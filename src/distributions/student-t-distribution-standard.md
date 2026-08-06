---
title: Student-t (standard)
toc: false
---

# Student-*t* distribution (standard)

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([1, 50], {value: 4, step: 1, label: "degrees of freedom ν"}),
  Inputs.range([-10, 10], {value: -1.96, step: 0.01, label: "quantile"})
]));
```

```js
const shownormal = view(Inputs.toggle({value: false, label: "show normal"}));
```

```js
const [nu, quantile] = params;

const x = d3.range(-10, 10, 0.01);
const studentdata = x.map((x) => ({x, pdf: jStat.studentt.pdf(x, nu)}));
const normaldata = x.map((x) => ({x, pdf: jStat.normal.pdf(x, 0, 1)}));
const studentcdf = jStat.studentt.cdf(quantile, nu);
const normcdf = jStat.normal.cdf(quantile, 0, 1);

const mean = nu > 1 ? 0 : NaN;
const variance = nu > 2 ? nu / (nu - 2) : NaN;
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {axis: false, domain: [0, 1.05 * jStat.normal.pdf(0, 0, 1)]},
  marks: [
    Plot.ruleY([0]),
    Plot.line(studentdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(studentdata, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2}),
    ...(shownormal ? [Plot.line(normaldata, {x: "x", y: "pdf", stroke: mvcolors[1], strokeWidth: 2})] : [])
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{\Gamma(\frac{\nu+1}{2})}{\Gamma(\frac{\nu}{2})\sqrt{\pi\nu}}\Big(1+\frac{x^2}{\nu}\Big)^{-(\nu+1)/2} \\[0.4em]
\mathbb{E}(X) &= 0, \,\, \nu>1 \\[0.4em]
\mathbb{V}(X) &= \frac{\nu}{\nu-2}, \,\, \nu>2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${Number.isNaN(mean) ? "—" : mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Number.isNaN(variance) ? "—" : Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${studentcdf.toPrecision(4)} |

</div>

<a class="notebook-link" href="https://observablehq.com/@mattiasvillani/student-t-distribution-standard" target="_blank" rel="noopener noreferrer">
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
