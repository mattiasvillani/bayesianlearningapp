---
title: Gaussian (unknown variance)
toc: false
---

# Bayesian inference for Gaussian iid data with unknown variance

```js
import jStat from "npm:jstat";
import {mvcolors} from "../components/mvcolors.js";
import {notebookLink} from "../components/notebookLink.js";
import {createFreezeState, resolveDomain} from "../components/freezeAxis.js";
```

```js
function tpdf(x, mu, scale, df) {
  return jStat.studentt.pdf((x - mu) / scale, df) / scale;
}
function tquantile(p, mu, scale, df) {
  return mu + scale * jStat.studentt.inv(p, df);
}
function scaledinvchi2pdf(x, nu, tau2) {
  return jStat.invgamma.pdf(x, nu / 2, (nu * tau2) / 2);
}
function scaledinvchi2quantile(p, nu, tau2) {
  return jStat.invgamma.inv(p, nu / 2, (nu * tau2) / 2);
}
function jointpdf(theta, sigma2, mu, kappa, nu, tau2) {
  return sigma2 > 0 ? jStat.normal.pdf(theta, mu, Math.sqrt(sigma2 / kappa)) * scaledinvchi2pdf(sigma2, nu, tau2) : 0;
}
function jointLevels(mu, kappa, nu, tau2) {
  const sigma2mode = (nu * tau2) / (nu + 2);
  const peak = jointpdf(mu, sigma2mode, mu, kappa, nu, tau2);
  return [0.05, 0.15, 0.3, 0.5, 0.7, 0.9].map((f) => f * peak);
}
```

```js
const n = datasettings[0];
const xbar = datasettings[1];
const s = datasettings[2];
const mu0 = priorsettings[0];
const kappa0 = priorsettings[1];
const nu0 = priorsettings[2];
const sigma0 = priorsettings[3];
const kappan = kappa0 + n;
const w = n / kappan;
const mun = w * xbar + (1 - w) * mu0;
const nun = nu0 + n;
const sigma2n = (nu0 * sigma0 ** 2 + (n - 1) * s ** 2 + ((kappa0 * n) / (kappa0 + n)) * (xbar - mu0) ** 2) / nun;
const sigman = Math.sqrt(sigma2n);
```

```js
function densdataTheta({mu0, kappa0, nu0, sigma0, xbar, s, n, mun, kappan, nun, sigman}) {
  const lowprob = 0.005;
  const highprob = 1 - lowprob;
  const priorScale = sigma0 / Math.sqrt(kappa0);
  const likeScale = s / Math.sqrt(n);
  const postScale = sigman / Math.sqrt(kappan);
  const xlimlow = d3.min([
    tquantile(lowprob, mu0, priorScale, nu0),
    tquantile(lowprob, xbar, likeScale, n),
    tquantile(lowprob, mun, postScale, nun)
  ]);
  const xlimhigh = d3.max([
    tquantile(highprob, mu0, priorScale, nu0),
    tquantile(highprob, xbar, likeScale, n),
    tquantile(highprob, mun, postScale, nun)
  ]);
  const thetas = d3.range(xlimlow, xlimhigh, (xlimhigh - xlimlow) / 500);
  const priorpdf = thetas.map((theta) => ({theta, pdf: tpdf(theta, mu0, priorScale, nu0), type: "prior"}));
  const likepdf = thetas.map((theta) => ({theta, pdf: tpdf(theta, xbar, likeScale, n), type: "likelihood"}));
  const postpdf = thetas.map((theta) => ({theta, pdf: tpdf(theta, mun, postScale, nun), type: "posterior"}));
  return {data: priorpdf.concat(likepdf, postpdf), xlimlow, xlimhigh};
}

const {data: ddTheta, xlimlow: xlimlowTheta, xlimhigh: xlimhighTheta} = densdataTheta({mu0, kappa0, nu0, sigma0, xbar, s, n, mun, kappan, nun, sigman});
const maxpdfTheta = d3.max(ddTheta, (d) => d.pdf);
```

```js
function densdataSigma2({nu0, sigma0, n, s, nun, sigman}) {
  const highprob = 0.995;
  const sigma0sq = sigma0 ** 2;
  const s2 = s ** 2;
  const sigmansq = sigman ** 2;
  const xlimlow = 0;
  const xlimhigh = d3.max([
    scaledinvchi2quantile(highprob, nu0, sigma0sq),
    scaledinvchi2quantile(highprob, n, s2),
    scaledinvchi2quantile(highprob, nun, sigmansq)
  ]);
  const sigma2s = d3.range(xlimlow, xlimhigh, (xlimhigh - xlimlow) / 500);
  const priorpdf = sigma2s.map((sigma2) => ({sigma2, pdf: scaledinvchi2pdf(sigma2, nu0, sigma0sq), type: "prior"}));
  const likepdf = sigma2s.map((sigma2) => ({sigma2, pdf: scaledinvchi2pdf(sigma2, n, s2), type: "likelihood"}));
  const postpdf = sigma2s.map((sigma2) => ({sigma2, pdf: scaledinvchi2pdf(sigma2, nun, sigmansq), type: "posterior"}));
  return {data: priorpdf.concat(likepdf, postpdf), xlimlow, xlimhigh};
}

const {data: ddSigma2, xlimlow: xlimlowSigma2, xlimhigh: xlimhighSigma2} = densdataSigma2({nu0, sigma0, n, s, nun, sigman});
const maxpdfSigma2 = d3.max(ddSigma2, (d) => d.pdf);
```

