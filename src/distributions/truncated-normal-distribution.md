---
title: Truncated Normal
toc: false
---

# Truncated Normal distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-5, 5], {value: 0, step: 0.1, label: "μ"}),
  Inputs.range([0.01, 20], {value: 1, step: 0.1, label: "σ"}),
  Inputs.range([-5, 5], {value: -2, step: 0.1, label: "a"}),
  Inputs.range([-5, 5], {value: 3, step: 0.1, label: "b"}),
  Inputs.range([-5, 5], {value: -1, step: 0.01, label: "quantile"})
]));
```

```js
const [mu, sigma, a, b, quantile] = params;

function truncnormalpdf(x, mu, sigma, a, b) {
  if (x < a || x > b) return 0;
  return jStat.normal.pdf(x, mu, sigma) / (jStat.normal.cdf(b, mu, sigma) - jStat.normal.cdf(a, mu, sigma));
}
function truncnormalcdf(x, mu, sigma, a, b) {
  return (jStat.normal.cdf(x, mu, sigma) - jStat.normal.cdf(a, mu, sigma)) / (jStat.normal.cdf(b, mu, sigma) - jStat.normal.cdf(a, mu, sigma));
}

const normfactor = jStat.normal.cdf(b, mu, sigma) - jStat.normal.cdf(a, mu, sigma);
const mean = mu + (truncnormalpdf(a, mu, sigma, a, b) - truncnormalpdf(b, mu, sigma, a, b)) / normfactor;
const variance = sigma ** 2 * (
  1 - (b * truncnormalpdf(b, mu, sigma, a, b) - a * truncnormalpdf(a, mu, sigma, a, b)) / normfactor
  - ((truncnormalpdf(a, mu, sigma, a, b) - truncnormalpdf(b, mu, sigma, a, b)) / normfactor) ** 2
);

const pdfdata = d3.range(-5, 5, 0.01).map((x) => ({x, pdf: truncnormalpdf(x, mu, sigma, a, b)}));
const cdfval = truncnormalcdf(quantile, mu, sigma, a, b);
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
f(x) &= \frac{\phi(x\mid\mu,\sigma^2)}{\Phi(b\mid\mu,\sigma^2)-\Phi(a\mid\mu,\sigma^2)}, \,\, a \le x \le b \\[0.4em]
\mathbb{E}(X) &= \mu + \frac{\phi(a\mid\mu,\sigma^2)-\phi(b\mid\mu,\sigma^2)}{\Phi(b\mid\mu,\sigma^2)-\Phi(a\mid\mu,\sigma^2)} \\[0.4em]
\mathbb{V}(X) &= \sigma^2\Big(1-\tfrac{b\phi(b)-a\phi(a)}{Z}-\big(\tfrac{\phi(a)-\phi(b)}{Z}\big)^2\Big),\,\, Z=\Phi(b)-\Phi(a)
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${cdfval.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/truncated-normal-distribution")}

</div>

</div>
