---
title: Central Limit Theorem
toc: false
---

# Central Limit Theorem

_The sample mean ${tex`\bar X_n`} is approximately normally distributed when ${tex`n`} is large enough for essentially any data distribution._

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

```js
function drawOne(distType, p) {
  switch (distType) {
    case "beta": return jStat.beta.sample(p[0], p[1]);
    case "bimodal": return Math.random() < p[4] ? jStat.normal.sample(p[0], p[2]) : jStat.normal.sample(p[1], p[3]);
    case "binomial": {
      let s = 0;
      for (let i = 0; i < p[0]; i++) if (Math.random() < p[1]) s++;
      return s;
    }
    case "cauchy": return p[0] + p[1] * jStat.studentt.sample(1);
    case "chi2": return jStat.chisquare.sample(p[0]);
    case "lognormal": return jStat.lognormal.sample(p[0], p[1]);
    case "poisson": return jStat.poisson.sample(p[0]);
    case "studentt": return p[0] + p[1] * jStat.studentt.sample(p[2]);
    case "uniform": return p[0] + Math.random() * (p[1] - p[0]);
  }
}
const discreteTypes = new Set(["poisson", "binomial"]);
```

```js
// The pdf (continuous types) or pmf (discrete types) of the selected
// distribution, evaluated at x — mirrors drawOne's cases above.
function pdfOrPmf(distType, p, x) {
  switch (distType) {
    case "beta": return jStat.beta.pdf(x, p[0], p[1]);
    case "bimodal": return p[4] * jStat.normal.pdf(x, p[0], p[2]) + (1 - p[4]) * jStat.normal.pdf(x, p[1], p[3]);
    case "binomial": return jStat.binomial.pdf(x, p[0], p[1]);
    case "cauchy": return jStat.studentt.pdf((x - p[0]) / p[1], 1) / p[1];
    case "chi2": return jStat.chisquare.pdf(x, p[0]);
    case "lognormal": return jStat.lognormal.pdf(x, p[0], p[1]);
    case "poisson": return jStat.poisson.pdf(x, p[0]);
    case "studentt": return jStat.studentt.pdf((x - p[0]) / p[1], p[2]) / p[1];
    case "uniform": return x >= p[0] && x <= p[1] ? 1 / (p[1] - p[0]) : 0;
  }
}
```

```js
// The true (or 99.8%-coverage) support of the continuous types, so the pdf
// plot's x-axis always shows the distribution's actual boundary — e.g. exact
// ticks at 0 and 1 for beta — rather than whatever a random sample happened
// to cover.
function pdfDomain(distType, p) {
  switch (distType) {
    case "beta": return [0, 1];
    // Padded beyond [a, b] so the pdf curve visibly drops to zero at the
    // edges instead of ending abruptly at the plot border.
    case "uniform": {
      const pad = 0.15 * (p[1] - p[0]);
      return [p[0] - pad, p[1] + pad];
    }
    case "chi2": return [0, jStat.chisquare.inv(0.999, p[0])];
    // Heavier-tailed types use a tighter window (not 99.8%) — otherwise
    // the extreme tail quantile stretches the axis until the peak is a sliver.
    case "lognormal": return [0, jStat.lognormal.inv(0.95, p[0], p[1])];
    case "studentt": return [p[0] + p[1] * jStat.studentt.inv(0.005, p[2]), p[0] + p[1] * jStat.studentt.inv(0.995, p[2])];
    case "cauchy": return [p[0] + p[1] * jStat.studentt.inv(0.05, 1), p[0] + p[1] * jStat.studentt.inv(0.95, 1)];
    case "bimodal": {
      const mus = [p[0], p[1]], sigmas = [p[2], p[3]];
      const spread = 4 * Math.max(...sigmas);
      return [Math.min(...mus) - spread, Math.max(...mus) + spread];
    }
  }
}
```

