---
title: LogNormal
toc: false
---

# LogNormal distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
const [mu, sigma] = params;
const mean = Math.exp(mu + 0.5 * sigma ** 2);
const variance = (Math.exp(sigma ** 2) - 1) * Math.exp(2 * mu + sigma ** 2);

const lognormalpdf = d3.range(0.01, 10, 0.01).map((x) => ({x, pdf: jStat.lognormal.pdf(x, mu, sigma)}));
const lognormalcdf = jStat.lognormal.cdf(params[2], mu, sigma);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-1, 1], {value: 0, step: 0.1, label: "μ"}),
  Inputs.range([0.1, 1], {value: 0.5, step: 0.01, label: "σ"}),
  Inputs.range([0, 10], {value: 1, step: 0.1, label: "Quantile:"})
]));
```

</div>

<div class="card">

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)"},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(lognormalpdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(lognormalpdf, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
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
f(x) &= \frac{1}{x\sigma\sqrt{2\pi}}\exp\left(-\frac{(\ln x-\mu)^2}{2\sigma^2}\right) \\[0.4em]
\mathbb{E}(X) &= e^{\mu+\sigma^2/2} \\[0.4em]
\mathbb{V}(X) &= (e^{\sigma^2}-1)e^{2\mu+\sigma^2}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${params[2].toFixed(2)})`} | ${lognormalcdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/lognormal-distribution")}

</div>

</div>
