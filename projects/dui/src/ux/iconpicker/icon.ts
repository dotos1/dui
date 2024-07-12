export class Icon {
  name: string;
  id: string;
  filter?: string[];
  aliases?: string[];
  type?: IconType;
}

export class SVGIcon {
  name: string;
  url: string;
  style?:any;
}

export enum IconType {
  FONT,
  SVG
}
