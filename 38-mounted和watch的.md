# mounted和watch的监听时机
- mounted钩子
  - 触发时机；当组件被挂载到DOM后，mounted钩子就会自动触发；
  - 作用：
    - mounted钩子用于在组件中首次加载启动计时器；
    - 作为初始化逻辑的一部分，确保组件一加载就开始计时；
  - 特点；
    - 只会触发一次（除非组件被销毁并重新挂载）
    - 与 start prop 的值无关，无论 start 的值是什么，mounted 都会触发

```
watch: {
  start () {
    this.startCounter();
  },
},
```
- watch监听器
  - 触发时机：当 start（prop传递过来的）的值发生变化时，watch监听器会触发；
  - 作用：在这个组件中，watch 监听器用于在 start prop 发生变化时重新启动计时器。
