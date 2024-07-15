export const $prefix=["mat", "list"];

export function get_unthemable_tokens() {
  return {
    'active-indicator-color': 'transparent',
    'active-indicator-shape': '4px'
  };
}

export function get_color_tokens($theme) {
  return {};
}

export function get_typography_tokens($theme) {
  return {};
}

export function get_density_tokens($theme) {
  return {
    'list-item-leading-icon-start-space': '16px',
    'list-item-leading-icon-end-space': '32px',
  };
}
