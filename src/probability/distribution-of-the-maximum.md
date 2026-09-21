---
title: Tails and Distribution of the Maximum
toc: false
---

# Tails and distribution of the maximum

_The tails of a distribution control how far the maximum of a sample can reach: heavier-tailed distributions push ${tex`X_{\max}`} much further out as the sample size ${tex`n`} grows._

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
function laplacepdf(x, mu, b) {
  return (1 / (2 * b)) * Math.exp(-Math.abs((x - mu) / b));
}
function laplacecdf(x, mu, b) {
  return x <= mu ? 0.5 * Math.exp((x - mu) / b) : 1 - 0.5 * Math.exp(-(x - mu) / b);
}
```

```js
// digamma and trigamma via standard asymptotic-series approximations (jStat has no special function for these)
function digamma(x) {
  let r = 0;
  while (x < 6) { r -= 1 / x; x += 1; }
  const x2 = 1 / (x * x);
  return r + Math.log(x) - 1 / (2 * x) - x2 * (1 / 12 - x2 * (1 / 120 - x2 * (1 / 252 - x2 * (1 / 240 - x2 / 132))));
}
function trigamma(x) {
  let r = 0;
  while (x < 6) { r += 1 / (x * x); x += 1; }
  return r + 1 / x + 1 / (2 * x ** 2) + 1 / (6 * x ** 3) - 1 / (30 * x ** 5) + 1 / (42 * x ** 7) - 1 / (30 * x ** 9);
}
function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }
function zpdf(x, alpha, beta, mu, sigma) {
  const z = (x - mu) / sigma;
  const y = sigmoid(z);
  return (jStat.beta.pdf(y, alpha, beta) * y * (1 - y)) / sigma;
}
function zcdf(x, alpha, beta, mu, sigma) {
  return jStat.beta.cdf(sigmoid((x - mu) / sigma), alpha, beta);
}
```

```js
// Normal, Laplace and Z are scaled to unit variance; Student-t is left
// unscaled (variance ν/(ν-2)), so its tail weight alone drives the comparison.
const laplaceScale = 1 / Math.sqrt(2);
const zAlpha = 0.5;
const zBeta = 0.5;
const zScale = 1 / Math.sqrt(trigamma(zAlpha) + trigamma(zBeta));
```

```js
// pdf of the maximum of n iid draws from a distribution with pdf f and cdf F: g(x) = n f(x) F(x)^(n-1)
function pdfmaxNormal(x, n) {
  return n * jStat.normal.pdf(x, 0, 1) * jStat.normal.cdf(x, 0, 1) ** (n - 1);
}
function pdfmaxStudentt(x, n, df) {
  return n * jStat.studentt.pdf(x, df) * jStat.studentt.cdf(x, df) ** (n - 1);
}
function pdfmaxLaplace(x, n) {
  return n * laplacepdf(x, 0, laplaceScale) * laplacecdf(x, 0, laplaceScale) ** (n - 1);
}
function pdfmaxZ(x, n) {
  return n * zpdf(x, zAlpha, zBeta, 0, zScale) * zcdf(x, zAlpha, zBeta, 0, zScale) ** (n - 1);
}
```

<div class="dist-layout">

<div class="dist-main" style="grid-column: 1 / -1;">

<div style="display: flex; gap: 1rem;">

<div class="card" style="flex: 1;">

<b>Settings</b>
${settingsInput}

```js
const settingsInput = Inputs.form([
  Inputs.range([1, 50], {value: 10, step: 1, label: tex`\text{sample size, }n`}),
  Inputs.range([1, 100], {value: 10, step: 1, label: tex`\text{df student-}t,\ \nu`})
]);
const settings = view(settingsInput);
```

```js
const [n, df] = settings;
```

<b>Show distributions</b>
${showDistInput}
<div class="show-log-row">${showLogInput}</div>

```js
const showDistInput = Inputs.checkbox(["normal", "laplace", "student-t", "z"], {value: ["normal", "laplace", "student-t", "z"]});
const showDist = view(showDistInput);
```

```js
const showLogInput = Inputs.toggle({label: "show pdf of X in log scale", value: false});
const showLog = view(showLogInput);
```

</div>

<div class="card" style="flex: 1;">

**Distribution of the maximum**

The maximum

${tex.block`X_{\max} = \max(X_1,\ldots,X_n)`}

of a sample of size ${tex`n`} from ${tex`f(x)`} has density

${tex.block`g(x_{\max}) = n\,f(x_{\max})F(x_{\max})^{n-1}`}

Here we compare four unit-scale distributions — [Normal](../distributions/normal-gaussian-distribution), [Laplace](../distributions/laplace-distribution), [Student-*t*](../distributions/student-t-distribution) (unscaled, variance ${tex`\nu/(\nu-2)`}) and [Fisher *Z*](../distributions/z-distribution) (${tex`\alpha=\beta=1/2`}).

</div>

</div>

<div class="card">

```js
const xGrid = d3.range(-5, 5, 0.02);
const pdfData = ["normal", "laplace", "student-t", "z"].flatMap((dist) =>
  xGrid.map((x) => ({
    x,
    pdf: dist === "normal" ? jStat.normal.pdf(x, 0, 1)
      : dist === "laplace" ? laplacepdf(x, 0, laplaceScale)
      : dist === "student-t" ? jStat.studentt.pdf(x, df)
      : zpdf(x, zAlpha, zBeta, 0, zScale),
    dist
  }))
);
const pdfDataShown = pdfData.filter((d) => showDist.includes(d.dist) && (!showLog || d.pdf > 0));
```

```js
const xGridMax = d3.range(-2, 10, 0.02);
const pdfMaxData = ["normal", "laplace", "student-t", "z"].flatMap((dist) =>
  xGridMax.map((x) => ({
    x,
    maxpdf: dist === "normal" ? pdfmaxNormal(x, n)
      : dist === "laplace" ? pdfmaxLaplace(x, n)
      : dist === "student-t" ? pdfmaxStudentt(x, n, df)
      : pdfmaxZ(x, n),
    dist
  }))
);
const pdfMaxDataShown = pdfMaxData.filter((d) => showDist.includes(d.dist));
```

```js
const distNames = ["normal", "laplace", "student-t", "z"];
const distColorMap = new Map(distNames.map((dist, i) => [dist, mvcolors[i]]));
const shownDistNames = distNames.filter((dist) => showDist.includes(dist));
const distColor = {domain: shownDistNames, range: shownDistNames.map((dist) => distColorMap.get(dist))};
```

<div style="display: flex; gap: 1rem;">
  <div style="flex: 1;">
  ${Plot.plot({
    width: Math.min(440, width),
    height: 340,
    style: {fontSize: "13px"},
    title: showLog ? "log pdf of X" : "pdf of X",
    color: {legend: true, ...distColor},
    x: {label: "x"},
    y: showLog ? {axis: false, type: "log", domain: [1e-4, 1]} : {axis: false, domain: [0, 0.85]},
    marks: [
      Plot.ruleY(showLog ? [1e-4] : [0]),
      Plot.line(pdfDataShown, {x: "x", y: "pdf", stroke: "dist", strokeWidth: 2})
    ]
  })}
  </div>
  <div style="flex: 1;">
  ${Plot.plot({
    width: Math.min(440, width),
    height: 340,
    style: {fontSize: "13px"},
    title: "pdf of max(X₁,...,Xₙ)",
    color: {legend: true, ...distColor},
    x: {label: "xₘₐₓ"},
    y: {axis: false},
    marks: [
      Plot.ruleY([0]),
      Plot.line(pdfMaxDataShown, {x: "x", y: "maxpdf", stroke: "dist", strokeWidth: 2})
    ]
  })}
  </div>
</div>

</div>

</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/distribution-of-the-maximum")}

<style>

.show-log-row form.inputs-3a86ea > label {
  width: auto;
  white-space: nowrap;
}

</style>