```js
function jointSigma2Bounds({nu0, sigma0, n, s, nun, sigman}) {
  const highprob = 0.99;
  const sigma0sq = sigma0 ** 2;
  const s2 = s ** 2;
  const sigmansq = sigman ** 2;
  const xlimhigh = d3.max([
    scaledinvchi2quantile(highprob, nu0, sigma0sq),
    scaledinvchi2quantile(highprob, n, s2),
    scaledinvchi2quantile(highprob, nun, sigmansq)
  ]);
  return [0, xlimhigh];
}

const jointSigma2Domain = jointSigma2Bounds({nu0, sigma0, n, s, nun, sigman});
```

```js
const frozenStateTheta = createFreezeState();
const frozenStateSigma2 = createFreezeState();
const frozenStateJointSigma2 = createFreezeState();
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

<div style="display: flex; gap: 1rem;">
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Data</b>
    ${dataInput}

```js
const dataInput = Inputs.form([
  Inputs.range([1, 100], {value: 5, step: 1, label: tex`n`}),
  Inputs.range([0, 20], {value: 16, step: 0.1, label: tex`\bar x`}),
  Inputs.range([0.1, 10], {value: 5, step: 0.1, label: tex`s`})
]);
const datasettings = view(dataInput);
```

  </div>
  <div class="card" style="flex: 1; min-width: 0; margin: 0;">
    <b>Prior</b>
    ${priorInput}

```js
const priorInput = Inputs.form([
  Inputs.range([0, 100], {value: 20, step: 1, label: tex`\mu_0`}),
  Inputs.range([0.1, 100], {value: 1, step: 0.1, label: tex`\kappa_0`}),
  Inputs.range([0.1, 100], {value: 6, step: 0.1, label: tex`\nu_0`}),
  Inputs.range([0.1, 100], {value: 5, step: 0.1, label: tex`\sigma_0`})
]);
const priorsettings = view(priorInput);
```

  </div>
</div>

<div class="card" style="padding-top: 0.25rem;">

```js
const viewInput = Inputs.radio(["Marginal distributions", "Joint distribution"], {value: "Marginal distributions"});
const viewChoice = view(viewInput);
```

```js
const showJoint = viewChoice === "Joint distribution";
```

<div style="margin-bottom: 0.5rem; font-size: 13px;">${viewInput}</div>

```js
const freezeInput = Inputs.toggle({label: "Freeze x-axis", value: true});
const freezeAxis = view(freezeInput);
```

```js
const xDomainTheta = resolveDomain(frozenStateTheta, freezeAxis, [xlimlowTheta, xlimhighTheta]);
const xDomainSigma2 = resolveDomain(frozenStateSigma2, freezeAxis, [xlimlowSigma2, xlimhighSigma2]);
const xDomainJointSigma2 = resolveDomain(frozenStateJointSigma2, freezeAxis, jointSigma2Domain);
```

```js
const plotsView = showJoint
  ? html`<div>
      <h2 style="font-size: 15px; font-weight: 500; margin: 0 0 0.5rem;">Joint posterior for ${tex`(\theta,\sigma^2)`}</h2>
      ${Plot.legend({
        color: {
          domain: ["prior", "likelihood", "posterior"],
          range: [mvcolors[1], mvcolors[0], mvcolors[2]]
        }
      })}
      <div style="font-size: 13px; line-height: 1; color: var(--theme-foreground-muted); margin: 0.25rem 0 -12px;">↑ ${tex`\sigma^2`}</div>
      ${Plot.plot({
      width: Math.min(500, width),
      height: Math.min(420, width),
      style: {fontSize: "13px"},
      x: {label: null, domain: xDomainTheta},
      y: {label: null, domain: xDomainJointSigma2},
      marks: [
        Plot.frame(),
        Plot.contour(null, {
          x1: xDomainTheta[0],
          x2: xDomainTheta[1],
          y1: xDomainJointSigma2[0],
          y2: xDomainJointSigma2[1],
          value: (theta, sigma2) => jointpdf(theta, sigma2, mu0, kappa0, nu0, sigma0 ** 2),
          stroke: mvcolors[1],
          strokeWidth: 2,
          thresholds: jointLevels(mu0, kappa0, nu0, sigma0 ** 2)
        }),
        Plot.contour(null, {
          x1: xDomainTheta[0],
          x2: xDomainTheta[1],
          y1: xDomainJointSigma2[0],
          y2: xDomainJointSigma2[1],
          value: (theta, sigma2) => jointpdf(theta, sigma2, xbar, n, n, s ** 2),
          stroke: mvcolors[0],
          strokeWidth: 2,
          thresholds: jointLevels(xbar, n, n, s ** 2)
        }),
        Plot.contour(null, {
          x1: xDomainTheta[0],
          x2: xDomainTheta[1],
          y1: xDomainJointSigma2[0],
          y2: xDomainJointSigma2[1],
          value: (theta, sigma2) => jointpdf(theta, sigma2, mun, kappan, nun, sigman ** 2),
          stroke: mvcolors[2],
          strokeWidth: 2,
          thresholds: jointLevels(mun, kappan, nun, sigman ** 2)
        })
      ]
    })}
      <div style="text-align: right; font-size: 13px; line-height: 1; margin-top: -12px; color: var(--theme-foreground-muted);">${tex`\theta`} →</div>
    </div>`
  : html`<div style="display: flex; gap: 1rem;">
      <div style="flex: 1;">
      ${Plot.plot({
        width: Math.min(400, width),
        style: {fontSize: "13px"},
        title: html`<h2>Marginal for ${tex`\theta`}</h2>`,
        color: {
          legend: true,
          domain: ["prior", "likelihood", "posterior"],
          range: [mvcolors[1], mvcolors[0], mvcolors[2]]
        },
        x: {label: null, domain: xDomainTheta},
        y: {axis: false, domain: [0, 1.02 * maxpdfTheta]},
        marks: [
          Plot.ruleY([0]),
          Plot.line(ddTheta, {x: "theta", y: "pdf", stroke: "type", strokeWidth: 2.5})
        ]
      })}
      <div style="text-align: right; font-size: 13px; line-height: 1; margin-top: -12px; color: var(--theme-foreground-muted);">${tex`\theta`} →</div>
      </div>
      <div style="flex: 1;">
      ${Plot.plot({
        width: Math.min(400, width),
        style: {fontSize: "13px"},
        title: html`<h2>Marginal for ${tex`\sigma^2`}</h2>`,
        color: {
          legend: true,
          domain: ["prior", "likelihood", "posterior"],
          range: [mvcolors[1], mvcolors[0], mvcolors[2]]
        },
        x: {label: null, domain: xDomainSigma2},
        y: {axis: false, domain: [0, 1.02 * maxpdfSigma2]},
        marks: [
          Plot.ruleY([0]),
          Plot.line(ddSigma2, {x: "sigma2", y: "pdf", stroke: "type", strokeWidth: 2.5})
        ]
      })}
      <div style="text-align: right; font-size: 13px; line-height: 1; margin-top: -12px; color: var(--theme-foreground-muted);">${tex`\sigma^2`} →</div>
      </div>
    </div>`;
