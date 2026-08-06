---
title: Inverse Gaussian
toc: false
---

# Inverse Gaussian (Wald) distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.1, 100], {value: 3, step: 0.1, label: "μ"}),
  Inputs.range([0.1, 5], {value: 1, step: 0.1, label: "λ"}),
  Inputs.range([0, 10], {value: 1, step: 0.01, label: "Quantile:"})
]));
```

```js
function inversegaussianpdf(x, mu, lambda) {
  return Math.sqrt(lambda / (2 * Math.PI * x ** 3)) * Math.exp(-(lambda * (x - mu) ** 2) / (2 * mu ** 2 * x));
}

function inversegaussiancdf(x, mu, lambda) {
  const z1 = Math.sqrt(lambda / x) * (x / mu - 1);
  const z2 = -Math.sqrt(lambda / x) * (x / mu + 1);
  return jStat.normal.cdf(z1, 0, 1) + Math.exp(2 * lambda / mu) * jStat.normal.cdf(z2, 0, 1);
}

const [mu, lambda] = params;
const pdfdata = d3.range(0.001, 10, 0.01).map((x) => ({x, pdf: inversegaussianpdf(x, mu, lambda)}));
const cdfdata = inversegaussiancdf(params[2], mu, lambda);
const mean = mu;
const variance = mu ** 3 / lambda;
const modeX = mu * (Math.sqrt(1 + (9 * mu ** 2) / (4 * lambda ** 2)) - (3 * mu) / (2 * lambda));
```

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)", domain: [0, inversegaussianpdf(modeX, mu, lambda)]},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \sqrt{\frac{\lambda}{2\pi x^3}}\exp\left(-\frac{\lambda(x-\mu)^2}{2\mu^2 x}\right) \\[0.4em]
\mathbb{E}(X) &= \mu \\[0.4em]
\mathbb{V}(X) &= \frac{\mu^3}{\lambda}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${params[2].toFixed(2)})`} | ${cdfdata.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/inverse-gaussian-distribution" target="_blank" rel="noopener noreferrer">
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
