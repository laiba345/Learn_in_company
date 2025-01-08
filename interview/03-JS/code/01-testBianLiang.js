/**
 * test var
 */
console.log(x); // undefined

var x = 1; 
// 测试全局对象挂载问题
console.log(window.x) // 测试不出来，可以去浏览器中测试；

/**
 * test let / const 
 */
// console.log(y); // 报错； 
// let y = 1; 


/**
 * 测试全局对象挂载问题
    在全局作用域中，var 声明的变量会被挂载到 window 或 global 对象上。
    javascript
 */