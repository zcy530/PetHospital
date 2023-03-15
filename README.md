# 关于如何协同开发

## 项目如何下载
1. 在本地随便选一个文件夹，用于存放这个项目代码，比如 Document
2. 打开控制台，进入这个文件夹的目录，比如 cd Document
3. 输入以下命令，可以下载代码到本地，以及将本地文件夹与github仓库关联到一起。下载后该文件夹里会新增一个文件夹 petHospital
``` 
git clone https://github.com/zcy530/PetHospital.git 
```
4. 在控制台中，进入这个下载下来的项目文件
``` 
cd petHospital
```
5. 使用下列命令查看是否与github仓库关联成功
``` 
git remote -v

// 如果结果如下，说明关联成功
/petHospital > git remote -v
origin  git@github.com:zcy530/PetHospital.git (fetch)
origin  git@github.com:zcy530/PetHospital.git (push)
```

## 如何运行
1. 确保控制台在项目文件夹的目录中
2. 因为项目中还没有安装依赖，第一次运行需要通过以下的命令安装 node_modules
``` 
yarn install 
```
3. 通过下面的命令运行项目
``` 
yarn start
```
4. Compiled successfully 之后，打开浏览器，输入 http://localhost:3000 访问项目的页面

## 如何协同开发：创建分支

1. 推荐用 vscode 编辑器，打开上方菜单的Terminal，再次确认 Terminal 在项目文件的目录中
``` 
/Documents/petHospital > 
```
2. 每次创建分支之前，首先保证本地 origin 的代码是最新的，把最近的远程代码拉到本地，不然后面会有点混乱
``` 
git pull
```
3. 创建你自己的分支，后面是分支的名字，可以自己取，以「名字/修改的功能」命名比较好~
``` 
git branch zhangcaiyi/create_home_page
```
3. 可以查看现在仓库一共有哪些分支
```
git branch -a
按q退出
```
5. 切换到你现在的分支当中，后面名字是你自己刚刚创建的
``` 
git checkout zhangcaiyi/create_home_page
```


## 如何协同开发：提交代码

1. 代码当中有修改
``` 
git add .
git status 保证所有文件都是绿色
git commmit -m "这里写注释"
git push --set-upstream origin zhangcaiyi/create_home_page
```
2. push 成功之后打开远程仓库的网址 https://github.com/zcy530/PetHospital， 就可以看到最顶部多了一个绿色的按钮 "Create Pull Request"，点击这个按钮，创建 Pull Request，这样管理员后台收到这个 PR，就可以把它合进去

## 一些注意
前台代码放在 pages_front 文件夹
后台代码放在 pages_back 文件夹

每个页面都被放在不同的page里的文件夹里面，因此不同的模块的开发过程应该不会相互干扰，但是不排除有时候会修改一些global的配置，比如package.json、静态资源等等，如果有全局的改变，尽快上传到远端。