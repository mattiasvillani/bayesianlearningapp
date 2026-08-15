---
title: Non-central Chi-squared
toc: false
---

# Non-central Chi2-distribution

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
// Poisson(λ/2)-mixture of central chi-squared(k+2i) — exact, and (unlike a modified
// Bessel function I_{k/2-1}) works for the non-integer k this slider allows.
function ncTerms(k, lambda) {
  const halfLambda = lambda / 2;
  const terms = [];
  for (let i = 0; i < 300; i++) {
    const w = Math.exp(-halfLambda + i * Math.log(halfLambda) - jStat.gammaln(i + 1));
    terms.push({weight: w, df: k + 2 * i});
    if (i > 10 && w < 1e-14) break;
  }
  return terms;
}
function ncpdf(x, terms) {
  return terms.reduce((s, {weight, df}) => s + weight * jStat.chisquare.pdf(x, df), 0);
}
function nccdf(x, terms) {
  return terms.reduce((s, {weight, df}) => s + weight * jStat.chisquare.cdf(x, df), 0);
}

const [k, lambda] = params;
const terms = ncTerms(k, lambda);
const binsize = 0.005;
const xDomainDynamic = [Number.EPSILON, k + lambda + 4 * Math.sqrt(2 * (k + 2 * lambda))];
const pdfdata = d3.range(xDomainDynamic[0], xDomainDynamic[1], binsize)
  .map((x) => ({x, pdf: ncpdf(x, terms)}));
const mean = k + lambda;
const sd = Math.sqrt(2 * (k + 2 * lambda));
const cdf = nccdf(params[2], terms);
```

```js
const frozenStateX = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([1, 20], {value: 2, step: 0.1, label: "k"}),
  Inputs.range([1, 20], {value: 1, step: 0.1, label: "λ"}),
  Inputs.range([Number.EPSILON, 20], {value: 2, step: 0.01, label: "Quantile:"})
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
  x: {label: "x", axis: true, domain: xDomain},
  y: {label: "f(x)"},
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
f(x) &= \frac{1}{2}e^{-(x+\lambda)/2}\left(\frac{x}{\lambda}\right)^{k/4-1/2} I_{k/2-1}\!\left(\sqrt{\lambda x}\right) \\[0.4em]
\mathbb{E}(X) &= k+\lambda \\[0.4em]
\mathbb{V}(X) &= 2(k+2\lambda)
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${sd.toPrecision(3)} |
| ${tex`P(X \le ${params[2].toFixed(2)})`} | ${cdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/non-central-chi2-distribution")}

</div>

</div>
