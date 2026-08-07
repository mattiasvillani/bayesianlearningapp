---
title: Gumbel–Softmax
toc: false
---

# Gumbel–Softmax Distribution

```js
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.01, 0.99], {value: 0.3, step: 0.01, label: "π₁"}),
  Inputs.range([0.01, 0.99], {value: 0.5, step: 0.01, label: "π₂"}),
  Inputs.range([0.01, 5], {value: 1, step: 0.01, label: "τ"})
]));
```

```js
function gumbelSoftmaxPdf(x, Pi, tau) {
  const K = Pi.length;
  let prod = 1;
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    prod *= Pi[i] / x[i] ** (tau + 1);
    sum += Pi[i] / x[i] ** tau;
  }
  return math.gamma(K) * tau ** (K - 1) * sum ** -K * prod;
}

const pi3 = 1 - params[0] - params[1];
const Pi = [params[0], params[1], pi3];
const tau = params[2];

const resolution = 80;
const grid = [];
if (pi3 > 0) {
  for (let i = 1; i < resolution; i++) {
    for (let j = 1; j < resolution - i; j++) {
      const x1 = i / resolution;
      const x2 = j / resolution;
      const x3 = 1 - x1 - x2;
      grid.push({x1, x2, pdf: gumbelSoftmaxPdf([x1, x2, x3], Pi, tau)});
    }
  }
}
const maxpdf = grid.length ? d3.max(grid, (d) => d.pdf) : 1;
```

```js
pi3 > 0
  ? Plot.plot({
      width: Math.min(500, width),
      height: Math.min(500, width),
      x: {label: "x₁", domain: [0, 1]},
      y: {label: "x₂", domain: [0, 1]},
      color: {
        range: ["white", mvcolors[0]], interpolate: "hsl",
        legend: true, type: "sequential", label: "pdf", domain: [0, maxpdf]
      },
      marks: [
        Plot.contour(grid, {x: "x1", y: "x2", fill: "pdf", stroke: "currentColor", blur: 2})
      ]
    })
  : html`<p>Probabilities outside the unit simplex (π₁ + π₂ must be ≤ 1).</p>`
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(\boldsymbol{x}) &= \Gamma(K)\,\tau^{K-1}\Big(\sum_{k=1}^K \frac{\pi_k}{x_k^\tau}\Big)^{-K}\prod_{k=1}^K \frac{\pi_k}{x_k^{\tau+1}} \\[0.4em]
\mathbb{E}(\boldsymbol{x}) &= \text{no closed form} \\[0.4em]
\lim_{\tau\to 0}\boldsymbol{x} &= \text{one-hot categorical}(\boldsymbol{\pi})
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  | 1 | 2 | 3 |
|---|---|---|---|
| ${tex`\pi`} | ${Pi[0].toPrecision(3)} | ${Pi[1].toPrecision(3)} | ${Pi[2].toPrecision(3)} |
| ${tex`\tau`} | ${tau.toPrecision(3)} |  |  |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/gumbel-softmax-distribution")}

</div>

</div>
