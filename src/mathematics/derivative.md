---
title: The Derivative
toc: false
---

# The Derivative

_The average rate of change ${tex`\frac{\Delta y}{\Delta x}`} of the function ${tex`f(x)`} gets closer and closer to the derivative ${tex`f'(a)`} at some chosen x=a when ${tex`\Delta x`} goes to zero._

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card params-card">

<b>Parameters</b>
${funcnameInput}
${aInput}
${deltaxInput}
${showDeltasInput}

```js
const funcnameInput = Inputs.select(["linear", "exp", "log", "square", "cube", "sin"], {value: "exp", label: "Function"});
const funcname = view(funcnameInput);
```

```js
const maxdeltax = 1;
```

```js
const f = funcname === "linear" ? (xv) => xv
  : funcname === "exp" ? (xv) => Math.exp(xv)
  : funcname === "log" ? (xv) => Math.log(xv)
  : funcname === "square" ? (xv) => xv ** 2
  : funcname === "cube" ? (xv) => xv ** 3
  : (xv) => Math.sin(xv);

const derivative = funcname === "linear" ? () => 1
  : funcname === "exp" ? (xv) => Math.exp(xv)
  : funcname === "log" ? (xv) => 1 / xv
  : funcname === "square" ? (xv) => 2 * xv
  : funcname === "cube" ? (xv) => 3 * xv ** 2
  : (xv) => Math.cos(xv);

const xdomainBase = funcname === "log" ? [maxdeltax + 0.1, 5]
  : funcname === "linear" ? [-2, 5]
  : funcname === "exp" ? [-1, 1]
  : funcname === "cube" ? [-2, 2]
  : funcname === "sin" ? [-3, 3]
  : [-5, 5];

const xdomain = [xdomainBase[0] - maxdeltax, xdomainBase[1] + maxdeltax];
const xrange = xdomain[1] - xdomain[0];
```

```js
const aInput = Inputs.range([xdomain[0] + maxdeltax, xdomain[1] - maxdeltax], {value: 1.2, step: 0.1, label: "a"});
const a = view(aInput);
```

```js
const deltaxInput = Inputs.range([0.001, maxdeltax], {value: 0.5, step: 0.001, label: "Δx"});
const deltax = view(deltaxInput);
```

```js
const showDeltasInput = Inputs.toggle({label: "Show Δy/Δx", value: true});
const showDeltas = view(showDeltasInput);
```

</div>

<div class="card derivative-value-card">

<span class="deriv-line">**Derivative** at ${tex`x=a`}: ${tex`f'(a) =`} ${derivAtA}</span><br>
<span class="deriv-line">**Average rate of change**: ${tex`\dfrac{\Delta y}{\Delta x} = \dfrac{f(a+\Delta x) - f(a)}{\Delta x} =`} ${avgRateOfChange}</span>

```js
const derivAtA = derivative(a).toFixed(4);
const avgRateOfChange = ((f(a + deltax) - f(a)) / deltax).toFixed(4);
```

</div>

<div class="card plot-card">

```js
function secantline(z) {
  const slope = (f(a + deltax) - f(a)) / deltax;
  return f(a) + slope * (z - a);
}
const funcdataLinear = d3.range(xdomain[0], xdomain[1], 0.01).map((xv) => ({x: xv, y: secantline(xv)}));
const funcdataDense = d3.range(xdomain[0], xdomain[1], 0.01).map((xv) => ({
  x: xv,
  y: f(xv),
  yDerivMin: f(xv) - derivative(xv) * maxdeltax,
  yDerivMax: f(xv) + derivative(xv) * maxdeltax
}));
const relevantData = funcdataDense.filter((d) => d.x >= xdomain[0] + maxdeltax && d.x <= xdomain[1] - maxdeltax);
const ydomain = [
  Math.round(d3.min(relevantData, (d) => Math.min(d.y, d.yDerivMin))),
  Math.round(d3.max(relevantData, (d) => Math.max(d.y, d.yDerivMax)))
];
```

