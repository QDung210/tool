"""
Script resize icon.png thành các kích thước khác nhau
"""
from PIL import Image
import os

def resize_icon():
    # Đọc icon.png
    if not os.path.exists('icon.png'):
        print("❌ Không tìm thấy icon.png")
        return
    
    img = Image.open('icon.png')
    print(f"📁 Đã mở icon.png - Kích thước: {img.size}")
    
    # Resize thành các kích thước cần thiết
    sizes = [16, 48, 128]
    
    for size in sizes:
        # Resize với LANCZOS (chất lượng cao)
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        output_path = f'icon{size}.png'
        resized.save(output_path, 'PNG')
        print(f"✅ Đã tạo {output_path} ({size}x{size})")
    
    print("\n✨ Hoàn thành! Đã tạo tất cả icon từ icon.png")

if __name__ == "__main__":
    resize_icon()
