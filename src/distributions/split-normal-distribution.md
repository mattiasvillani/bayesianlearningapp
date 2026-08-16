---
title: Split-Normal
toc: false
---

# Split-Normal distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
const [mu, sigma1, sigma2, quantile] = params;

function splitnpdf(x, mu, sigma1, sigma2) {
  const c = Math.sqrt(2 / Math.PI) / (sigma1 + sigma2);
  return x <= mu
    ? c * Math.exp(-(0.5 / sigma1 ** 2) * (x - mu) ** 2)
    : c * Math.exp(-(0.5 / sigma2 ** 2) * (x - mu) ** 2);
}
function splitncdf(x, mu, sigma1, sigma2) {
  const c = Math.sqrt(2 / Math.PI) / (sigma1 + sigma2);
  if (x <= mu) return c * Math.sqrt(2 * Math.PI) * sigma1 * jStat.normal.cdf((x - mu) / sigma1, 0, 1);
  return c * Math.sqrt(2 * Math.PI) * sigma1 * 0.5 + (c * Math.sqrt(2 * Math.PI) * sigma2 * jStat.normal.cdf((x - mu) / sigma2, 0, 1) - 0.5);
}

const mean = mu + Math.sqrt(2 / Math.PI) * (sigma2 - sigma1);
const variance = (1 - 2 / Math.PI) * (sigma2 - sigma1) ** 2 + sigma1 * sigma2;
const skewness = Math.sqrt(2 / Math.PI) * (sigma2 - sigma1) * ((4 / Math.PI - 1) * (sigma2 - sigma1) ** 2 + sigma1 * sigma2);

const xDomainDynamic = [mu - 8 * sigma1, mu + 8 * sigma2];
const pdfdata = d3.range(xDomainDynamic[0], xDomainDynamic[1], 0.01).map((x) => ({x, pdf: splitnpdf(x, mu, sigma1, sigma2)}));
const cdfval = splitncdf(quantile, mu, sigma1, sigma2);
```

```js
const frozenStateX = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-10, 10], {value: 0, step: 0.1, label: "location, μ"}),
  Inputs.range([0.01, 10], {value: 1, step: 0.1, label: "left scale, σ₁"}),
  Inputs.range([0.01, 10], {value: 1.5, step: 0.01, label: "right scale, σ₂"}),
  Inputs.range([-10, 10], {value: -1, step: 0.01, label: "quantile"})
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
```

```js
Plot.plot({
  width: Math.min(720, width),
  x: {label: "x", axis: true, domain: xDomain},
  y: {label: "f(x)", axis: false},
  marks: [
    Plot.ruleY([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[2], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[2], opacity: 0.2})
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
f(x) &= \begin{cases} c \cdot \kappa(x\mid\mu,\sigma_1) & x \leq \mu \\ c \cdot \kappa(x\mid\mu,\sigma_2) & x > \mu \end{cases} \\[0.4em]
c &= \sqrt{2/\pi}\,(\sigma_1+\sigma_2)^{-1} \\[0.4em]
\mathbb{E}(X) &= \mu + \sqrt{2/\pi}(\sigma_2-\sigma_1) \\[0.4em]
\mathbb{V}(X) &= (1-2/\pi)(\sigma_2-\sigma_1)^2 + \sigma_1\sigma_2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`\text{Skewness}(X)`} | ${skewness.toPrecision(3)} |
| ${tex`P(X \le ${quantile.toFixed(2)})`} | ${cdfval.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/split-normal-distribution")}

</div>

</div>
