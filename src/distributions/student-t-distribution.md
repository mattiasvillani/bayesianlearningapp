---
title: Student-t
toc: false
---

# Student-*t* distribution (three-parameter)

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "location μ"}),
  Inputs.range([0.1, 5], {value: 1, step: 0.1, label: "scale τ"}),
  Inputs.range([1, 50], {value: 4, step: 1, label: "degrees of freedom ν"}),
  Inputs.range([-10, 10], {value: -1.96, step: 0.01, label: "quantile"})
]));
```

```js
const shownormal = view(Inputs.toggle({value: false, label: "show normal"}));
```

```js
const [mu, tau, nu, quantile] = params;

const x = d3.range(mu - 8 * tau, mu + 8 * tau, 0.01);
const studentdata = x.map((x) => ({x, pdf: jStat.studentt.pdf((x - mu) / tau, nu) / tau}));
const normaldata = x.map((x) => ({x, pdf: jStat.normal.pdf(x, mu, tau)}));
const studentcdf = jStat.studentt.cdf((quantile - mu) / tau, nu);
const normcdf = jStat.normal.cdf(quantile, mu, tau);

const mean = nu > 1 ? mu : NaN;
const variance = nu > 2 ? (nu / (nu - 2)) * tau ** 2 : NaN;
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {axis: false, domain: [0, 1.05 * jStat.normal.pdf(mu, mu, tau)]},
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
f(x) &= \frac{\Gamma(\frac{\nu+1}{2})}{\Gamma(\frac{\nu}{2})\sqrt{\pi\nu}\,\tau}\Big(1+\frac{1}{\nu}\big(\tfrac{x-\mu}{\tau}\big)^2\Big)^{-(\nu+1)/2} \\[0.4em]
\mathbb{E}(X) &= \mu, \,\, \nu>1 \\[0.4em]
\mathbb{V}(X) &= \frac{\nu}{\nu-2}\tau^2, \,\, \nu>2
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

${notebookLink("https://observablehq.com/@mattiasvillani/student-t-distribution")}

</div>

</div>
