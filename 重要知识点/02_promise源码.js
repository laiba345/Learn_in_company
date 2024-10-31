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
// class MyPromise {
//   constructor(executor) {
//     this.state = 'pending'
//     const resolve = () => {
//       if(this.state === 'pending') {
//         this.state = 'fulfilled'
//       }
//     }

//     const reject = () => {
//       if(this.state === 'pending') {
//         this.state = 'rejected'
//       }
//     }

//     executor(resolve, reject)
//   }
// }
// 注意：promise里面内置了捕获错误的机制，使用的是catch或then的第二个参数处理
// promise自身维护了一个状态state，值分别为：pending，fulfilled，rejected，默认值就是pending，如果我们resolve了，那么就会触发then的第一个参数，如果reject了，那么就是触发catch或者then的第二个参数
// 还有一种情况就是，假设resolve和reject都调用了，谁先谁执行，后面的不执行；
// 注意：必须先从默认状态开始，然后才能改变状态，


// resolve和reject函数是可以传值的，分别传给then和catch的形参，参数都给个初始值undefined，调用的时候进行赋值
// class MyPromise {
//   constructor(executor) {
//     this.state = 'pending' // promise的默认状态
//     this.state = undefined // resolve的参数
//     this.state = undefined // reject的参数

//     // resolve和reject函数都是可以传值的，
//     const resolve = (value) => {
//       if(this.state === 'pending') {
//         this.state = 'fulfilled'
//         this.value = value
//       }
//     }

//     const reject = (reason) => {
//       if(this.state === 'pending') {
//         this.state = 'rejected'
//         this.reason = reason
//       }
//     }

//     executor(resolve, reject)
//   }
// }

/**
 * 注意
 * 1. 无论是否resolve，如果有then，那么then一定会进行调用，
 * 2. 有无resolve影响的是then里面的回调时，resolve回调了
 *    - 那么then的第一个回调一定是执行的，
 *    - catch同理
 */

// then是Promise原型身上的方法，用class写的话，就写在constructor外面
// class MyPromise {
//   constructor(executor) {

//   }
//   then() {

//   }
// }

/**
 * 1. then是走两个回调的，一个对应的resolve，一个对应的reject，其实第二个就是catch，
 * .then里面的第二个回调就等同于.catch 
 * 2. .then里面一定会有两个形参，resolve的调用会触发then的第一个回调，
 * ，因此我需要把then的第一个参数挂在this上，让resolve函数去调用这个then的第一个回调
 * 3. 原型上的then里面的this指向的实例对象，共用一个this，
 * 并且then里面的回调里面可能会有多个函数，需要遍历他逐个进行调用
 * 
 * 4. 为什么是多个回调？
 *  - 一个promise实例后面是可以接受多个then的，只要promise的状态为fulfilled
 *  那么所有的then回调都会执行，执行的参数此时就发挥作用了，给到then的回调吗，catch同理
 */
class MyPromise {
  constructor(executor) {
    this.onFulfilledCallbacks = [] // 装then里面的回调
    this.onRejectedCallbacks = [] // 装catch里面的回调

    const resolve = (value) => {
      if(this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onFulfilledCallbacks.forEach(cb => cb(value))
      }
    }

    const reject = (reason) => {
      if(this.state === 'pending') {
        this.state = 'reject'
        this.reason = reason
        this.onRejectedCallbacks.forEach(cb => cb(reason))
      }
    }
  }
  // then 需要等待前面的promise状态变更后才能执行then里面的回调，因此一定是一个异步
  then(onFulfilled, onRejected) {
    // 两个参数回调都需要存起来分别供resolve和reject去调用；
  }
}




