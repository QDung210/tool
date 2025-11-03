"""
Script tạo icon PNG cho Chrome Extension
Chạy: python create_icons.py
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_gradient_background(size):
    """Tạo background gradient"""
    img = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(img)
    
    # Tạo gradient từ #667eea sang #764ba2
    for y in range(size):
        # Tính toán màu cho mỗi dòng
        ratio = y / size
        r = int(102 + (118 - 102) * ratio)
        g = int(126 + (75 - 126) * ratio)
        b = int(234 + (162 - 234) * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    return img

def create_icon(size, output_path):
    """Tạo icon với kích thước cho trước"""
    # Tạo background gradient
    img = create_gradient_background(size)
    draw = ImageDraw.Draw(img)
    
    # Vẽ hình tròn bo góc (rounded rectangle)
    # Tạo mask cho bo góc
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    corner_radius = size // 5
    mask_draw.rounded_rectangle([(0, 0), (size, size)], corner_radius, fill=255)
    
    # Apply mask
    output = Image.new('RGBA', (size, size))
    output.paste(img, (0, 0))
    output.putalpha(mask)
    
    # Thêm text "AI" hoặc emoji
    try:
        # Thử dùng font hệ thống
        font_size = int(size * 0.5)
        try:
            # Windows
            font = ImageFont.truetype("seguiemj.ttf", font_size)
            text = "🤖"
        except:
            try:
                # Fallback to Arial
                font = ImageFont.truetype("arial.ttf", font_size)
                text = "AI"
            except:
                font = ImageFont.load_default()
                text = "AI"
        
        # Vẽ text ở giữa
        draw = ImageDraw.Draw(output)
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        position = ((size - text_width) // 2, (size - text_height) // 2 - size // 10)
        
        draw.text(position, text, fill='white', font=font)
        
    except Exception as e:
        print(f"Lưu ý: Không thể thêm text/emoji: {e}")
        # Vẽ hình tròn đơn giản thay thế
        draw = ImageDraw.Draw(output)
        center = size // 2
        radius = size // 4
        draw.ellipse([center - radius, center - radius, 
                     center + radius, center + radius], 
                    fill='white')
    
    # Lưu file
    output.save(output_path, 'PNG')
    print(f"✅ Đã tạo {output_path}")

def main():
    sizes = [16, 48, 128]
    
    print("🎨 Bắt đầu tạo icon...")
    
    for size in sizes:
        output_path = f"icon{size}.png"
        create_icon(size, output_path)
    
    print("\n✨ Hoàn thành! Đã tạo tất cả icon.")
    print("📝 Bạn có thể thay thế các icon này bằng thiết kế của riêng bạn.")

if __name__ == "__main__":
    main()
