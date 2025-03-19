import {
  Component, Input,
  OnInit, TemplateRef,
} from '@angular/core';


import { Toolbar, ToolbarItem, ToolbarDropdown } from '../../types';
import { MenuService } from './menu.service';
import { Editor } from '../../Editor';
import EditorError from '../../utils/error';

export const DEFAULT_TOOLBAR: Toolbar = [
  ['bold', 'italic'],
  ['code', 'blockquote'],
  ['underline', 'strike'],
  ['ordered_list', 'bullet_list'],
  [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ['link', 'image'],
  ['text_color', 'background_color'],
  ['align_left', 'align_center', 'align_right', 'align_justify'],
  ['format_clear'],
];

export const TOOLBAR_MINIMAL: Toolbar = [
  ['bold', 'italic'],
  [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ['link', 'image'],
  ['text_color', 'background_color'],
];

export const TOOLBAR_FULL: Toolbar = [
  ['bold', 'italic'],
  ['code', 'blockquote'],
  ['underline', 'strike'],
  ['ordered_list', 'bullet_list'],
  [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  ['link', 'image'],
  ['text_color', 'background_color'],
  ['align_left', 'align_center', 'align_right', 'align_justify'],
  ['horizontal_rule'],
];

const DEFAULT_COLOR_PRESETS = [
 '#000000',
  '#434343',
  '#666666',
  '#999999',
'#b7b7b7',
'#cccccc',
'#d9d9d9',
'#efefef',
'#f3f3f3',
'#FFFFFF',

'#980000',
'#FF0000',
'#FF9900',
'#FFFF00',
'#00FF00',
'#00FFFF',
'#4A86E8',
'#0000FF',
'#9900FF',
'#FF00FF',

'#E6B8AF',
'#F4CCCC',
'#FCE5CD',
'#FFF2CC',
'#D9EAD3',
'#D0E0E3',
'#C9DAF8',
'#CFE2F3',
'#D9D2F9',
'#EAD1DC',

'#DD7E68',
'#EA9999',
'#F9CB9C',
'#FFE599',
'#B6D7A8',
'#A2C4C9',
'#A4C2F4',
'#9FC5E8',
'#B4A7D6',
'#D5A6BD',

'#CC4125',
'#E06666',
'#F6B26B',
'#FFD966',
'#93C47D',
'#76A5AF',
'#6D9EEB',
'#6FA8DC',
'#8E7CC3',
'#C27BA0',

'#A61C00',
'#CC0000',
'#E69138',
'#F1C232',
'#6AA84F',
'#45818E',
'#3C78D8',
'#3D85C6',
'#674EA7',
'#A64D79',

'#85200C',
'#990000',
'#B45F06',
'#BF9000',
'#38761D',
'#134F5C',
'#1155CC',
'#0B5394',
'#351C75',
'#741B47',

'#5B0F00',
'#660000',
'#783F04',
'#7F6000',
'#274E13',
'#0C343D',
'#1C4587',
'#073763',
'#20124D',
'#4C1130',
];


@Component({
  selector: 'ux-editor-menu',
  templateUrl: './menu.component.html',
  providers: [MenuService],
  
})

export class MenuComponent implements OnInit {
  @Input() toolbar: Toolbar = TOOLBAR_MINIMAL;
  @Input() colorPresets: string[] = DEFAULT_COLOR_PRESETS;
  @Input() disabled = false;
  @Input() editor: Editor;
  @Input() customMenuRef: TemplateRef<any> | null = null;
  @Input() dropdownPlacement: 'top' | 'bottom' = 'bottom';

  toggleCommands: ToolbarItem[] = [
    'bold',
    'italic',
    'underline',
    'strike',
    'code',
    'blockquote',
    'ordered_list',
    'bullet_list',
    'align_left',
    'align_center',
    'align_right',
    'align_justify',
  ];

  insertCommands: ToolbarItem[] = [
    'horizontal_rule',
    'format_clear',
  ];

  iconContainerClass = ['Editor__MenuItem', 'Editor__MenuItem--Icon'];
  dropdownContainerClass = ['Editor__Dropdown'];
  seperatorClass = ['Editor__Seperator'];

  constructor(private menuService: MenuService) { }

  get presets(): string[][] {
    const col = 8;
    const colors: string[][] = [];

    this.colorPresets.forEach((color, index) => {
      const row = Math.floor(index / col);

      if (!colors[row]) {
        colors.push([]);
      }

      colors[row].push(color);
    });

    return colors;
  }

  trackByIndex(index: number): number {
    return index;
  }

  isDropDown(item: ToolbarItem): boolean {
    if ((item as ToolbarDropdown)?.heading) {
      return true;
    }

    return false;
  }

  getDropdownItems(item: ToolbarItem): ToolbarDropdown {
    return item as ToolbarDropdown;
  }

  ngOnInit(): void {
    if (!this.editor) {
      throw new EditorError('Required editor instance to initialize menu component');
    }

    this.menuService.editor = this.editor;
  }
}
