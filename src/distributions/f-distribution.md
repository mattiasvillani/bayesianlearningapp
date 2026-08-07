---
title: F
toc: false
---

# F-distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const fpdf = d3.range(0.01, jStat.centralF.inv(0.99, params[0], params[1]), 0.01)
  .map((x) => ({x, pdf: jStat.centralF.pdf(x, params[0], params[1])}));
const fcdf = jStat.centralF.cdf(params[2], params[0], params[1]);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([1, 20], {value: 4, step: 1, label: "ν₁"}),
  Inputs.range([1, 20], {value: 4, step: 1, label: "ν₂"}),
  Inputs.range([0.01, 10], {value: 2, step: 0.01, label: "Quantile:"})
]));
```

</div>

<div class="card">

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(fpdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(fpdf, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{1}{\Beta(\nu_1/2,\nu_2/2)}\left(\frac{\nu_1}{\nu_2}\right)^{\nu_1/2} x^{\nu_1/2-1}\left(1+\frac{\nu_1}{\nu_2}x\right)^{-(\nu_1+\nu_2)/2} \\[0.4em]
\mathbb{E}(X) &= \frac{\nu_2}{\nu_2-2},\ \ \nu_2>2 \\[0.4em]
\mathbb{V}(X) &= \frac{2\nu_2^2(\nu_1+\nu_2-2)}{\nu_1(\nu_2-2)^2(\nu_2-4)},\ \ \nu_2>4
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${(params[1] / (params[1] - 2)).toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(2 * (params[1] / (params[1] - 2)) ** 2 * (params[0] + params[1] - 2) / (params[0] * (params[1] - 4))).toPrecision(3)} |
| ${tex`P(X \le ${params[2].toFixed(2)})`} | ${fcdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/f-distribution")}

</div>

</div>
