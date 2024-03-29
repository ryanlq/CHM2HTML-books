import os
from bs4 import BeautifulSoup

def extract_text_from_html(file_path):
    # 使用BeautifulSoup解析HTML文件并提取文本
    with open(file_path, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
        return soup.get_text()

def merge_texts_to_book(texts, output_file):
    # 将所有提取的文本合并到一个文件中
    with open(output_file, 'w', encoding='utf-8') as file:
        for text in texts:
            file.write(text)
            file.write('\n')

def process_books(root_dir):
    # 遍历个人文档文件夹
    for collection_dir, _, _ in os.walk(root_dir):
        collection_name = os.path.basename(collection_dir)
        for book_dir, _, files in os.walk(os.path.join(root_dir, collection_name)):
            book_name = os.path.basename(book_dir)
            # 用于存储所有提取的文本
            all_texts = []
            for file in files:
                if file.endswith('.html'):
                    file_path = os.path.join(book_dir, file)
                    text = extract_text_from_html(file_path)
                    all_texts.append(text)
            
            # 创建以书籍名称命名的.txt文件
            output_file_name = f"{book_name}.txt"
            output_file_path = os.path.join(root_dir, collection_name, book_name, output_file_name)
            merge_texts_to_book(all_texts, output_file_path)
            print(f"书籍 {book_name} 已处理，并保存为 {output_file_name}")

root_directory_path = 'E:\txt书籍\chm'
process_books(root_directory_path)
