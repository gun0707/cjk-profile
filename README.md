# 程锦康 · 个人主页

使用原生 HTML、CSS、JavaScript 构建的静态个人网站，展示项目作品、学习方向与交互式 Dijkstra 算法演示。

## 项目作品

- [PyTorch 手写数字识别](https://github.com/gun0707/pytorch-digits)：可复现实验，最佳配置测试准确率 97.0%。
- [Qt 图算法可视化](https://github.com/gun0707/qt-graph-visualizer)：DFS、Prim、Dijkstra 的逐步演示。

## 本地预览

在仓库根目录运行：

```sh
python -m http.server 8000
```

打开 http://localhost:8000 。网站无构建步骤和运行时依赖。

## 部署

GitHub Pages 从 `main` 分支根目录发布。`.nojekyll` 用于直接提供静态文件。修改源码并推送后会自动重新部署。
