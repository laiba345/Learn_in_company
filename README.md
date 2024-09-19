# 对项目的操作命令
1. 拉取新项目；克隆到本地
git clone <项目的GitLab地址>
git clone https://gitlab.com/username/projectname.git
2. 创建属于自己的分支
git clone https://gitlab.com/username/projectname.git
git checkout -b my-feature-branch
3. 查看修改的代码
git status
4. 提交修改
git add .
5. 提交更改
git commit -m "描述你的修改内容"
6. 推送分支到远程仓库
git push origin <新分支名>
git push origin my-feature-branch
7. 合并分支（GitLab 上通过提交一个 Merge Request（合并请求）来合并分支）
- 推送分支后，去 GitLab 项目页面。
- 提交一个新的 Merge Request，选择你刚创建的分支和需要合并的目标分支（例如 main 或 master）。
- 提交请求后，项目的维护者或你自己可以在通过代码审查后合并分支。
8. 
