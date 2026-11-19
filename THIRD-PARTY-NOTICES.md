# Third-Party Open Source Notices / 第三方开源软件声明

`@dotos/dui` (internal scope alias: `@dotos1/dui`) is open-sourced under the **MIT License** (see [`LICENSE`](./LICENSE)).

This document provides complete attributions and license notices for:
1. **Direct runtime `dependencies`** (7 packages);
2. **Host `peerDependencies`** (14 packages provided by the consuming Angular 22 application);
3. **Embedded or adapted open-source components** integrated and upgraded for Angular 22 inside `src/`.

All runtime dependencies and adapted upstream works use permissive, OSI-approved open-source licenses (**MIT**, **Apache-2.0**, **BSD-3-Clause**, **ISC**, **0BSD**).

`@dotos/dui`（内部作用域别名：`@dotos1/dui`）基于 **MIT 开源许可证**发布（详见 [`LICENSE`](./LICENSE)）。本文档完整声明本库涉及的三类第三方开源软件署名与许可证信息：直接运行时依赖（7 项）、宿主对等依赖（14 项）以及 `src/` 内面向 Angular 22 深度适配的开源组件代码（全部为 MIT / Apache-2.0 / BSD-3-Clause / ISC / 0BSD 宽松开源协议）。

---

## 1. Direct Runtime Dependencies (`dependencies` — 7 Packages) / 直接运行时依赖

