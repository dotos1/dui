/**
 * @fileoverview Module `src/ux/link-preview/components/link-preview-loading-spinner.ts` providing link preview loading spinner definitions and implementation.
 * @zh 模块文件 `src/ux/link-preview/components/link-preview-loading-spinner.ts`，提供链接预览加载中加载指示器相关的定义与实现。
 */

/* tslint:disable:max-line-length */
/**
 * Constant/variable `LinkPreviewLoadingSpinner` defining link preview loading spinner in `src/ux/link-preview/components`.
 * @zh 常量/变量 `LinkPreviewLoadingSpinner`，定义 `src/ux/link-preview/components` 中的链接预览加载中加载指示器。
 */
export const LinkPreviewLoadingSpinner = `
<svg class="lds-message" width="60px"  height="60px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="translate(20 50)">
<circle cx="0" cy="0" r="7" fill="#1B364C" transform="scale(0.99275 0.99275)">
  <animateTransform attributeName="transform" type="scale" begin="-0.375s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform>
</circle>
</g><g transform="translate(40 50)">
<circle cx="0" cy="0" r="7" fill="#285072" transform="scale(0.773605 0.773605)">
  <animateTransform attributeName="transform" type="scale" begin="-0.25s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform>
</circle>
</g><g transform="translate(60 50)">
<circle cx="0" cy="0" r="7" fill="#346B99" transform="scale(0.42525 0.42525)">
  <animateTransform attributeName="transform" type="scale" begin="-0.125s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform>
</circle>
</g><g transform="translate(80 50)">
<circle cx="0" cy="0" r="7" fill="#999999" transform="scale(0.113418 0.113418)">
  <animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform>
</circle>
</g></svg>
`;
