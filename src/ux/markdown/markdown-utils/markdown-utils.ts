/**
 * @fileoverview Module `src/ux/markdown/markdown-utils/markdown-utils.ts` providing markdown utils definitions and implementation.
 * @zh 模块文件 `src/ux/markdown/markdown-utils/markdown-utils.ts`，提供Markdown文档工具集相关的定义与实现。
 */

/**
 * Executes `removeLeadingHash` to handle remove leading hash.
 * @zh 执行 `removeLeadingHash`，用于移除LeadingHash。
 * @param str - str parameter (`string`) / 字符串参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function removeLeadingHash(str: string): string {
  if (str) {
    return str.replace(/^#+/, '');
  }
  return '';
}

/**
 * Executes `removeTrailingHash` to handle remove trailing hash.
 * @zh 执行 `removeTrailingHash`，用于移除TrailingHash。
 * @param str - str parameter (`string | null`) / 字符串参数（`string | null`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function removeTrailingHash(str: string | null): string {
  if (str) {
    return str.replace(/#.*/, '');
  }
  return '';
}

/**
 * Executes `genHeadingId` to handle gen heading id.
 * @zh 执行 `genHeadingId`，用于genHeading唯一标识。
 * @param str - str parameter (`string`) / 字符串参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function genHeadingId(str: string): string {
  if (str) {
    return removeLeadingHash(
      str
        .replace(/(_|-|\s)+/g, '')
        .replace(/[&+$,/:;=?@"#{}|^¨~[\]`\\*)(%.!'<>]/g, '')
    ).toLowerCase();
  }
  return '';
}

/**
 * Executes `scrollToAnchor` to handle scroll to anchor.
 * @zh 执行 `scrollToAnchor`，用于滚动转换为锚点。
 * @param scope - scope parameter (`HTMLElement`) / scope参数（`HTMLElement`）
 * @param anchor - anchor parameter (`string`) / 锚点参数（`string`）
 * @param tryParent - try parent parameter (`boolean`) / try父级参数（`boolean`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function scrollToAnchor(
  scope: HTMLElement,
  anchor: string,
  tryParent: boolean
): boolean {
  if (scope && anchor) {
    const normalizedAnchor: string = genHeadingId(anchor);
    let headingToJumpTo: Element | null = null;
    const headingWithinComponent = scope.querySelector(
      `[id="${normalizedAnchor}"]`
    );

    if (headingWithinComponent) {
      headingToJumpTo = headingWithinComponent;
    } else if (tryParent) {
      const parent = scope.parentElement;
      if (parent) {
        headingToJumpTo = parent.querySelector(`[id="${normalizedAnchor}"]`);
      }
    }
    if (headingToJumpTo) {
      headingToJumpTo.scrollIntoView({ behavior: 'auto' });
      return true;
    }
  }
  return false;
}

/**
 * Executes `isAnchorLink` to handle is anchor link.
 * @zh 执行 `isAnchorLink`，用于是否为锚点链接。
 * @param anchor - anchor parameter (`HTMLAnchorElement`) / 锚点参数（`HTMLAnchorElement`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isAnchorLink(anchor?: HTMLAnchorElement): boolean {
  if (anchor) {
    const href = anchor.getAttribute('href');
    if (href) {
      return href.startsWith('#');
    }
  }
  return false;
}
/**
 * Constant/variable `RAW_GITHUB_HOSTNAME` defining raw github hostname in `src/ux/markdown/markdown-utils`.
 * @zh 常量/变量 `RAW_GITHUB_HOSTNAME`，定义 `src/ux/markdown/markdown-utils` 中的原始GITHUBHOSTNAME。
 */
const RAW_GITHUB_HOSTNAME = 'raw.githubusercontent.com';

/**
 * Executes `rawGithubHref` to handle raw github href.
 * @zh 执行 `rawGithubHref`，用于原始GithubHref。
 * @param githubHref - github href parameter (`string`) / githubHref参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function rawGithubHref(githubHref?: string): string {
  if (githubHref) {
    try {
      const url: URL = new URL(githubHref);
      if (url.hostname === RAW_GITHUB_HOSTNAME) {
        return url.href;
      } else if (isGithubHref(githubHref)) {
        url.hostname = RAW_GITHUB_HOSTNAME;
        url.pathname = url.pathname.split('/blob', 2).join('');
        return url.href;
      }
    } catch {
      return '';
    }
  }
  return '';
}

/**
 * Executes `isGithubHref` to handle is github href.
 * @zh 执行 `isGithubHref`，用于是否为GithubHref。
 * @param href - href parameter (`string`) / href参数（`string`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isGithubHref(href?: string): boolean {
  try {
    const temp: URL = new URL(href ?? '');
    return temp.hostname === 'github.com';
  } catch {
    return false;
  }
}

/**
 * Executes `isRawGithubHref` to handle is raw github href.
 * @zh 执行 `isRawGithubHref`，用于是否为原始GithubHref。
 * @param href - href parameter (`string`) / href参数（`string`）
 * @returns Result of type `boolean` / 类型为 `boolean` 的返回值
 */
export function isRawGithubHref(href: string = ''): boolean {
  try {
    const temp: URL = new URL(href);
    return temp.hostname === RAW_GITHUB_HOSTNAME;
  } catch {
    return false;
  }
}

/**
 * Executes `renderVideoElements` to handle render video elements.
 * @zh 执行 `renderVideoElements`，用于渲染视频元素列表。
 * @param html - html parameter (`string`) / HTML内容参数（`string`）
 * @returns Result of type `string` / 类型为 `string` 的返回值
 */
export function renderVideoElements(html: string): string {
  const ytLongEmbed =
    /!\[(?:(?:https?:)?(?:\/\/)?)(?:(?:www)?.)?youtube.(?:.+?)\/(?:(?:embed\/)([\w-]{11})(\?[\w%;-]+(?:=[\w%;-]+)?(?:&[\w%;-]+(?:=[\w%;-]+)?)*)?)]/gi;
  const ytLongWatch =
    /!\[(?:(?:https?:)?(?:\/\/)?)(?:(?:www)?.)?youtube.(?:.+?)\/(?:(?:watch\?v=)([\w-]{11})(&[\w%;-]+(?:=[\w%;-]+)?)*)]/gi;
  const ytShort =
    /!\[(?:(?:https?:)?(?:\/\/)?)?youtu.be\/([\w-]{11})\??([\w%;-]+(?:=[\w%;-]+)?(?:&[\w%;-]+(?:=[\w%;-]+)?)*)?]/gi;
  const ytPlaylist =
    /!\[(?:(?:https?:)?(?:\/\/)?)(?:(?:www)?.)?youtube.(?:.+?)\/(?:(?:playlist\?list=)([\w-]{34})(&[\w%;-]+(?:=[\w%;-]+)?)*)]/gi;

  function convert(match: string, id: string, flags: string): string {
    if (flags) {
      id += '?' + flags.replace(/&amp;/gi, '&');
    }
    return `<iframe allow="fullscreen" frameborder="0" src="https://www.youtube.com/embed/${id}"></iframe>`;
  }
  function convertPL(match: string, id: string, flags: string): string {
    if (flags) {
      id += flags.replace(/&amp;/gi, '&');
    }
    return `<iframe allow="fullscreen" frameborder="0" src="https://www.youtube.com/embed/videoseries?list=${id}"></iframe>`;
  }

  return html
    .replace(ytLongWatch, convert)
    .replace(ytLongEmbed, convert)
    .replace(ytShort, convert)
    .replace(ytPlaylist, convertPL);
}
