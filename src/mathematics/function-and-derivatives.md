---
title: A Function and Its Derivatives
toc: false
---

# A Function and Its Derivatives

_This interactive visualization plots a function ${tex`f(x)`} together with its first ${tex`f'(x)`} and second ${tex`f''(x)`} derivatives._

```js
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div class="card params-card">

<b>Parameters</b>
${funcnameInput}
${plotFirstDerivInput}
${plotSecondDerivInput}
${showPlotTipInput}
${showGridlinesInput}

```js
const funcnameInput = Inputs.select(["linear", "exp", "log", "square", "cubic", "sqrt", "abs", "sin", "cos"], {value: "cubic", label: "Function f(x)"});
const funcname = view(funcnameInput);
```

```js
const plotFirstDerivInput = Inputs.toggle({label: tex`\text{plot } f'(x)`, value: false});
const plotFirstDeriv = view(plotFirstDerivInput);
```

```js
const plotSecondDerivInput = Inputs.toggle({label: tex`\text{plot } f''(x)`, value: false});
const plotSecondDeriv = view(plotSecondDerivInput);
```

```js
const showPlotTipInput = Inputs.toggle({label: "show plot tip", value: false});
const showPlotTip = view(showPlotTipInput);
```

```js
const showGridlinesInput = Inputs.toggle({label: "show gridlines", value: true});
const showGridlines = view(showGridlinesInput);
```

</div>

<div class="card plot-card">

```js
const f = funcname === "linear" ? (xv) => xv
  : funcname === "exp" ? (xv) => Math.exp(xv)
  : funcname === "log" ? (xv) => Math.log(xv)
  : funcname === "square" ? (xv) => xv ** 2
  : funcname === "cubic" ? (xv) => xv ** 3
  : funcname === "sqrt" ? (xv) => Math.sqrt(xv)
  : funcname === "abs" ? (xv) => Math.abs(xv)
  : funcname === "cos" ? (xv) => Math.cos(xv)
  : (xv) => Math.sin(xv);

const derivative = funcname === "linear" ? () => 1
  : funcname === "exp" ? (xv) => Math.exp(xv)
  : funcname === "log" ? (xv) => 1 / xv
  : funcname === "square" ? (xv) => 2 * xv
  : funcname === "cubic" ? (xv) => 3 * xv ** 2
  : funcname === "sqrt" ? (xv) => (1 / 2) * xv ** (-1 / 2)
  : funcname === "abs" ? (xv) => (xv > 0 ? 1 : xv < 0 ? -1 : NaN)
  : funcname === "cos" ? (xv) => -Math.sin(xv)
  : (xv) => Math.cos(xv);

const derivative2 = funcname === "linear" ? () => 0
  : funcname === "exp" ? (xv) => Math.exp(xv)
  : funcname === "log" ? (xv) => -1 / xv ** 2
  : funcname === "square" ? () => 2
  : funcname === "cubic" ? (xv) => 6 * xv
  : funcname === "sqrt" ? (xv) => (-1 / 4) * xv ** (-3 / 2)
  : funcname === "abs" ? (xv) => (xv === 0 ? NaN : 0)
  : funcname === "cos" ? (xv) => -Math.cos(xv)
  : (xv) => -Math.sin(xv);

const xdomain = funcname === "log" ? [0.1, 5]
  : funcname === "linear" ? [-2, 5]
  : funcname === "exp" ? [-1, 1]
  : funcname === "cubic" ? [-2, 2]
  : funcname === "sqrt" ? [0.01, 5]
  : funcname === "abs" ? [-5, 5]
  : funcname === "cos" ? [-2 * Math.PI, 2 * Math.PI]
  : funcname === "sin" ? [-2 * Math.PI, 2 * Math.PI]
  : [-5, 5];