```js
// Repeatedly resamples (with replacement) n values from the pre-generated
// population and returns the mean of each replicate — much cheaper than
// redrawing from the distribution itself on every replicate.
function samplingMeans(population, n, nRep) {
  const N = population.length;
  const means = new Array(nRep);
  for (let r = 0; r < nRep; r++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += population[(Math.random() * N) | 0];
    means[r] = sum / n;
  }
  return means;
}
```

<div class="dist-layout">

<div class="dist-main" style="grid-column: 1 / -1;">

<div style="display: flex; gap: 1rem;">

<div class="card" style="flex: 1;">

**Central Limit Theorem**<br>
If ${tex`X_1,X_2,\ldots,X_n`} are independent, identically distributed observations from an arbitrary distribution with finite mean ${tex`\mu`} and variance ${tex`\sigma^2`}, then for large ${tex`n`}

${tex.block`\bar X_n \overset{\operatorname{approx}}{\sim} \operatorname{N}\Big(\mu,\frac{\sigma^2}{n}\Big)`}
</div>

<div class="card" style="flex: 1;">

<b>Settings</b>
${distTypeInput}
${paramsInput}
${sampleSizeInput}

```js
const distTypeInput = Inputs.select(["beta", "bimodal", "binomial", "cauchy", "chi2", "lognormal", "poisson", "studentt", "uniform"], {value: "uniform", label: "distribution"});
const distType = view(distTypeInput);
```

```js
const paramsInput = distType === "binomial" ? Inputs.form([
    Inputs.range([1, 30], {value: 10, step: 1, label: tex`\text{trials }n`}),
    Inputs.range([0.01, 0.99], {value: 0.3, step: 0.01, label: tex`\text{success prob }p`})
  ])
  : distType === "poisson" ? Inputs.form([
    Inputs.range([0, 10], {value: 1, step: 0.1, label: tex`\text{mean }\lambda`})
  ])
  : distType === "beta" ? Inputs.form([
    Inputs.range([0.1, 20], {value: 3, step: 0.1, label: tex`\text{shape }\alpha`}),
    Inputs.range([0.1, 20], {value: 5, step: 0.1, label: tex`\text{shape }\beta`})
  ])
  : distType === "cauchy" ? Inputs.form([
    Inputs.range([-5, 5], {value: 0, step: 0.1, label: tex`\text{location }m`}),
    Inputs.range([0.1, 5], {value: 1, step: 0.1, label: tex`\text{scale }\gamma`})
  ])
  : distType === "studentt" ? Inputs.form([
    Inputs.range([-5, 5], {value: 0, step: 0.1, label: tex`\text{location }\mu`}),
    Inputs.range([0.1, 5], {value: 1, step: 0.1, label: tex`\text{scale }\sigma`}),
    Inputs.range([1, 50], {value: 4, step: 1, label: tex`\text{df }\nu`})
  ])
  : distType === "chi2" ? Inputs.form([
    Inputs.range([1, 50], {value: 3, step: 1, label: tex`\text{df }\nu`})
  ])
  : distType === "lognormal" ? Inputs.form([
    Inputs.range([-5, 5], {value: 0, step: 0.1, label: tex`\text{location }\mu`}),
    Inputs.range([0.1, 5], {value: 1, step: 0.1, label: tex`\text{scale }\sigma`})
  ])
  : distType === "bimodal" ? Inputs.form([
    Inputs.range([-5, 5], {value: -2, step: 0.1, label: tex`\text{location }\mu_1`}),
    Inputs.range([-5, 5], {value: 2, step: 0.1, label: tex`\text{location }\mu_2`}),
    Inputs.range([0.1, 5], {value: 1, step: 0.1, label: tex`\text{scale }\sigma_1`}),
    Inputs.range([0.1, 5], {value: 1, step: 0.1, label: tex`\text{scale }\sigma_2`}),
    Inputs.range([0, 1], {value: 0.5, step: 0.01, label: tex`\text{weight }w_1`})
  ])
  : Inputs.form([
    Inputs.range([-5, 5], {value: 0, step: 0.1, label: tex`\text{lower }a`}),
    Inputs.range([-5, 5], {value: 1, step: 0.1, label: tex`\text{upper }b`})
  ]);
const params = view(paramsInput);
```

