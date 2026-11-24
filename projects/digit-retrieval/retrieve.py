"""在手写数字测试集中检索与查询图片最相似的五张图。"""

import argparse
from pathlib import Path

import torch
from torch.nn import functional as F

from main import EPOCHS, HIDDEN_DIM, SEED, build_model, load_splits, run


def print_images(images, labels):
    """在终端并排画出原始 8×8 灰度图，左一为查询，右侧按相似度排列。"""
    headings = ["Query"] + [f"Top-{rank}" for rank in range(1, len(images))]
    print("    ".join(f"{name} ({label})".center(16) for name, label in zip(headings, labels)))
    shades = " .:-=+*#%@"
    pixels = (images.reshape(-1, 8, 8) * (len(shades) - 1)).round().long()
    for row in range(8):
        print("    ".join("".join(shades[v] * 2 for v in img[row].tolist()) for img in pixels))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--query-index", type=int, default=0, help="测试集中的图片编号，默认 0")
    args = parser.parse_args()

    _, _, (images, labels) = load_splits(SEED)
    query = args.query_index
    if not 0 <= query < len(images):
        parser.error(f"--query-index 须在 0 到 {len(images) - 1} 之间")

    checkpoint = Path(__file__).parent / "results" / f"hidden{HIDDEN_DIM}_epochs{EPOCHS}_seed{SEED}.pth"
    if not checkpoint.is_file():
        print("首次运行，先训练默认模型。")
        run(HIDDEN_DIM, EPOCHS, SEED)
    saved = torch.load(checkpoint, map_location="cpu", weights_only=True)
    model = build_model(saved["hidden_dim"])
    model.load_state_dict(saved["state_dict"])
    model.eval()

    with torch.no_grad():
        # 跳过最后的十分类输出层，保留每张图的隐藏层特征。
        features = model[:-1](images)
        scores = F.cosine_similarity(features[query:query + 1], features, dim=1)
        scores[query] = -torch.inf  # 查询图片不能检索到自身
        neighbors = scores.topk(5).indices

    print(f"查询编号 {query}，真实数字 {labels[query].item()}，候选图片 {len(images) - 1} 张")
    for rank, index in enumerate(neighbors.tolist(), start=1):
        print(f"Top-{rank}  编号 {index:3d}  数字 {labels[index].item()}  相似度 {scores[index].item():.4f}")
    display = [query, *neighbors.tolist()]
    print_images(images[display], labels[display].tolist())


if __name__ == "__main__":
    main()
