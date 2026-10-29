/**
 * 注销接口（backend.logoutApi）的返回。
 * @zh AuthService.onLogout 推送的就是它；调用方按 success 判断是否真的注销成功。
 */
export interface LogoutResult {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}
