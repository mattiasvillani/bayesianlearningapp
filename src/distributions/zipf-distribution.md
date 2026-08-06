---
title: Zipf
toc: false
---

# Zipf distribution

```js
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([1, 50], {value: 10, step: 1, label: "N"}),
  Inputs.range([Number.EPSILON, 5], {value: 1, step: 0.1, label: "s"})
]));
```

```js
const quantile = view(Inputs.range([1, params[0]], {value: 2, step: 1, label: "quantile"}));
```

```js
function H(N, s) {
  let harmonicnumber = 0;
  for (let k = 1; k <= N; k++) harmonicnumber += 1 / (k ** s);
  return harmonicnumber;
}

const N = params[0], s = params[1];
const mean = H(N, s - 1) / H(N, s);
const variance = H(N, s - 2) / H(N, s) - mean ** 2;
const pdfdata = d3.range(1, N + 1, 1).map((x) => ({x, pdf: (1 / x ** s) / H(N, s)}));
const cdf = H(quantile, s) / H(N, s);
```

```js
Plot.plot({
  x: {label: "k", axis: true},
  y: {label: "P(k)", axis: true},
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
P(x) &= \frac{1}{x^s}\cdot\frac{1}{H_{N,s}}, \ x = 1,2,\ldots,N \\[0.4em]
\mathbb{E}(X) &= \frac{H_{N,s-1}}{H_{N,s}} \\[0.4em]
\mathbb{V}(X) &= \frac{H_{N,s-2}}{H_{N,s}} - \Big(\frac{H_{N,s-1}}{H_{N,s}}\Big)^2
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

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/zipf-distribution" target="_blank" rel="noopener noreferrer">
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
