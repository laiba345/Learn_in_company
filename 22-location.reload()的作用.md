## location.reload()
- location.reload() 是 JavaScript 中用来重新加载当前页面的方法，**其作用类似于用户按下浏览器的刷新按钮**。具体行为如下：
  - 1. 重新加载当前页面
    - 默认情况下，location.reload() 会从浏览器缓存中加载页面。
    - 如果需要强制从服务器加载，可以使用参数 true：location.reload(true)。、
  - 2. 用法
  ```
  location.reload(); // 从缓存重新加载
  location.reload(true); // 强制从服务器重新加载
  ```
- **但是使用这个的会，可能会导致页面跳转不成功**
  - 加上 location.reload() 后，页面的跳转可能会被中断，因为 location.reload() 会立即重新加载当前页面，导致后续代码无法执行。以下是可能的原因：
  - 如果你在页面跳转之前调用了 location.reload()，它会刷新当前页面，而后续的跳转代码可能不会执行, 上述代码就可能不会执行，这一点需要清楚； 
  ```
  const logOut = () => {
  cookies.remove('username');
  cookies.remove('role');
  cookies.remove('token');
  cookies.remove('pid');
  cookies.remove('adrole');
  cookies.remove('bu');
  cookies.remove('fromRouter');
  cookies.remove('toRouter');
  localStorage.removeItem('token');
  console.log('@', 'logOut'); 
  // location.reload();
  router.push('/login');
};
```
