# Websocket相关知识的学习
- 概念
  - 什么是 WebSocket？ WebSocket 是一种网络通信协议，允许客户端和服务器之间进行全双工通信。它通过一个持久的连接让数据在客户端和服务器之间进行即时交换。
  - 和HTTP的区别？
    -  HTTP 是一个请求-响应协议，而 **WebSocket 提供了一种持续的连接**，使得数据可以在客户端和服务器之间实时双向流动。
- 工作原理
  - **WebSocket 如何通过 HTTP 握手建立连接？**
    - WebSocket 使用HTTP握手来建立连接，然后在连接建立后切换到WebSocket协议，以便实现持久的、双向的通信
    - 握手过程
      - 1.  客户端发起 WebSocket 握手请求； 客户端（通常是浏览器）首先发送一个 HTTP 请求，要求与服务器建立 WebSocket 连接。这个请求是一个 HTTP 协议的升级请求，它通过设置 Upgrade 和 Connection 头来告诉服务器希望切换到 WebSocket 协议。
        - 请求头示例：
        ```
        GET /chat HTTP/1.1   // 这是一个标准的 HTTP GET 请求。
        Host: example.com  // 指定服务器的主机名
        Upgrade: websocket  // 指示服务器升级协议到 WebSocket。
        Connection: Upgrade  // 指示这不是普通的 HTTP 请求，而是希望升级到 WebSocket 协议。
        Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==  // 这是一个随机生成的 Base64 编码的字符串，用于安全目的，服务器使用它来验证请求。
        Sec-WebSocket-Version: 13 // 版本
        ```
      - 2. 服务器响应HTTP握手请求； 当服务器收到客户端的请求后，它会检查请求头中的信息。如果请求是有效的，且服务器支持 WebSocket 协议，服务器会返回一个包含 101 Switching Protocols 的 HTTP 响应，表示协议升级成功。
        - 服务器响应头示例
        ```
        HTTP/1.1 101 Switching Protocols  // 表示服务器接受客户端的协议升级请求，并切换协议。
        Upgrade: websocket  // 确认协议升级为WebSocket
        Connection: Upgrade  // 确认这是一个协议升级。
        Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=  // 这个字段是对 Sec-WebSocket-Key 的响应，是通过 Sec-WebSocket-Key 和一个固定的 GUID（258EAFA5-E914-47DA-95CA-C5AB0DC85B11）进行 SHA-1 哈希运算后再进行 Base64 编码得到的。它的作用是验证客户端发起的请求是否合法。
        ```
      - 3. 握手成功，WebSocket 连接建立； 一旦握手成功，HTTP 连接会被升级为 WebSocket 协议，客户端和服务器就可以开始使用 WebSocket 协议进行实时的双向通信。从此，WebSocket 协议会覆盖掉 HTTP 协议，连接持续存在，直到主动关闭连接。
- 握手的核心点：
客户端发送 HTTP 请求，通过 Upgrade 请求头告知服务器希望升级到 WebSocket。

服务器响应，如果支持 WebSocket 协议，返回 101 Switching Protocols，并确认协议已升级。

握手完成后，双方使用 WebSocket 协议进行双向通信。

- 为什么要使用 HTTP 握手？
兼容性：WebSocket 协议是建立在 HTTP 协议之上的，使用 HTTP 握手确保它能够通过现有的 HTTP 服务器和防火墙等网络中间件。

安全性：Sec-WebSocket-Key 和 Sec-WebSocket-Accept 使得握手过程具有一定的安全性，可以防止一些伪造的请求。

总结：
WebSocket 通过 HTTP 握手建立连接，是为了利用现有的 HTTP 协议基础进行初步通信，然后切换到 WebSocket 协议。通过这个握手过程，WebSocket 实现了全双工通信，使得客户端和服务器之间可以进行持续的数据交换。
