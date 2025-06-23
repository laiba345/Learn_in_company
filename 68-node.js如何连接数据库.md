- 1. 安装mysql驱动
  - npm install mysql2 
- 2. 基本连接的示例
```
const mysql = require('mysql2');

// 创建连接池（推荐生产环境使用）
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',
  database: 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 执行查询
pool.query('SELECT * FROM users', (err, results) => {
  if (err) throw err;
  console.log(results);
});

// 使用 Promise
const promisePool = pool.promise();
async function getUsers() {
  const [rows] = await promisePool.query('SELECT * FROM users');
  return rows;
}
```
