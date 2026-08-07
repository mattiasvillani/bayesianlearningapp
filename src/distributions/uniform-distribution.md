---
title: Uniform
toc: false
---

# Uniform distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const [a, b, quantile] = params;

const unifpdf = d3.range(-5.1, 5.1, 0.001).map((x) => ({x, pdf: jStat.uniform.pdf(x, a, b)}));
const unifcdf = jStat.uniform.cdf(quantile, a, b);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "a"}),
  Inputs.range([-5, 5], {value: 1, step: 0.1, label: "b"}),
  Inputs.range([-5, 5], {value: 1, step: 0.01, label: "Quantile:"})
]));
```

</div>

<div class="card">

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

${notebookLink("https://observablehq.com/@mattiasvillani/uniform-distribution")}

</div>

</div>
