# Hướng dẫn cài đặt và sử dụng

## Bước 1: Tạo Icon

Chạy lệnh sau để tạo icon:

```bash
pip install pillow
python create_icons.py
```

Hoặc nếu bạn không muốn dùng Python, có thể:
1. Tải icon đơn giản từ: https://www.flaticon.com/
2. Resize thành 3 kích thước: 16x16, 48x48, 128x128
3. Đặt tên: icon16.png, icon48.png, icon128.png

## Bước 2: Lấy GROQ API Key

1. Truy cập: https://console.groq.com/
2. Đăng ký/Đăng nhập
3. Tạo API Key mới
4. Copy API key

## Bước 3: Cài Extension vào Chrome

1. Mở Chrome
2. Vào `chrome://extensions/`
3. Bật **Developer mode** (góc phải trên)
4. Click **Load unpacked**
5. Chọn thư mục `tool`
6. Extension sẽ hiện trên thanh công cụ

## Bước 4: Sử dụng

1. Click icon extension
2. Nhập GROQ API Key
3. Click "Lưu API Key"
4. Mở Google Form bất kỳ
5. Click icon extension
6. Click "Tự Động Trả Lời"

## Lưu ý

- Extension chỉ hoạt động trên trang Google Forms
- Cần có API key hợp lệ
- Sử dụng có trách nhiệm!

## Test Extension

Bạn có thể test với form mẫu hoặc tạo form riêng với các câu hỏi:
- Câu hỏi trắc nghiệm thường
- Câu hỏi chọn nhiều đáp án
- Câu hỏi có hình ảnh

Chúc bạn thành công! 🎉
