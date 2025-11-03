# Google Form Auto Answer Extension

## 📝 Mô tả
Extension Chrome tự động trả lời câu hỏi Google Form sử dụng GROQ API với AI model Llama 3.3.

## ✨ Tính năng
- ✅ Tự động nhận diện 3 loại câu hỏi:
  - **Q1**: Câu hỏi trắc nghiệm thường (chỉ 1 đáp án)
  - **Q2**: Câu hỏi có thể chọn nhiều đáp án
  - **Q3**: Câu hỏi có hình ảnh kèm theo
- 🤖 Sử dụng GROQ API với model Llama 3.3 70B
- 🎯 Prompt được tối ưu cho từng loại câu hỏi
- 💾 Lưu API key an toàn trong Chrome Storage
- 🚀 Giao diện đẹp, dễ sử dụng

## 📦 Cài đặt

### 1. Lấy GROQ API Key
1. Truy cập https://console.groq.com/
2. Đăng ký/đăng nhập tài khoản
3. Tạo API key mới
4. Copy API key

### 2. Cài đặt Extension
1. Mở Chrome và truy cập `chrome://extensions/`
2. Bật **Developer mode** (góc trên bên phải)
3. Click **Load unpacked**
4. Chọn thư mục chứa extension này
5. Extension sẽ xuất hiện trên thanh công cụ Chrome

### 3. Tạo icon PNG (tùy chọn)
Vì Chrome Extension cần file PNG cho icon, bạn cần tạo 3 file icon:
- `icon16.png` (16x16px)
- `icon48.png` (48x48px)  
- `icon128.png` (128x128px)

Bạn có thể:
- Sử dụng tool online như https://www.favicon-generator.org/
- Hoặc tạo bằng Photoshop/GIMP
- Hoặc dùng emoji 🤖 làm icon đơn giản

**Lưu ý tạm thời**: Nếu không có icon, extension vẫn chạy nhưng sẽ hiển thị icon mặc định.

## 🎮 Cách sử dụng

1. **Thiết lập API Key**:
   - Click vào icon extension trên thanh công cụ
   - Nhập GROQ API Key vào ô input
   - Click "💾 Lưu API Key"

2. **Sử dụng trên Google Form**:
   - Mở bất kỳ Google Form nào
   - Click vào icon extension
   - Click "🚀 Tự Động Trả Lời"
   - Chờ extension phân tích và điền đáp án

## 🔧 Cấu trúc Project

```
tool/
├── manifest.json       # Cấu hình extension
├── popup.html          # Giao diện popup
├── popup.js           # Logic popup
├── content.js         # Script chạy trên Google Form
├── background.js      # Service worker
├── icon16.png         # Icon 16x16
├── icon48.png         # Icon 48x48
├── icon128.png        # Icon 128x128
├── q1.txt            # Sample Q1 HTML
├── q2.txt            # Sample Q2 HTML
└── q3.txt            # Sample Q3 HTML
```

## 🎯 Cách hoạt động

1. **Content Script** phân tích cấu trúc HTML của Google Form
2. Nhận diện loại câu hỏi (radio/checkbox) và các đáp án
3. Kiểm tra có hình ảnh hay không
4. Tạo prompt phù hợp cho GROQ API
5. Gọi API để nhận câu trả lời
6. Tự động click chọn đáp án đúng

## ⚙️ Prompt Strategy

Extension sử dụng các prompt khác nhau cho từng tình huống:

- **Có tiêu đề + có ảnh**: Phân tích dựa trên cả tiêu đề và ảnh
- **Có tiêu đề**: Phân tích dựa trên tiêu đề và đáp án
- **Không có tiêu đề**: Suy luận dựa trên nội dung các đáp án

Prompt được thiết kế để AI:
- Hiểu rõ loại câu hỏi (single/multiple choice)
- Phân tích logic từ các đáp án
- Trả lời ngắn gọn chỉ bằng số thứ tự

## 🚨 Lưu ý

- Extension chỉ hoạt động trên Google Forms
- Cần có kết nối internet để gọi GROQ API
- API key được lưu local, không gửi đi đâu khác
- Độ chính xác phụ thuộc vào model AI và câu hỏi
- Sử dụng có trách nhiệm, chỉ cho mục đích học tập

## 🐛 Debug

Mở Chrome DevTools:
- **Popup**: Right-click extension icon → Inspect
- **Content Script**: F12 trên trang Google Form → Console
- **Background**: chrome://extensions → Extension details → Inspect service worker

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa

## 👨‍💻 Tác giả

Created with ❤️ for educational purposes
