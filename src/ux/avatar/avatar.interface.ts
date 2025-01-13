import { SafeUrl } from "@angular/platform-browser";
export interface IAVatar {

  id: string;

  name:string;

  src?:string|SafeUrl;

  avatar?:string|SafeUrl;

  getAvatar(size: number): string;
}
