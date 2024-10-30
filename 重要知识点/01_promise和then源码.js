/**
 * 同步与异步
 * 1. 异步指的是同时执行代码，其实就是指的并发。
 * 2. 对于V8引擎来说，同步并不是我们我们想当然的同时执行代码，同步是指同步原来的顺序，每一行代码会按照它们出现的顺序依次执行，前一行代码必须完全执行完毕并返回控制权给调用者之后，下一行代码才会开始执行。
 */

// function a() {
//   setTimeout(() => {
//     console.log('a is ok');
//   }, 1000);
// }

// function b() {
//   console.log('b is ok');
// }

// a()
// b()

/**
 * 执行结果
 * b is ok
 * a is ok
 *
 * 对于V8引擎来说，执行代码肯定是要优先考虑效率的，
 * 它不可能会等你1s执行完a函数再去执行b函数的，
 * 这就是V8引擎执行代码的情况，这种需要耗时执行的代码也叫做异步执行代码
 */

/**
 * 异步好就好在效率好，但是有的时候我希望能够先执行a函数，再执行b函数
 * 又或者我执行的那个函数需要在另一个函数之前执行完毕
 */

// let flag = false
// function a(){
//     setTimeout(()=>{
//         console.log('我结婚啦');
//         flag = true
//     },1000)
// }
// function b(){
//     setTimeout(()=>{
//         console.log('我生娃啦')
//     },500)
// }
// a()
// if(flag){
// 	b()
// }
// 上述方式根本行不通，但是你可以将b函数放到a函数里面去执行；
// 但是如果函数一多起来，函数嵌套函数，代码会非常糟糕

// Promise的诞生
// es6 新增了一个promise方法，专门用来解决回调地狱的，或者说解决异步更优雅
function a() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("a is ok");
      resolve(1);
    }, 1000);
  });
}

function b() {
  console.log("b is ok");
}

a().then(
  (res) => {
    console.log(res, "+++");
    b();
  },
  (err) => {
    console.log(err, "---");
  }
);

/**
 * 上述代码的解释
 * 1. function a() 定义了一个异步函数，它返回一个Promise对象
 * 在这个Promise的executor函数中，setTimeout被用来模拟一个耗时1秒的异步操作
 * 当这个操作完成时，它会通过调用resolve函数来解析Promise，传入值1作为结果
 * 2. function b() 是一个简单的同步函数
 * 3. 在a().then(...) 中，我们注册了两个回调函数：1. 成功的回调；2.失败的回调
 * 由于在a函数中调用了resolve，而不是reject，所以只有成功的回调会被调用
 * 4. 成功的回调接收Promise解析后的值，这里是1，然后它调用b函数
 */

