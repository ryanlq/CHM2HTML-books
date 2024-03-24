import os
from bs4 import BeautifulSoup
import chardet
import codecs
import shutil
import re



g_root = ''
g_newroot = ''
COMMON_ENCODINGS = ['utf-8', 'gbk', 'gb2312', 'big5', 'gb18030','iso-8859-1']
tail = "</body></html>"
# def find_non_num_alpha_chinese_chars(s):
#     # 正则表达式匹配非数字、非英文字母、非汉字的字符
#     pattern = "[^\u4e00-\u9fa5a-zA-Z0-9]"
#     matches = re.findall(pattern, s)
#     return matches
def replace_consecutive_duplicates(s, target):
    # 注意：此处的正则表达式是为了匹配连续的 '<br>' 标签，而不是 'br' 文本
    pattern = f"(?i)<{target}>{{2,}}"
    return re.sub(pattern, f"<{target}>", s)


def find_valid_encoding(file_path):
    with open(file_path, 'rb') as file:
        data = file.read()
        result = chardet.detect(data)
        encoding = result['encoding']
        for encoding in COMMON_ENCODINGS:
            try:
                decoded_data = data.decode(encoding)
                return encoding
            except UnicodeDecodeError:
                pass
        # 如果所有常见编码都尝试过仍未成功，则返回chardet检测的结果
        # print(file_path,encoding)
        return encoding
    
def newpath(path):
    t = path.replace(g_root,"")
    # print(path," | ",g_root," | ",g_newroot," | ",t)
    return g_newroot  +t

def checkpath(path,output_filename):
    dir = path.replace(output_filename, '')
    if not os.path.exists(dir):
        os.makedirs(dir)

def shift_img(img_src):
    # 检查img_src是否以'/'开头，如果是，则去掉
    # 处理img_src使其成为绝对路径（如果已经是绝对路径则无需处理）
                parts = img_src.split("/")
                if img_src.startswith('/'):  # 如果src是绝对路径（服务器相对根目录的路径）
                    img_absolute_src = os.path.join(g_root, img_src[1:])
                else:  # 如果src是相对路径
                    
                    img_absolute_src = os.path.join(g_root, *parts)

                # 计算新图片文件的绝对路径
                new_img_dst = os.path.join(g_newroot, *parts)

                # 创建新图片文件所需的目录结构（如果尚不存在）
                os.makedirs(os.path.dirname(new_img_dst), exist_ok=True)

                # 将图片文件复制到新地址
                shutil.copy2(img_absolute_src, new_img_dst)

def find_buttons(soup):
    # 定义替换规则
    replacements = {
        'Untitled-3.jpg': '上一页',
        'Untitled-4.jpg': '目录',
        'Untitled-5.jpg': '下一页',
    }

    tables= soup.findAll('td', {'width': '68'})
    buttons = ""
    #输出数组字符串
    for td in tables:
        for img in td.findAll('img'):
            img_src = img.get('src')
            if img_src in replacements:
                img.replaceWith(replacements[img_src])
        buttons += str(td)
    buttons = buttons.replace('<td width="68">', '').replace('</td>', '').replace("htm","html")
    return buttons

def extract_and_save_text(dir_path,newdir_path):
    global g_newroot
    g_newroot = newdir_path

    global g_root
    g_root = dir_path

    for root, dirs, files in os.walk(dir_path):
        for filename in files:
            if filename.lower().endswith('.htm'):  # 只处理htm文件
                filepath = os.path.join(root, filename)

                # 获取有效的编码方式
                encoding = find_valid_encoding(filepath)
                header = "<html><head><link rel='stylesheet' href='../all.css'><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head><body>"

                # 使用找到的编码打开并读取HTML文件
                with codecs.open(filepath, 'r', encoding=encoding) as f:
                    contents = f.read()

                # 创建BeautifulSoup对象
                soup = BeautifulSoup(contents, 'html.parser')
                buttons = ""
                buttons = find_buttons(soup)
                text = ''
                
                if filename == "bbb.htm":
                    table = soup.find('table', {'border': '0', 'cellpadding': '3', 'cellspacing': '3', 'width': '74%'})
                    if table:
                        if filename == "bbb.htm":
                            links = table.find_all('a')

                            # 收集所有a标签的文本内容
                            # link_texts = [link.get_text().strip() for link in links]

                            # 将所有文本内容连接成一个字符串，这里用空格作为分隔符
                            a_tags_html = []
                            for link in links:
                                # 获取a标签的完整HTML字符串
                                tag_html = str(link)

                                # 查找a标签内的img标签，并获取src属性
                                img_tags = link.find_all('img')
                                for img in img_tags:
                                    img_src = img.get('src')
                                    shift_img(img_src)

                                a_tags_html.append(tag_html)
                            text = ' '.join(a_tags_html)
                            text = text.replace("htm","html")
                else:
                    # 找到具有指定属性的表格
                    table = soup.find('table', {'border': '0', 'cellpadding': '0', 'cellspacing': '0', 'width': '99%'})
                    # 如果找到了表格，则提取其文本内容
                    if table:
                        if filename == "index.htm":
                            links = table.find_all('a')

                            # 收集所有a标签的文本内容
                            # link_texts = [link.get_text().strip() for link in links]

                            # 将所有文本内容连接成一个字符串，这里用空格作为分隔符
                            a_tags_html = []
                            for link in links:
                                # 获取a标签的完整HTML字符串
                                tag_html = str(link)
                                a_tags_html.append(tag_html)
                            text = ' '.join(a_tags_html)
                            text = text.replace("htm","html")
                            
                        else:
                            # text = table.get_text(separator='\n\n').replace("<BR><BR>", "\n\n")
                            text = table.get_text().replace("\n\n", "\n").replace("\n\n", "\n").replace("\n", "<br><br>")
                            
                            # test
                            # special_chars  = find_non_num_alpha_chinese_chars(text[0:40])
                            # print("特殊字符列表：", special_chars)


                            # target = 'br'
                            # text = replace_consecutive_duplicates(text, target)

                            text = text.replace("   ", "<br>")
                # 将提取的文本保存到与原始文件同目录且去掉'.htm'后缀名的新文件中
                output_filename = os.path.splitext(filename)[0] + '.html'
                output_filepath = newpath(filepath)
                output_filepath = output_filepath.replace(filename,output_filename)
                output_filepath = os.path.join(output_filepath)
                checkpath(output_filepath,output_filename)
                contents = "<p>" + text + "</p><div class='button-group'>" + buttons+"</div>"
                # 写入并覆盖已有文件,将内容以UTF-8编码写入新文件
                with codecs.open(output_filepath, 'w', encoding='utf-8') as f:
                    f.write(header + contents + tail)

# 调用函数，开始遍历并处理指定目录及其子目录下的所有htm文件
# extract_and_save_text(root,newroot)