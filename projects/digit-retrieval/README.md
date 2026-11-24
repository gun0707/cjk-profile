# 手写数字相似图片检索

把手写数字分类模型的隐藏层用作图片特征。查询图来自测试集，候选库由测试集中其余 269 张图片组成。程序按余弦相似度排序，并在终端显示前五张图片。

## 在 Windows 上运行

进入本目录，使用 Python 3.11 与 CPU 版 PyTorch。本项目已在 PyTorch 2.15.0+cpu、scikit-learn 1.9.1 下验证。

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe retrieve.py
.\.venv\Scripts\python.exe retrieve.py --query-index 12
```

如果使用已有环境，在该环境的终端执行 `python retrieve.py` 即可。首次没有权重时会调用 `main.py` 训练 64 隐藏单元、50 轮、随机种子 42 的默认模型。模型权重与实验结果会保存到 `results/`。

- `main.py` 加载数据、定义模型、训练与验证选模。
- `retrieve.py` 提取隐藏层特征、计算相似度并返回前五张。
- `index.html` 展示方法和实际运行记录。

默认查询第 0 张（数字 6），排名第一的候选是第 6 张，余弦相似度 0.9843。
