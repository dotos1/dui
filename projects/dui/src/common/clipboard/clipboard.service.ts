
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LogService } from '@dotos/dui/core/services';
import { ToastrService } from "@dotos/dui/common/toastr";

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  data: any;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private logService: LogService,
    private notificationService: ToastrService) { }


  isTargetValid(target: HTMLInputElement | HTMLTextAreaElement) {
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      return !target.hasAttribute('disabled');
    }
    return false;
  }


  copyToClipboard(target: HTMLInputElement | HTMLTextAreaElement, message?: string) {
    if (this.isTargetValid(target)) {
      try {
        target.select();
        target.setSelectionRange(0, target.value.length);
        this.document.execCommand('copy');
        this.notify(message);
      } catch (error) {
        this.logService.error(error);
      }
    }
  }

 
  copyContentToClipboard(content: any, message?: string) {
    try {
      this.data= content;
      document.addEventListener('copy', (e: ClipboardEvent) => {
        if(typeof(content)!='string'){
          content=JSON.stringify(content);
        }
        e.clipboardData.setData('text/plain', (content));
        e.preventDefault();
        document.removeEventListener('copy', null);
      });
      document.execCommand('copy');
      if(message){
        this.notify(message);
      }
    } catch (error) {
      this.logService.error(error);
    }
  }

  private notify(message:any) {
    if (message) {
      this.notificationService.success(message);
    }
  }

    get(): any {
        return this.data;
    }

    set(data) {
        this.data = data;
    }

    clear(): any {
        this.data = undefined;
        return this.data;
    }

    isEmpty(): boolean {
        return !this.data;
    }
}
