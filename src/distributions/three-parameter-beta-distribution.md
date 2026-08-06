---
title: Beta (three-parameter)
toc: false
---

# Beta distribution (generalized three-parameter)

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.1, 20], {value: 3, step: 0.1, label: "α"}),
  Inputs.range([0.1, 20], {value: 3, step: 0.1, label: "β"}),
  Inputs.range([-0.55, 10], {value: 1, step: 0.1, label: "γ"}),
  Inputs.range([0, 10], {value: 0.2, step: 0.01, label: "Quantile:"})
]));
```

```js
function beta3pdf(x, alpha, beta, gamma) {
  return (Math.abs(gamma) * x ** (alpha * gamma - 1) * (1 - x ** gamma) ** (beta - 1)) / jStat.betafn(alpha, beta);
}
function beta3cdf(quantile, alpha, beta, gamma) {
  if (gamma > 0) {
    return jStat.beta.cdf(quantile ** gamma, alpha, beta);
  } else {
    return 1 - jStat.beta.cdf((1 / quantile) ** Math.abs(gamma), alpha, beta);
  }
}

const [alpha, beta, gamma, quantile] = params;

const xgrid = gamma > 0 ? d3.range(0.001, 1.001, 0.001) : d3.range(1.001, 10, 0.001);
const betapdf = xgrid.map((x) => ({x, pdf: beta3pdf(x, alpha, beta, gamma)}));
const betacdf = beta3cdf(quantile, alpha, beta, gamma);

const mean = jStat.betafn(alpha + 1 / gamma, beta) / jStat.betafn(alpha, beta);
const variance = jStat.betafn(alpha + 2 / gamma, beta) / jStat.betafn(alpha, beta) - mean ** 2;
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(betapdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(betapdf, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{\vert\gamma\vert}{\Beta(\alpha,\beta)} x^{\alpha\gamma-1}(1-x^\gamma)^{\beta-1} \\[0.4em]
\mathbb{E}(X) &= \frac{\Beta(\alpha+1/\gamma,\beta)}{\Beta(\alpha,\beta)} \\[0.4em]
\mathbb{V}(X) &= \frac{\Beta(\alpha+2/\gamma,\beta)}{\Beta(\alpha,\beta)} - \mathbb{E}(X)^2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${betacdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/three-parameter-beta-distribution" target="_blank" rel="noopener noreferrer">
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
