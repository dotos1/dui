import { Theme } from '../interfaces/theme';
import { matColor, rgba } from '../mat-color';

export function monacoEditorTheme(theme: Theme): Object {
  const inputOptionHoverBackground =
    theme.type == 'light' ? '#d6ecf2' : rgba('rgb(90, 93, 94)', 0.5);
  const focusBorder = matColor(theme.primary, 500);
  const editorCodeLensForeground =
    theme.type == 'light' ? '#919191' : '#999999';
  const editorLinkActiveForeground =
    theme.type == 'light'
      ? '#0000ff'
      : theme.type == 'dark'||theme.type=='darkblue'
      ? '#00ffff'
      : '#4e94ce';

  return {
    ".monaco-editor":{
      "color":matColor(theme.foreground, 'text')+" !important",
      "background-color": matColor(theme.background,'background')+" !important"
    },
    ".monaco-editor .margin":{
      "color":matColor(theme.foreground, 'text')+" !important",
      "background-color": matColor(theme.background,'background')+" !important"
    },
    ".monaco-editor .view-overlays .current-line": {
      "border":" 1px solid "+ matColor(theme.foreground,'divider') +"  !important"
    },
    ".monaco-editor, .monaco-editor-background, .monaco-editor .inputarea.ime-input":{
      "background-color": matColor(theme.background,'background')+" !important"
    },
    '.monaco-custom-checkbox:hover': {
      'background-color': inputOptionHoverBackground,
    },
    '.hc-black .monaco-custom-checkbox:hover': {
      border: '1px dashed ' + focusBorder,
    },
    '.monaco-editor .codelens-decoration': {
      color: editorCodeLensForeground,
    },
    '.monaco-editor .codelens-decoration > a:hover': {
      color: editorLinkActiveForeground + ' !important',
    },
    '.monaco-editor .codelens-decoration > a:hover .codicon': {
      color: editorLinkActiveForeground + ' !important',
    },
    '.monaco-editor .codelens-decoration .codicon': {
      color:
        theme.type == 'light'
          ? '#919191'
          : theme.type == 'dark'||theme.type=='darkblue'
          ? '#999999'
          : '#999999',
    },
    '.monaco-editor .marker-widget .descriptioncontainer .message a.code-link > span':
      {
        color:
          theme.type == 'light'
            ? '#006ab1'
            : theme.type == 'dark'||theme.type=='darkblue'
            ? '#3794ff'
            : '#58a6ff',
      },
    '.monaco-editor .reference-zone-widget .ref-tree': {
      'background-color': matColor(theme.background, 'background'),
      color: matColor(theme.foreground, 'icon'),
    },
    '.monaco-editor .reference-zone-widget .ref-tree .reference-file': {
      color: matColor(theme.foreground, 'text'),
    },
    '.monaco-editor .reference-zone-widget .ref-tree .monaco-list:focus .monaco-list-rows  > .monaco-list-row.selected:not(.highlighted)':
      {
        'background-color': matColor(theme.primary, 900),
        color:
          theme.type == 'light'
            ? '#6c6c6c'
            : theme.type == 'dark'||theme.type=='darkblue'
            ? '#ffffff'
            : '#ffffff',
      },
    '.monaco-editor .reference-zone-widget .ref-tree .referenceMatch .highlight':
      {
        'background-color':
          theme.type == 'light'
            ? 'rgba(234, 92, 0, 0.3)'
            : 'gba(187, 128, 9, 0.4)',
      },
    '.monaco-editor .reference-zone-widget .preview .reference-decoration': {
      'background-color':
        theme.type == 'light'
          ? 'rgba(245, 216, 2, 0.87)'
          : 'rgba(187, 128, 9, 0.4)',
      border: ' 2px solid ' + matColor(theme.primary, 500),
    },
    '.monaco-editor .reference-zone-widget .preview .monaco-editor .inputarea.ime-input':
      {
        'background-color': matColor(theme.background,'background')
      },
    '.monaco-editor .reference-zone-widget .preview .monaco-editor .monaco-editor-background':
      {
        'background-color':
          theme.type == 'light'
            ? '#f2f8fc'
            : theme.type == 'dark'||theme.type=='darkblue'
            ? '#000000'
            : 'rgba(110, 118, 129, 0.1)',
      },
    '.monaco-editor .reference-zone-widget .preview .monaco-editor .margin': {
      'background-color':
        theme.type == 'light'
          ? '#f2f8fc'
          : theme.type == 'dark'||theme.type=='darkblue'
          ? '#000000'
          : 'rgba(110, 118, 129, 0.1)',
    },
    '.monaco-editor.hc-black  .reference-zone-widget .ref-tree .referenceMatch .highlight':
      {
        border: '1px dotted #f38518',
      },
    '.monaco-editor .monaco-editor-overlaymessage .message': {
      color: matColor(theme.foreground, 'secondary-text'),
      'background-color': matColor(theme.background, 'card'),
      border: '1px solid ' + matColor(theme.foreground, 'divider'),
    },
    '.monaco-editor .monaco-editor-overlaymessage .anchor.top': {
      'border-bottom-color':
        '1px solid ' + matColor(theme.foreground, 'divider'),
    },
    '.monaco-editor .monaco-editor-overlaymessage .anchor.below': {
      'border-top-color': '1px solid ' + matColor(theme.foreground, 'divider'),
    },
    '.monaco-editor .snippet-placeholder': {
      'background-color':
        theme.type == 'light'
          ? '#d6ecf2'
          : theme.type == 'dark'||theme.type=='darkblue'
          ? 'rgba(124, 124, 124, 0.3)'
          : 'rgba(124, 124, 124, 0.3)',
    },
    '.monaco-editor .finish-snippet-placeholder': {
      'outline-color':
        theme.type == 'light'
          ? '#d6ecf2'
          : theme.type == 'dark'||theme.type=='darkblue'
          ? '#525252'
          : '#525252',
    },
    '.monaco-editor .suggest-details,.monaco-editor .suggest-widget': {
      border:
        ' 1px solid ' + theme.type == 'light'
          ? '#c8c8c8'
          : theme.type == 'dark'||theme.type=='darkblue'
          ? '#6fc3df'
          : '#454545',
      'background-color':
        theme.type == 'light'
          ? '#f3f3f3'
          : theme.type == 'dark'||theme.type=='darkblue'
          ? '#0c141f'
          : '#161b22',
    },
    '.monaco-editor .suggest-widget .suggest-status-bar': {
      'border-top':
        '1px solid ' + theme.type == 'light'
          ? '#c8c8c8'
          : theme.type == 'dark'||theme.type=='darkblue'
          ? '#6fc3df'
          : '#454545',
    },
    '.monaco-editor .suggest-widget.with-status-bar .suggest-status-bar .action-label':
      {
        color:
          theme.type == 'light'
            ? 'rgba(0, 0, 0, 0.5)'
            : theme.type == 'dark'||theme.type=='darkblue'
            ? 'rgba(255, 255, 255, 0.5)'
            : 'rgba(201, 209, 217, 0.5)',
      },
    '.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused': {
      color: theme.type == 'light' ? '#ffffff' : '#c9d1d9',
    },
    '.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused .codicon':
      {
        color: matColor(theme.background, 'card'),
      },
    '.monaco-editor .suggest-widget .monaco-list .monaco-list-row:not(.focused) .monaco-icon-label':
      {
        color: matColor(theme.foreground, 'text'),
      },
    '.monaco-editor .suggest-widget .monaco-list .monaco-list-row .monaco-highlighted-label .highlight':
      {
        color: matColor(theme.primary, 500),
      },
    '.monaco-editor .suggest-widget .monaco-list .monaco-list-row.focused .monaco-highlighted-label .highlight':
      {
        color: matColor(theme.primary, 500),
      },
    '.monaco-editor .suggest-details': {
      color: matColor(theme.foreground, 'text'),
    },
    '.monaco-editor .suggest-details.focused': {
      'border-color': matColor(theme.primary, 500),
    },
    '.monaco-editor .suggest-details a': {
      color: matColor(theme.primary, 400),
    },
    '.monaco-editor .suggest-details a:hover': {
      color: matColor(theme.primary, 600),
    },
    '.monaco-editor .suggest-details code': {
      'background-color':
        theme.type == 'light'
          ? 'rgba(220, 220, 220, 0.4)'
          : theme.type == 'dark'||theme.type=='darkblue'
          ? '#000000'
          : 'rgba(110, 118, 129, 0.4)',
    },
    '.editor-banner': {
      background: matColor(theme.primary, 800),
      'background-color': matColor(theme.primary, 800),
    },
    '.editor-banner,.editor-banner .action-container .codicon, .editor-banner .message-actions-container .monaco-link':
      {
        color: matColor(theme.primary, 800),
      },
    '.editor-banner .icon-container .codicon': {
      color: matColor(theme.primary, 300),
    },
    '.monaco-editor .unicode-highlight': {
      border: ' 1px solid ' + matColor(theme.accent, 500),
    },
  };
}
