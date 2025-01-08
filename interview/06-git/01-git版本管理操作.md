# 主要用哪些Git版本管理操作，对git Rebase了解多少？
1. 仓库基本操作
- 克隆远程仓库 git clone <repo-url>
- 初始化本地仓库 git init

2. 查看状态和日志
- 查看状态 git status
- 查看历史 git log

3. 分支操作
- 查看分支 git branch
- 创建分支 git branch <branch-name> 
- 切换分支 git checkout <branch-name> 
- 创建并切换分支 git checkout -b <branch-name>
- 删除分支 git branch -d <branch-name>
- 强制删除分支 git branch -D <branch-name>

4. 修改文件和提交
- 添加文件到暂存区 git add <file>
- 添加所有文件 git add .
- 提交文件 git commit -m "message"

5. 同步远程仓库
- 拉取远程分支； git pull
- 推送代码到远程仓库 git push origin <branch-name>
- 设置远程仓库 git remote add origin <repo-url> 

6. 合并与冲突
- 合并分支 git merge <branch-name>
- 查看冲突文件；**自动提示冲突文件** 

# 对Git Rebase的理解？
- 什么是Git Rebase？
    - git rebase是一个用于重新整理提交历史的命令。它的作用是将一个分支的提交历史，
    重新应用到另一个分支上，从而保持提交记录的整洁性。
- 更新本地分支？
    - git checkout <feature-branch> 
    - git rebase main
        - 上述操作会把当前分支的提交历史重新基于main分支的最新状态；
        - 效果类似于合并，但提交历史更加线性和清晰

# Git Merge和Git Rebase的区别？
- 提交历史
    - Git Merge；保留原始的分支提交历史
    - Git Rebase；重新整理提交历史，历史更加线性
- 使用场景
    - Git Merge；合并分支，适合多人协作
    - Git Rebase；整理历史记录，保持清晰
- 是否生成新提交
    - Git Merge；会生成一个新的合并提交
    - Git Rebase；不会生成合并提交

## 注意
- 不要对已推送的分支使用 Rebase；如果对已经推送到远程的分支使用 rebase，可能导致其他开发者的代码失效。