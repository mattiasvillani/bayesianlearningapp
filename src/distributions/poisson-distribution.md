---
title: Poisson
toc: false
---

# Poisson distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const poispdf = d3.range(0, params[0] + 4 * Math.sqrt(params[0]), 1)
  .map((x) => ({x, pdf: jStat.poisson.pdf(x, params[0])}));
const poiscdf = jStat.poisson.cdf(params[1], params[0]);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.1, 20], {value: 2, step: 0.1, label: "λ"}),
  Inputs.range([1, 40], {value: 1, step: 1, label: "quantile"})
]));
```

</div>

<div class="card">

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)", axis: true},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(poispdf, {
      x: "x", y: "pdf", fill: mvcolors[0], fillOpacity: 0.3, strokeWidth: 0,
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    }),
    Plot.barY(poispdf, {
      filter: (d) => d.x <= params[1], x: "x", y: "pdf", fill: mvcolors[0],
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    })
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
P(x) &= \frac{\lambda^x e^{-\lambda}}{x!}, \ x = 0,1,2,\ldots \\[0.4em]
\mathbb{E}(X) &= \lambda \\[0.4em]
\mathbb{V}(X) &= \lambda
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${params[0].toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(params[0]).toPrecision(3)} |
| ${tex`P(X \le ${params[1]})`} | ${poiscdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/poisson-distribution")}

</div>

</div>
