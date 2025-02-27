# git的问题的相关操作
```
$ git push
fatal: The current branch hk has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin hk

To have this happen automatically for branches without a tracking
upstream, see 'push.autoSetupRemote' in 'git help config'.
```
- 按照其要求来，使用命令git push --set-upstream origin hk来操作即可

# 接着报错
```
! [rejected]        hk -> hk (fetch first)
error: failed to push some refs to 'https://ite.cns.myfiinet.com/gitlab/f1340047/Global_Genesis_Vue3.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```
- 需要将远程分支的更改拉取到本地，合并后再推送；使用命令git pull origin hk
