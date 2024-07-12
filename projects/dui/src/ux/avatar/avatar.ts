import { SafeUrl } from '@angular/platform-browser';
import { IAVatar } from './avatar.interface';

export class Avatar implements IAVatar {

  constructor(
    public id: string,
    public name: string,
    public src?: string|SafeUrl) {
  }

  public getAvatar(size: number): string {
    return this.getInitials(this.name, size);
  }

  private getInitials(name: string, size: number): string {
    name = name.trim();
    if (!name) {
      return '';
    }
    const initials = name.split(' ');
    if (size && size < initials.length) {
      return this.constructInitials(initials.slice(0, size));
    } else {
      return this.constructInitials(initials);
    }
  }

  private constructInitials(elements: string[]): string {
    if (!elements || !elements.length) {
      return '';
    }
    return elements
      .filter(element => element && element.length > 0)
      .map(element => element[0].toUpperCase())
      .join('');
  }
}
