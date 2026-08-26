---
title: Bayes' theorem for events
toc: false
---

# Bayes' theorem for events

_Bayes' theorem reverses a conditioning: it lets you compute ${tex`P(A \mid B)`} from ${tex`P(B \mid A)`}._

**Bayes' theorem**<br>
The probability of event ${tex`A`} conditional on the occurrence of event ${tex`B`} is

${tex`P(A \mid B) =  \dfrac{P(B \mid A)P(A)}{P(B)} = \dfrac{P(B \mid A)P(A)}{P(B \mid A)P(A) + P(B \mid A^c)P(A^c)}`}

In the interactive example below, the event A is "covid" and event B is "positive test", so Bayes' theorem lets you compute the probability of interest <br>

${tex`P(\text{covid } \vert \text{ positive test})`} 

from the reverse probability 

${tex`P(\text{positive test } \vert \text{ covid})`}.

The latter probability is provided by the company that developed the test. 

Experiment and see how the probability for covid given a positive test actually depends on the base probability ${tex`P(A)`} of having covid, before getting a positive test.
 You can use the interactivity below for any two events A and B by changing the text describing the events A and B.

```js
import {notebookLink} from "../components/notebookLink.js";
```

<div class="dist-layout dist-layout--wide">

<div class="dist-main">

  <div class="card params-card">

<b>Event names</b>
${labelsInput}

```js
const labelsInput = Inputs.form([
  Inputs.text({label: "Event A:", placeholder: "enter name of event A", value: "covid"}),
  Inputs.text({label: "Event B:", placeholder: "enter name of event B", value: "positive test"})
]);
const labels = view(labelsInput);
```

<b>Probabilities</b>
${probsInput}

```js
const probsInput = Inputs.form([
  Inputs.range([0, 1], {value: 0.9677, step: 0.0001, label: tex`P(\text{${labels[1]}} \mid \text{${labels[0]}})`}),
  Inputs.range([0, 1], {value: 0.992, step: 0.0001, label: tex`P(\text{not ${labels[1]}} \mid \text{not ${labels[0]}})`}),
  Inputs.range([0, 1], {value: 0.05, step: 0.0001, label: tex`P(\text{${labels[0]}})`})
]);
const probs = view(probsInput);
```

  </div>

  <div class="card result-card">

```js
const probA = probs[0] * probs[2] / (probs[0] * probs[2] + (1 - probs[1]) * (1 - probs[2]));
```

<div class="result-line">${tex`P(\text{${labels[0]}} \mid \text{${labels[1]}}) = ${probA.toPrecision(4)}`}</div>

  </div>

</div>

<div class="dist-side">

  <div class="card">

**Example: a rapid Covid test**<br>
A woman tests positive on a rapid self-test. What is the probability she actually have Covid?

- **Sensitivity** (true positive rate): ${tex`P(B \mid A)`} = P(positive test | Covid)
- **Specificity** (true negative rate): ${tex`P(B^c \mid A^c)`} = P(negative test | not Covid)
- **Base rate**: ${tex`P(A)`} = P(Covid) is the probability for Covid before the test result, perhaps given by the proportion of Covid in the population (but maybe she has other symptoms suggesting covid?).

The defaults above (96.77% sensitivity, 99.20% specificity) come from a real test's instruction leaflet.

  </div>

${notebookLink("https://observablehq.com/@mattiasvillani/bayes-theorem-for-events")}

</div>

</div>

<style>

.dist-main form.inputs-3a86ea label {
  padding: 2px 0;
}

.dist-main form.inputs-3a86ea:not(.inputs-3a86ea-toggle) label {
  width: 220px;
}

.params-card input[type="number"] {
  width: 4.5rem;
  flex: none;
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
  margin-bottom: 1rem;
}

.result-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
}

.result-line {
  font-size: 1.4rem;
}

</style>
