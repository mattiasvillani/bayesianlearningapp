---
title: Gumbel
toc: false
---

# Gumbel distribution

```js
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-1, 5], {value: 2, step: 0.1, label: "μ"}),
  Inputs.range([0.01, 5], {value: 1, step: 0.01, label: "β"}),
  Inputs.range([-10, 10], {value: 2, step: 0.01, label: "quantile"})
]));
```

```js
const EULER_MASCHERONI = 0.5772156649015329;
const [mu, beta, quantile] = params;

function pdfgumbel(x) {
  const z = (x - mu) / beta;
  return (1 / beta) * Math.exp(-(z + Math.exp(-z)));
}
function cdfgumbel(x) {
  return Math.exp(-Math.exp(-(x - mu) / beta));
}

const mean = mu + beta * EULER_MASCHERONI;
const variance = ((Math.PI ** 2) / 6) * beta ** 2;

const pdfdata = d3.range(mu - 4 * beta, mu + 8 * beta, 0.01).map((x) => ({x, pdf: pdfgumbel(x)}));
const cdfval = cdfgumbel(quantile);
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
f(x) &= \frac{1}{\beta}e^{-(z+e^{-z})}, \,\, z=\frac{x-\mu}{\beta} \\[0.4em]
\mathbb{E}(X) &= \mu + \beta\gamma \\[0.4em]
\mathbb{V}(X) &= \frac{\pi^2}{6}\beta^2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${cdfval.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/gumbel-distribution" target="_blank" rel="noopener noreferrer">
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
