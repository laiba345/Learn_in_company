# 1. 全新文件夹拉取代码
```
git init
git remote add origin http:...
输入gitlab账号和密码
git pull origin 分支名
```
# 2. 分支的相关操作
1. 拉取新项目；克隆到本地
```
git clone <项目的GitLab地址>
git clone https://gitlab.com/username/projectname.git
```
2. 创建属于自己的分支
```
git clone https://gitlab.com/username/projectname.git
git checkout -b my-feature-branch
```
3. 查看修改的代码
```
git status
```
4. 提交修改
```
git add .
```
5. 提交更改
```
git commit -m "描述你的修改内容"
```
6. 推送分支到远程仓库
```
git push origin <新分支名>
git push origin my-feature-branch
```
7. 合并分支（GitLab 上通过提交一个 Merge Request（合并请求）来合并分支）（一般使用可视化来直接看）
```
- 推送分支后，去 GitLab 项目页面。
- 提交一个新的 Merge Request，选择你刚创建的分支和需要合并的目标分支（例如 main 或 master）。
- 提交请求后，项目的维护者或你自己可以在通过代码审查后合并分支。
```
8. 删除分支
```
- 删除本地分支  git branch -d <分支名>
git branch -d my-feature-branch
- 删除远程分支 git push origin --delete <分支名>
git push origin --delete my-feature-branch
```
9. 强制将本地文件推送到具体分支
git push origin branch_name --force
# 3. react创建新项目
- 先全局安装create-react-app
  - npm install -g create-react-app
- 使用下列命令创建一个新的react项目
  - npx create-react-app my-app
    
# 4. 本地文件如何上传到github新建的仓库
将本地代码上传到 GitHub 仓库，你可以按照以下步骤操作：
- 1. **初始化本地 Git 仓库（如果尚未初始化）**  
   如果你的本地代码还没有初始化 Git 仓库，可以使用下面的命令来初始化：
   ```bash
   git init
   ```
- 2. **添加远程仓库**  
   将你在 GitHub 上创建的仓库链接添加为远程仓库：
   ```bash
   git remote add origin https://github.com/laiba345/DP-Star-Demo.git
   ```
- 3. **添加文件到 Git 仓库**  
   使用 `git add` 命令将代码文件添加到 Git 的暂存区：
   ```bash
   git add .
   ```
   这条命令会将当前文件夹下的所有文件添加到 Git。如果你只想上传某些特定文件，可以将 `.` 替换成文件名。
- 4. **提交更改**  
   提交代码到本地仓库，并写一个简短的提交信息：
   ```bash
   git commit -m "Initial commit"
   ```
- 5. **推送到 GitHub**  
   将代码推送到 GitHub 上的远程仓库：
   ```bash
   git push -u origin master
   ```
   如果你的默认分支是 `main` 而不是 `master`，请将 `master` 替换为 `main`：
   ```bash
   git push -u origin main
   ```
- 6. **验证**  
   打开浏览器，访问你的 GitHub 仓库链接 `https://github.com/laiba345/DP-Star-Demo.git`，你应该能看到本地代码已成功上传到 GitHub。

每次更新本地代码后，重复步骤 3 和 4 来提交本地更改，然后用 `git push` 将其上传到 GitHub。

# 5. 创建一个最新的vue3相关的项目
- 安装官方的创建工具
  - 使用命令：npm create vue@latest 一步到位即可
## vue3项目中使用element-plus的步骤（自动导入）
- 1. 首先使用命令：npm install element-plus --save
- 2. 然后在main.ts中导入Element-plus，一定要导入，要不然大多数样式什么的没有用
```
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
```
- 3. 设置自动导入操作
  - 首先你需要安装unplugin-vue-components 和 unplugin-auto-import这两款插件
    - npm install -D unplugin-vue-components unplugin-auto-import
  - 然后你需要将配置信息放到vite.config.ts中，以（vite为例,看自己的文件中，少哪些东西）
```
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```
# 6. 创建一个最新的react项目
- 直接使用create-react-app来创建React项目
  - 通过命令：npx create-react-app <your-project-name> 来创建项目
    - 该命令弄过以后，需要自己手动选择自己需要的配置；
  - 然后npm install； npm start即可
- 在react项目中使用antd也是很随意的；
  - npm install antd --save
  - 然后在App.tsx中引入相应的组件即可
```
import React from 'react';
import { Button } from 'antd';
```
# 7. 最新前端有什么新的技术吗？