| Package / 包名 | Version Range / 版本范围 | License / 许可证 | Copyright & Upstream Repository / 版权与上游仓库 |
| :--- | :--- | :--- | :--- |
| `buffer` | `^6.0.3` | MIT | Copyright (c) Feross Aboukhadijeh, and other contributors — <https://github.com/feross/buffer> |
| `colornames` | `^1.1.1` | MIT | Copyright (c) Tim Oxley — <https://github.com/timoxley/colornames> |
| `element-resize-detector` | `^1.2.4` | MIT | Copyright (c) Lucas Wiener — <https://github.com/wnr/element-resize-detector> |
| `fuse.js` | `^6.6.2` | Apache-2.0 | Copyright (c) Kiro Risk (<http://kiro.me>) — <https://github.com/krisk/Fuse> |
| `minimatch-browser` | `^1.0.0` | ISC | Copyright (c) Isaac Z. Schlueter & Eugenio Romano — <https://github.com/isaacs/minimatch> |
| `perfect-scrollbar` | `^1.5.5` | MIT | Copyright (c) Hyunje Jun and other contributors — <https://github.com/mdbootstrap/perfect-scrollbar> |
| `tslib` | `^2.3.1` | 0BSD | Copyright (c) Microsoft Corporation — <https://github.com/microsoft/tslib> |

---

## 2. Host Peer Dependencies (`peerDependencies` — 14 Packages) / 宿主对等依赖（由消费端工程提供）

| Package / 包名 | Version Range / 版本范围 | Optional / 可选 | License / 许可证 | Copyright & Upstream Repository / 版权与上游仓库 |
| :--- | :--- | :--- | :--- | :--- |
| `@angular/animations` | `^22.0.0` | No | MIT | Copyright (c) Google LLC — <https://github.com/angular/angular> |
| `@angular/cdk` | `^22.0.0` | No | MIT | Copyright (c) Google LLC — <https://github.com/angular/components> |
| `@angular/common` | `^22.0.0` | No | MIT | Copyright (c) Google LLC — <https://github.com/angular/angular> |
| `@angular/core` | `^22.0.0` | No | MIT | Copyright (c) Google LLC — <https://github.com/angular/angular> |
| `@angular/forms` | `^22.0.0` | No | MIT | Copyright (c) Google LLC — <https://github.com/angular/angular> |
| `@angular/material` | `^22.0.0` | No | MIT | Copyright (c) Google LLC — <https://github.com/angular/components> |
| `@angular/material-moment-adapter` | `^22.0.0` | **Yes** | MIT | Copyright (c) Google LLC — <https://github.com/angular/components> |
| `@angular/platform-browser` | `^22.0.0` | No | MIT | Copyright (c) Google LLC — <https://github.com/angular/angular> |
| `@angular/router` | `^22.0.0` | No | MIT | Copyright (c) Google LLC — <https://github.com/angular/angular> |
| `highlight.js` | `^11.11.1` | **Yes** | BSD-3-Clause | Copyright (c) Ivan Sagalaev and highlight.js contributors — <https://github.com/highlightjs/highlight.js> |
| `lodash-es` | `^4.17.21` | No | MIT | Copyright (c) OpenJS Foundation and other contributors — <https://github.com/lodash/lodash> |
| `mobx` | `^6.0.0` | No | MIT | Copyright (c) Michel Weststrate and MobX contributors — <https://github.com/mobxjs/mobx> |
| `moment` | `^2.29.1` | No | MIT | Copyright (c) JS Foundation and other contributors — <https://github.com/moment/moment> |
| `rxjs` | `^7.8.0` | No | Apache-2.0 | Copyright (c) Ben Lesh and RxJS contributors — <https://github.com/ReactiveX/rxjs> |

---

## 3. Embedded & Adapted Open-Source Components in `src/` / 源码内嵌与深度适配的开源组件

Several modules inside `src/` contain code originally derived from permissive open-source libraries and subsequently refactored, type-hardened, and maintained for Angular 22, M2 dynamic theming, and strict CSP compliance.

### 3.1 Apache License 2.0 (`Apache-2.0`)

| Upstream Project / 上游项目 | Location in `src/` / 源码路径 | Copyright & Attribution / 版权署名与说明 |
| :--- | :--- | :--- |
| `angular-split` | `src/container/layout` | Copyright (c) Bertrand Gaillard & `angular-split` contributors — <https://github.com/angular-split/angular-split> (Modified for Angular 22 & DUI `LayoutComponent` / `SplitAreaDirective`). |
| Alfresco Application Development Framework (`@alfresco/adf-core`) | `src/data/cardview` | Copyright (c) Alfresco Software, Ltd. — <https://github.com/Alfresco/alfresco-ng2-components> (Modified for DUI `CardViewModule` & Angular 22 Material). |
| Mozilla `pdf.js` (`jpg.js` JPEG Decoder) | `src/util/jpeg/decoder.ts` | Copyright (c) Mozilla Foundation and contributors — <https://github.com/mozilla/pdf.js> (Adapted TypeScript `JpegImage` decoder). |

### 3.2 BSD 3-Clause License (`BSD-3-Clause`)

| Upstream Project / 上游项目 | Location in `src/` / 源码路径 | Copyright & Attribution / 版权署名与说明 |
| :--- | :--- | :--- |
| `jpeg-js` (JPEG Encoder) | `src/util/jpeg/encoder.ts` | Copyright (c) Eugene Ware, Andreas Ritter, and contributors — <https://github.com/jpeg-js/jpeg-js> (Adapted TypeScript `JPEGEncoder`). |

### 3.3 MIT License (`MIT`)

| Upstream Project / 上游项目 | Location in `src/` / 源码路径 | Copyright & Attribution / 版权署名与上游仓库 |
| :--- | :--- | :--- |
| `Golden Layout` | `src/container/dock-layout` | Copyright (c) Hoxton One Ltd & Golden Layout contributors — <https://github.com/golden-layout/golden-layout> |
| `ngx-scrollbar` & `bezier-easing` | `src/common/scrollbar` | Copyright (c) Murhaf Sousli (`ngx-scrollbar`, <https://github.com/MurhafSousli/ngx-scrollbar>); Copyright (c) Gaëtan Renaudeau (`bezier-easing`, <https://github.com/gre/bezier-easing>) |
| `angular2parse` & `@angular/compiler` lexer/parser | `src/core/angular2parse` | Copyright (c) Google LLC (`@angular/compiler`); Copyright (c) `angular2parse` contributors (Modified for zero-`eval` AST resolution) |
| `ngx-color` | `src/common/colorpicker` | Copyright (c) TypeCtrl / Scott Cooper — <https://github.com/scttcper/ngx-color> |
| `@ctrl/tinycolor` | `src/core/color` | Copyright (c) Scott Cooper & Brian Grinstead — <https://github.com/scttcper/tinycolor> |
| `angular2-query-builder` | `src/ux/query-builder` | Copyright (c) Zebulonima / `angular2-query-builder` contributors — <https://github.com/zebulonj/Angular2-QueryBuilder> |
| `ngx-daterangepicker-material` | `src/form/daterangepicker` | Copyright (c) Fetrarij — <https://github.com/fetrarij/ngx-daterangepicker-material> |
| `ngx-toastr` | `src/common/toastr` | Copyright (c) Scott Cooper — <https://github.com/scttcper/ngx-toastr> |
| `@swimlane/ngx-datatable` | `src/data/datatable` | Copyright (c) Swimlane — <https://github.com/swimlane/ngx-datatable> |
| `@circlon/angular-tree-component` | `src/tree` | Copyright (c) 500tech & Circlon Group — <https://github.com/CirclonGroup/angular-tree-component> |
| `angular-gridster2` | `src/container/gridster` | Copyright (c) Tiberiu Zuld — <https://github.com/tiberiuzuld/angular-gridster2> |
| `@ngx-formly/core` | `src/core/form` | Copyright (c) Formly contributors — <https://github.com/ngx-formly/ngx-formly> |
| `mobx-angular` | `src/core/mobx` | Copyright (c) Adam Klein & `mobx-angular` contributors — <https://github.com/mobxjs/mobx-angular> |
| `@ngx-translate/core` | `src/translator` | Copyright (c) Olivier Combe & `@ngx-translate` contributors — <https://github.com/ngx-translate/core> |
| Teradata `@covalent/core` | `src/common/breadcrumbs`, `src/common/dialogs`, `src/common/loading`, `src/common/media`, `src/common/message`, `src/common/notifications`, `src/common/search-box`, `src/data/paging`, `src/ux/code-editor` | Copyright (c) Teradata — <https://github.com/Teradata/covalent> |
| `ngx-drag-drop` | `src/common/dnd` | Copyright (c) Reppners — <https://github.com/reppners/ngx-drag-drop> |
| `ngx-drag-to-select` | `src/common/dragselect` | Copyright (c) Dominic Elm — <https://github.com/d3lm/ngx-drag-to-select> |
| `ng-click-outside` | `src/common/clickout` | Copyright (c) Echeung — <https://github.com/arkon/ng-click-outside> |
| `ng-inline-svg` | `src/common/inline-svg` | Copyright (c) Echeung — <https://github.com/arkon/ng-inline-svg> |
| `ng-svg-icon-sprite` | `src/common/icon-sprite` | Copyright (c) Jan Suwart — <https://github.com/jannicz/ng-svg-icon-sprite> |
| `ng-keyboard-shortcuts` | `src/common/keyboard` | Copyright (c) Omriegar — <https://github.com/omridevk/ng-keyboard-shortcuts> |
| `ngx-perfect-scrollbar` | `src/common/perfect-scrollbar` | Copyright (c) Zefoy — <https://github.com/zefoy/ngx-perfect-scrollbar> |
| `@ncstate/sat-popover` | `src/common/popover` | Copyright (c) Will Howell & NC State — <https://github.com/ncstate-sat/popover> |
| `ngx-print` | `src/common/print` | Copyright (c) Suleimanef — <https://github.com/selemxmn/ngx-print> |
| `angular-resizable-element` | `src/common/resize-element` | Copyright (c) Matt Lewis — <https://github.com/mattlewis92/angular-resizable-element> |
| `@ngmodule/material-carousel` | `src/common/carousel` | Copyright (c) NgModule — <https://github.com/ngmodule/material-carousel> |
| `@mat-datetimepicker/core` | `src/form/date/picker`, `src/form/date/adapter`, `src/form/date/moment` | Copyright (c) Kuncevic — <https://github.com/kuhnroyal/mat-datetimepicker> |
| `@auth0/angular-jwt` | `src/core/auth` | Copyright (c) Auth0, Inc. — <https://github.com/auth0/angular2-jwt> |
| `ngx-avatar` | `src/ux/avatar` | Copyright (c) Haithem Mosbahi — <https://github.com/h2qutc/ngx-avatar> |
| `ngx-multi-window` | `src/ux/multi-window` | Copyright (c) MarioDK — <https://github.com/kyr0/ngx-multi-window> |
| `ngx-os` | `src/ux/windows` | Copyright (c) Promises — <https://github.com/Promises/ngx-os> |

---

## 4. Full Standard License Texts / 标准开源许可证全文

### 4.1 MIT License (`MIT`)

```text
MIT License

Copyright (c) <year> <copyright holders>

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 4.2 Apache License, Version 2.0 (`Apache-2.0`)

```text
Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "{}"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright 2017 Kirollos Risk

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```

### 4.3 BSD 3-Clause License (`BSD-3-Clause`)

```text
BSD 3-Clause License

Copyright (c) <year>, <copyright holder>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

### 4.4 ISC License (`ISC`)

```text
The ISC License

Copyright (c) <year> <owner>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

### 4.5 BSD Zero Clause License (`0BSD`)

```text
BSD Zero Clause License (0BSD)

Copyright (c) <year> by <author>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```
