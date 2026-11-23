"use strict";
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}));
document.querySelector('#year').textContent = new Date().getFullYear();

// 与 Qt 项目的七顶点示例图使用相同的边和权值。
const vertices = [[110,35],[310,35],[380,130],[310,215],[110,215],[40,130],[210,125]];
const edges = [[0,1,28],[0,5,10],[1,2,16],[1,6,14],[2,3,12],[3,4,22],[3,6,18],[4,5,25],[4,6,24]];
const frames = [{distance:[0,Infinity,Infinity,Infinity,Infinity,Infinity,Infinity],parent:Array(7).fill(-1),seen:[],current:-1}];
const distance = frames[0].distance.slice(), parent = Array(7).fill(-1), seen = [];
for (let count = 0; count < vertices.length; count++) {
  let u = -1;
  for (let v = 0; v < vertices.length; v++) {
    if (!seen.includes(v) && (u < 0 || distance[v] < distance[u])) u = v;
  }
  if (u < 0 || !Number.isFinite(distance[u])) break;
  seen.push(u);
  for (const [a,b,w] of edges) {
    const v = a === u ? b : b === u ? a : -1;
    if (v >= 0 && !seen.includes(v) && distance[u] + w < distance[v]) {
      distance[v] = distance[u] + w;
      parent[v] = u;
    }
  }
  frames.push({distance:distance.slice(),parent:parent.slice(),seen:seen.slice(),current:u});
}
let step = 0;
const svg = document.querySelector('#demo-graph');
const nextButton = document.querySelector('#next-step');
function renderDemo() {
  const frame = frames[step];
  svg.innerHTML = edges.map(([a,b,w]) => {
    const [x1,y1] = vertices[a], [x2,y2] = vertices[b];
    const tree = (frame.parent[a] === b && frame.seen.includes(a)) || (frame.parent[b] === a && frame.seen.includes(b));
    const mx=(x1+x2)/2, my=(y1+y2)/2-7;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${tree?'demo-tree':'demo-edge'}"/><text x="${mx}" y="${my}" class="demo-weight" text-anchor="middle">${w}</text>`;
  }).join('') + vertices.map(([x,y],v) => {
    const done=frame.seen.includes(v)?' seen':'';
    const d=Number.isFinite(frame.distance[v])?frame.distance[v]:'∞';
    return `<circle cx="${x}" cy="${y}" r="15" class="demo-node${done}"/><text x="${x}" y="${y+1}" class="demo-label${done}">${v}</text><text x="${x}" y="${y+32}" class="demo-dist">${d}</text>`;
  }).join('');
  document.querySelector('#step-counter').textContent = `${step} / ${frames.length-1}`;
  document.querySelector('#demo-description').textContent = step===0
    ? '从顶点 0 出发，点击“下一步”确定最近的顶点。'
    : step===frames.length-1
      ? `计算完成。顶点 0–6 的最短距离：${frame.distance.join('、')}。`
      : `确定顶点 ${frame.current}，距离为 ${frame.distance[frame.current]}；更新相邻顶点的候选距离。`;
  nextButton.disabled = step===frames.length-1;
}
nextButton.addEventListener('click', () => {if(step<frames.length-1){step++;renderDemo();}});
document.querySelector('#reset-demo').addEventListener('click', () => {step=0;renderDemo();});
renderDemo();