```js
const sampleSizeInput = Inputs.range([1, 300], {value: 2, step: 1, label: tex`\text{sample size }n`});
const sampleSize = view(sampleSizeInput);
```

</div>

</div>

<div class="card">

```js
const popSize = 10000;
const popData = d3.range(popSize).map(() => drawOne(distType, params));
```

```js
const nRep = 4000;
const sampleMeans = samplingMeans(popData, sampleSize, nRep).map((mean) => ({mean}));
```

```js
const dataCaption = html`<div style="color: ${mvcolors[0]}; font-size: 16px; margin-bottom: 0.75rem;">${discreteTypes.has(distType) ? "Probability mass function" : "Probability density function"} of the selected distribution.</div>`;
const meansCaption = html`<div style="color: ${mvcolors[2]}; font-size: 16px; margin-bottom: 0.75rem;">Distribution of the sample mean from samples with n=${sampleSize} observations.</div>`;
```

```js
const dataPlot = discreteTypes.has(distType)
  ? (() => {
      const maxK = distType === "binomial" ? params[0] : Math.max(10, Math.ceil(params[0] * 4 + 10));
      const pmfBars = d3.range(0, maxK + 1).map((k) => ({x: k, pdf: pdfOrPmf(distType, params, k)}));
      return Plot.plot({
        width: Math.min(440, width),
        marginBottom: 55,
        style: {fontSize: "15px"},
        x: {label: "x", labelAnchor: "center", labelOffset: 44, labelArrow: "none"},
        y: {axis: false},
        marks: [
          Plot.barY(pmfBars, {x: "x", y: "pdf", fill: mvcolors[0]}),
          Plot.ruleY([0])
        ]
      });
    })()
  : (() => {
      const [lo, hi] = pdfDomain(distType, params);
      // Inset the evaluation grid slightly so divergent densities right at a
      // boundary (e.g. beta with shape < 1) don't blow up to Infinity, while
      // the axis domain below still shows the true boundary (e.g. 0 and 1).
      const evalLo = lo + (hi - lo) * 1e-4;
      const evalHi = hi - (hi - lo) * 1e-4;
      const gridN = 400;
      const pdfCurve = d3.range(gridN).map((i) => {
        const x = evalLo + (evalHi - evalLo) * i / (gridN - 1);
        return {x, pdf: pdfOrPmf(distType, params, x)};
      });
      const maxPdf = d3.max(pdfCurve, (d) => d.pdf);
      return Plot.plot({
        width: Math.min(440, width),
        marginBottom: 55,
        style: {fontSize: "15px"},
        x: {label: "x", domain: [lo, hi], labelAnchor: "center", labelOffset: 44, labelArrow: "none"},
        y: {axis: false, domain: [0, 1.1 * maxPdf]},
        marks: [
          Plot.lineY(pdfCurve, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2.5}),
          Plot.ruleY([0])
        ]
      });
    })();
```

```js
const meansPlot = Plot.plot({
  width: Math.min(440, width),
  marginBottom: 55,
  style: {fontSize: "15px"},
  x: {label: "sample mean, x̄", labelAnchor: "center", labelOffset: 44, labelArrow: "none"},
  y: {axis: false},
  marks: [
    Plot.rectY(sampleMeans, Plot.binX({y: "count"}, {x: "mean", fill: mvcolors[2]})),
    Plot.ruleY([0])
  ]
});
```

```js
const cauchyWarning = distType === "cauchy"
  ? html`<p style="color: ${mvcolors[2]}; font-weight: bold; margin: 0 0 0.75rem;">The Cauchy distribution does not have a mean and the central limit theorem does not hold!</p>`
  : "";
```

${cauchyWarning}

<div style="display: flex; gap: 1rem;">
  <div style="flex: 1;">${dataCaption}${dataPlot}</div>
  <div style="flex: 1;">${meansCaption}${meansPlot}</div>
</div>

</div>

</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/central-limit-theorem")}
