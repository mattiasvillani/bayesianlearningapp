---
title: Generalized Extreme Value
toc: false
---

# Generalized extreme value distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: -2, step: 0.1, label: "μ"}),
  Inputs.range([0.01, 5], {value: 0.5, step: 0.01, label: "σ"}),
  Inputs.range([-5, 5], {value: 0, step: 0.01, label: "ξ"}),
  Inputs.range([-5, 5], {value: -1, step: 0.01, label: "quantile"})
]));
```

```js
const EULER_MASCHERONI = 0.5772156649015329;
const [mu, sigma, xi, quantile] = params;

function tfun(x) {
  return xi !== 0 ? (1 + xi * ((x - mu) / sigma)) ** (-1 / xi) : Math.exp(-(x - mu) / sigma);
}
function pdfgev(x) {
  const t = tfun(x);
  return (1 / sigma) * t ** (xi + 1) * Math.exp(-t);
}
function cdfgev(x) {
  return Math.exp(-tfun(x));
}
const xmin = -5, xmax = 5;
function support() {
  if (xi === 0) return [xmin, xmax];
  return xi > 0 ? [mu - sigma / xi, xmax] : [xmin, mu - sigma / xi];
}

const mean = xi === 0 ? mu + sigma * EULER_MASCHERONI
  : (xi < 1 ? mu + sigma * (jStat.gammafn(1 - xi) - 1) / xi : Infinity);
const variance = xi === 0 ? ((Math.PI ** 2) / 6) * sigma ** 2
  : (xi < 0.5 ? (sigma ** 2) * (jStat.gammafn(1 - 2 * xi) - jStat.gammafn(1 - xi) ** 2) / (xi ** 2) : Infinity);

const suppRaw = support();
const supp = [Math.min(suppRaw[0], suppRaw[1]), Math.max(suppRaw[0], suppRaw[1])];
const pdfdata = d3.range(supp[0], supp[1], Math.max((supp[1] - supp[0]) / 1000, 1e-6)).map((x) => ({x, pdf: pdfgev(x)}));
const cdfval = cdfgev(quantile);
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true},
  y: {label: "f(x)", axis: false},
  marks: [
    Plot.ruleY([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \frac{1}{\sigma}t(x)^{\xi+1}e^{-t(x)} \\[0.4em]
t(x) &= \begin{cases} \big(1+\xi\frac{x-\mu}{\sigma}\big)^{-1/\xi} & \xi \neq 0 \\ \exp\big(-\frac{x-\mu}{\sigma}\big) & \xi = 0 \end{cases} \\[0.4em]
\mathbb{E}(X) &= \mu + \frac{\sigma(\Gamma(1-\xi)-1)}{\xi}, \,\, \xi<1,\xi\neq0 \\[0.4em]
\mathbb{V}(X) &= \sigma^2\frac{\Gamma(1-2\xi)-\Gamma(1-\xi)^2}{\xi^2}, \,\, \xi<\tfrac{1}{2}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${Number.isFinite(mean) ? mean.toPrecision(3) : "∞"} |
| ${tex`\mathbb{S}(X)`} | ${Number.isFinite(variance) ? Math.sqrt(variance).toPrecision(3) : "∞"} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${cdfval.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/generalized-extreme-value-distribution")}

</div>

</div>
