---
title: Multivariate normal
toc: false
---

# Multivariate normal distribution

```js
import Plotly from "npm:plotly.js-dist-min";
import {mvcolors} from "../components/mvcolors.js";
import {themeColor} from "../components/functionLibrary.js";
```

```js
const miniColor = themeColor("--mv-color-0", "#6C8EBF");
const miniBackground = themeColor("--theme-background-a", "#ffffff");

// p = 1: standard normal density curve
const uniPts = d3.range(-3.2, 3.21, 0.08).map((x) => ({x, y: Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)}));

// p = 2: standard bivariate normal density surface (zero correlation)
const bivN = 24;
const bivDom = d3.range(bivN).map((i) => -2.2 + (4.4 * i) / (bivN - 1));
const bivZ = bivDom.map((y) => bivDom.map((x) => Math.exp(-0.5 * (x * x + y * y)) / (2 * Math.PI)));

// p = 3: trivariate normal density ellipsoid (fixed illustrative covariance)
function cholesky3mini([[s00, s01, s02], [, s11, s12], [, , s22]]) {
  const l00 = Math.sqrt(s00);
  const l10 = s01 / l00;
  const l20 = s02 / l00;
  const l11 = Math.sqrt(s11 - l10 * l10);
  const l21 = (s12 - l20 * l10) / l11;
  const l22 = Math.sqrt(s22 - l20 * l20 - l21 * l21);
  return [[l00, 0, 0], [l10, l11, 0], [l20, l21, l22]];
}
const [ts1, ts2, ts3] = [1, 0.7, 1.2];
const [tr12, tr13, tr23] = [0.3, -0.25, 0.35];
const triSigma = [
  [ts1 ** 2, tr12 * ts1 * ts2, tr13 * ts1 * ts3],
  [tr12 * ts1 * ts2, ts2 ** 2, tr23 * ts2 * ts3],
  [tr13 * ts1 * ts3, tr23 * ts2 * ts3, ts3 ** 2]
];
const triL = cholesky3mini(triSigma);
function ellipsoidMini(L, scale, res = 16) {
  const X = [], Y = [], Z = [];
  for (let i = 0; i <= res; i++) {
    const theta = (Math.PI * i) / res;
    const rowX = [], rowY = [], rowZ = [];
    for (let j = 0; j <= res; j++) {
      const phi = (2 * Math.PI * j) / res;
      const u0 = Math.sin(theta) * Math.cos(phi);
      const u1 = Math.sin(theta) * Math.sin(phi);
      const u2 = Math.cos(theta);
      rowX.push(scale * L[0][0] * u0);
      rowY.push(scale * (L[1][0] * u0 + L[1][1] * u1));
      rowZ.push(scale * (L[2][0] * u0 + L[2][1] * u1 + L[2][2] * u2));
    }
    X.push(rowX); Y.push(rowY); Z.push(rowZ);
  }
  return {X, Y, Z};
}
const triEllipsoid = ellipsoidMini(triL, 2.2);
```

<div class="dist-layout">

<div class="card properties-card">

### Properties

```tex
\begin{aligned}
&\boldsymbol{x} \sim \mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma}), \quad \text{where } \boldsymbol{x} = (x_1, x_2, \ldots, x_p)^\top \\[0.4em]
&f(\boldsymbol{x}) = \vert 2\pi\boldsymbol{\Sigma}\vert^{-1/2}\exp\Big(-\frac{1}{2}(\boldsymbol{x}-\boldsymbol{\mu})^\top\boldsymbol{\Sigma}^{-1}(\boldsymbol{x}-\boldsymbol{\mu})\Big) \\[0.4em]
&\mathbb{E}(\boldsymbol{x}) = \boldsymbol{\mu} \\[0.4em]
&\mathrm{Cov}(\boldsymbol{x}) = \boldsymbol{\Sigma}
\end{aligned}
```

Partitioning ${tex`\boldsymbol{x}`}, ${tex`\boldsymbol{\mu}`} and ${tex`\boldsymbol{\Sigma}`} into subvectors/blocks:

```tex
\boldsymbol{x} = \begin{pmatrix}\boldsymbol{x}_1\\ \boldsymbol{x}_2\end{pmatrix},\quad
\boldsymbol{\mu} = \begin{pmatrix}\boldsymbol{\mu}_1\\ \boldsymbol{\mu}_2\end{pmatrix},\quad
\boldsymbol{\Sigma} = \begin{pmatrix}\boldsymbol{\Sigma}_{11} & \boldsymbol{\Sigma}_{12}\\ \boldsymbol{\Sigma}_{21} & \boldsymbol{\Sigma}_{22}\end{pmatrix}
```

The **marginal distributions** are

