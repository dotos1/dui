import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvatarConfigService } from './avatar-config.service';
import { IAVatar } from './avatar.interface';

export const defaultColors = [
  '#1abc9c',
  '#3498db',
  '#f1c40f',
  '#8e44ad',
  '#e74c3c',
  '#d35400',
  '#2c3e50',
  '#7f8c8d'
];

/**
 * Provides utilities methods related to Avatar component
 */
@Injectable()
export class AvatarService {
  public avatarColors: string[] = defaultColors;

  private readonly failedSources = new Map<string, IAVatar>();

  constructor(
    private http: HttpClient,
    private avatarConfigService: AvatarConfigService
  ) {
    this.overrideAvatarColors();
  }

  public fetchAvatar(avatarUrl: string): Observable<unknown> {
    return this.http.get(avatarUrl);
  }

  public getRandomColor(avatarText: string): string {
    if (!avatarText) {
      return 'transparent';
    }
    const asciiCodeSum = this.calculateAsciiCode(avatarText);
    return this.avatarColors[asciiCodeSum % this.avatarColors.length];
  }

  public isTextAvatar(source: IAVatar): boolean {
    return source.src==undefined;
  }

  private overrideAvatarColors(): void {
    this.avatarColors = this.avatarConfigService.getAvatarColors(defaultColors);
  }

  private calculateAsciiCode(value: string): number {
    return value
      .split('')
      .map(letter => letter.charCodeAt(0))
      .reduce((previous, current) => previous + current);
  }
}
