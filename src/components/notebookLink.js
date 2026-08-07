import {html} from "npm:htl";

export function notebookLink(url) {
  return html`<a class="notebook-link" href="${url}" target="_blank" rel="noopener noreferrer">
<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="1.5" width="9" height="13" rx="1.2" stroke="currentColor" stroke-width="1.1"></rect>
  <line x1="4.2" y1="4.4" x2="8.8" y2="4.4" stroke="currentColor" stroke-width="0.9"></line>
  <line x1="4.2" y1="6.6" x2="8.8" y2="6.6" stroke="currentColor" stroke-width="0.9"></line>
  <line x1="4.2" y1="8.8" x2="7.2" y2="8.8" stroke="currentColor" stroke-width="0.9"></line>
  <circle cx="12.3" cy="12.3" r="2.3" fill="#6C8EBF"></circle>
  <circle cx="10.4" cy="13.2" r="1.6" fill="#c0a34d"></circle>
  <circle cx="13.5" cy="13.6" r="1.4" fill="#007878"></circle>
</svg>
Original notebook ↗
</a>`;
}
