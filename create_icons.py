#!/usr/bin/env python3
"""
Create placeholder icons for Chrome extension
"""
import base64
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """Create a placeholder icon with Shopify green and MYOB blue"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Shopify green color
    shopify_green = (0, 128, 96, 255)
    # MYOB blue color  
    myob_blue = (0, 102, 204, 255)
    
    # Create a simple design that combines both colors
    if size >= 48:
        # Draw a split design - left half Shopify green, right half MYOB blue
        draw.rectangle([0, 0, size//2, size], fill=shopify_green)
        draw.rectangle([size//2, 0, size, size], fill=myob_blue)
        
        # Add "S" and "M" letters
        try:
            font_size = size // 3
            font = ImageFont.load_default()
            # Draw "S" on green side
            draw.text((size//4 - font_size//4, size//2 - font_size//2), "S", fill="white", font=font)
            # Draw "M" on blue side  
            draw.text((3*size//4 - font_size//4, size//2 - font_size//2), "M", fill="white", font=font)
        except:
            pass
    else:
        # For small icons, just use the split design
        draw.rectangle([0, 0, size//2, size], fill=shopify_green)
        draw.rectangle([size//2, 0, size, size], fill=myob_blue)
    
    # Save as PNG
    img.save(output_path, 'PNG')
    print(f"Created {output_path}")

# Create icons directory if it doesn't exist
icons_dir = "chrome-extension/icons"
os.makedirs(icons_dir, exist_ok=True)

# Generate icons
create_icon(16, f"{icons_dir}/icon16.png")
create_icon(48, f"{icons_dir}/icon48.png") 
create_icon(128, f"{icons_dir}/icon128.png")

print("All icons created successfully!")