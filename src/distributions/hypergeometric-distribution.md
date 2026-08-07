---
title: Hypergeometric
toc: false
---

# Hypergeometric distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const mean = n * K / N;
const variance = (n * K / N) * ((N - K) / N) * ((N - n) / (N - 1));
const xMin = Math.max(0, n + K - N);
const xMax = Math.max(xMin + 1, Math.ceil(mean + 5 * Math.sqrt(variance || 0)) + 1);
const hypergeopdf = d3.range(xMin, xMax, 1).map((x) => ({x, pdf: jStat.hypgeom.pdf(x, N, K, n)}));
const hypergeocdf = jStat.hypgeom.cdf(quantile, N, K, n);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const N = view(Inputs.range([1, 1000], {value: 500, step: 1, label: "N (population size)"}));
```

```js
const K = view(Inputs.range([0, N], {value: 50, step: 1, label: "K (no. success items)"}));
```

```js
const n = view(Inputs.range([0, N], {value: 100, step: 1, label: "n (sample size)"}));
```

```js
const quantile = view(Inputs.range([Math.max(0, n + K - N), Math.min(n, K)], {value: Math.min(n, K), step: 1, label: "quantile"}));
```

</div>

<div class="card">

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)", axis: true},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(hypergeopdf, {
      x: "x", y: "pdf", fill: mvcolors[0], fillOpacity: 0.3, strokeWidth: 0,
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    }),
    Plot.barY(hypergeopdf, {
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
P(x) &= \frac{\binom{K}{x}\binom{N-K}{n-x}}{\binom{N}{n}}, \ x = \max(0,n+K-N),\ldots,\min(n,K) \\[0.4em]
\mathbb{E}(X) &= n\frac{K}{N} \\[0.4em]
\mathbb{V}(X) &= n\frac{K}{N}\cdot\frac{N-K}{N}\cdot\frac{N-n}{N-1}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile})`} | ${hypergeocdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/hypergeometric-distribution")}

</div>

</div>
