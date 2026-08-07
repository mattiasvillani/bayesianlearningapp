---
title: Student-t (standard)
toc: false
---

# Student-*t* distribution (standard)

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
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

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

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

</div>

<div class="card">

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

${notebookLink("https://observablehq.com/@mattiasvillani/student-t-distribution-standard")}

</div>

</div>
