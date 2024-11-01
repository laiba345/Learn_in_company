import React from "react";
import "./App.css";
import { Button, ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "red" } }}>
      <h1>hello React</h1>
      <Button>一键启动</Button>
    </ConfigProvider>
  );
}
export default App;
