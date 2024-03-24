import os
import convert
root = r"E:\chm书籍"
new_root = r"E:\txt书籍\chm"
def process_top_level_directories(parent_directory):
    # 自定义你的处理函数
    def custom_action(subdir):
        print(f"正在处理顶级子目录: {subdir}")
        convert.extract_and_save_text(subdir,os.path.join(new_root,os.path.basename(subdir)))

    # 获取顶级子目录列表
    top_level_dirs = next(os.walk(parent_directory))[1]

    # 对每个顶级子目录执行操作
    for subdir in top_level_dirs:
        subdirectory_path = os.path.join(parent_directory, subdir)
        custom_action(subdirectory_path)


# 调用函数，传入你想要处理的目录路径
process_top_level_directories(root)