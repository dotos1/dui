/* stylelint-disable no-duplicate-selectors */

import { Theme } from '../interfaces';
import { matColor } from '../mat-color';

export function duiMarkdownTheme(theme: Theme): Object {
  return {
    '.dui-markdown':
    {
      background: matColor(theme.background, 'background'),
    },
    '.dui-markdown >* h1 .octicon-link,  h2 .octicon-link,  h3 .octicon-link,  h4 .octicon-link,  h5 .octicon-link,  h6 .octicon-link':
      {
        background: matColor(theme.background, 'card'),
      },
    '.dui-markdown  >*  .pl-c': {
      background:  matColor(theme.background, 'disabled-button'),
    },
    ' .dui-markdown >*  .pl-c1, .pl-s .pl-v': {
      color:  matColor(theme.primary, 300),
    },
    '.dui-markdown >*   .pl-e, .pl-en': {
      color: '#795da3',
    },
    '.dui-markdown >*   .pl-s .pl-s1, .pl-smi': {
      color: matColor(theme.foreground, 'secondary-text'),
    },
    '.dui-markdown >*  .pl-ent': {
      color: '#63a35c',
    },
    '.dui-markdown >*  .pl-k': {
      color: '#a71d5d',
    },
    '.dui-markdown >*   .pl-pds,  .pl-s,  .pl-s .pl-pse .pl-s1,  .pl-sr,  .pl-sr .pl-cce,  .pl-sr .pl-sra,  .pl-sr .pl-sre':
      {
        color: matColor(theme.primary, 900),
      },
    '.dui-markdown >*  .pl-v': {
      color: '#ed6a43',
    },
    '.dui-markdown >*  .pl-id': {
      color: '#b52a1d',
    },
    '.dui-markdown >*  .pl-ii': {
      'background-color': '#b52a1d',
      color: matColor(theme.background, 'card'),
    },
    '.dui-markdown >*  .pl-sr .pl-cce': {
      color: '#63a35c',
      'font-weight': 'bold',
    },
    '.dui-markdown >*  .pl-ml': {
      color: '#693a17',
    },
    '.dui-markdown >*  .pl-mh,.pl-mh .pl-en,.pl-ms': {
      color: matColor(theme.primary, 900),
      'font-weight': 'bold',
    },
    '.dui-markdown >*  .pl-mq': {
      color: '#008080',
    },
    '.dui-markdown >*  .pl-mi': {
      color:  matColor(theme.foreground, 'secondary-text'),
      'font-style': 'italic',
    },
    '.dui-markdown >*  .pl-mb': {
      color:  matColor(theme.foreground, 'secondary-text'),
      'font-weight': 'bold',
    },
    '.dui-markdown >*  .pl-md': {
      'background-color':  matColor(theme.background, 'card'),
      "color": '#bd2c00',
    },
    '.dui-markdown >*  .pl-mi1': {
      'background-color':  matColor(theme.background, 'card'),
      color: '#55a532',
    },
    '.dui-markdown >*  .pl-mdr': {
      color: '#795da3',
      'font-weight': 'bold',
    },
    '.dui-markdown >*  .pl-mo': {
      color:  matColor(theme.primary, 800),
    },
    '.dui-markdown >*   kbd': {
      'background-color': matColor(theme.background, 'card'),
      border: 'solid 1px '+ matColor(theme.foreground, 'divider'),
      'border-bottom-color': matColor(theme.foreground, 'divider'),
      'box-shadow': 'inset 0 -1px 0 '+ matColor(theme.foreground, 'divider'),
    },
    '.dui-markdown >*  .full-commit .btn-outline:not(:disabled):hover': {
      color:  matColor(theme.primary, 500),
      border: '1px solid '+matColor(theme.primary, 500),
    },
    '.dui-markdown >*   :checked + .radio-label': {
      'border-color':matColor(theme.primary, 500),
    },
  };
}
