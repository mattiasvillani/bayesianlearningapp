---
title: Chi-squared
toc: false
---

# Chi2-distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([1, 20], {value: 4, step: 1, label: "ν"}),
  Inputs.range([0.01, 10], {value: 2, step: 0.01, label: "Quantile:"})
]));
```

```js
const chisquarepdf = d3.range(0.01, params[0] + 5 * Math.sqrt(2 * params[0]), 0.01)
  .map((x) => ({x, pdf: jStat.chisquare.pdf(x, params[0])}));
const chisquarecdf = jStat.chisquare.cdf(params[1], params[0]);
```

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)", domain: [0, jStat.chisquare.pdf(Math.max(0, params[0] - 2), params[0])]},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(chisquarepdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(chisquarepdf, {filter: (d) => d.x <= params[1], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{1}{2^{\nu/2}\Gamma(\nu/2)}\; x^{\nu/2-1} e^{-x/2} \\[0.4em]
\mathbb{E}(X) &= \nu \\[0.4em]
\mathbb{V}(X) &= 2\nu
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${params[0].toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(2 * params[0]).toPrecision(3)} |
| ${tex`P(X \le ${params[1].toFixed(2)})`} | ${chisquarecdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/chi2-distribution" target="_blank" rel="noopener noreferrer">
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
