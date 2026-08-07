---
title: Logit-normal
toc: false
---

# LogitNormal distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
function logit(x) {
  return Math.log(x / (1 - x));
}
function logistic(x) {
  return 1 / (1 + Math.exp(-x));
}

const [mu, sigma, quantile] = params;

const draws = d3.range(10000).map(() => logistic(jStat.normal.sample(mu, sigma)));
const mean = d3.mean(draws);
const variance = jStat.variance(draws);

const pdfdata = d3.range(0.001, 1, 0.001).map((x) => ({x, pdf: jStat.normal.pdf(logit(x), mu, sigma) / (x * (1 - x))}));
const cdf = jStat.normal.cdf(logit(quantile), mu, sigma);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "μ"}),
  Inputs.range([0, 5], {value: 1, step: 0.01, label: "σ"}),
  Inputs.range([0, 1], {value: 0.5, step: 0.01, label: "Quantile:"})
]));
```

</div>

<div class="card">

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
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
f(x) &= \frac{1}{\sqrt{2\pi\sigma^2}}e^{-\frac{1}{2\sigma^2}(\mathrm{logit}(x)-\mu)^2}\frac{1}{x(1-x)} \\[0.4em]
\mathbb{E}(X) &= \text{no closed form} \\[0.4em]
\mathbb{V}(X) &= \text{no closed form}
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

${notebookLink("https://observablehq.com/@mattiasvillani/logit-normal-distribution")}

</div>

</div>
