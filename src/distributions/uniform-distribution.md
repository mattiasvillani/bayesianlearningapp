---
title: Uniform
toc: false
---

# Uniform distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "a"}),
  Inputs.range([-5, 5], {value: 1, step: 0.1, label: "b"}),
  Inputs.range([-5, 5], {value: 1, step: 0.01, label: "Quantile:"})
]));
```

```js
const [a, b, quantile] = params;

const unifpdf = d3.range(-5.1, 5.1, 0.001).map((x) => ({x, pdf: jStat.uniform.pdf(x, a, b)}));
const unifcdf = jStat.uniform.cdf(quantile, a, b);
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true, domain: [-5.5, 5.5]},
  y: {label: "f(x)", axis: true, domain: [0, 1.1 / (b - a)]},
  marks: [
    Plot.ruleY([0]),
    Plot.line(unifpdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(unifpdf, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{1}{b-a} \text{ for } a\le x\le b \\[0.4em]
\mathbb{E}(X) &= \frac{a+b}{2} \\[0.4em]
\mathbb{V}(X) &= \frac{(b-a)^2}{12}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${((a + b) / 2).toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt((b - a) ** 2 / 12).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${unifcdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/uniform-distribution" target="_blank" rel="noopener noreferrer">
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
