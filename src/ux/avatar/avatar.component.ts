import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Avatar } from './avatar';
import { AvatarService } from './avatar.service';
import { IAVatar } from './avatar.interface';
import { SafeUrl } from '@angular/platform-browser';

type Style = Partial<CSSStyleDeclaration>;

@Component({
  selector: 'dui-avatar',

  templateUrl: './avatar.component.html',
  changeDetection:ChangeDetectionStrategy.Default,
  
})
export class AvatarComponent implements OnChanges, OnDestroy {

  @ViewChild('imageAvatar',{static:false}) imgElement: ElementRef;

  @Input()
  public round = true;
  @Input()
  public size: string | number = 50;
  @Input()
  public textSizeRatio = 3;
  @Input()
  public bgColor: string | undefined;
  @Input()
  public fgColor = '#FFF';
  @Input()
  public borderColor: string | undefined;
  @Input()
  public style: Style = {};
  @Input()
  public cornerRadius: string | number = 0;

  @Input()
  public set value(v:any){
    if(v){
        if(v.avatar){
          v.src=v.avatar;
        }
        this._value=new Avatar(v.id,v.name,v.src);
        this.changeDetectionRef.detectChanges();
    }
  }

  public get value(){
    return this._value;
  }

  private _value:IAVatar;

  @Input()
  public initialsSize: string | number = 0;

  @Output()
  public clickOnAvatar: EventEmitter<IAVatar> = new EventEmitter<IAVatar>();

  public isAlive = true;
  public avatarSrc: string | SafeUrl = null;
  public avatarText: string | null = null;
  public avatarStyle: Style = {};
  public hostStyle: Style = {};
  public isImageAvatar=false;

  constructor(
    protected changeDetectionRef: ChangeDetectorRef,
    private avatarService: AvatarService
  ) {}

  public onAvatarClicked(): void {
    this.clickOnAvatar.emit(this.value);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.fetchAvatarSource();
      this.initializeAvatar();
    }
  }

  public fetchAvatarSource(): void {
    if(this.value){
      if (this.avatarService.isTextAvatar(this.value)) {
        this.buildTextAvatar(this.value);
        this.avatarSrc = null;
        this.isImageAvatar=false;
      } else {
        this.isImageAvatar=true;
        this.changeDetectionRef.detectChanges();
        this.buildImageAvatar(this.value);
      }
    }
  }

  public ngOnDestroy(): void {
    this.isAlive = false;
  }

  private initializeAvatar(): void {
    this.hostStyle = {
      width: this.size + 'px',
      height: this.size + 'px'
    };
  }

  private buildTextAvatar(avatarSource: IAVatar): void {
    this.avatarText = avatarSource.getAvatar(+this.initialsSize);
    this.avatarStyle = this.getInitialsStyle(avatarSource.name);
  }

  private buildImageAvatar(avatarSource: IAVatar): void {
    this.avatarStyle = this.getImageStyle();

    if(avatarSource.src.toString().startsWith('data:')){
      let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
      let baseRawString=avatarSource.src.toString();
      let base64=baseRawString.substring(baseRawString.indexOf(",")+1,baseRawString.length);
      this.avatarSrc = '';

       if(this.imgElement&&base64regex.test(base64)){
         this.imgElement.nativeElement.src =avatarSource.src;
       }
    }else{
      this.avatarSrc = avatarSource.src;
    }
  }

  private getInitialsStyle(avatarValue: string): Style {
    return {
      maxWidth: '100%',
      borderRadius: this.round ? '50%' : this.cornerRadius + 'px',
      border: this.borderColor ? '1px solid ' + this.borderColor : '',
      width: this.size + 'px',
      height: this.size + 'px',
      textAlign: 'center',
      textTransform: 'uppercase',
      color: this.fgColor,
      backgroundColor: this.bgColor
        ? this.bgColor
        : this.avatarService.getRandomColor(avatarValue),
      font:
        Math.floor(+this.size / this.textSizeRatio) +
        'px Helvetica, Arial, sans-serif',
      lineHeight: this.size + 'px',
      ...this.style
    };
  }

  private getImageStyle(): Style {
    return {
      maxWidth: '100%',
      borderRadius: this.round ? '50%' : this.cornerRadius + 'px',
      border: this.borderColor ? '1px solid ' + this.borderColor : '',
      width: this.size + 'px',
      height: this.size + 'px',
      ...this.style,
    };
  }
}
