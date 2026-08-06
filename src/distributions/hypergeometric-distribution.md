---
title: Hypergeometric
toc: false
---

# Hypergeometric distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

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

```js
const mean = n * K / N;
const variance = (n * K / N) * ((N - K) / N) * ((N - n) / (N - 1));
const xMin = Math.max(0, n + K - N);
const xMax = Math.max(xMin + 1, Math.ceil(mean + 5 * Math.sqrt(variance || 0)) + 1);
const hypergeopdf = d3.range(xMin, xMax, 1).map((x) => ({x, pdf: jStat.hypgeom.pdf(x, N, K, n)}));
const hypergeocdf = jStat.hypgeom.cdf(quantile, N, K, n);
```

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

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/hypergeometric-distribution" target="_blank" rel="noopener noreferrer">
<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="1.5" width="9" height="13" rx="1.2" stroke="currentColor" stroke-width="1.1"/>
  <line x1="4.2" y1="4.4" x2="8.8" y2="4.4" stroke="currentColor" stroke-width="0.9"/>
  <line x1="4.2" y1="6.6" x2="8.8" y2="6.6" stroke="currentColor" stroke-width="0.9"/>
  <line x1="4.2" y1="8.8" x2="7.2" y2="8.8" stroke="currentColor" stroke-width="0.9"/>
  <circle cx="12.3" cy="12.3" r="2.3" fill="#6C8EBF"/>
  <circle cx="10.4" cy="13.2" r="1.6" fill="#c0a34d"/>
  <circle cx="13.5" cy="13.6" r="1.4" fill="#007878"/>
</svg>
Original notebook ↗
</a>

</div>

</div>
