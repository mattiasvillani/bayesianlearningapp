---
title: Beta-Binomial
toc: false
---

# Beta-Binomial distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([1, 200], {value: 10, step: 1, label: "n"}),
  Inputs.range([Number.EPSILON, 50], {value: 2, step: 0.1, label: "α"}),
  Inputs.range([Number.EPSILON, 50], {value: 2, step: 0.1, label: "β"})
]));
```

```js
const quantile = view(Inputs.range([1, params[0]], {value: 3, step: 1, label: "quantile"}));
```

```js
function betabinomPDF(x, n, alpha, beta) {
  return jStat.combination(n, x) * jStat.betafn(x + alpha, n - x + beta) / jStat.betafn(alpha, beta);
}

const n = params[0], alpha = params[1], beta = params[2];
const pdfdata = d3.range(0, n + 1, 1).map((x) => ({x, pdf: betabinomPDF(x, n, alpha, beta)}));
const mean = n * alpha / (alpha + beta);
const variance = n * alpha * beta * (alpha + beta + n) / ((alpha + beta) ** 2 * (alpha + beta + 1));
const cdf = d3.sum(pdfdata.filter((d) => d.x <= quantile).map((d) => d.pdf));
```

```js
Plot.plot({
  x: {label: "x", axis: true, domain: d3.range(0, n + 1, 1)},
  y: {label: "f(x)", axis: true},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(pdfdata, {
      x: "x", y: "pdf", fill: mvcolors[0], fillOpacity: 0.3, strokeWidth: 0,
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    }),
    Plot.barY(pdfdata, {
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
P(x) &= \binom{n}{x}\frac{\Beta(x+\alpha, n-x+\beta)}{\Beta(\alpha,\beta)}, \ x = 0,1,\ldots,n \\[0.4em]
\mathbb{E}(X) &= n\frac{\alpha}{\alpha+\beta} \\[0.4em]
\mathbb{V}(X) &= \frac{n\alpha\beta(\alpha+\beta+n)}{(\alpha+\beta)^2(\alpha+\beta+1)}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile})`} | ${cdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/beta-binomial-distribution" target="_blank" rel="noopener noreferrer">
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
