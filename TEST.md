# 🧪 Hướng dẫn Test Extension

## Bước 1: Cài đặt Extension

1. Mở Chrome
2. Vào `chrome://extensions/`
3. Bật **Developer mode**
4. Click **Load unpacked**
5. Chọn thư mục: `C:\Users\dung\OneDrive\Desktop\tool`

✅ Extension sẽ hiển thị với tên "Google Form Auto Answer"

## Bước 2: Lưu API Key

1. Lấy GROQ API key tại: https://console.groq.com/keys
2. Click icon extension 🤖
3. Paste API key
4. Click "💾 Lưu API Key"
5. Thấy thông báo: "✅ API Key đã được thiết lập"

## Bước 3: Tạo Google Form Test

### Tạo form test nhanh:
1. Vào https://forms.google.com/
2. Click "Blank form" (form trống)
3. Thêm 3 câu hỏi:

**Câu 1: Multiple choice (Q1)**
- Question: "What is AI?"
- Options:
  * A: Artificial Intelligence
  * B: Alien Intelligence
  * C: Animal Intelligence
  * D: None

**Câu 2: Checkboxes (Q2)**
- Question: "Select programming languages"
- Options:
  * Python
  * JavaScript
  * Java
  * C++

**Câu 3: Multiple choice with image (Q3)**
- Question: "What is this?"
- Upload any image
- Options:
  * Option A
  * Option B
  * Option C
  * Option D

4. Click "Send" → Copy link
5. Mở link trong tab mới (chế độ làm bài)

## Bước 4: Test Extension

1. **Mở DevTools** (`F12`)
2. Vào tab **Console**
3. Click icon extension 🤖
4. Click **"🚀 Tự Động Trả Lời"**

### Kiểm tra Console:

Bạn sẽ thấy các log sau (theo thứ tự):

```
✅ Google Form Auto Answer - Content script loaded!
📨 Nhận được message startAutoAnswer
🚀 Bắt đầu handleAutoAnswer...
Đã tìm thấy 3 câu hỏi
Đã chọn đáp án 1: A: Artificial Intelligence
Đã chọn đáp án 1: Python
Đã chọn đáp án 2: JavaScript
Đã chọn đáp án 1: Option A
```

### Kiểm tra Form:

- [ ] Câu 1 đã được chọn 1 đáp án
- [ ] Câu 2 đã được chọn 1 hoặc nhiều đáp án
- [ ] Câu 3 đã được chọn 1 đáp án

### Kiểm tra Popup:

- [ ] Hiển thị: "✅ Hoàn thành! Đã trả lời 3 câu hỏi."

## ✅ Test thành công nếu:

1. ✅ Console không có lỗi màu đỏ
2. ✅ Tất cả câu hỏi đã được chọn đáp án
3. ✅ Popup hiển thị thông báo thành công
4. ✅ Có thể submit form

## ❌ Nếu thất bại:

### Console có lỗi:
→ Xem file `TROUBLESHOOTING.md`

### Không tìm thấy câu hỏi:
1. Reload trang form (`F5`)
2. Đợi load xong
3. Thử lại

### API error:
1. Kiểm tra API key
2. Kiểm tra internet
3. Thử API key mới

## 🎯 Test nâng cao

### Test với form thật:

1. Tìm Google Form công khai trên mạng
2. Hoặc dùng form của giáo viên (nếu được phép)
3. Test xem extension hoạt động như thế nào

### Test với nhiều loại câu hỏi:

- [ ] Multiple choice (radio)
- [ ] Checkboxes
- [ ] With images
- [ ] Without title
- [ ] Long options text

## 📊 Kết quả mong đợi

| Test Case | Kết quả mong đợi |
|-----------|------------------|
| Form với 1 câu | ✅ Trả lời được |
| Form với 10 câu | ✅ Trả lời được |
| Câu không có đề | ✅ Phân tích đáp án |
| Câu có hình ảnh | ✅ Nhận diện được |
| Reload extension | ✅ Vẫn hoạt động |
| Nhiều tab cùng lúc | ✅ Hoạt động độc lập |

## 🐛 Known Issues

1. **Không hỗ trợ:**
   - Short answer (text input)
   - Paragraph (textarea)
   - Date/Time picker
   - File upload

2. **Giới hạn:**
   - API rate limit: ~30 requests/phút
   - Chỉ hoạt động trên Google Forms
   - Cần internet connection

## 💡 Tips

- **Test nhiều lần** để đảm bảo ổn định
- **Kiểm tra đáp án** trước khi submit
- **Đọc TROUBLESHOOTING.md** nếu gặp lỗi
- **Mở Console** để theo dõi quá trình

Chúc test thành công! 🎉
