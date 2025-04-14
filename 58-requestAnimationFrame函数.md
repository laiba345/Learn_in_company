# requestAnimationFrame函数
- 定义；
  - requestAnimationFrame 是浏览器提供的 JavaScript API，用于高效、流畅地执行动画。
  - 浏览器原生提供的JS方法，用于请求浏览器在下次重绘（repaint前执行指定的回调函数）。
  - 本质：浏览器渲染引擎的钩子，与屏幕刷新率同步（通常 60Hz，即每秒 60 次）。
  - **由浏览器实现，属于Web API的一部分**
- 工作原理
  - 注册回调：调用 requestAnimationFrame(callback)，将 callback 加入浏览器动画队列。
  - 执行时机：浏览器在每次页面渲染前（通常每秒 60 次）执行队列中的所有回调。
  - 参数传递：回调函数会自动接收一个 timestamp 参数（高精度时间戳，单位毫秒），可用于计算动画进度。
- 搭配 cancelAnimationFrame
  - 作用：取消未执行的动画帧请求（类似 clearTimeout）；
  - 使用场景：组件卸载时清理资源，防止内存泄露； 
```
let animationId;
const startAnimation = () => {
  animationId = requestAnimationFrame(animate);
};
const stopAnimation = () => {
  cancelAnimationFrame(animationId);
};
```