```js
Plot.plot({
  width: Math.min(900, width),
  height: 520,
  x: {label: "x", domain: xdomain},
  y: {label: "f(x)", domain: ydomain},
  marks: [
    Plot.ruleY([0]),
    Plot.ruleX([0]),
    Plot.line([{x: 0, y: secantline(a)}, {x: a, y: secantline(a)}], {x: "x", y: "y", stroke: "var(--theme-foreground-muted)", strokeDasharray: "4,4"}),
    Plot.text([{x: 0, y: secantline(a), label: "f(a)"}], {x: "x", y: "y", text: "label", dx: -20, dy: -6, fill: "var(--theme-foreground-muted)"}),
    Plot.text([{x: 0, y: f(a + deltax), label: "f(a+Δx)"}], {x: "x", y: "y", text: "label", dx: -20, dy: -6, fill: "var(--theme-foreground-muted)"}),
    Plot.line([{x: 0, y: f(a + deltax)}, {x: a + deltax, y: f(a + deltax)}], {x: "x", y: "y", stroke: "var(--theme-foreground-muted)", strokeDasharray: "4,4"}),
    Plot.text([{x: a + deltax, y: (f(a + deltax) + f(a)) / 2, label: "Δy"}], {filter: showDeltas, x: "x", y: "y", dx: 20, text: "label", fontSize: 16, fill: "var(--theme-foreground-muted)"}),
    Plot.line([{x: a, y: 0}, {x: a, y: secantline(a)}], {x: "x", y: "y", stroke: "var(--theme-foreground-muted)", strokeDasharray: "4,4"}),
    Plot.line([{x: a + deltax, y: 0}, {x: a + deltax, y: f(a + deltax)}], {x: "x", y: "y", stroke: "var(--theme-foreground-muted)", strokeDasharray: "4,4"}),
    Plot.text([{x: a, y: 0, label: "a"}], {x: "x", y: "y", text: "label", dy: 20, fill: "var(--theme-foreground-muted)"}),
    Plot.text([{x: a + deltax, y: 0, label: "a+Δx"}], {x: "x", y: "y", text: "label", dy: 20, fill: "var(--theme-foreground-muted)"}),
    Plot.text([{x: a + deltax / 2, y: 0.9 * secantline(a), label: "Δx"}], {filter: showDeltas, x: "x", y: "y", text: "label", fontSize: 16, fill: "var(--theme-foreground-muted)"}),
    Plot.areaY(funcdataLinear, {filter: (d) => showDeltas && d.x >= a && d.x <= (a + deltax), x: "x", y2: "y", y1: secantline(a), fill: mvcolors[2], opacity: 0.15}),
    Plot.lineY(funcdataDense, {x: "x", y: "y", stroke: mvcolors[0], strokeWidth: 2.5}),
    Plot.line([{x: a - 0.1 * xrange, y: secantline(a - 0.1 * xrange)}, {x: a + deltax + 0.1 * xrange, y: secantline(a + deltax + 0.1 * xrange)}], {x: "x", y: "y", stroke: mvcolors[2], strokeWidth: 2.5}),
    Plot.dot([{x: a, y: f(a)}, {x: a + deltax, y: f(a + deltax)}], {x: "x", y: "y", fill: mvcolors[0], r: 3})
  ]
})
```

</div>

</div>

<div class="dist-side">

<div class="card">

**Derivative of elementary functions**

${tex`\dfrac{\mathrm{d}}{\mathrm{d}x}a = 0`} for constant ${tex`a`}

${tex`\dfrac{\mathrm{d}}{\mathrm{d}x}(a + bx) = b`}

${tex`\dfrac{\mathrm{d}}{\mathrm{d}x}x^n = n x^{n-1}`}

${tex`\dfrac{\mathrm{d}}{\mathrm{d}x}e^x = e^x`}

${tex`\dfrac{\mathrm{d}}{\mathrm{d}x}\ln(x) = \dfrac{1}{x}`}

${tex`\dfrac{\mathrm{d}}{\mathrm{d}x}\dfrac{1}{x} = -\dfrac{1}{x^2}`}

${tex`\dfrac{\mathrm{d}}{\mathrm{d}x}\cos(x) = -\sin(x)`}

${tex`\dfrac{\mathrm{d}}{\mathrm{d}x}\sin(x) = \cos(x)`}

</div>

<div class="card">

**Derivative of a combination of differentiable functions ${tex`f(x)`} and ${tex`g(x)`}**

Constant rule: ${tex`\dfrac{\mathrm{d}}{\mathrm{d}x}\big( a f(x) \big) = a f'(x)`} for constant ${tex`a`}

Sum rule: ${tex`\dfrac{\mathrm{d}}{\mathrm{d}x}\big( f(x) + g(x) \big) = f'(x) + g'(x)`}

Product rule: ${tex`\dfrac{\mathrm{d}}{\mathrm{d}x}\big( f(x)g(x) \big) = f'(x)g(x) + f(x)g'(x)`}

Quotient rule: ${tex`\dfrac{\mathrm{d}}{\mathrm{d}x} \dfrac{f(x)}{g(x)} = \dfrac{f'(x)g(x)-f(x)g'(x)}{(g(x))^2}`}

Reciprocal rule: ${tex`\dfrac{\mathrm{d}}{\mathrm{d}x} \dfrac{1}{g(x)} = -\dfrac{g'(x)}{(g(x))^2}`}

Chain rule: ${tex`\dfrac{\mathrm{d}}{\mathrm{d}x} f(g(x)) = f'(g(x))\cdot g'(x)`}

</div>

</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/the-derivative")}

<style>

.dist-main form.inputs-3a86ea label {
  padding: 2px 0;
}

.dist-main form.inputs-3a86ea:not(.inputs-3a86ea-toggle) label {
  width: 124px;
}

.params-card > p > b {
  display: block;
  margin-bottom: 0.6rem;
}

.params-card {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.params-card > p {
  margin-bottom: 0;
}

.derivative-value-card {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.derivative-value-card .deriv-line {
  display: inline-block;
}

.dist-side .card p {
  line-height: 1.6;
  margin: 0;
}

.dist-side .card p + p {
  margin-top: 1.1rem;
}

.derivative-value-card br + .deriv-line {
  margin-top: 0.4rem;
}

.plot-card {
  padding-top: 0.5rem;
}

.plot-card .observablehq--block + .observablehq--block {
  margin-top: 0;
}

.plot-card figure {
  margin-top: 0;
}

</style>
