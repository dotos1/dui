
import { NgModule } from '@angular/core';
import { CookieService } from './cookie.service';
import { HighlightTransformService } from './highlight-transform.service';
import { LogService } from './log.service';
import { ScriptLoaderService } from './script-loader.service';
import { ShareParamService } from './share-param.service';

@NgModule({
  providers: [
    CookieService,
    HighlightTransformService,
    LogService,
    ShareParamService,
    ScriptLoaderService],
})
export class CommonServicesModule { }
