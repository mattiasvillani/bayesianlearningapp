---
title: Triangular
toc: false
---

# Triangular distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "lower, a"}),
  Inputs.range([-5, 5], {value: 1, step: 0.1, label: "upper, b"}),
  Inputs.range([-5, 5], {value: 0.5, step: 0.1, label: "mode, c"}),
  Inputs.range([-5, 5], {value: 1, step: 0.1, label: "Quantile:"})
]));
```

```js
const [a, b, c, quantile] = params;

const mean = (a + b + c) / 3;
const variance = (a ** 2 + b ** 2 + c ** 2 - a * b - a * c - b * c) / 18;

const pdf = d3.range(-5, 5, 0.01).map((x) => ({x, pdf: jStat.triangular.pdf(x, a, b, c)}));
const cdf = jStat.triangular.cdf(quantile, a, b, c);
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.line(pdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdf, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \begin{cases} \dfrac{2(x-a)}{(b-a)(c-a)} & a\le x< c \\[0.6em] \dfrac{2(b-x)}{(b-a)(b-c)} & c\le x\le b \end{cases} \\[0.4em]
\mathbb{E}(X) &= \frac{a+b+c}{3} \\[0.4em]
\mathbb{V}(X) &= \frac{a^2+b^2+c^2-ab-ac-bc}{18}
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

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/triangular-distribution" target="_blank" rel="noopener noreferrer">
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
