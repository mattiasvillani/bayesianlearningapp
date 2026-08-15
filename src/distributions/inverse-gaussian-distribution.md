---
title: Inverse Gaussian
toc: false
---

# Inverse Gaussian (Wald) distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
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

function inversegaussianquantile(p, mu, lambda) {
  let lo = 1e-6;
  let hi = mu * 2 + 1;
  while (inversegaussiancdf(hi, mu, lambda) < p) hi *= 2;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (inversegaussiancdf(mid, mu, lambda) < p) lo = mid; else hi = mid;
  }
  return hi;
}

const [mu, lambda] = params;
const variance = mu ** 3 / lambda;
const xDomainDynamic = [0.001, inversegaussianquantile(0.99, mu, lambda)];
const pdfdata = d3.range(xDomainDynamic[0], xDomainDynamic[1], (xDomainDynamic[1] - xDomainDynamic[0]) / 1200).map((x) => ({x, pdf: inversegaussianpdf(x, mu, lambda)}));
const cdfdata = inversegaussiancdf(params[2], mu, lambda);
const mean = mu;
const modeX = mu * (Math.sqrt(1 + (9 * mu ** 2) / (4 * lambda ** 2)) - (3 * mu) / (2 * lambda));
const yDomainDynamic = [0, inversegaussianpdf(modeX, mu, lambda)];
```

```js
const frozenStateX = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.1, 100], {value: 3, step: 0.1, label: "μ"}),
  Inputs.range([0.1, 5], {value: 1, step: 0.1, label: "λ"}),
  Inputs.range([0, 10], {value: 1, step: 0.01, label: "Quantile:"})
]));
```

</div>

<div class="card" style="padding-top: 0.25rem;">

```js
const freezeInput = Inputs.toggle({label: "Freeze x-axis", value: true});
const freezeAxis = view(freezeInput);
```

```js
const xDomain = resolveDomain(frozenStateX, freezeAxis, xDomainDynamic);
const yDomain = yDomainDynamic;
```

```js
Plot.plot({
  x: {label: "x", axis: true, domain: xDomain, ticks: 12},
  y: {label: "f(x)", domain: yDomain},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= params[2], x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
  ]
})
```

<div style="margin-top: -0.75rem; font-size: 13px;">${freezeInput}</div>

</div>

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
