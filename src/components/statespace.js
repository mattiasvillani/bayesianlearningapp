import * as math from "npm:mathjs";

// Gaussian log-density, used for prediction-error-decomposition log-likelihoods.
export function normalLogPdf(x, mu, sigma) {
  return -0.5 * Math.log(2 * Math.PI) - Math.log(sigma) - 0.5 * ((x - mu) / sigma) ** 2;
}

// One Kalman filter step for the linear Gaussian state-space model
//   y_t = C theta_t + v_t,      v_t ~ N(0, V)
//   theta_t = A theta_{t-1} + w_t,  w_t ~ N(0, W)
// given the previous filtered state (mu, Omega) and the new observation y (a vector).
// Returns the updated filtered state along with the one-step-ahead predicted state.
export function kalmanFilterUpdate(mu, Omega, y, A, C, V, W) {
  const p = Omega.length;
  const muPred = math.multiply(A, mu);
  const OmegaPred = math.add(math.multiply(math.multiply(A, Omega), math.transpose(A)), W);
  const S = math.add(math.multiply(math.multiply(C, OmegaPred), math.transpose(C)), V); // innovation covariance
  const K = math.multiply(math.multiply(OmegaPred, math.transpose(C)), math.inv(S)); // Kalman gain
  const innovation = math.subtract(y, math.multiply(C, muPred));
  const muFilt = math.add(muPred, math.multiply(K, innovation));
  const OmegaFilt = math.multiply(math.subtract(math.identity(p).toArray(), math.multiply(K, C)), OmegaPred);
  return {muFilt, OmegaFilt, muPred, OmegaPred};
}

// Runs the Kalman filter over a full series of observation vectors Y, starting from the
// prior (mu0, Omega0). Returns the filtered and one-step-ahead predicted state trajectories,
// one entry per time point.
export function kalmanFilter(Y, A, C, V, W, mu0, Omega0) {
  const muFilter = [];
  const OmegaFilter = [];
  const muPred = [];
  const OmegaPred = [];
  let mu = mu0;
  let Omega = Omega0;
  for (let t = 0; t < Y.length; t++) {
    const step = kalmanFilterUpdate(mu, Omega, Y[t], A, C, V, W);
    mu = step.muFilt;
    Omega = step.OmegaFilt;
    muFilter.push(mu);
    OmegaFilter.push(Omega);
    muPred.push(step.muPred);
    OmegaPred.push(step.OmegaPred);
  }
  return {muFilter, OmegaFilter, muPred, OmegaPred};
}

// Rauch-Tung-Striebel (RTS) smoother: given the forward filter's filtered and one-step-ahead
// predicted state trajectories (as returned by kalmanFilter), computes the smoothed state
// estimates theta_{t|T}, which use the full series y_1,...,y_T rather than only data up to t.
export function kalmanSmoother(A, muFilter, OmegaFilter, muPred, OmegaPred) {
  const T = muFilter.length;
  const muSmooth = new Array(T);
  const OmegaSmooth = new Array(T);
  muSmooth[T - 1] = muFilter[T - 1];
  OmegaSmooth[T - 1] = OmegaFilter[T - 1];
  for (let t = T - 2; t >= 0; t--) {
    const J = math.multiply(math.multiply(OmegaFilter[t], math.transpose(A)), math.inv(OmegaPred[t + 1]));
    muSmooth[t] = math.add(muFilter[t], math.multiply(J, math.subtract(muSmooth[t + 1], muPred[t + 1])));
    OmegaSmooth[t] = math.add(OmegaFilter[t], math.multiply(math.multiply(J, math.subtract(OmegaSmooth[t + 1], OmegaPred[t + 1])), math.transpose(J)));
  }
  return {muSmooth, OmegaSmooth};
}

// One-step-ahead prediction-error-decomposition log-likelihood for the LGSS model,
// used to estimate unknown variance parameters (V, W) by maximum likelihood.
export function kalmanLogLik(Y, A, C, V, W, mu0, Omega0) {
  const {muPred, OmegaPred} = kalmanFilter(Y, A, C, V, W, mu0, Omega0);
  let logLik = 0;
  for (let t = 0; t < Y.length; t++) {
    const yPred = math.multiply(C, muPred[t]);
    const S = math.add(math.multiply(math.multiply(C, OmegaPred[t]), math.transpose(C)), V);
    for (let i = 0; i < Y[t].length; i++) {
      logLik += normalLogPdf(Y[t][i], yPred[i], Math.sqrt(S[i][i]));
    }
  }
  return logLik;
}