```

${plotsView}

<div style="margin-top: -0.75rem; font-size: 13px;">${freezeInput}</div>

</div>

</div>

<div class="dist-side">

<div class="card">

**Model**<br>
${tex`X_1,\ldots,X_n \mid \theta,\sigma^2 \sim \operatorname{N}(\theta,\sigma^2)`}

**Prior**<br>
${tex`\theta \mid \sigma^2 \sim \operatorname{N}\Big(\mu_0,\dfrac{\sigma^2}{\kappa_0}\Big)`}<br>
${tex`\sigma^2 \sim \text{Inv-}\chi^2(\nu_0,\sigma_0^2)`}

**Posterior**<br>
${tex`\theta \mid \sigma^2,\boldsymbol{x} \sim \operatorname{N}\Big(\mu_n,\dfrac{\sigma^2}{\kappa_n}\Big)`}<br>
${tex`\sigma^2 \mid \boldsymbol{x} \sim \text{Inv-}\chi^2(\nu_n,\sigma_n^2)`}

**Posterior hyperparameters**<br>
${tex`\kappa_n = \kappa_0+n = ${kappan.toPrecision(3)}`}<br>
${tex`w = n/\kappa_n = ${w.toPrecision(3)}`}<br>
${tex`\mu_n = w\bar x+(1-w)\mu_0 = ${mun.toPrecision(3)}`}<br>
${tex`\nu_n = \nu_0+n = ${nun.toPrecision(3)}`}<br>
${tex`\sigma_n^2 = ${sigma2n.toPrecision(3)}`}

**Marginal posterior for θ**<br>
${tex`\theta \mid \boldsymbol{x} \sim t_{\nu_n}\Big(\mu_n,\dfrac{\sigma_n^2}{\kappa_n}\Big)`}

</div>

<div class="card">

### Summary

|  | Prior | Posterior |
|---|---|---|
| ${tex`\mu`} | ${mu0.toPrecision(3)} | ${mun.toPrecision(3)} |
| ${tex`\kappa`} | ${kappa0.toPrecision(3)} | ${kappan.toPrecision(3)} |
| ${tex`\nu`} | ${nu0.toPrecision(3)} | ${nun.toPrecision(3)} |
| ${tex`\sigma`} | ${sigma0.toPrecision(3)} | ${sigman.toPrecision(3)} |

</div>

${notebookLink("https://observablehq.com/@mattiasvillani/bayesian-inference-for-gaussian-iid-data")}

</div>

</div>

<style>

.dist-main figure {
  margin: 0;
}

</style>
