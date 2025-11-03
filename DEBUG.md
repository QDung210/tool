# 🐛 Debug Guide - Khi câu hỏi không được trả lời

## ✅ **Đã sửa lỗi:**

### Vấn đề trước:
- Khi 1 câu hỏi lỗi → toàn bộ extension dừng
- Chỉ câu hỏi có ảnh được xử lý

### Đã sửa:
1. ✅ **Mỗi câu hỏi xử lý độc lập** - Nếu câu 1 lỗi, vẫn xử lý câu 2, 3
2. ✅ **Không throw error** - Return null thay vì throw
3. ✅ **Log chi tiết hơn** - Biết chính xác câu nào lỗi, lỗi gì
4. ✅ **Fallback đầy đủ** - Thử hết 3 models trước khi bỏ qua

## 📊 **Log mới bạn sẽ thấy:**

### Trường hợp thành công:
```
📝 Question 1: type=radio, hasImage=false, options=4
📝 Prompt preview: Question: "What is AI?"
Options:
1. Artificial Intelligence
2. Alien Intelligence...
🎯 Will try 3 model(s): openai/gpt-oss-120b, moonshotai/kimi-k2-instruct-0905, openai/gpt-oss-20b
🤖 Trying model: openai/gpt-oss-120b
🎯 AI answer: "1"
✅ Selected answer: 1 - Artificial Intelligence
✓ Clicked: 1
✅ Question 1 answered successfully
```

### Trường hợp fallback:
```
📝 Question 2: type=checkbox, hasImage=false, options=4
🎯 Will try 3 model(s): openai/gpt-oss-120b, moonshotai/kimi-k2-instruct-0905, openai/gpt-oss-20b
🤖 Trying model: openai/gpt-oss-120b
❌ Model openai/gpt-oss-120b failed: rate_limit_exceeded
🔄 Trying next model...
🤖 Trying model: moonshotai/kimi-k2-instruct-0905
🎯 AI answer: "1,3,4"
✅ Selected 3 answers: 1, 3, 4
   - 1: We have access to a lot more computational power...
   - 3: We have access to a lot more data...
   - 4: Deep learning has resulted in significant improvements...
✓ Clicked: 1
✓ Clicked: 3
✓ Clicked: 4
✅ Question 2 answered successfully
```

### Trường hợp có ảnh:
```
📝 Question 3: type=radio, hasImage=true, options=4
🖼️ Loading image...
✅ Image encoded
🎯 Will try 1 model(s): meta-llama/llama-4-scout-17b-16e-instruct
🤖 Trying model: meta-llama/llama-4-scout-17b-16e-instruct
🎯 AI answer: "2"
✅ Selected answer: 2 - Option B...
✓ Clicked: 2
✅ Question 3 answered successfully
```

### Trường hợp thất bại (nhưng không dừng):
```
📝 Question 2: type=checkbox, hasImage=false, options=4
🤖 Trying model: openai/gpt-oss-120b
❌ Model openai/gpt-oss-120b failed: invalid_api_key
🔄 Trying next model...
🤖 Trying model: moonshotai/kimi-k2-instruct-0905
❌ Model moonshotai/kimi-k2-instruct-0905 failed: timeout
🔄 Trying next model...
🤖 Trying model: openai/gpt-oss-20b
❌ Model openai/gpt-oss-20b failed: server_error
❌ All models failed, returning null
⚠️ No valid answer from any model
⚠️ Question 2: No valid answer returned
❌ Question 2 failed: (nhưng tiếp tục Question 3)
```

## 🔍 **Cách debug:**

### 1. Mở Console (F12)
Bạn sẽ thấy log rất chi tiết cho từng câu hỏi

### 2. Kiểm tra từng câu hỏi:
- **"Found X questions"** → Có bao nhiêu câu
- **"Question N: type=..."** → Loại câu hỏi
- **"Will try M model(s)"** → Sẽ thử bao nhiêu models
- **"🤖 Trying model: ..."** → Model đang dùng
- **"✅ Selected ..."** → Đã chọn đáp án nào

### 3. Nếu không trả lời:
Tìm dòng:
```
⚠️ Question X: No valid answer returned
```

Xem lỗi ở trên:
- `❌ Model ... failed: rate_limit_exceeded` → Hết quota, đợi hoặc đổi API key
- `❌ Model ... failed: invalid_api_key` → API key sai
- `⚠️ Could not parse answer` → AI trả lời sai format
- `⚠️ Invalid index` → AI chọn số ngoài range

## 🚀 **Cách test:**

### Test 1: Tất cả câu hỏi
```
1. Reload extension (chrome://extensions/)
2. Reload form (F5)
3. Mở Console (F12)
4. Click "Tự Động Trả Lời"
5. Xem log - tất cả 3 câu phải có "✅ answered successfully"
```

### Test 2: Một câu lỗi
```
1. Tắt internet ngắn → sẽ có câu lỗi
2. Extension vẫn xử lý câu khác
3. Kết quả: "Đã trả lời 2 câu hỏi" (thay vì 3)
```

### Test 3: Fallback
```
1. Nếu model 1 lỗi
2. Tự động chuyển sang model 2
3. Log sẽ hiển thị "🔄 Trying next model..."
```

## 📝 **Checklist nếu không trả lời:**

- [ ] Console có log "Found X questions"? (Nếu không → reload trang)
- [ ] Console có "Question N: type=..."? (Nếu không → parse lỗi)
- [ ] Console có "🤖 Trying model..."? (Nếu không → không gọi API)
- [ ] Console có "❌ Model ... failed"? (Nếu có → xem lý do)
- [ ] Console có "✅ Selected ..."? (Nếu không → parse lỗi)
- [ ] Console có "✓ Clicked ..."? (Nếu không → DOM lỗi)

## 💡 **Tips:**

1. **Nếu tất cả đều fail:**
   - Kiểm tra API key
   - Kiểm tra internet
   - Thử reload extension

2. **Nếu chỉ 1-2 câu fail:**
   - Xem log lỗi cụ thể
   - Có thể do rate limit → đợi 1-2 phút
   - Thử lại

3. **Nếu parse lỗi:**
   - AI trả lời sai format
   - Đọc "🎯 AI answer: ..." để thấy AI trả lời gì
   - Có thể cần cải thiện prompt

Extension giờ đã robust hơn nhiều! 💪
