---
title: Compound-Gamma
toc: false
---

# Compound-Gamma distribution

```js
import * as math from "npm:mathjs";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
function pdfcompoundgamma(x, alpha, beta, kappa) {
  const normconst = (beta ** alpha / math.gamma(alpha)) * (math.gamma(alpha + kappa) / math.gamma(kappa));
  return normconst * (x ** (kappa - 1)) / ((beta + x) ** (alpha + kappa));
}

const coarseStep = 0.02;
let cum = 0;
let xUpper = 200;
for (let xv = coarseStep / 2; xv < 200; xv += coarseStep) {
  cum += pdfcompoundgamma(xv, params[0], params[1], params[2]) * coarseStep;
  if (cum >= 0.995) { xUpper = xv; break; }
}
const xDomainDynamic = [0, xUpper];

const stepsize = xUpper / 1500;
const pdfdata = d3.range(0, xUpper, stepsize)
  .map((x) => ({x, pdf: pdfcompoundgamma(x, params[0], params[1], params[2])}));
const yDomainDynamic = [0, d3.max(pdfdata, (d) => d.pdf) * 1.05];

const mean = params[2] * (params[1] / (params[0] - 1));
const variance = params[1] ** 2 * ((params[2] ** 2 + params[2] * (params[0] - 1)) / ((params[0] - 2) * (params[0] - 1) ** 2));
const cdf = d3.sum(pdfdata.filter((d) => d.x <= params[3]).map((d) => d.pdf * stepsize));
```

```js
const frozenStateX = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([0.01, 5], {value: 3, step: 0.01, label: "α"}),
  Inputs.range([0.01, 5], {value: 2, step: 0.01, label: "β"}),
  Inputs.range([0.01, 5], {value: 1, step: 0.01, label: "κ"}),
  Inputs.range([0, 15], {value: 2, step: 0.01, label: "Quantile:"})
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
  x: {label: "x", axis: true, domain: xDomain},
  y: {label: "f(x)", domain: yDomain},
  marks: [
    Plot.ruleY([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[2], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= params[3], x: "x", y: "pdf", fill: mvcolors[2], opacity: 0.2})
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
f(x) &= \frac{\beta^\alpha}{\Gamma(\alpha)}\, \frac{\Gamma(\alpha+\kappa)}{\Gamma(\kappa)}\, \frac{x^{\kappa-1}}{(\beta + x)^{\alpha+\kappa}} \\[0.4em]
\mathbb{E}(X) &= \kappa\frac{\beta}{\alpha-1} \\[0.4em]
\mathbb{V}(X) &= \beta^2\frac{\kappa^2+\kappa(\alpha-1)}{(\alpha-2)(\alpha-1)^2}
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${params[3].toFixed(2)})`} | ${cdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/compound-gamma-distribution")}

</div>

</div>
