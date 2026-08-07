---
title: Inverse Gaussian
toc: false
---

# Inverse Gaussian (Wald) distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.1, 100], {value: 3, step: 0.1, label: "μ"}),
  Inputs.range([0.1, 5], {value: 1, step: 0.1, label: "λ"}),
  Inputs.range([0, 10], {value: 1, step: 0.01, label: "Quantile:"})
]));
```

```js
function inversegaussianpdf(x, mu, lambda) {
  return Math.sqrt(lambda / (2 * Math.PI * x ** 3)) * Math.exp(-(lambda * (x - mu) ** 2) / (2 * mu ** 2 * x));
}

function inversegaussiancdf(x, mu, lambda) {
  const z1 = Math.sqrt(lambda / x) * (x / mu - 1);
  const z2 = -Math.sqrt(lambda / x) * (x / mu + 1);
  return jStat.normal.cdf(z1, 0, 1) + Math.exp(2 * lambda / mu) * jStat.normal.cdf(z2, 0, 1);
}

const [mu, lambda] = params;
const pdfdata = d3.range(0.001, 10, 0.01).map((x) => ({x, pdf: inversegaussianpdf(x, mu, lambda)}));
const cdfdata = inversegaussiancdf(params[2], mu, lambda);
const mean = mu;
const variance = mu ** 3 / lambda;
const modeX = mu * (Math.sqrt(1 + (9 * mu ** 2) / (4 * lambda ** 2)) - (3 * mu) / (2 * lambda));
```

```js
Plot.plot({
  x: {label: "x", axis: true},
  y: {label: "f(x)", domain: [0, inversegaussianpdf(modeX, mu, lambda)]},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

</div>

<div class="dist-side">

<div class="card">

### Properties

```tex
\begin{aligned}
f(x) &= \sqrt{\frac{\lambda}{2\pi x^3}}\exp\left(-\frac{\lambda(x-\mu)^2}{2\mu^2 x}\right) \\[0.4em]
\mathbb{E}(X) &= \mu \\[0.4em]
\mathbb{V}(X) &= \frac{\mu^3}{\lambda}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${params[2].toFixed(2)})`} | ${cdfdata.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/inverse-gaussian-distribution")}

</div>

</div>
