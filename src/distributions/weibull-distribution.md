---
title: Weibull
toc: false
---

# Weibull distribution

```js
import jStat from "npm:jstat";
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.01, 10], {value: 1, step: 0.1, label: "λ"}),
  Inputs.range([0.01, 10], {value: 1, step: 0.1, label: "k"}),
  Inputs.range([0, 10], {value: 1, step: 0.1, label: "Quantile:"})
]));
```

```js
const [lambda, k] = params;
const mean = lambda * math.gamma(1 + 1 / k);
const variance = lambda ** 2 * (math.gamma(1 + 2 / k) - math.gamma(1 + 1 / k) ** 2);

const pdf = d3.range(0.01, 10, 0.01).map((x) => ({x, pdf: jStat.weibull.pdf(x, lambda, k)}));
const cdf = jStat.weibull.cdf(params[2], lambda, k);
```

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(pdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdf, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{k}{\lambda}\left(\frac{x}{\lambda}\right)^{k-1} e^{-(x/\lambda)^k} \\[0.4em]
\mathbb{E}(X) &= \lambda\,\Gamma\!\left(1+\frac{1}{k}\right) \\[0.4em]
\mathbb{V}(X) &= \lambda^2\left(\Gamma\!\left(1+\frac{2}{k}\right)-\Gamma\!\left(1+\frac{1}{k}\right)^2\right)
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

${notebookLink("https://observablehq.com/@mattiasvillani/weibull-distribution")}

</div>

</div>
