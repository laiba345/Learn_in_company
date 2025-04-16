## 使用cookie获取用户信息
- 使用Vue.js提供的插件VueCookie可以用于在客户端操作cookies； 
```
import VueCookies from 'vue-cookies';
const cookies: any = VueCookies;
```
    - 然后你就可以在原文中使用获取到的cookie内容
        - 如： {{ cookies.get('username') }}
        - 直接通过cookie.get('相关字段'); 来获取之前存的值； 
- 这样做有一个很大的好处，
    - 获取一些用户信息的时候可以直接使用cookies.get('xxx') 来获取用户数据信息，就不需要从父组件传递过来
    - cookie存的值，你直接把其想象在浏览器中的值即可；
    

