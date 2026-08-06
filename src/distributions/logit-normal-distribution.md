---
title: Logit-normal
toc: false
---

# LogitNormal distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "μ"}),
  Inputs.range([0, 5], {value: 1, step: 0.01, label: "σ"}),
  Inputs.range([0, 1], {value: 0.5, step: 0.01, label: "Quantile:"})
]));
```

```js
function logit(x) {
  return Math.log(x / (1 - x));
}
function logistic(x) {
  return 1 / (1 + Math.exp(-x));
}

const [mu, sigma, quantile] = params;

const draws = d3.range(10000).map(() => logistic(jStat.normal.sample(mu, sigma)));
const mean = d3.mean(draws);
const variance = jStat.variance(draws);

const pdfdata = d3.range(0.001, 1, 0.001).map((x) => ({x, pdf: jStat.normal.pdf(logit(x), mu, sigma) / (x * (1 - x))}));
const cdf = jStat.normal.cdf(logit(quantile), mu, sigma);
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
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
f(x) &= \frac{1}{\sqrt{2\pi\sigma^2}}e^{-\frac{1}{2\sigma^2}(\mathrm{logit}(x)-\mu)^2}\frac{1}{x(1-x)} \\[0.4em]
\mathbb{E}(X) &= \text{no closed form} \\[0.4em]
\mathbb{V}(X) &= \text{no closed form}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${cdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/logit-normal-distribution" target="_blank" rel="noopener noreferrer">
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
