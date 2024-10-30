/**
 * 源码 promise
 * 1. 维护一个状态，state：pending、fulfilled、rejected，目的是让promise的状态
 * 一经改变无法修改，并且then和catch无法同时触发
 *  - pending：状态为等待，表示Promise尚未完成
 *  - fulfilled：状态为已完成，表示Promise成功
 *  - rejected：状态为已拒绝，表示Promise失败
 * 2. 从用法上清楚，promise接受一个回调，回调里面有两个参数，这个回调需要自己触发
 * 所以要进行调用，并且这两个形参是个函数，
 */
// 使用类来写
class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    const resolve = () => {
      if(this.state === 'pending') {
        this.state = 'fulfilled'
      }
    }

    const reject = () => {
      if(this.state === 'pending') {
        this.state = 'rejected'
      }
    }

    executor(resolve, reject)
  }
}

