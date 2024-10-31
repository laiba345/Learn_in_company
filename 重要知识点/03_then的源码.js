/**
 * then的源码
 * - 1. 默认返回一个promise对象，状态为fulfilled
 * - 2. 当then前面的promise状态为fulfilled，then中的回调直接执行，
 *    当then前面的promise状态为rejected，then中的第二个回调直接执行，
 *    当then前面的promise状态为pending，then中的回调需要被换存起来交给resolve或者reject。
 * - 3，一个promise对象后面可以接多个then，因此then一定返回一个promise，
 *    既然保证了后面的then执行，因此then返回的promise状态一定是fulfilled
 * - 4. 还需要考虑一种情况，就是then里面接的参数是回调，但是以防万一往里面加入参数
 *    或者其它东西，不是函数体的话
 *    - 因此这里需要使用typeof将两个参数先判断下，如果不是函数体，那就自己赋值一个
 *    没有意义的函数体，之后就返回一个Promise
 */
// class MyPromise {
//   constructor(executor) {
//     this.onFulfilledCallbacks = [] // 装then里面的回调
//     this.onRejectedCallbacks = [] // 装catch里面的回调

//     const resolve = (value) => {
//       if(this.state === 'pending') {
//         this.state = 'fulfilled'
//         this.value = value
//         this.onFulfilledCallbacks.forEach(cb => cb(value))
//       }
//     }

//     const reject = (reason) => {
//       if(this.state === 'pending') {
//         this.state = 'reject'
//         this.reason = reason
//         this.onRejectedCallbacks.forEach(cb => cb(reason))
//       }
//     }
//   }
//   // then 需要等待前面的promise状态变更后才能执行then里面的回调，因此一定是一个异步
//   then(onFulfilled, onRejected) {
//     // 两个参数回调都需要存起来分别供resolve和reject去调用；
//     onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
//     onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
//     const newPromise = new MyPromise((resolve, reject) => {

//     })
//     return newPromise
//   }
// }

/**
 * 然后then里面的回调是可以继续返回一个promise对象的，
 * 这个时候的promise状态就可以把默认的fulfilled状态覆盖掉，
 * 因此要进行一个状态判断，三种状态就是三种可能
 *
 * 1. 如果状态为fulfilled
 *  - 那么说明then前面的那个哥们已经彻底执行完了then前面的promise对象
 *  的状态瞬间变更完成了，需要立即执行then里面的回调；
 * 2. 如果状态为rejected，那么就调用第二个回调，状态rejected并不能影响
 *  后面then的执行，因此还是resolve
 * 3. 如果状态为pending，那么说明前面的promise实例因为异步的原因还没有转变状态
 *  因此要把两种状态给存起来，存进之前准备好的数据里去；
 */

class MyPromise {
  constructor(executor) {
    this.onFulfilledCallbacks = []; // 装then里面的回调
    this.onRejectedCallbacks = []; // 装catch里面的回调

    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach((cb) => cb(value));
      }
    };

    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "reject";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((cb) => cb(reason));
      }
    };
  }
  // then 需要等待前面的promise状态变更后才能执行then里面的回调，因此一定是一个异步
  then(onFulfilled, onRejected) {
    // 两个参数回调都需要存起来分别供resolve和reject去调用；
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    const newPromise = new MyPromise((resolve, reject) => {
      if (this.state == "fulfilled") {
        setTimeout(() => {
          // 模拟异步，但是模拟不了微任务
          try {
            const result = onFulfilled(this.value);
            resolve(result); // 应该放result中的resolve中的参数
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.state === "rejected") {
        setTimeout(() => {
          try {
            const result = onRejected(this.reason);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
      if (this.state === "pending") {
        // 缓存then中的回调
        this.onFulfilledCallbacks.push((value) => {
          setTimeout(() => {
            try {
              const result = onFulfilled(value);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push((value) => {
          setTimeout(() => {
            try {
              const result = onFulfilled(reason);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });
    return newPromise;
  }
}
