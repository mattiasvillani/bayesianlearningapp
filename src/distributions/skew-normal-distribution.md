---
title: Skew-Normal
toc: false
---

# Skew-normal distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "location, ξ"}),
  Inputs.range([0.01, 10], {value: 1, step: 0.1, label: "scale, ω"}),
  Inputs.range([-10, 10], {value: 2, step: 0.01, label: "skew, α"}),
  Inputs.range([-5, 5], {value: 1, step: 0.01, label: "quantile"})
]));
```

```js
const [xi, omega, alpha, quantile] = params;
const delta = alpha / Math.sqrt(1 + alpha ** 2);

const mean = xi + omega * delta * Math.sqrt(2 / Math.PI);
const variance = omega ** 2 * (1 - (2 * delta ** 2) / Math.PI);
const skewness = ((4 - Math.PI) / 2) * ((delta * Math.sqrt(2 / Math.PI)) ** 3) / ((1 - (2 * delta ** 2) / Math.PI) ** 1.5);

function skewnormalpdf(x, xi, omega, alpha) {
  const z = (x - xi) / omega;
  return (2 / omega) * jStat.normal.pdf(z, 0, 1) * jStat.normal.cdf(alpha * z, 0, 1);
}

const gridsize = 0.01;
const pdfdata = d3.range(xi - 8 * omega, xi + 8 * omega, gridsize).map((x) => ({x, pdf: skewnormalpdf(x, xi, omega, alpha)}));
const cdfval = d3.sum(pdfdata.filter((d) => d.x <= quantile).map((d) => d.pdf)) * gridsize;
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "f(x)", axis: false},
  marks: [
    Plot.ruleY([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{2}{\omega}\phi\Big(\frac{x-\xi}{\omega}\Big)\Phi\Big(\alpha\big(\tfrac{x-\xi}{\omega}\big)\Big) \\[0.4em]
\mathbb{E}(X) &= \xi + \omega\delta\sqrt{2/\pi} \\[0.4em]
\mathbb{V}(X) &= \omega^2\big(1-2\delta^2/\pi\big) \\[0.4em]
\delta &= \alpha/\sqrt{1+\alpha^2}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`\text{Skewness}(X)`} | ${skewness.toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${cdfval.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/skew-normal-distribution" target="_blank" rel="noopener noreferrer">
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
