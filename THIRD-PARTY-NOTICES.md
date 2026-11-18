# Third-Party Open Source Notices / 第三方开源软件声明

`@dotos/dui` (internal scope alias: `@dotos1/dui`) is licensed under the **MIT License** (see [`LICENSE`](./LICENSE)).

This distribution declares the following third-party open-source packages as runtime `dependencies` or `peerDependencies`. All direct runtime dependencies use permissive OSI-approved open-source licenses (MIT, Apache-2.0, ISC, 0BSD).

`@dotos/dui`（内部作用域别名：`@dotos1/dui`）采用 **MIT 开源许可证**（详见 [`LICENSE`](./LICENSE)）。以下如实列出本组件库运行时声明的第三方开源依赖及其许可证信息（全部为 MIT / Apache-2.0 / ISC / 0BSD 宽松开源协议）。

---

## 1. Direct Runtime Dependencies (`dependencies`) / 直接运行时依赖

| Package / 包名 | Version Range / 版本范围 | License / 许可证 | Copyright & Upstream Repository / 版权与上游仓库 |
| :--- | :--- | :--- | :--- |
| `buffer` | `^6.0.3` | MIT | Copyright (c) Feross Aboukhadijeh, and other contributors — <https://github.com/feross/buffer> |
| `colornames` | `^1.1.1` | MIT | Copyright (c) Tim Oxley — <https://github.com/timoxley/colornames> |
| `element-resize-detector` | `^1.2.4` | MIT | Copyright (c) Lucas Wiener — <https://github.com/wnr/element-resize-detector> |
| `fuse.js` | `^6.6.2` | Apache-2.0 | Copyright (c) Kiro Risk (<http://kiro.me>) — <https://github.com/krisk/Fuse> |
| `minimatch-browser` | `^1.0.0` | ISC | Copyright (c) Isaac Z. Schlueter & Eugenio Romano — <https://github.com/isaacs/minimatch> |
| `perfect-scrollbar` | `^1.5.5` | MIT | Copyright (c) Hyunje Jun and other contributors — <https://github.com/mdbootstrap/perfect-scrollbar> |
| `tslib` | `^2.3.1` | 0BSD | Copyright (c) Microsoft Corporation — <https://github.com/Microsoft/tslib> |

---

## 2. Host Peer Dependencies (`peerDependencies`) / 宿主对等依赖（由消费端提供，不随本包捆绑分发）

| Package / 包名 | Version Range / 版本范围 | Optional / 可选 | License / 许可证 | Upstream / 上游项目 |
| :--- | :--- | :--- | :--- | :--- |
| `@angular/animations` | `^22.0.0` | No | MIT | Google LLC — <https://github.com/angular/angular> |
| `@angular/cdk` | `^22.0.0` | No | MIT | Google LLC — <https://github.com/angular/components> |
| `@angular/common` | `^22.0.0` | No | MIT | Google LLC — <https://github.com/angular/angular> |
| `@angular/core` | `^22.0.0` | No | MIT | Google LLC — <https://github.com/angular/angular> |
| `@angular/forms` | `^22.0.0` | No | MIT | Google LLC — <https://github.com/angular/angular> |
| `@angular/material` | `^22.0.0` | No | MIT | Google LLC — <https://github.com/angular/components> |
| `@angular/material-moment-adapter` | `^22.0.0` | **Yes** | MIT | Google LLC — <https://github.com/angular/components> |
| `@angular/platform-browser` | `^22.0.0` | No | MIT | Google LLC — <https://github.com/angular/angular> |
| `@angular/router` | `^22.0.0` | No | MIT | Google LLC — <https://github.com/angular/angular> |
| `highlight.js` | `^11.11.1` | **Yes** | BSD-3-Clause | Ivan Sagalaev & highlight.js contributors — <https://github.com/highlightjs/highlight.js> |
| `lodash-es` | `^4.17.21` | No | MIT | OpenJS Foundation and other contributors — <https://github.com/lodash/lodash> |
| `mobx` | `^6.0.0` | No | MIT | Michel Weststrate and MobX contributors — <https://github.com/mobxjs/mobx> |
| `moment` | `^2.29.1` | No | MIT | JS Foundation and other contributors — <https://github.com/moment/moment> |
| `rxjs` | `^7.8.0` | No | Apache-2.0 | Ben Lesh & RxJS contributors — <https://github.com/ReactiveX/rxjs> |

---

## 3. Standard License Texts Summary / 标准许可证摘要

### MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to inclusion of the copyright notice and permission notice in all copies or substantial portions of the Software.

### Apache License 2.0 (`fuse.js`, `rxjs`)
Licensed under the Apache License, Version 2.0. You may obtain a copy of the License at <https://www.apache.org/licenses/LICENSE-2.0>.

### ISC License (`minimatch-browser`)
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the copyright notice and permission notice appear in all copies.

### BSD Zero Clause License (`tslib`)
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

### BSD 3-Clause License (`highlight.js`, optional peer)
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the three standard BSD conditions are met.
