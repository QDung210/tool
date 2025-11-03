// Google Form Auto Answer - Content Script
// Version 2.0 - With fallback models

if (!window.googleFormAutoAnswerLoaded) {
  window.googleFormAutoAnswerLoaded = true;
  console.log('✅ Content script loaded!');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startAutoAnswer') {
    console.log('📨 Received message');
    handleAutoAnswer().then(sendResponse);
    return true;
  }
});

async function handleAutoAnswer() {
  try {
    const questions = parseQuestions();
    if (questions.length === 0) {
      return { success: false, error: 'No questions found' };
    }
    
    console.log(`Found ${questions.length} questions`);
    let count = 0;
    
    for (const q of questions) {
      console.log(`\n📝 Question ${q.index + 1}: type=${q.type}, hasImage=${!!q.imageUrl}, options=${q.options.length}`);
      try {
        const answer = await getAnswerFromGroq(q);
        if (answer && answer.length > 0) {
          await fillAnswer(q, answer);
          count++;
          console.log(`✅ Question ${q.index + 1} answered successfully`);
        } else {
          console.warn(`⚠️ Question ${q.index + 1}: No valid answer returned`);
        }
        await sleep(500);
      } catch (error) {
        console.error(`❌ Question ${q.index + 1} failed:`, error.message);
        // Continue to next question instead of stopping
      }
    }
    
    return { success: true, answeredCount: count };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function parseQuestions() {
  const questions = [];
  const containers = document.querySelectorAll('[jsname="WsjYwc"]');
  
  containers.forEach((container, index) => {
    const q = { index, container, type: null, title: '', options: [], imageUrl: null };
    
    const titleEl = container.querySelector('[role="heading"] .M7eMe');
    if (titleEl) q.title = titleEl.textContent.trim();
    
    const imageEl = container.querySelector('img.HxhGpf');
    if (imageEl) q.imageUrl = imageEl.src;
    
    const radioGroup = container.querySelector('[role="radiogroup"]');
    const checkboxList = container.querySelector('[role="list"]');
    
    if (radioGroup) {
      q.type = 'radio';
      radioGroup.querySelectorAll('[role="radio"]').forEach(radio => {
        const label = radio.getAttribute('aria-label');
        if (label) q.options.push({ element: radio, text: label });
      });
    } else if (checkboxList) {
      q.type = 'checkbox';
      checkboxList.querySelectorAll('[role="checkbox"]').forEach(checkbox => {
        const label = checkbox.getAttribute('aria-label');
        if (label) q.options.push({ element: checkbox, text: label });
      });
    }
    
    if (q.type && q.options.length > 0) questions.push(q);
  });
  
  return questions;
}

async function getAnswerFromGroq(question) {
  const result = await chrome.storage.local.get(['groqApiKey']);
  const apiKey = result.groqApiKey;
  if (!apiKey) throw new Error('API key not set');
  
  let systemPrompt, userPrompt, useVision = false, imageBase64 = null;
  
  if (question.imageUrl) {
    console.log('🖼️ Loading image...');
    try {
      imageBase64 = await downloadAndEncodeImage(question.imageUrl);
      useVision = true;
      console.log('✅ Image encoded');
    } catch (e) {
      console.error('⚠️ Image load failed:', e);
    }
  }
  
  if (question.type === 'radio') {
    systemPrompt = 'You are an expert. Reply with ONLY the number of the correct answer (1-4). No explanation.';
  } else {
    systemPrompt = 'You are an expert. Reply with numbers of ALL correct answers separated by commas (e.g. "1,3,4"). No explanation.';
  }
  
  userPrompt = question.title ? `Question: "${question.title}"\n\n` : 'This question has no title.\n\n';
  userPrompt += 'Options:\n';
  question.options.forEach((opt, idx) => {
    userPrompt += `${idx + 1}. ${opt.text}\n`;
  });
  
  if (question.type === 'radio') {
    userPrompt += '\nSelect ONE. Reply with number only.';
  } else {
    userPrompt += '\nSelect ALL correct. Reply with numbers separated by commas.';
  }
  
  console.log(`📝 Prompt preview: ${userPrompt.substring(0, 100)}...`);
  
  const textModels = ['openai/gpt-oss-120b', 'moonshotai/kimi-k2-instruct-0905', 'openai/gpt-oss-20b'];
  const visionModel = 'meta-llama/llama-4-scout-17b-16e-instruct';
  const modelsToTry = useVision ? [visionModel] : textModels;
  
  console.log(`🎯 Will try ${modelsToTry.length} model(s): ${modelsToTry.join(', ')}`);
  
  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    
    try {
      console.log(`🤖 Trying model: ${model}`);
      
      const messages = [{ role: 'system', content: systemPrompt }];
      
      if (useVision && imageBase64) {
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: userPrompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` }}
          ]
        });
      } else {
        messages.push({ role: 'user', content: userPrompt });
      }
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, temperature: 0.2, max_tokens: 20 })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
        console.error(`❌ Model ${model} failed:`, errorMsg);
        if (i < modelsToTry.length - 1) {
          console.log(`🔄 Trying next model...`);
          continue;
        }
        console.error(`❌ All models failed for this question`);
        return null; // Return null instead of throwing error
      }
      
      const data = await response.json();
      const answerText = data.choices[0].message.content.trim();
      console.log(`🎯 AI answer: "${answerText}"`);
      
      if (question.type === 'radio') {
        const match = answerText.match(/\d+/);
        if (match) {
          const idx = parseInt(match[0]) - 1;
          if (idx >= 0 && idx < question.options.length) {
            console.log(`✅ Selected answer: ${idx + 1} - ${question.options[idx].text.substring(0, 50)}...`);
            return [idx];
          } else {
            console.warn(`⚠️ Invalid index: ${idx + 1}, max: ${question.options.length}`);
          }
        } else {
          console.warn(`⚠️ Could not parse answer: "${answerText}"`);
        }
      } else {
        const numbers = answerText.match(/\d+/g);
        if (numbers) {
          const answers = numbers.map(n => parseInt(n) - 1).filter(idx => idx >= 0 && idx < question.options.length);
          if (answers.length > 0) {
            console.log(`✅ Selected ${answers.length} answers: ${answers.map(i => i + 1).join(', ')}`);
            answers.forEach(idx => {
              console.log(`   - ${idx + 1}: ${question.options[idx].text.substring(0, 50)}...`);
            });
            return answers;
          } else {
            console.warn(`⚠️ All parsed numbers were invalid: ${numbers.join(', ')}`);
          }
        } else {
          console.warn(`⚠️ Could not parse answer: "${answerText}"`);
        }
      }
      
      // If parsing failed but we got a response, try next model
      if (i < modelsToTry.length - 1) {
        console.log(`🔄 Parse failed, trying next model...`);
        continue;
      }
      
      return null;
      
    } catch (error) {
      console.error(`❌ Error with ${model}:`, error.message);
      if (i < modelsToTry.length - 1) {
        console.log(`🔄 Trying next model due to error...`);
        continue;
      }
      console.error(`❌ All models failed, returning null`);
      return null; // Return null instead of throwing
    }
  }
  
  console.warn(`⚠️ No valid answer from any model`);
  return null;
}

async function downloadAndEncodeImage(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function fillAnswer(question, answerIndices) {
  console.log(`🎯 Filling ${answerIndices.length} answer(s) for question ${question.index + 1}...`);
  
  for (const index of answerIndices) {
    const option = question.options[index];
    if (option?.element) {
      // Kiểm tra xem đã được chọn chưa (để tránh toggle off)
      const isChecked = option.element.getAttribute('aria-checked') === 'true';
      
      if (!isChecked) {
        option.element.click();
        console.log(`✓ Clicked answer ${index + 1}: ${option.text.substring(0, 50)}...`);
        
        // Delay nhỏ giữa các click (quan trọng cho checkbox)
        if (answerIndices.length > 1) {
          await sleep(200);
        }
      } else {
        console.log(`ℹ️ Answer ${index + 1} already selected, skipping`);
      }
    } else {
      console.warn(`⚠️ Could not find element for answer ${index + 1}`);
    }
  }
  
  // Delay sau khi click xong để Google Form xử lý
  await sleep(300);
  
  // Verify các đáp án đã được chọn
  const selectedCount = answerIndices.filter(index => {
    const option = question.options[index];
    return option?.element?.getAttribute('aria-checked') === 'true';
  }).length;
  
  if (selectedCount === answerIndices.length) {
    console.log(`✅ All ${answerIndices.length} answer(s) confirmed selected`);
  } else {
    console.warn(`⚠️ Only ${selectedCount}/${answerIndices.length} answers are selected!`);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
