---
title: Weibull
toc: false
---

# Weibull distribution

```js
import jStat from "npm:jstat";
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.01, 10], {value: 1, step: 0.1, label: "λ"}),
  Inputs.range([0.01, 10], {value: 1, step: 0.1, label: "k"}),
  Inputs.range([0, 10], {value: 1, step: 0.1, label: "Quantile:"})
]));
```

```js
const [lambda, k] = params;
const mean = lambda * math.gamma(1 + 1 / k);
const variance = lambda ** 2 * (math.gamma(1 + 2 / k) - math.gamma(1 + 1 / k) ** 2);

const pdf = d3.range(0.01, 10, 0.01).map((x) => ({x, pdf: jStat.weibull.pdf(x, lambda, k)}));
const cdf = jStat.weibull.cdf(params[2], lambda, k);
```

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(pdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdf, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{k}{\lambda}\left(\frac{x}{\lambda}\right)^{k-1} e^{-(x/\lambda)^k} \\[0.4em]
\mathbb{E}(X) &= \lambda\,\Gamma\!\left(1+\frac{1}{k}\right) \\[0.4em]
\mathbb{V}(X) &= \lambda^2\left(\Gamma\!\left(1+\frac{2}{k}\right)-\Gamma\!\left(1+\frac{1}{k}\right)^2\right)
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${params[2].toFixed(2)})`} | ${cdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/weibull-distribution" target="_blank" rel="noopener noreferrer">
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
