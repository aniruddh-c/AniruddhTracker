// js/ui/header.js

export function renderHeader(title, subtitle = "", options = {}) {
  const { noCaps = false } = options;

  return `
    <div class="app-header">
      <div class="app-header-content">
        <div class="app-header-title ${noCaps ? "no-caps" : ""}">
          ${title}
        </div>
        ${
          subtitle
            ? `<div class="app-header-subtitle">${subtitle}</div>`
            : ""
        }
      </div>
    </div>
  `;
}
