---
title: Law of Large Numbers
toc: false
---

# Law of Large Numbers

_If ${tex`X_1,X_2,\ldots,X_n`} are independent observations from a population with expected value ${tex`\mu`}, the sample mean ${tex`\bar X_n`} stabilizes around ${tex`\mu`} as ${tex`n`} grows._

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
const frozenState = createFreezeState();
```

<div class="dist-layout">

<div class="dist-main" style="grid-column: 1 / -1;">

<div style="display: flex; gap: 1rem;">

<div class="card" style="flex: 1;">

**Law of Large Numbers**<br>
If ${tex`X_1,X_2,\ldots,X_n`} are independent, identically distributed random variables from a distribution with expected value ${tex`\mu`} and finite variance, then

${tex.block`\bar X_n \overset{P}{\rightarrow} \mu \quad \text{as } n \rightarrow \infty`}

i.e. ${tex`\bar X_n`} *converges in probability* to ${tex`\mu`} as ${tex`n`} grows large.

</div>

<div class="card" style="flex: 1;">

**Convergence in Probability**<br>
${tex`\bar X_n \overset{P}{\rightarrow} \mu`} means that for every ${tex`\epsilon > 0`},

${tex.block`\lim_{n\rightarrow \infty} P(\vert \bar X_n -\mu \vert >\epsilon) = 0`}

i.e. the probability that ${tex`\bar X_n`} deviates from ${tex`\mu`} by more than ${tex`\epsilon`} vanishes as ${tex`n`} grows, however small ${tex`\epsilon`} is.

</div>

</div>

<div class="card">

<b>Settings</b>
${userinputsInput}

```js
const userinputsInput = Inputs.form([
  Inputs.range([1, 1000], {value: 1, step: 1, label: tex`n`}),
  Inputs.range([0.001, 0.25], {value: 0.1, step: 0.001, label: tex`\epsilon`}),
  Inputs.range([1, 5], {value: 3, step: 0.001, label: tex`\mu`}),
  Inputs.range([0.1, 5], {value: 0.1, step: 0.1, label: tex`\sigma`})
]);
const userinputs = view(userinputsInput);
```

```js
const [n, eps, mu, sigma] = userinputs;
const se = sigma / Math.sqrt(n);
```

```js
const resolution = 1000;
const step = (6 * sigma) / resolution;
const xGrid = d3.range(mu - 3 * sigma, mu + 3 * sigma, step);
const datapdf = xGrid.map((x) => ({x, pdf: jStat.normal.pdf(x, mu, se)}));
```

```js
const freezeInput = Inputs.toggle({label: "Freeze x-axis", value: true});
const freezeAxis = view(freezeInput);
```

```js
const xDomain = resolveDomain(frozenState, freezeAxis, [mu - 3 * sigma, mu + 3 * sigma]);
```

```js
const probOutside = jStat.normal.cdf(mu - eps, mu, se) + (1 - jStat.normal.cdf(mu + eps, mu, se));
```

${tex.block`P(\vert \bar X_n -\mu \vert >${eps}) = ${probOutside.toPrecision(4)}`}

```js
Plot.plot({
  width: Math.min(900, width),
  height: 360,
  caption: html`<span style="color: ${mvcolors[0]};">Sampling distribution for the sample mean ${tex`\bar X_n`}</span><br>
  <span style="color: ${mvcolors[1]};">Probability that the sample mean deviates more than ${tex`\epsilon`} from ${tex`\mu`}</span>`,
  x: {label: "sample mean, x̄", domain: xDomain},
  y: {axis: false},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([mu]),
    Plot.line(datapdf, {x: "x", y: "pdf", stroke: mvcolors[0], strokeWidth: 2}),
    Plot.areaY(datapdf, {filter: (d) => d.x >= mu + eps, x: "x", y: "pdf", fill: mvcolors[1], fillOpacity: 0.35}),
    Plot.areaY(datapdf, {filter: (d) => d.x <= mu - eps, x: "x", y: "pdf", fill: mvcolors[1], fillOpacity: 0.35}),
    Plot.arrow([{x1: mu * 1.002, y1: 0, x2: mu + eps, y2: 0}], {x1: "x1", y1: "y1", x2: "x2", y2: "y2", stroke: mvcolors[2], strokeWidth: 2}),
    Plot.text([{x: mu + eps / 2, y: 0, label: "ϵ"}], {x: "x", y: "y", text: "label", fill: mvcolors[2], dy: -8}),
    Plot.arrow([{x1: mu * 0.998, y1: 0, x2: mu - eps, y2: 0}], {x1: "x1", y1: "y1", x2: "x2", y2: "y2", stroke: mvcolors[2], strokeWidth: 2}),
    Plot.text([{x: mu - eps / 2, y: 0, label: "-ϵ"}], {x: "x", y: "y", text: "label", fill: mvcolors[2], dy: -8})
  ]
})
```

<div style="margin-top: -0.75rem; font-size: 13px;">${freezeInput}</div>

</div>

</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/law-large-numbers")}
