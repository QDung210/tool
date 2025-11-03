// Kiểm tra và hiển thị trạng thái API key khi popup mở
document.addEventListener('DOMContentLoaded', async () => {
  const result = await chrome.storage.local.get(['groqApiKey']);
  const apiStatus = document.getElementById('apiStatus');
  const autoAnswerBtn = document.getElementById('autoAnswer');
  
  if (result.groqApiKey) {
    apiStatus.textContent = '✅ API Key đã được thiết lập';
    apiStatus.classList.remove('not-set');
    autoAnswerBtn.disabled = false;
  }
  
  // Clear logs button
  document.getElementById('clearLogs').addEventListener('click', () => {
    document.getElementById('logs').innerHTML = '';
  });
});

// Lưu API key
document.getElementById('saveApiKey').addEventListener('click', async () => {
  const apiKey = document.getElementById('apiKey').value.trim();
  const statusDiv = document.getElementById('status');
  const apiStatus = document.getElementById('apiStatus');
  const autoAnswerBtn = document.getElementById('autoAnswer');
  
  if (!apiKey) {
    showStatus('Vui lòng nhập API key!', 'error');
    return;
  }
  
  try {
    await chrome.storage.local.set({ groqApiKey: apiKey });
    apiStatus.textContent = '✅ API Key đã được thiết lập';
    apiStatus.classList.remove('not-set');
    autoAnswerBtn.disabled = false;
    showStatus('✅ Đã lưu API key thành công!', 'success');
    document.getElementById('apiKey').value = '';
  } catch (error) {
    showStatus('❌ Lỗi khi lưu API key: ' + error.message, 'error');
  }
});

// Lắng nghe logs từ content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'log') {
    addLog(message.level, message.text);
  }
});

// Bắt đầu tự động trả lời
document.getElementById('autoAnswer').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  const autoAnswerBtn = document.getElementById('autoAnswer');
  const logContainer = document.getElementById('logContainer');
  
  try {
    // Hiển thị log container
    logContainer.style.display = 'block';
    document.getElementById('logs').innerHTML = '';
    
    // Kiểm tra tab hiện tại có phải Google Form không
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('docs.google.com/forms')) {
      showStatus('⚠️ Vui lòng mở Google Form trước!', 'error');
      addLog('error', 'Không phải trang Google Form');
      return;
    }
    
    // Vô hiệu hóa nút trong khi xử lý
    autoAnswerBtn.disabled = true;
    autoAnswerBtn.innerHTML = '<span class="spinner"></span>Đang xử lý...';
    
    addLog('info', 'Bắt đầu quá trình tự động trả lời...');
    showStatus('🔄 Đang inject script...', 'info');
    
    try {
      // Inject content script nếu chưa có
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      
      addLog('success', 'Đã inject content script');
      // Đợi một chút để script được load
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (injectError) {
      addLog('warning', 'Script đã được inject trước đó');
      console.log('Script đã được inject hoặc lỗi inject:', injectError);
    }
    
    showStatus('🔄 Đang phân tích câu hỏi...', 'info');
    addLog('info', 'Đang gửi lệnh phân tích câu hỏi...');
    
    // Gửi message đến content script
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'startAutoAnswer' });
      
      if (response && response.success) {
        showStatus(`✅ Hoàn thành! Đã trả lời ${response.answeredCount} câu hỏi.`, 'success');
        addLog('success', `✅ HOÀN THÀNH! Đã trả lời ${response.answeredCount}/${response.totalQuestions} câu hỏi`);
        
        if (response.logs && response.logs.length > 0) {
          response.logs.forEach(log => {
            addLog(log.level || 'info', log.text);
          });
        }
      } else if (response && response.error) {
        showStatus('❌ ' + response.error, 'error');
        addLog('error', '❌ ' + response.error);
      } else {
        showStatus('❌ Không nhận được phản hồi từ trang', 'error');
        addLog('error', 'Không nhận được phản hồi');
      }
    } catch (msgError) {
      showStatus('❌ Không thể kết nối với trang. Vui lòng reload trang và thử lại!', 'error');
      addLog('error', '❌ Lỗi kết nối: ' + msgError.message);
    }
    
  } catch (error) {
    showStatus('❌ Lỗi: ' + error.message, 'error');
    addLog('error', '❌ Lỗi: ' + error.message);
  } finally {
    autoAnswerBtn.disabled = false;
    autoAnswerBtn.innerHTML = '🚀 Tự Động Trả Lời';
  }
});

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
  
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }
}

function addLog(level, text) {
  const logsDiv = document.getElementById('logs');
  const logEntry = document.createElement('div');
  logEntry.className = 'log-entry';
  
  const time = new Date().toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
  
  const levelClass = `log-${level}`;
  const icon = {
    'success': '✅',
    'error': '❌',
    'warning': '⚠️',
    'info': 'ℹ️',
    'question': '📝',
    'answer': '✓'
  }[level] || '•';
  
  logEntry.innerHTML = `
    <span class="log-time">[${time}]</span>
    <span class="${levelClass}">${icon} ${text}</span>
  `;
  
  logsDiv.appendChild(logEntry);
  logsDiv.scrollTop = logsDiv.scrollHeight;
}
