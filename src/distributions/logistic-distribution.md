---
title: Logistic
toc: false
---

# Logistic distribution

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
const [mu, s, quantile] = params;

function pdf_func(x, mu, s) {
  return Math.exp(-(x - mu) / s) / ((s * (1 + Math.exp(-(x - mu) / s))) ** 2);
}
function cdf_func(x, mu, s) {
  return 1 / (1 + Math.exp(-(x - mu) / s));
}

const mean = mu;
const variance = (s ** 2 * Math.PI ** 2) / 3;

const xDomainDynamic = [mu - 10 * s, mu + 10 * s];
const pdfdata = d3.range(xDomainDynamic[0], xDomainDynamic[1], (xDomainDynamic[1] - xDomainDynamic[0]) / 1200).map((x) => ({x, pdf: pdf_func(x, mu, s)}));
const yDomainDynamic = [0, d3.max(pdfdata, (d) => d.pdf) * 1.05];
const cdfval = cdf_func(quantile, mu, s);
```

```js
const frozenStateX = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([-10, 10], {value: 0, step: 0.1, label: "μ"}),
  Inputs.range([0.1, 10], {value: 1, step: 0.1, label: "s"}),
  Inputs.range([-10, 10], {value: -1, step: 0.1, label: "quantile"})
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
  width: Math.min(720, width),
  x: {label: "x", axis: true, domain: xDomain},
  y: {label: "f(x)", axis: false, domain: yDomain},
  marks: [
    Plot.ruleY([0]),
    Plot.line(pdfdata, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(pdfdata, {filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0], opacity: 0.2})
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
f(x) &= \frac{e^{-(x-\mu)/s}}{s\big(1+e^{-(x-\mu)/s}\big)^2} \\[0.4em]
\mathbb{E}(X) &= \mu \\[0.4em]
\mathbb{V}(X) &= \frac{s^2\pi^2}{3}
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

${notebookLink("https://observablehq.com/@mattiasvillani/logistic-distribution")}

</div>

</div>
