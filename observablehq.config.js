export default {
  title: "Bayesian Learning",
  pages: [
    {
      name: "Bayesics",
      open: true,
      pages: [
        {
          name: "Bayes' theorem for events",
          path: "/bayesics/bayes-theorem-for-events"
        }
      ]
    },
    {
      name: "Conjugate Analysis",
      open: true,
      pages: [
        {
          name: "Bernoulli data",
          path: "/conjugate-analysis/bayesian-inference-for-bernoulli-iid-data"
        },
        {
          name: "Poisson data",
          path: "/conjugate-analysis/bayesian-inference-for-iid-poisson-counts"
        },
        {
          name: "Exponential data",
          path: "/conjugate-analysis/bayesian-inference-for-exponential-iid-data"
        },
        {
          name: "Gaussian data (known variance)",
          path: "/conjugate-analysis/bayesian-inference-for-gaussian-known-variance"
        },
        {
          name: "Gaussian data (unknown variance)",
          path: "/conjugate-analysis/bayesian-inference-for-gaussian-unknown-variance"
        }
      ]
    },
    {
      name: "Likelihood",
      open: false,
      pages: [
        {
          name: "MLE - Bernoulli data",
          path: "/likelihood/maximum-likelihood-bernoulli-data"
        },
        {
          name: "MLE - Poisson data",
          path: "/likelihood/maximum-likelihood-poisson-data"
        },
        {
          name: "MLE - Exponential data",
          path: "/likelihood/maximum-likelihood-exponential-data"
        }
      ]
    },
    {
      name: "Mathematics",
      open: false,
      pages: [
        {
          name: "The Exponential Function",
          path: "/mathematics/exponential-function"
        },
        {
          name: "The Logarithm Function",
          path: "/mathematics/logarithm-function"
        },
        {
          name: "The Derivative",
          path: "/mathematics/derivative"
        },
        {
          name: "A Function and Its Derivatives",
          path: "/mathematics/function-and-derivatives"
        },
        {
          name: "Function Optimization",
          path: "/mathematics/function-optimization"
        },
        {
          name: "The Taylor Approximation",
          path: "/mathematics/taylor-approximation"
        },
        {
          name: "The Riemann Integral",
          path: "/mathematics/riemann-integral"
        },
        {
          name: "Second Derivative and Curvature",
          path: "/mathematics/curvature"
        }
      ]
    },
    {
      name: "Data stories",
      open: false,
      pages: [
        {
          name: "Internet speed data",
          path: "/data-stories/internet-speed-data"
        }
      ]
    },
    {
      name: "Distributions",
      open: false,
      pages: [
        {name: "Bernoulli", path: "/distributions/bernoulli-distribution"},
        {name: "Beta", path: "/distributions/beta-distribution"},
        {name: "Beta (four-parameter)", path: "/distributions/four-parameter-beta-distribution"},
        {name: "Beta (three-parameter)", path: "/distributions/three-parameter-beta-distribution"},
        {name: "Beta-Binomial", path: "/distributions/beta-binomial-distribution"},
        {name: "Binomial", path: "/distributions/binomial-distribution"},
        {name: "Bivariate Normal", path: "/distributions/bivariate-normal-distribution"},
        {name: "Cauchy", path: "/distributions/cauchy-distribution"},
        {name: "Chi-squared", path: "/distributions/chi2-distribution"},
        {name: "Compound-Gamma", path: "/distributions/compound-gamma-distribution"},
        {name: "Dirichlet", path: "/distributions/dirichlet-distribution"},
        {name: "Exponential", path: "/distributions/exponential-distribution"},
        {name: "F", path: "/distributions/f-distribution"},
        {name: "Fisher Z", path: "/distributions/z-distribution"},
        {name: "Gamma", path: "/distributions/gamma-distribution"},
        {name: "Generalized Extreme Value", path: "/distributions/generalized-extreme-value-distribution"},
        {name: "Geometric", path: "/distributions/geometric-distribution"},
        {name: "Gumbel", path: "/distributions/gumbel-distribution"},
        {name: "Gumbel–Softmax", path: "/distributions/gumbel-softmax-distribution"},
        {name: "Hypergeometric", path: "/distributions/hypergeometric-distribution"},
        {name: "Inverse Gamma", path: "/distributions/inverse-gamma-distribution"},
        {name: "Inverse Gaussian", path: "/distributions/inverse-gaussian-distribution"},
        {name: "Kumaraswamy", path: "/distributions/kumaraswamy-distribution"},
        {name: "Laplace", path: "/distributions/laplace-distribution"},
        {name: "Logistic", path: "/distributions/logistic-distribution"},
        {name: "Logit-normal", path: "/distributions/logit-normal-distribution"},
        {name: "LogNormal", path: "/distributions/lognormal-distribution"},
        {name: "Mixture of Poissons", path: "/distributions/mixture-of-poissons"},
        {name: "Multivariate logistic normal", path: "/distributions/multivariate-logisticnormal-distribution"},
        {name: "Multivariate Normal", path: "/distributions/multivariate-normal-distribution"},
        {name: "Negative Binomial", path: "/distributions/negative-binomial-distribution"},
        {name: "Non-central Chi-squared", path: "/distributions/non-central-chi2-distribution"},
        {name: "Normal (Gaussian)", path: "/distributions/normal-gaussian-distribution"},
        {name: "Normal Mixture", path: "/distributions/normal-mixture"},
        {name: "Pareto", path: "/distributions/pareto-distribution"},
        {name: "Poisson", path: "/distributions/poisson-distribution"},
        {name: "Poisson-Gamma", path: "/distributions/poisson-gamma-distribution"},
        {name: "Pólya-Gamma", path: "/distributions/polya-gamma-distribution"},
        {name: "Scaled Inverse Chi-squared", path: "/distributions/scaled-inverse-chi-2-distribution"},
        {name: "Skellam", path: "/distributions/skellam-distribution"},
        {name: "Skew-Normal", path: "/distributions/skew-normal-distribution"},
        {name: "Split-Normal", path: "/distributions/split-normal-distribution"},
        {name: "Split-t", path: "/distributions/split-t-distribution"},
        {name: "Student-t", path: "/distributions/student-t-distribution"},
        {name: "Student-t (standard)", path: "/distributions/student-t-distribution-standard"},
        {name: "Triangular", path: "/distributions/triangular-distribution"},
        {name: "Trivariate Normal", path: "/distributions/trivariate-normal-distribution"},
        {name: "Truncated Normal", path: "/distributions/truncated-normal-distribution"},
        {name: "Uniform", path: "/distributions/uniform-distribution"},
        {name: "von Mises", path: "/distributions/von-mises-distribution"},
        {name: "Weibull", path: "/distributions/weibull-distribution"},
        {name: "Zero-Inflated Poisson", path: "/distributions/zero-inflated-poisson-distribution"},
        {name: "Zipf", path: "/distributions/zipf-distribution"}
      ]
    }
  ],
  header: `
<button id="theme-toggle" type="button" aria-label="Toggle light and dark mode" title="Toggle light/dark mode">
  <svg id="theme-toggle-sun" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="3.2" fill="currentColor"/>
    <g stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
      <line x1="8" y1="0.8" x2="8" y2="2.4"/>
      <line x1="8" y1="13.6" x2="8" y2="15.2"/>
      <line x1="0.8" y1="8" x2="2.4" y2="8"/>
      <line x1="13.6" y1="8" x2="15.2" y2="8"/>
      <line x1="2.6" y1="2.6" x2="3.7" y2="3.7"/>
      <line x1="12.3" y1="12.3" x2="13.4" y2="13.4"/>
      <line x1="2.6" y1="13.4" x2="3.7" y2="12.3"/>
      <line x1="12.3" y1="3.7" x2="13.4" y2="2.6"/>
    </g>
  </svg>
  <svg id="theme-toggle-moon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 9.5A6 6 0 1 1 6.5 2.5a5 5 0 0 0 7 7Z" fill="currentColor"/>
  </svg>
</button>
<script>
(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem("mv-theme");
  if (stored === "light" || stored === "dark") root.setAttribute("data-theme", stored);
  document.addEventListener("click", function (event) {
    if (!event.target.closest("#theme-toggle")) return;
    var current = root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("mv-theme", next);
  });
})();
</script>
<script>
(function () {
  var observer = new MutationObserver(function () {
    var footer = document.querySelector("#observablehq-footer");
    var link = document.querySelector("main .notebook-link");
    if (!footer || !link) return;
    footer.appendChild(link.closest("p") || link);
    observer.disconnect();
  });
  observer.observe(document.documentElement, {childList: true, subtree: true});
})();
</script>`,
  footer: `An interactive companion to the book <a href="https://mattiasvillani.com/BayesianLearningBook/">Bayesian Learning</a> by <a href="https://mattiasvillani.com">Mattias Villani</a>`,
  toc: false,
  sidebar: true,
  pager: false,
  root: "src",
  style: "styles.css"
};
