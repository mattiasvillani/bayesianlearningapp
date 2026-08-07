---
title: Inverse Gamma
toc: false
---

# Inverse Gamma distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.01, 10], {value: 3, step: 0.01, label: "shape α"}),
  Inputs.range([0.01, 300], {value: 1, step: 0.01, label: "scale β"}),
  Inputs.range([0, 10], {value: 1, step: 0.01, label: "Quantile:"})
]));
```

```js
const [alpha, beta] = params;

let extremes = [0.001, 20];
if (jStat.invgamma.cdf(extremes[1], alpha, beta) < 0.975) {
  extremes = [0.001, jStat.invgamma.inv(0.975, alpha, beta)];
}

const pdfvals = d3.range(extremes[0], extremes[1], (extremes[1] - extremes[0]) / 1000)
  .map((x) => ({x, pdf: jStat.invgamma.pdf(x, alpha, beta)}));
const cdf = jStat.invgamma.cdf(params[2], alpha, beta);
const mean = alpha > 1 ? beta / (alpha - 1) : Infinity;
const variance = alpha > 2 ? beta ** 2 / ((alpha - 1) ** 2 * (alpha - 2)) : Infinity;
```

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(pdfvals, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfvals, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{\beta^\alpha}{\Gamma(\alpha)} x^{-\alpha-1} e^{-\beta/x} \\[0.4em]
\mathbb{E}(X) &= \frac{\beta}{\alpha-1},\ \ \alpha>1 \\[0.4em]
\mathbb{V}(X) &= \frac{\beta^2}{(\alpha-1)^2(\alpha-2)},\ \ \alpha>2
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

${notebookLink("https://observablehq.com/@mattiasvillani/inverse-gamma-distribution")}

</div>

</div>
