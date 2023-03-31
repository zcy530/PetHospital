import os, sys

d = {'1': 'f', '2': 'l', '3': 'b', '4': 'r', '5': 'd', '6': 'u'}


def rename_files():
    old_names = os.listdir(path)
    for old_name in old_names:
        if old_name != sys.argv[0]:
            for i in range(1, 7):
                new_name = old_name.replace(str(i), d.get(str(i)))
                os.rename(os.path.join(path, old_name), os.path.join(path, new_name))
    old_names = os.listdir(path)
    for old_name in old_names:
        if old_name != sys.argv[0]:
            new_name = old_name.replace("png", "jpg")
                os.rename(os.path.join(path, old_name), os.path.join(path, new_name))


if __name__ == '__main__':
    path = '/Users/bellal/Downloads/图片/rename'
    rename_files()