```tex
\boldsymbol{x}_1 \sim \mathcal{N}(\boldsymbol{\mu}_1, \boldsymbol{\Sigma}_{11}), \quad \boldsymbol{x}_2 \sim \mathcal{N}(\boldsymbol{\mu}_2, \boldsymbol{\Sigma}_{22})
```

The **conditional distribution** is

```tex
\begin{aligned}
&\boldsymbol{x}_1 \mid \boldsymbol{x}_2 \sim \mathcal{N}\big(\boldsymbol{\mu}_{1\mid 2},\ \boldsymbol{\Sigma}_{1\mid 2}\big) \\[0.4em]
&\boldsymbol{\mu}_{1\mid 2} = \boldsymbol{\mu}_1 + \boldsymbol{\Sigma}_{12}\boldsymbol{\Sigma}_{22}^{-1}(\boldsymbol{x}_2-\boldsymbol{\mu}_2) \\[0.4em]
&\boldsymbol{\Sigma}_{1\mid 2} = \boldsymbol{\Sigma}_{11}-\boldsymbol{\Sigma}_{12}\boldsymbol{\Sigma}_{22}^{-1}\boldsymbol{\Sigma}_{21}
\end{aligned}
```

</div>

<div class="card mini-plots-card">

### Increasing dimension

```js
(async () => {
  const wrap = document.createElement("div");
  wrap.style.display = "flex";
  wrap.style.flexDirection = "column";
  wrap.style.gap = "0.5rem";
  wrap.style.alignItems = "center";

  function labeledBox(label, node) {
    const box = document.createElement("div");
    box.style.display = "flex";
    box.style.flexDirection = "column";
    box.style.alignItems = "center";
    const cap = document.createElement("div");
    cap.style.fontSize = "12px";
    cap.style.marginBottom = "0.25rem";
    cap.appendChild(tex`${label}`);
    box.appendChild(cap);
    box.appendChild(node);
    return box;
  }

  const uniNode = Plot.plot({
    width: 100, height: 90, margin: 4, axis: null,
    marks: [
      Plot.areaY(uniPts, {x: "x", y: "y", fill: mvcolors[0], opacity: 0.25}),
      Plot.line(uniPts, {x: "x", y: "y", stroke: mvcolors[0], strokeWidth: 2})
    ]
  });

  const bivDiv = document.createElement("div");
  bivDiv.style.width = "100px";
  bivDiv.style.height = "90px";
  bivDiv.style.marginTop = "-14px";
  await Plotly.newPlot(bivDiv, [{
    type: "surface",
    x: bivDom, y: bivDom, z: bivZ,
    colorscale: [[0, miniBackground], [1, miniColor]],
    showscale: false,
    hoverinfo: "skip",
    contours: {x: {highlight: false}, y: {highlight: false}, z: {highlight: false}}
  }], {
    width: 100, height: 90,
    margin: {l: 0, r: 0, t: 0, b: 0},
    paper_bgcolor: "rgba(0,0,0,0)",
    scene: {
      xaxis: {visible: false}, yaxis: {visible: false}, zaxis: {visible: false},
      aspectmode: "manual", aspectratio: {x: 1, y: 1, z: 0.6},
      camera: {eye: {x: 0.85, y: -0.85, z: 0.7}}
    }
  }, {displayModeBar: false});

  const triDiv = document.createElement("div");
  triDiv.style.width = "100px";
  triDiv.style.height = "90px";
  await Plotly.newPlot(triDiv, [{
    type: "surface",
    x: triEllipsoid.X, y: triEllipsoid.Y, z: triEllipsoid.Z,
    colorscale: [[0, miniColor], [1, miniColor]],
    showscale: false,
    hoverinfo: "skip",
    opacity: 0.85,
    contours: {x: {highlight: false}, y: {highlight: false}, z: {highlight: false}}
  }], {
    width: 100, height: 90,
    margin: {l: 0, r: 0, t: 0, b: 0},
    paper_bgcolor: "rgba(0,0,0,0)",
    scene: {
      xaxis: {visible: false}, yaxis: {visible: false}, zaxis: {visible: false},
      camera: {eye: {x: 1.6, y: -1.6, z: 0.9}}
    }
  }, {displayModeBar: false});

  wrap.appendChild(labeledBox("p = 1", uniNode));
  wrap.appendChild(labeledBox("p = 2", bivDiv));
  wrap.appendChild(labeledBox("p = 3", triDiv));

  return wrap;
})()
```

</div>

</div>

## Interactive visualizations

- [Univariate normal distribution (p=1)](./normal-gaussian-distribution)
- [Bivariate normal distribution (p=2)](./bivariate-normal-distribution)
- [Trivariate normal distribution (p=3)](./trivariate-normal-distribution)

<style>

.properties-card .katex {
  font-size: 0.95em;
}

.properties-card .katex-display,
.properties-card .katex-display > .katex {
  text-align: left;
}

</style>
