---
title: Zipf
toc: false
---

# Zipf distribution

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
function H(N, s) {
  let harmonicnumber = 0;
  for (let k = 1; k <= N; k++) harmonicnumber += 1 / (k ** s);
  return harmonicnumber;
}

const N = params[0], s = params[1];
const mean = H(N, s - 1) / H(N, s);
const variance = H(N, s - 2) / H(N, s) - mean ** 2;
const pdfdata = d3.range(1, N + 1, 1).map((x) => ({x, pdf: (1 / x ** s) / H(N, s)}));
const cdf = H(quantile, s) / H(N, s);
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card">

```js
const params = view(Inputs.form([
  Inputs.range([1, 50], {value: 10, step: 1, label: "N"}),
  Inputs.range([Number.EPSILON, 5], {value: 1, step: 0.1, label: "s"})
]));
```

```js
const quantile = view(Inputs.range([1, params[0]], {value: 2, step: 1, label: "quantile"}));
```

</div>

<div class="card">

```js
Plot.plot({
  x: {label: "k", axis: true},
  y: {label: "P(k)", axis: true},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(pdfdata, {
      x: "x", y: "pdf", fill: mvcolors[0], fillOpacity: 0.3, strokeWidth: 0,
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    }),
    Plot.barY(pdfdata, {
      filter: (d) => d.x <= quantile, x: "x", y: "pdf", fill: mvcolors[0],
      title: (d) => `P(X=${d.x}) = ${d.pdf.toPrecision(4)}`
    })
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
P(x) &= \frac{1}{x^s}\cdot\frac{1}{H_{N,s}}, \ x = 1,2,\ldots,N \\[0.4em]
\mathbb{E}(X) &= \frac{H_{N,s-1}}{H_{N,s}} \\[0.4em]
\mathbb{V}(X) &= \frac{H_{N,s-2}}{H_{N,s}} - \Big(\frac{H_{N,s-1}}{H_{N,s}}\Big)^2
\end{aligned}
```

</div>

<div class="card">

### Numerical properties

|  |  |
|---|---|
| ${tex`\mathbb{E}(X)`} | ${mean.toPrecision(3)} |
| ${tex`\mathbb{S}(X)`} | ${Math.sqrt(variance).toPrecision(3)} |
| ${tex`P(X \le ${quantile})`} | ${cdf.toPrecision(4)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/zipf-distribution")}

</div>

</div>
