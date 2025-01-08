// test1
// console.log('1'); // 同步任务，直接执行

// setTimeout(() => {
//   console.log('2'); // 宏任务，推入宏任务队列
// }, 0);

// Promise.resolve()
//   .then(() => {
//     console.log('3'); // 微任务，推入微任务队列
//   })
//   .then(() => {
//     console.log('4'); // 微任务，继续推入微任务队列
//   });

// console.log('5'); // 同步任务，直接执行

// console.log('-----------------------'); 
/**
- 代码执行结果
1
5
3
4
2

执行过程
- 1. 执行同步任务，打印1和5
- 2. 异步任务
  - setTimeout回调加入宏任务队列
  - Promise.then 回调加入微任务队列
- 3. 主线程执行完成后，清空微任务队列，依次执行3和4
- 4. 最后执行宏任务队列中的setTimeout，打印2；
 */

// test2 
/**
 * 注意：微任务优先级会高于宏任务；
 * - 微任务在当前事件循环中就会被执行，而宏任务要等到下一个事件循环才执行；
 * - Promise.resolve().then(())是微任务，会立即在当前事件循环中被清空
 * - setTimeout是宏任务，会等到下一次事件循环才被执行；
 */
// setTimeout(() => console.log('macro task'), 0); // 后执行

// Promise.resolve().then(() => console.log('micro task')); // 先执行或者说先打印出来；

// test3
setTimeout(function () {
    console.log(1); // 4
});
new Promise(function (resolve, reject) {
    console.log(2)  // 1
    resolve(3) // 3
}).then(function (val) {
    console.log(val);
})
console.log(4); // 2