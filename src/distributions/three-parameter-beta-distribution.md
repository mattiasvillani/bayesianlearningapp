---
title: Beta (three-parameter)
toc: false
---

# Beta distribution (generalized three-parameter)

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.1, 20], {value: 3, step: 0.1, label: "α"}),
  Inputs.range([0.1, 20], {value: 3, step: 0.1, label: "β"}),
  Inputs.range([-0.55, 10], {value: 1, step: 0.1, label: "γ"}),
  Inputs.range([0, 10], {value: 0.2, step: 0.01, label: "Quantile:"})
]));
```

```js
function beta3pdf(x, alpha, beta, gamma) {
  return (Math.abs(gamma) * x ** (alpha * gamma - 1) * (1 - x ** gamma) ** (beta - 1)) / jStat.betafn(alpha, beta);
}
function beta3cdf(quantile, alpha, beta, gamma) {
  if (gamma > 0) {
    return jStat.beta.cdf(quantile ** gamma, alpha, beta);
  } else {
    return 1 - jStat.beta.cdf((1 / quantile) ** Math.abs(gamma), alpha, beta);
  }
}

const [alpha, beta, gamma, quantile] = params;

const xgrid = gamma > 0 ? d3.range(0.001, 1.001, 0.001) : d3.range(1.001, 10, 0.001);
const betapdf = xgrid.map((x) => ({x, pdf: beta3pdf(x, alpha, beta, gamma)}));
const betacdf = beta3cdf(quantile, alpha, beta, gamma);

const mean = jStat.betafn(alpha + 1 / gamma, beta) / jStat.betafn(alpha, beta);
const variance = jStat.betafn(alpha + 2 / gamma, beta) / jStat.betafn(alpha, beta) - mean ** 2;
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(betapdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(betapdf, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{\vert\gamma\vert}{\Beta(\alpha,\beta)} x^{\alpha\gamma-1}(1-x^\gamma)^{\beta-1} \\[0.4em]
\mathbb{E}(X) &= \frac{\Beta(\alpha+1/\gamma,\beta)}{\Beta(\alpha,\beta)} \\[0.4em]
\mathbb{V}(X) &= \frac{\Beta(\alpha+2/\gamma,\beta)}{\Beta(\alpha,\beta)} - \mathbb{E}(X)^2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${betacdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/three-parameter-beta-distribution")}

</div>

</div>