const latexfunc = funcname === "linear" ? {expr: "f(x) = x", dprime: "f'(x) = 1", dbiss: "f''(x) = 0"}
  : funcname === "exp" ? {expr: "f(x) = \\exp(x)", dprime: "f'(x) = \\exp(x)", dbiss: "f''(x) = \\exp(x)"}
  : funcname === "log" ? {expr: "f(x) = \\log(x)", dprime: "f'(x) = \\frac{1}{x}", dbiss: "f''(x) = -\\frac{1}{x^2}"}
  : funcname === "square" ? {expr: "f(x) = x^2", dprime: "f'(x) = 2x", dbiss: "f''(x) = 2"}
  : funcname === "cubic" ? {expr: "f(x) = x^3", dprime: "f'(x) = 3x^2", dbiss: "f''(x) = 6x"}
  : funcname === "sqrt" ? {expr: "f(x) = \\sqrt{x}", dprime: "f'(x) = \\frac{1}{2}x^{-1/2}", dbiss: "f''(x) = -\\frac{1}{4}x^{-3/2}"}
  : funcname === "abs" ? {expr: "f(x) = \\vert x \\vert", dprime: "f'(x) = \\frac{x}{\\vert x \\vert} \\text{ for } x \\neq 0", dbiss: "f''(x) = 0 \\text{ for } x \\neq 0"}
  : funcname === "cos" ? {expr: "f(x) = \\cos(x)", dprime: "f'(x) = -\\sin(x)", dbiss: "f''(x) = -\\cos(x)"}
  : {expr: "f(x) = \\sin(x)", dprime: "f'(x) = \\cos(x)", dbiss: "f''(x) = -\\sin(x)"};

const titleParts = [latexfunc.expr];
if (plotFirstDeriv) titleParts.push(latexfunc.dprime);
if (plotSecondDeriv) titleParts.push(latexfunc.dbiss);
const titleStr = titleParts.join("\\qquad\\qquad ");
const plotTitle = tex(Object.assign([titleStr], {raw: [titleStr]}));

const ngrid = 500;
const funcdata = d3.range(xdomain[0], xdomain[1], (xdomain[1] - xdomain[0]) / ngrid).map((xv) => ({
  x: xv,
  f: f(xv),
  fprime: derivative(xv),
  fbiss: derivative2(xv)
}));

const plotDomain = ["f(x)", ...(plotFirstDeriv ? ["f'(x)"] : []), ...(plotSecondDeriv ? ["f''(x)"] : [])];
const plotRange = [mvcolors[0], ...(plotFirstDeriv ? [mvcolors[1]] : []), ...(plotSecondDeriv ? [mvcolors[2]] : [])];

const ydomain = !plotFirstDeriv && !plotSecondDeriv ? d3.extent(funcdata, (d) => d.f)
  : plotFirstDeriv && !plotSecondDeriv ? d3.extent(funcdata.flatMap((d) => [d.f, d.fprime]))
  : d3.extent(funcdata.flatMap((d) => [d.f, d.fprime, d.fbiss]));
```

```js
Plot.plot({
  width: Math.min(900, width),
  height: 480,
  title: plotTitle,
  color: {legend: true, domain: plotDomain, range: plotRange},
  x: {label: "x", domain: xdomain},
  y: {label: "f(x)", domain: ydomain},
  grid: showGridlines,
  marks: [
    Plot.ruleY([0]),
    Plot.lineY(funcdata, {filter: plotSecondDeriv, x: "x", y: "fbiss", stroke: mvcolors[2], strokeWidth: 2.5}),
    Plot.lineY(funcdata, {filter: plotFirstDeriv, x: "x", y: "fprime", stroke: mvcolors[1], strokeWidth: 2.5}),
    Plot.lineY(funcdata, {x: "x", y: "f", stroke: mvcolors[0], strokeWidth: 2.5}),
    Plot.text([{x: xdomain[0] + 0.2 * (xdomain[1] - xdomain[0]), y: 0.85 * ydomain[0], label: "derivatives do not exist at x=0"}],
      {filter: funcname === "abs" && (plotFirstDeriv || plotSecondDeriv), x: "x", y: "y", text: "label", fill: "var(--theme-foreground-muted)"}),
    Plot.tip(funcdata, Plot.pointerX({
      filter: showPlotTip,
      x: "x",
      y: "f",
      title: (d) => {
        const labels = [`x=${d.x.toFixed(3)}`, `f(x)=${d.f.toFixed(3)}`];
        if (plotFirstDeriv) labels.push(`f'(x)=${d.fprime.toFixed(3)}`);
        if (plotSecondDeriv) labels.push(`f''(x)=${d.fbiss.toFixed(3)}`);
        return labels.join("\n");
      }
    }))
  ]
})
```

</div>

</div>

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/some-functions-and-their-derivatives")}

<style>

.dist-main form.inputs-3a86ea label {
  padding: 2px 0;
}

.dist-main form.inputs-3a86ea:not(.inputs-3a86ea-toggle) label {
  width: 124px;
}

.params-card select {
  width: 120px;
}

.params-card > p > b {
  display: block;
  margin-bottom: 0.6rem;
}

.params-card {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
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
