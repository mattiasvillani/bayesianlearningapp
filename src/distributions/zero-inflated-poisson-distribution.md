---
title: Zero-Inflated Poisson
toc: false
---

# Zero-inflated Poisson distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const pi = params[0], lambda = params[1], quantile = params[2];
const mean = (1 - pi) * lambda;
const variance = lambda * (1 - pi) * (1 + pi * lambda);
const zipoispdf = d3.range(0, lambda + 4 * Math.sqrt(lambda) + 1, 1)
  .map((x) => ({x, pdf: pi * (x === 0) + (1 - pi) * jStat.poisson.pdf(x, lambda)}));
const zipoiscdf = pi + (1 - pi) * jStat.poisson.cdf(quantile, lambda);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0, 1], {value: 0.5, step: 0.01, label: "π"}),
  Inputs.range([0.1, 10], {value: 2, step: 0.1, label: "λ"}),
  Inputs.range([0, 20], {value: 2, step: 1, label: "quantile"})
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
    Plot.barY(zipoispdf, {
      x: "x", y: "pdf", fill: mvcolors[0], fillOpacity: 0.3, strokeWidth: 0,
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    }),
    Plot.barY(zipoispdf, {
      filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0],
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
P(x) &= \begin{cases} \pi + (1-\pi)e^{-\lambda} & x = 0 \\ (1-\pi)\dfrac{\lambda^x e^{-\lambda}}{x!} & x = 1,2,\ldots \end{cases} \\[0.4em]
\mathbb{E}(X) &= \lambda(1-\pi) \\[0.4em]
\mathbb{V}(X) &= \lambda(1-\pi)(1+\pi\lambda)
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile})`} | ${zipoiscdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/zero-inflated-poisson-distribution")}

</div>

</div>
