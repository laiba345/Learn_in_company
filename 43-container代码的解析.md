## 关键逻辑流程
- 1. 容器状态更新；（页面加载时，通过getContainerList来初始化容器数据）；
- 2. Websocket建立连接后，实时接收后端推送的容器状态变化；
- 3. 更新containerList并重新计算各状态的数量（calculateUnitQty）；
 
## 用户操作流程
- 启动/停止测试
  - 用户点击容器按钮（比如：Start Test）；
  - 触发 clickAction，通过WebSocket来发送操作命令；
  - 后端处理完成后，通过WebSocket来返回新状态，前端更新界面；
- 回答问题
  - 后端推送问题数据，触发websocketonmessage；
  - 打开问题对话框（ask-question），用户输入答案后调用answerQuestion 提交；
- 容器锁定
  - 用户触发锁定操作，弹出确认对话框；
  - 确认后调用lockGeniusContainer，通过API修改锁定状态；
  - 确定上了日中轨又是另外一回事，
