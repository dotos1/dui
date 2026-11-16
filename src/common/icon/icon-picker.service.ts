/**
 * @fileoverview Module `src/common/icon/icon-picker.service.ts` providing icon picker service definitions and implementation.
 * @zh 模块文件 `src/common/icon/icon-picker.service.ts`，提供图标选择器服务相关的定义与实现。
 */

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@dotos1/dui/translator';
import { Icon, IconType } from './icon';

/**
 * Injectable Angular service `IconPickerService` managing icon picker service state and operations in `src/common/icon`.
 * @zh 可注入的 Angular 服务 `IconPickerService`，管理 `src/common/icon` 中的图标选择器服务状态与业务操作。
 */
@Injectable({ providedIn: 'root' })
export class IconPickerService {
  /**
   * Creates an instance of `IconPickerService` and initializes its dependencies and internal state.
   * @zh 创建 `IconPickerService` 实例，并初始化其依赖项与内部状态。
   * @param http - Injected or initial http (`HttpClient`) / 注入或传入的HTTP（`HttpClient`）
   * @param translate - Injected or initial translate (`TranslateService`) / 注入或传入的翻译（`TranslateService`）
   * @param _apiBase - Injected or initial api base (`string`) / 注入或传入的API接口基础（`string`）
   */
  constructor(
    private http: HttpClient,
    protected translate: TranslateService,
    @Inject('apiBase') private _apiBase: string
  ) {}


  /**
   * Returns the built-in list of selectable icons (currently font-based icons).
   * @zh 返回内置的可选图标列表（当前为字体图标）。
   */
  getIcons(ipIconPack: string): Icon[] {
    let icons: Icon[] = [];
    const faIcons = this.getFaIcons().map((icon) => {
      icon.type = IconType.FONT;
      if (!icon.id) {
        icon.id = icon.name;
      }
      return icon;
    });
    icons = icons.concat(faIcons);
    return icons;
  }

  /**
   * Fetches the list of SVG icons available under the given server-side directory/path.
   * @zh 获取给定服务端目录/路径下可用的 SVG 图标列表。
   */
  getSVGIcons(dir: string, iconpath: string) {
    let params: HttpParams = new HttpParams()
      .set('dir', dir)
      .set('iconpath', iconpath);
    return this.http.get(this._apiBase + '/lib/iconlist', { params: params });
  }

  /**
   * Fetches the list of custom icons available under the given server-side directory/path.
   * @zh 获取给定服务端目录/路径下可用的自定义图标列表。
   */
  getCustomIcons(dir: string, iconpath: string) {
    let params: HttpParams = new HttpParams()
      .set('dir', dir)
      .set('iconpath', iconpath);
    return this.http.get(this._apiBase + '/lib/customIconlist', {
      params: params,
    });
  }

  /**
   * Fetches the list of font icons available under the given server-side directory/path.
   * @zh 获取给定服务端目录/路径下可用的字体图标列表。
   */
  getFontIcons(dir: string, fontpath: string) {
    let params: HttpParams = new HttpParams()
      .set('dir', dir)
      .set('fontpath', fontpath);
    return this.http.get(this._apiBase + '/lib/fonticonlist', {
      params: params,
    });
  }

  /**
   * Executes `getFaIcons` to handle get fa icons.
   * @zh 执行 `getFaIcons`，用于获取Fa图标集合。
   * @returns Result of type `Icon[]` / 类型为 `Icon[]` 的返回值
   */
  private getFaIcons(): Icon[] {
    return [
      {
        name: '10k',
        id: '10k',
        filter: ['Audio&Video'],
      },
      {
        name: '10mp',
        filter: ['Images'],
      },
      {
        name: '11mp',
        filter: ['Images'],
      },
      {
        name: '123',
        filter: ['UI actions'],
      },
      {
        name: '12mp',
        filter: ['Images'],
      },
      {
        name: '13mp',
        filter: ['Images'],
      },
      {
        name: '14mp',
        filter: ['Images'],
      },
      {
        name: '16mp',
        filter: ['Images'],
      },
      {
        name: '17mp',
        filter: ['Images'],
      },
      {
        name: '18_up_rating',
        filter: ['Social'],
      },
      {
        name: '18mp',
        filter: ['Images'],
      },
      {
        name: '19mp',
        filter: ['Images'],
      },
      {
        name: '1k',
        filter: ['Audio&Video', 'av'],
      },
      {
        name: '1k_plus',
        filter: ['Audio&Video', 'av'],
      },
      {
        name: '1x_mobiledata',
        filter: ['Android', 'device'],
      },
      {
        name: '1x_mobiledata_badge',
        filter: ['Android'],
      },
      {
        name: '20mp',
        filter: ['Images'],
      },
      {
        name: '21mp',
        filter: ['Images'],
      },
      {
        name: '22mp',
        filter: ['Images'],
      },
      {
        name: '23mp',
        filter: ['Images'],
      },
      {
        name: '24fps_select',
        filter: ['Images'],
      },
      {
        name: '24mp',
        filter: ['Images'],
      },
      {
        name: '2d',
        filter: ['Audio&Video'],
      },
      {
        name: '2k',
        filter: ['Audio&Video', 'av'],
      },
      {
        name: '2k_plus',
        filter: ['Audio&Video', 'av'],
      },
      {
        name: '2mp',
        filter: ['Images'],
      },
      {
        name: '30fps',
        filter: ['Audio&Video', 'device'],
      },
      {
        name: '30fps_select',
        filter: ['Images'],
      },
      {
        name: '360',
        filter: ['Maps'],
      },
      {
        name: '3d',
        filter: ['Audio&Video'],
      },
      {
        name: '3d_rotation',
        filter: ['Actions'],
      },
      {
        name: '3g_mobiledata',
        filter: ['Android', 'device'],
      },
      {
        name: '3g_mobiledata_badge',
        filter: ['Android'],
      },
      {
        name: '3k',
        filter: ['Audio&Video', 'av'],
      },
      {
        name: '3k_plus',
        filter: ['Audio&Video'],
      },
      {
        name: '3mp',
        filter: ['Images'],
      },
      {
        name: '3p',
        filter: ['Communicate'],
      },
      {
        name: '4g_mobiledata',
        filter: ['Android'],
      },
      {
        name: '4g_mobiledata_badge',
        filter: ['Android'],
      },
      {
        name: '4g_plus_mobiledata',
        filter: ['Android'],
      },
      {
        name: '4k',
        filter: ['Audio&Video'],
      },
      {
        name: '4k_plus',
        filter: ['Audio&Video'],
      },
      {
        name: '4mp',
        filter: ['Images'],
      },
      {
        name: '50mp',
        filter: ['Images'],
      },
      {
        name: '5g',
        filter: ['Android'],
      },
      {
        name: '5g_mobiledata_badge',
        filter: ['Android'],
      },
      {
        name: '5k',
        filter: ['Audio&Video'],
      },
      {
        name: '5k_plus',
        filter: ['Audio&Video'],
      },
      {
        name: '5mp',
        filter: ['Images'],
      },
      {
        name: '60fps',
        filter: ['Audio&Video'],
      },
      {
        name: '60fps_select',
        filter: ['Images'],
      },
      {
        name: '6_ft_apart',
        filter: ['Social'],
      },
      {
        name: '6k',
        filter: ['Audio&Video'],
      },
      {
        name: '6k_plus',
        filter: ['Audio&Video'],
      },
      {
        name: '6mp',
        filter: ['Images'],
      },
      {
        name: '7k',
        filter: ['Audio&Video'],
      },
      {
        name: '7k_plus',
        filter: ['Audio&Video'],
      },
      {
        name: '7mp',
        filter: ['Images'],
      },
      {
        name: '8k',
        filter: ['Audio&Video'],
      },
      {
        name: '8k_plus',
        filter: ['Audio&Video'],
      },
      {
        name: '8mp',
        filter: ['Images'],
      },
      {
        name: '9k',
        filter: ['Audio&Video'],
      },
      {
        name: '9k_plus',
        filter: ['Audio&Video'],
      },
      {
        name: '9mp',
        filter: ['Images'],
      },
      {
        name: 'abc',
        filter: ['UI actions'],
      },
      {
        name: 'ac_unit',
        filter: ['Household'],
      },
      {
        name: 'access_alarm',
        filter: ['device'],
      },
      {
        name: 'access_alarms',
        filter: ['device'],
      },
      {
        name: 'access_time',
        filter: ['device'],
      },
      {
        name: 'access_time_filled',
        filter: ['device'],
      },
      {
        name: 'accessibility',
        filter: ['Actions'],
      },
      {
        name: 'accessibility_new',
        filter: ['Actions'],
      },
      {
        name: 'accessible',
        filter: ['Actions'],
      },
      {
        name: 'accessible_forward',
        filter: ['Actions'],
      },
      {
        name: 'accessible_menu',
        filter: ['UI actions'],
      },
      {
        name: 'account_balance',
        filter: ['Business'],
      },
      {
        name: 'account_balance_wallet',
        filter: ['Business'],
      },
      {
        name: 'account_box',
        filter: ['Actions'],
      },
      {
        name: 'account_child',
        filter: ['Actions'],
      },
      {
        name: 'account_child_invert',
        filter: ['Actions'],
      },
      {
        name: 'account_circle',
        filter: ['Actions'],
      },
      {
        name: 'account_circle_off',
        filter: ['Actions'],
      },
      {
        name: 'account_tree',
        filter: ['Business'],
      },
      {
        name: 'action_key',
        filter: ['UI actions'],
      },
      {
        name: 'activity_zone',
        filter: ['Home'],
      },
      {
        name: 'acupuncture',
        filter: ['Social'],
      },
      {
        name: 'acute',
        filter: ['UI actions'],
      },
      {
        name: 'ad',
        filter: ['Actions'],
      },
      {
        name: 'ad_group',
        filter: ['Actions'],
      },
      {
        name: 'ad_group_off',
        filter: ['Actions'],
      },
      {
        name: 'ad_off',
        filter: ['Actions'],
      },
      {
        name: 'ad_units',
        filter: ['device'],
      },
      {
        name: 'adaptive_audio_mic',
        filter: ['Audio&Video'],
      },
      {
        name: 'adaptive_audio_mic_off',
        filter: ['Audio&Video'],
      },
      {
        name: 'adb',
        filter: ['Android'],
      },
      {
        name: 'add',
        filter: ['UI actions'],
      },
      {
        name: 'add_2',
        filter: ['UI actions'],
      },
      {
        name: 'add_a_photo',
        filter: ['Images'],
      },
      {
        name: 'add_ad',
        filter: ['Actions'],
      },
      {
        name: 'add_alarm',
        filter: ['device'],
      },
      {
        name: 'add_alert',
        filter: ['Actions'],
      },
      {
        name: 'add_box',
        filter: ['UI actions'],
      },
      {
        name: 'add_business',
        filter: ['Business'],
      },
      {
        name: 'add_call',
        filter: ['Communicate'],
      },
      {
        name: 'add_card',
        filter: ['Business'],
      },
      {
        name: 'add_chart',
        filter: ['Business'],
      },
      {
        name: 'add_circle',
        filter: ['UI actions'],
      },
      {
        name: 'add_circle_outline',
        filter: ['content'],
      },
      {
        name: 'add_column_left',
        filter: ['Text'],
      },
      {
        name: 'add_column_right',
        filter: ['Text'],
      },
      {
        name: 'add_comment',
        filter: ['Communicate'],
      },
      {
        name: 'add_diamond',
        filter: ['Hardware'],
      },
      {
        name: 'add_home',
        filter: ['Maps'],
      },
      {
        name: 'add_home_work',
        filter: ['Maps'],
      },
      {
        name: 'add_ic_call',
        filter: ['communication'],
      },
      {
        name: 'add_link',
        filter: ['Text'],
      },
      {
        name: 'add_location',
        filter: ['Maps'],
      },
      {
        name: 'add_location_alt',
        filter: ['Maps'],
      },
      {
        name: 'add_moderator',
        filter: ['Privacy'],
      },
      {
        name: 'add_notes',
        filter: ['Text'],
      },
      {
        name: 'add_photo_alternate',
        filter: ['Images'],
      },
      {
        name: 'add_reaction',
        filter: ['Social'],
      },
      {
        name: 'add_road',
        filter: ['Maps'],
      },
      {
        name: 'add_row_above',
        filter: ['Text'],
      },
      {
        name: 'add_row_below',
        filter: ['Text'],
      },
      {
        name: 'add_shopping_cart',
        filter: ['Business'],
      },
      {
        name: 'add_task',
        filter: ['UI actions'],
      },
      {
        name: 'add_to_drive',
        filter: ['Text'],
      },
      {
        name: 'add_to_home_screen',
        filter: ['device'],
      },
      {
        name: 'add_to_photos',
        filter: ['image'],
      },
      {
        name: 'add_to_queue',
        filter: ['Audio&Video'],
      },
      {
        name: 'add_triangle',
        filter: ['Maps'],
      },
      {
        name: 'addchart',
        filter: ['action'],
      },
      {
        name: 'adf_scanner',
        filter: ['Hardware'],
      },
      {
        name: 'adjust',
        filter: ['Images'],
      },
      {
        name: 'admin_meds',
        filter: ['Social'],
      },
      {
        name: 'admin_panel_settings',
        filter: ['Privacy'],
      },
      {
        name: 'ads_click',
        filter: ['Actions'],
      },
      {
        name: 'agender',
        filter: ['Social'],
      },
      {
        name: 'agriculture',
        filter: ['Transit'],
      },
      {
        name: 'air',
        filter: ['Activities'],
      },
      {
        name: 'air_freshener',
        filter: ['Household'],
      },
      {
        name: 'air_purifier',
        filter: ['Household'],
      },
      {
        name: 'air_purifier_gen',
        filter: ['Household'],
      },
      {
        name: 'airline_seat_flat',
        filter: ['Travel'],
      },
      {
        name: 'airline_seat_flat_angled',
        filter: ['Travel'],
      },
      {
        name: 'airline_seat_individual_suite',
        filter: ['Travel'],
      },
      {
        name: 'airline_seat_legroom_extra',
        filter: ['Travel'],
      },
      {
        name: 'airline_seat_legroom_normal',
        filter: ['Travel'],
      },
      {
        name: 'airline_seat_legroom_reduced',
        filter: ['Travel'],
      },
      {
        name: 'airline_seat_recline_extra',
        filter: ['Travel'],
      },
      {
        name: 'airline_seat_recline_normal',
        filter: ['Travel'],
      },
      {
        name: 'airline_stops',
        filter: ['Maps'],
      },
      {
        name: 'airlines',
        filter: ['Transit'],
      },
      {
        name: 'airplane_ticket',
        filter: ['Travel'],
      },
      {
        name: 'airplanemode_active',
        filter: ['device'],
      },
      {
        name: 'airplanemode_inactive',
        filter: ['Android'],
      },
      {
        name: 'airplay',
        filter: ['Audio&Video'],
      },
      {
        name: 'airport_shuttle',
        filter: ['Transit'],
      },
      {
        name: 'airwave',
        filter: ['Home'],
      },
      {
        name: 'alarm',
        filter: ['Actions'],
      },
      {
        name: 'alarm_add',
        filter: ['Actions'],
      },
      {
        name: 'alarm_off',
        filter: ['Actions'],
      },
      {
        name: 'alarm_on',
        filter: ['Actions'],
      },
      {
        name: 'alarm_pause',
        filter: ['Actions'],
      },
      {
        name: 'alarm_smart_wake',
        filter: ['Actions'],
      },
      {
        name: 'album',
        filter: ['Audio&Video'],
      },
      {
        name: 'align_center',
        filter: ['Text'],
      },
      {
        name: 'align_end',
        filter: ['Text'],
      },
      {
        name: 'align_flex_center',
        filter: ['Text'],
      },
      {
        name: 'align_flex_end',
        filter: ['Text'],
      },
      {
        name: 'align_flex_start',
        filter: ['Text'],
      },
      {
        name: 'align_horizontal_center',
        filter: ['Text'],
      },
      {
        name: 'align_horizontal_left',
        filter: ['Text'],
      },
      {
        name: 'align_horizontal_right',
        filter: ['Text'],
      },
      {
        name: 'align_items_stretch',
        filter: ['Text'],
      },
      {
        name: 'align_justify_center',
        filter: ['Text'],
      },
      {
        name: 'align_justify_flex_end',
        filter: ['Text'],
      },
      {
        name: 'align_justify_flex_start',
        filter: ['Text'],
      },
      {
        name: 'align_justify_space_around',
        filter: ['Text'],
      },
      {
        name: 'align_justify_space_between',
        filter: ['Text'],
      },
      {
        name: 'align_justify_space_even',
        filter: ['Text'],
      },
      {
        name: 'align_justify_stretch',
        filter: ['Text'],
      },
      {
        name: 'align_self_stretch',
        filter: ['Text'],
      },
      {
        name: 'align_space_around',
        filter: ['Text'],
      },
      {
        name: 'align_space_between',
        filter: ['Text'],
      },
      {
        name: 'align_space_even',
        filter: ['Text'],
      },
      {
        name: 'align_start',
        filter: ['Text'],
      },
      {
        name: 'align_stretch',
        filter: ['Text'],
      },
      {
        name: 'align_vertical_bottom',
        filter: ['Text'],
      },
      {
        name: 'align_vertical_center',
        filter: ['Text'],
      },
      {
        name: 'align_vertical_top',
        filter: ['Text'],
      },
      {
        name: 'all_inbox',
        filter: ['Communicate'],
      },
      {
        name: 'all_inclusive',
        filter: ['Actions'],
      },
      {
        name: 'all_match',
        filter: ['UI actions'],
      },
      {
        name: 'all_out',
        filter: ['Actions'],
      },
      {
        name: 'allergies',
        filter: ['Social'],
      },
      {
        name: 'allergy',
        filter: ['Social'],
      },
      {
        name: 'alt_route',
        filter: ['Maps'],
      },
      {
        name: 'alternate_email',
        filter: ['Communicate'],
      },
      {
        name: 'altitude',
        filter: ['Social'],
      },
      {
        name: 'ambulance',
        filter: ['Transit'],
      },
      {
        name: 'amend',
        filter: ['UI actions'],
      },
      {
        name: 'amp_stories',
        filter: ['Text'],
      },
      {
        name: 'analytics',
        filter: ['Business'],
      },
      {
        name: 'anchor',
        filter: ['Actions'],
      },
      {
        name: 'android',
        filter: ['Android'],
      },
      {
        name: 'android_cell_4_bar',
        filter: ['Android'],
      },
      {
        name: 'android_cell_4_bar_alert',
        filter: ['Android'],
      },
      {
        name: 'android_cell_4_bar_off',
        filter: ['Android'],
      },
      {
        name: 'android_cell_4_bar_plus',
        filter: ['Android'],
      },
      {
        name: 'android_cell_5_bar',
        filter: ['Android'],
      },
      {
        name: 'android_cell_5_bar_alert',
        filter: ['Android'],
      },
      {
        name: 'android_cell_5_bar_off',
        filter: ['Android'],
      },
      {
        name: 'android_cell_5_bar_plus',
        filter: ['Android'],
      },
      {
        name: 'android_cell_dual_4_bar',
        filter: ['Android'],
      },
      {
        name: 'android_cell_dual_4_bar_alert',
        filter: ['Android'],
      },
      {
        name: 'android_cell_dual_4_bar_plus',
        filter: ['Android'],
      },
      {
        name: 'android_cell_dual_5_bar',
        filter: ['Android'],
      },
      {
        name: 'android_cell_dual_5_bar_alert',
        filter: ['Android'],
      },
      {
        name: 'android_cell_dual_5_bar_plus',
        filter: ['Android'],
      },
      {
        name: 'android_wifi_3_bar',
        filter: ['Android'],
      },
      {
        name: 'android_wifi_3_bar_alert',
        filter: ['Android'],
      },
      {
        name: 'android_wifi_3_bar_lock',
        filter: ['Android'],
      },
      {
        name: 'android_wifi_3_bar_off',
        filter: ['Android'],
      },
      {
        name: 'android_wifi_3_bar_plus',
        filter: ['Android'],
      },
      {
        name: 'android_wifi_3_bar_question',
        filter: ['Android'],
      },
      {
        name: 'android_wifi_4_bar',
        filter: ['Android'],
      },
      {
        name: 'android_wifi_4_bar_alert',
        filter: ['Android'],
      },
      {
        name: 'android_wifi_4_bar_lock',
        filter: ['Android'],
      },
      {
        name: 'android_wifi_4_bar_off',
        filter: ['Android'],
      },
      {
        name: 'android_wifi_4_bar_plus',
        filter: ['Android'],
      },
      {
        name: 'android_wifi_4_bar_question',
        filter: ['Android'],
      },
      {
        name: 'animated_images',
        filter: ['Audio&Video'],
      },
      {
        name: 'animation',
        filter: ['Images'],
      },
      {
        name: 'announcement',
        filter: ['action'],
      },
      {
        name: 'aod',
        filter: ['device'],
      },
      {
        name: 'aod_tablet',
        filter: ['Hardware'],
      },
      {
        name: 'aod_watch',
        filter: ['Hardware'],
      },
      {
        name: 'apartment',
        filter: ['Travel'],
      },
      {
        name: 'api',
        filter: ['Actions'],
      },
      {
        name: 'apk_document',
        filter: ['Android'],
      },
      {
        name: 'apk_install',
        filter: ['Android'],
      },
      {
        name: 'app_badging',
        filter: ['UI actions'],
      },
      {
        name: 'app_blocking',
        filter: ['action'],
      },
      {
        name: 'app_registration',
        filter: ['UI actions'],
      },
      {
        name: 'app_settings_alt',
        filter: ['navigation'],
      },
      {
        name: 'app_shortcut',
        filter: ['action'],
      },
      {
        name: 'apparel',
        filter: ['Household'],
      },
      {
        name: 'approval',
        filter: ['Actions'],
      },
      {
        name: 'approval_delegation',
        filter: ['Actions'],
      },
      {
        name: 'approval_delegation_off',
        filter: ['Actions'],
      },
      {
        name: 'apps',
        filter: ['UI actions'],
      },
      {
        name: 'apps_outage',
        filter: ['UI actions'],
      },
      {
        name: 'aq',
        filter: ['Home'],
      },
      {
        name: 'aq_indoor',
        filter: ['Home'],
      },
      {
        name: 'ar_on_you',
        filter: ['Audio&Video'],
      },
      {
        name: 'ar_stickers',
        filter: ['Audio&Video'],
      },
      {
        name: 'architecture',
        filter: ['Activities'],
      },
      {
        name: 'archive',
        filter: ['Text'],
      },
      {
        name: 'area_chart',
        filter: ['Business'],
      },
      {
        name: 'arming_countdown',
        filter: ['Home'],
      },
      {
        name: 'arrow_and_edge',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_back',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_back_2',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_back_ios',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_back_ios_new',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_circle_down',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_circle_left',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_circle_right',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_circle_up',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_cool_down',
        filter: ['Activities'],
      },
      {
        name: 'arrow_downward',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_downward_alt',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_drop_down',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_drop_down_circle',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_drop_up',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_forward',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_forward_ios',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_insert',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_left',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_left_alt',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_menu_close',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_menu_open',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_or_edge',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_outward',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_range',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_right',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_right_alt',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_selector_tool',
        filter: ['Actions'],
      },
      {
        name: 'arrow_shape_up',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_shape_up_stack',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_shape_up_stack_2',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_split',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_top_left',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_top_right',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_upload_progress',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_upload_ready',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_upward',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_upward_alt',
        filter: ['UI actions'],
      },
      {
        name: 'arrow_warm_up',
        filter: ['Activities'],
      },
      {
        name: 'arrows_input',
        filter: ['UI actions'],
      },
      {
        name: 'arrows_more_down',
        filter: ['Home'],
      },
      {
        name: 'arrows_more_up',
        filter: ['Home'],
      },
      {
        name: 'arrows_output',
        filter: ['UI actions'],
      },
      {
        name: 'arrows_outward',
        filter: ['UI actions'],
      },
      {
        name: 'art_track',
        filter: ['Audio&Video'],
      },
      {
        name: 'article',
        filter: ['Text'],
      },
      {
        name: 'article_person',
        filter: ['Text'],
      },
      {
        name: 'article_shortcut',
        filter: ['Text'],
      },
      {
        name: 'artist',
        filter: ['Audio&Video'],
      },
      {
        name: 'aspect_ratio',
        filter: ['Images'],
      },
      {
        name: 'assessment',
        filter: ['action'],
      },
      {
        name: 'assignment',
        filter: ['Text'],
      },
      {
        name: 'assignment_add',
        filter: ['Text'],
      },
      {
        name: 'assignment_globe',
        filter: ['Text'],
      },
      {
        name: 'assignment_ind',
        filter: ['Text'],
      },
      {
        name: 'assignment_late',
        filter: ['Text'],
      },
      {
        name: 'assignment_return',
        filter: ['Text'],
      },
      {
        name: 'assignment_returned',
        filter: ['Text'],
      },
      {
        name: 'assignment_turned_in',
        filter: ['Text'],
      },
      {
        name: 'assist_walker',
        filter: ['Maps'],
      },
      {
        name: 'assistant',
        filter: ['image'],
      },
      {
        name: 'assistant_device',
        filter: ['Hardware'],
      },
      {
        name: 'assistant_direction',
        filter: ['UI actions'],
      },
      {
        name: 'assistant_navigation',
        filter: ['UI actions'],
      },
      {
        name: 'assistant_on_hub',
        filter: ['Home'],
      },
      {
        name: 'assistant_photo',
        filter: ['image'],
      },
      {
        name: 'assured_workload',
        filter: ['Privacy'],
      },
      {
        name: 'asterisk',
        filter: ['Text'],
      },
      {
        name: 'atm',
        filter: ['Business'],
      },
      {
        name: 'atr',
        filter: ['Business'],
      },
      {
        name: 'attach_email',
        filter: ['Communicate'],
      },
      {
        name: 'attach_file',
        filter: ['Text'],
      },
      {
        name: 'attach_file_add',
        filter: ['Text'],
      },
      {
        name: 'attach_file_off',
        filter: ['Text'],
      },
      {
        name: 'attach_money',
        filter: ['Business'],
      },
      {
        name: 'attachment',
        filter: ['Text'],
      },
      {
        name: 'attractions',
        filter: ['Travel'],
      },
      {
        name: 'attribution',
        filter: ['Communicate'],
      },
      {
        name: 'audio_description',
        filter: ['Audio&Video'],
      },
      {
        name: 'audio_file',
        filter: ['Audio&Video'],
      },
      {
        name: 'audio_video_receiver',
        filter: ['Hardware'],
      },
      {
        name: 'audiotrack',
        filter: ['image'],
      },
      {
        name: 'auto_awesome',
        filter: ['image'],
      },
      {
        name: 'auto_awesome_mosaic',
        filter: ['Images'],
      },
      {
        name: 'auto_awesome_motion',
        filter: ['Images'],
      },
      {
        name: 'auto_delete',
        filter: ['Actions'],
      },
      {
        name: 'auto_fix_high',
        filter: ['image'],
      },
      {
        name: 'auto_fix_normal',
        filter: ['image'],
      },
      {
        name: 'auto_fix_off',
        filter: ['image'],
      },
      {
        name: 'auto_graph',
        filter: ['editor'],
      },
      {
        name: 'auto_mode',
        filter: ['home'],
      },
      {
        name: 'auto_read_pause',
        filter: ['Communicate'],
      },
      {
        name: 'auto_read_play',
        filter: ['Communicate'],
      },
      {
        name: 'auto_stories',
        filter: ['Images'],
      },
      {
        name: 'auto_stories_off',
        filter: ['Images'],
      },
      {
        name: 'auto_towing',
        filter: ['Transit'],
      },
      {
        name: 'auto_transmission',
        filter: ['Transit'],
      },
      {
        name: 'autofps_select',
        filter: ['Images'],
      },
      {
        name: 'automation',
        filter: ['Text'],
      },
      {
        name: 'autopause',
        filter: ['Audio&Video'],
      },
      {
        name: 'autoplay',
        filter: ['Audio&Video'],
      },
      {
        name: 'autorenew',
        filter: ['UI actions'],
      },
      {
        name: 'autostop',
        filter: ['Audio&Video'],
      },
      {
        name: 'av1',
        filter: ['Audio&Video'],
      },
      {
        name: 'av_timer',
        filter: ['Audio&Video'],
      },
      {
        name: 'avc',
        filter: ['Audio&Video'],
      },
      {
        name: 'avg_pace',
        filter: ['Activities'],
      },
      {
        name: 'avg_time',
        filter: ['Activities'],
      },
      {
        name: 'award_meal',
        filter: ['Maps'],
      },
      {
        name: 'award_star',
        filter: ['Actions'],
      },
      {
        name: 'azm',
        filter: ['Activities'],
      },
      {
        name: 'baby_changing_station',
        filter: ['Maps'],
      },
      {
        name: 'back_hand',
        filter: ['Household'],
      },
      {
        name: 'back_to_tab',
        filter: ['UI actions'],
      },
      {
        name: 'background_dot_large',
        filter: ['Images'],
      },
      {
        name: 'background_dot_small',
        filter: ['Images'],
      },
      {
        name: 'background_grid_small',
        filter: ['Images'],
      },
      {
        name: 'background_replace',
        filter: ['Actions'],
      },
      {
        name: 'backlight_high',
        filter: ['Android'],
      },
      {
        name: 'backlight_high_off',
        filter: ['Android'],
      },
      {
        name: 'backlight_low',
        filter: ['Android'],
      },
      {
        name: 'backpack',
        filter: ['Activities'],
      },
      {
        name: 'backspace',
        filter: ['UI actions'],
      },
      {
        name: 'backup',
        filter: ['Actions'],
      },
      {
        name: 'backup_table',
        filter: ['Actions'],
      },
      {
        name: 'badge',
        filter: ['Privacy'],
      },
      {
        name: 'badge_critical_battery',
        filter: ['Android'],
      },
      {
        name: 'badminton',
        filter: ['Activities'],
      },
      {
        name: 'bakery_dining',
        filter: ['Travel'],
      },
      {
        name: 'balance',
        filter: ['Hardware'],
      },
      {
        name: 'balcony',
        filter: ['Household'],
      },
      {
        name: 'ballot',
        filter: ['Text'],
      },
      {
        name: 'bar_chart',
        filter: ['Business'],
      },
      {
        name: 'bar_chart_4_bars',
        filter: ['Business'],
      },
      {
        name: 'bar_chart_off',
        filter: ['Business'],
      },
      {
        name: 'barcode',
        filter: ['Business'],
      },
      {
        name: 'barcode_reader',
        filter: ['Business'],
      },
      {
        name: 'barcode_scanner',
        filter: ['Business'],
      },
      {
        name: 'barefoot',
        filter: ['Social'],
      },
      {
        name: 'batch_prediction',
        filter: ['Actions'],
      },
      {
        name: 'bath_bedrock',
        filter: ['Travel'],
      },
      {
        name: 'bath_outdoor',
        filter: ['Activities'],
      },
      {
        name: 'bath_private',
        filter: ['Activities'],
      },
      {
        name: 'bath_public_large',
        filter: ['Activities'],
      },
      {
        name: 'bath_soak',
        filter: ['Household'],
      },
      {
        name: 'bathroom',
        filter: ['Household'],
      },
      {
        name: 'bathtub',
        filter: ['Household'],
      },
      {
        name: 'battery_0_bar',
        filter: ['Android'],
      },
      {
        name: 'battery_1_bar',
        filter: ['Android'],
      },
      {
        name: 'battery_20',
        filter: ['device'],
      },
      {
        name: 'battery_2_bar',
        filter: ['Android'],
      },
      {
        name: 'battery_30',
        filter: ['device'],
      },
      {
        name: 'battery_3_bar',
        filter: ['Android'],
      },
      {
        name: 'battery_4_bar',
        filter: ['Android'],
      },
      {
        name: 'battery_50',
        filter: ['device'],
      },
      {
        name: 'battery_5_bar',
        filter: ['Android'],
      },
      {
        name: 'battery_60',
        filter: ['device'],
      },
      {
        name: 'battery_6_bar',
        filter: ['Android'],
      },
      {
        name: 'battery_80',
        filter: ['device'],
      },
      {
        name: 'battery_90',
        filter: ['device'],
      },
      {
        name: 'battery_alert',
        filter: ['Android'],
      },
      {
        name: 'battery_android_0',
        filter: ['Android'],
      },
      {
        name: 'battery_android_1',
        filter: ['Android'],
      },
      {
        name: 'battery_android_2',
        filter: ['Android'],
      },
      {
        name: 'battery_android_3',
        filter: ['Android'],
      },
      {
        name: 'battery_android_4',
        filter: ['Android'],
      },
      {
        name: 'battery_android_5',
        filter: ['Android'],
      },
      {
        name: 'battery_android_6',
        filter: ['Android'],
      },
      {
        name: 'battery_android_alert',
        filter: ['Android'],
      },
      {
        name: 'battery_android_bolt',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_1',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_2',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_3',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_4',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_5',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_6',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_alert',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_bolt',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_full',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_plus',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_question',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_share',
        filter: ['Android'],
      },
      {
        name: 'battery_android_frame_shield',
        filter: ['Android'],
      },
      {
        name: 'battery_android_full',
        filter: ['Android'],
      },
      {
        name: 'battery_android_plus',
        filter: ['Android'],
      },
      {
        name: 'battery_android_question',
        filter: ['Android'],
      },
      {
        name: 'battery_android_share',
        filter: ['Android'],
      },
      {
        name: 'battery_android_shield',
        filter: ['Android'],
      },
      {
        name: 'battery_change',
        filter: ['Android'],
      },
      {
        name: 'battery_charging_20',
        filter: ['Android'],
      },
      {
        name: 'battery_charging_30',
        filter: ['Android'],
      },
      {
        name: 'battery_charging_50',
        filter: ['Android'],
      },
      {
        name: 'battery_charging_60',
        filter: ['Android'],
      },
      {
        name: 'battery_charging_80',
        filter: ['Android'],
      },
      {
        name: 'battery_charging_90',
        filter: ['Android', 'device'],
      },
      {
        name: 'battery_charging_full',
        filter: ['Android', 'device'],
      },
      {
        name: 'battery_error',
        filter: ['Android'],
      },
      {
        name: 'battery_full',
        filter: ['Android'],
      },
      {
        name: 'battery_full_alt',
        filter: ['Android'],
      },
      {
        name: 'battery_horiz_000',
        filter: ['Home'],
      },
      {
        name: 'battery_horiz_050',
        filter: ['Home'],
      },
      {
        name: 'battery_horiz_075',
        filter: ['Home'],
      },
      {
        name: 'battery_low',
        filter: ['Android'],
      },
      {
        name: 'battery_plus',
        filter: ['Android'],
      },
      {
        name: 'battery_profile',
        filter: ['Home'],
      },
      {
        name: 'battery_saver',
        filter: ['Android'],
      },
      {
        name: 'battery_share',
        filter: ['Android'],
      },
      {
        name: 'battery_status_good',
        filter: ['Android'],
      },
      {
        name: 'battery_std',
        filter: ['device'],
      },
      {
        name: 'battery_unknown',
        filter: ['Android'],
      },
      {
        name: 'battery_very_low',
        filter: ['Android'],
      },
      {
        name: 'beach_access',
        filter: ['Travel'],
      },
      {
        name: 'bed',
        filter: ['Household'],
      },
      {
        name: 'bedroom_baby',
        filter: ['Household'],
      },
      {
        name: 'bedroom_child',
        filter: ['Household'],
      },
      {
        name: 'bedroom_parent',
        filter: ['Household'],
      },
      {
        name: 'bedtime',
        filter: ['Social'],
      },
      {
        name: 'bedtime_off',
        filter: ['Social'],
      },
      {
        name: 'beenhere',
        filter: ['Maps'],
      },
      {
        name: 'beer_meal',
        filter: ['Travel'],
      },
      {
        name: 'bento',
        filter: ['Travel'],
      },
      {
        name: 'bia',
        filter: ['Activities'],
      },
      {
        name: 'bid_landscape',
        filter: ['Business'],
      },
      {
        name: 'bid_landscape_disabled',
        filter: ['Business'],
      },
      {
        name: 'bigtop_updates',
        filter: ['Android'],
      },
      {
        name: 'bike_dock',
        filter: ['Transit'],
      },
      {
        name: 'bike_lane',
        filter: ['Transit'],
      },
      {
        name: 'bike_scooter',
        filter: ['Transit'],
      },
      {
        name: 'biotech',
        filter: ['Activities'],
      },
      {
        name: 'blanket',
        filter: ['Household'],
      },
      {
        name: 'blender',
        filter: ['Household'],
      },
      {
        name: 'blind',
        filter: ['Social'],
      },
      {
        name: 'blinds',
        filter: ['Household'],
      },
      {
        name: 'blinds_closed',
        filter: ['Household'],
      },
      {
        name: 'block',
        filter: ['UI actions'],
      },
      {
        name: 'block_flipped',
        filter: ['content'],
      },
      {
        name: 'blood_pressure',
        filter: ['Social'],
      },
      {
        name: 'bloodtype',
        filter: ['Social'],
      },
      {
        name: 'bluetooth',
        filter: ['Android'],
      },
      {
        name: 'bluetooth_audio',
        filter: ['notification'],
      },
      {
        name: 'bluetooth_connected',
        filter: ['Android'],
      },
      {
        name: 'bluetooth_disabled',
        filter: ['Android'],
      },
      {
        name: 'bluetooth_drive',
        filter: ['Android'],
      },
      {
        name: 'bluetooth_searching',
        filter: ['Android'],
      },
      {
        name: 'blur_circular',
        filter: ['Images'],
      },
      {
        name: 'blur_linear',
        filter: ['Images'],
      },
      {
        name: 'blur_medium',
        filter: ['Images'],
      },
      {
        name: 'blur_off',
        filter: ['Images'],
      },
      {
        name: 'blur_on',
        filter: ['Images'],
      },
      {
        name: 'blur_short',
        filter: ['Images'],
      },
      {
        name: 'boat_bus',
        filter: ['Transit'],
      },
      {
        name: 'boat_railway',
        filter: ['Transit'],
      },
      {
        name: 'body_fat',
        filter: ['Social'],
      },
      {
        name: 'body_system',
        filter: ['Social'],
      },
      {
        name: 'bolt',
        filter: ['UI actions'],
      },
      {
        name: 'bomb',
        filter: ['Social'],
      },
      {
        name: 'book',
        filter: ['Text'],
      },
      {
        name: 'book_2',
        filter: ['Text'],
      },
      {
        name: 'book_3',
        filter: ['Text'],
      },
      {
        name: 'book_4',
        filter: ['Text'],
      },
      {
        name: 'book_5',
        filter: ['Text'],
      },
      {
        name: 'book_6',
        filter: ['Text'],
      },
      {
        name: 'book_online',
        filter: ['action'],
      },
      {
        name: 'book_ribbon',
        filter: ['Actions'],
      },
      {
        name: 'bookmark',
        filter: ['Actions'],
      },
      {
        name: 'bookmark_add',
        filter: ['Actions'],
      },
      {
        name: 'bookmark_added',
        filter: ['Actions'],
      },
      {
        name: 'bookmark_bag',
        filter: ['Actions'],
      },
      {
        name: 'bookmark_border',
        filter: ['action'],
      },
      {
        name: 'bookmark_check',
        filter: ['Actions'],
      },
      {
        name: 'bookmark_flag',
        filter: ['Actions'],
      },
      {
        name: 'bookmark_heart',
        filter: ['Actions'],
      },
      {
        name: 'bookmark_manager',
        filter: ['Actions'],
      },
      {
        name: 'bookmark_remove',
        filter: ['Actions'],
      },
      {
        name: 'bookmark_star',
        filter: ['Actions'],
      },
      {
        name: 'bookmarks',
        filter: ['Actions'],
      },
      {
        name: 'books_movies_and_music',
        filter: ['Activities'],
      },
      {
        name: 'border_all',
        filter: ['Text'],
      },
      {
        name: 'border_bottom',
        filter: ['Text'],
      },
      {
        name: 'border_clear',
        filter: ['Text'],
      },
      {
        name: 'border_color',
        filter: ['Text'],
      },
      {
        name: 'border_horizontal',
        filter: ['Text'],
      },
      {
        name: 'border_inner',
        filter: ['Text'],
      },
      {
        name: 'border_left',
        filter: ['Text'],
      },
      {
        name: 'border_outer',
        filter: ['Text'],
      },
      {
        name: 'border_right',
        filter: ['Text'],
      },
      {
        name: 'border_style',
        filter: ['Text'],
      },
      {
        name: 'border_top',
        filter: ['Text'],
      },
      {
        name: 'border_vertical',
        filter: ['Text'],
      },
      {
        name: 'borg',
        filter: ['UI actions'],
      },
      {
        name: 'bottom_app_bar',
        filter: ['UI actions'],
      },
      {
        name: 'bottom_drawer',
        filter: ['UI actions'],
      },
      {
        name: 'bottom_navigation',
        filter: ['UI actions'],
      },
      {
        name: 'bottom_panel_close',
        filter: ['UI actions'],
      },
      {
        name: 'bottom_panel_open',
        filter: ['UI actions'],
      },
      {
        name: 'bottom_right_click',
        filter: ['UI actions'],
      },
      {
        name: 'bottom_sheets',
        filter: ['UI actions'],
      },
      {
        name: 'box',
        filter: ['Business'],
      },
      {
        name: 'box_add',
        filter: ['Business'],
      },
      {
        name: 'box_edit',
        filter: ['Business'],
      },
      {
        name: 'boy',
        filter: ['Social'],
      },
      {
        name: 'brand_awareness',
        filter: ['Audio&Video'],
      },
      {
        name: 'brand_family',
        filter: ['Text'],
      },
      {
        name: 'branding_watermark',
        filter: ['Audio&Video'],
      },
      {
        name: 'breakfast_dining',
        filter: ['Travel'],
      },
      {
        name: 'breaking_news',
        filter: ['Text'],
      },
      {
        name: 'breaking_news_alt_1',
        filter: ['Text'],
      },
      {
        name: 'breastfeeding',
        filter: ['Social'],
      },
      {
        name: 'brick',
        filter: ['Social'],
      },
      {
        name: 'briefcase_meal',
        filter: ['Business'],
      },
      {
        name: 'brightness_1',
        filter: ['Images'],
      },
      {
        name: 'brightness_2',
        filter: ['Images'],
      },
      {
        name: 'brightness_3',
        filter: ['Images'],
      },
      {
        name: 'brightness_4',
        filter: ['Images'],
      },
      {
        name: 'brightness_5',
        filter: ['Images'],
      },
      {
        name: 'brightness_6',
        filter: ['Images'],
      },
      {
        name: 'brightness_7',
        filter: ['Images'],
      },
      {
        name: 'brightness_alert',
        filter: ['Android'],
      },
      {
        name: 'brightness_auto',
        filter: ['Android'],
      },
      {
        name: 'brightness_empty',
        filter: ['Android'],
      },
      {
        name: 'brightness_high',
        filter: ['device'],
      },
      {
        name: 'brightness_low',
        filter: ['device'],
      },
      {
        name: 'brightness_medium',
        filter: ['Android'],
      },
      {
        name: 'bring_your_own_ip',
        filter: ['Social'],
      },
      {
        name: 'broadcast_on_home',
        filter: ['Audio&Video'],
      },
      {
        name: 'broadcast_on_personal',
        filter: ['Audio&Video'],
      },
      {
        name: 'broken_image',
        filter: ['Images'],
      },
      {
        name: 'browse',
        filter: ['Actions'],
      },
      {
        name: 'browse_activity',
        filter: ['UI actions'],
      },
      {
        name: 'browse_gallery',
        filter: ['UI actions'],
      },
      {
        name: 'browser_not_supported',
        filter: ['hardware'],
      },
      {
        name: 'browser_updated',
        filter: ['Hardware'],
      },
      {
        name: 'brunch_dining',
        filter: ['Travel'],
      },
      {
        name: 'brush',
        filter: ['Images'],
      },
      {
        name: 'bubble',
        filter: ['UI actions'],
      },
      {
        name: 'bubble_chart',
        filter: ['Business'],
      },
      {
        name: 'bubbles',
        filter: ['UI actions'],
      },
      {
        name: 'bucket_check',
        filter: ['UI actions'],
      },
      {
        name: 'bug_report',
        filter: ['Actions'],
      },
      {
        name: 'build',
        filter: ['Actions'],
      },
      {
        name: 'build_circle',
        filter: ['Actions'],
      },
      {
        name: 'bungalow',
        filter: ['Travel'],
      },
      {
        name: 'burst_mode',
        filter: ['Images'],
      },
      {
        name: 'bus_alert',
        filter: ['Transit'],
      },
      {
        name: 'bus_railway',
        filter: ['Transit'],
      },
      {
        name: 'business',
        filter: ['communication'],
      },
      {
        name: 'business_center',
        filter: ['Maps'],
      },
      {
        name: 'business_chip',
        filter: ['Text'],
      },
      {
        name: 'business_messages',
        filter: ['Communicate'],
      },
      {
        name: 'buttons_alt',
        filter: ['UI actions'],
      },
      {
        name: 'cabin',
        filter: ['Travel'],
      },
      {
        name: 'cable',
        filter: ['Android'],
      },
      {
        name: 'cable_car',
        filter: ['Transit'],
      },
      {
        name: 'cached',
        filter: ['UI actions'],
      },
      {
        name: 'cadence',
        filter: ['Activities'],
      },
      {
        name: 'cake',
        filter: ['Activities'],
      },
      {
        name: 'cake_add',
        filter: ['Activities'],
      },
      {
        name: 'calculate',
        filter: ['Business'],
      },
      {
        name: 'calendar_add_on',
        filter: ['Communicate'],
      },
      {
        name: 'calendar_apps_script',
        filter: ['Communicate'],
      },
      {
        name: 'calendar_check',
        filter: ['Actions'],
      },
      {
        name: 'calendar_clock',
        filter: ['Actions'],
      },
      {
        name: 'calendar_lock',
        filter: ['Actions'],
      },
      {
        name: 'calendar_meal',
        filter: ['Social'],
      },
      {
        name: 'calendar_meal_2',
        filter: ['Maps'],
      },
      {
        name: 'calendar_month',
        filter: ['Actions'],
      },
      {
        name: 'calendar_today',
        filter: ['Actions'],
      },
      {
        name: 'calendar_view_day',
        filter: ['Text'],
      },
      {
        name: 'calendar_view_month',
        filter: ['Text'],
      },
      {
        name: 'calendar_view_week',
        filter: ['Text'],
      },
      {
        name: 'call',
        filter: ['Communicate'],
      },
      {
        name: 'call_end',
        filter: ['Communicate'],
      },
      {
        name: 'call_log',
        filter: ['Communicate'],
      },
      {
        name: 'call_made',
        filter: ['Communicate'],
      },
      {
        name: 'call_merge',
        filter: ['Communicate'],
      },
      {
        name: 'call_missed',
        filter: ['Communicate'],
      },
      {
        name: 'call_missed_outgoing',
        filter: ['Communicate'],
      },
      {
        name: 'call_quality',
        filter: ['Communicate'],
      },
      {
        name: 'call_received',
        filter: ['Communicate'],
      },
      {
        name: 'call_split',
        filter: ['Communicate'],
      },
      {
        name: 'call_to_action',
        filter: ['Audio&Video'],
      },
      {
        name: 'camera',
        filter: ['Images'],
      },
      {
        name: 'camera_alt',
        filter: ['image'],
      },
      {
        name: 'camera_enhance',
        filter: ['action'],
      },
      {
        name: 'camera_front',
        filter: ['image'],
      },
      {
        name: 'camera_indoor',
        filter: ['Household'],
      },
      {
        name: 'camera_outdoor',
        filter: ['Household'],
      },
      {
        name: 'camera_rear',
        filter: ['image'],
      },
      {
        name: 'camera_roll',
        filter: ['Images'],
      },
      {
        name: 'camera_video',
        filter: ['Hardware'],
      },
      {
        name: 'cameraswitch',
        filter: ['Android'],
      },
      {
        name: 'campaign',
        filter: ['Activities'],
      },
      {
        name: 'camping',
        filter: ['Activities'],
      },
      {
        name: 'cancel',
        filter: ['UI actions'],
      },
      {
        name: 'cancel_presentation',
        filter: ['Communicate'],
      },
      {
        name: 'cancel_schedule_send',
        filter: ['Communicate'],
      },
      {
        name: 'candle',
        filter: ['Social'],
      },
      {
        name: 'candlestick_chart',
        filter: ['Business'],
      },
      {
        name: 'cannabis',
        filter: ['Social'],
      },
      {
        name: 'captive_portal',
        filter: ['UI actions'],
      },
      {
        name: 'capture',
        filter: ['UI actions'],
      },
      {
        name: 'car_crash',
        filter: ['Transit'],
      },
      {
        name: 'car_defrost_left',
        filter: ['Transit'],
      },
      {
        name: 'car_defrost_low_left',
        filter: ['Transit'],
      },
      {
        name: 'car_defrost_low_right',
        filter: ['Transit'],
      },
      {
        name: 'car_defrost_mid_left',
        filter: ['Transit'],
      },
      {
        name: 'car_defrost_mid_low_left',
        filter: ['Transit'],
      },
      {
        name: 'car_defrost_mid_low_right',
        filter: ['Transit'],
      },
      {
        name: 'car_defrost_mid_right',
        filter: ['Transit'],
      },
      {
        name: 'car_defrost_right',
        filter: ['Transit'],
      },
      {
        name: 'car_fan_low_left',
        filter: ['Transit'],
      },
      {
        name: 'car_fan_low_mid_left',
        filter: ['Transit'],
      },
      {
        name: 'car_fan_low_right',
        filter: ['Transit'],
      },
      {
        name: 'car_fan_mid_left',
        filter: ['Transit'],
      },
      {
        name: 'car_fan_mid_low_right',
        filter: ['Transit'],
      },
      {
        name: 'car_fan_mid_right',
        filter: ['Transit'],
      },
      {
        name: 'car_fan_recirculate',
        filter: ['Transit'],
      },
      {
        name: 'car_gear',
        filter: ['Transit'],
      },
      {
        name: 'car_lock',
        filter: ['Transit'],
      },
      {
        name: 'car_mirror_heat',
        filter: ['Transit'],
      },
      {
        name: 'car_rental',
        filter: ['Travel'],
      },
      {
        name: 'car_repair',
        filter: ['Travel'],
      },
      {
        name: 'car_tag',
        filter: ['Transit'],
      },
      {
        name: 'card_giftcard',
        filter: ['action'],
      },
      {
        name: 'card_membership',
        filter: ['Business'],
      },
      {
        name: 'card_travel',
        filter: ['Business'],
      },
      {
        name: 'cardio_load',
        filter: ['Social'],
      },
      {
        name: 'cardiology',
        filter: ['Social'],
      },
      {
        name: 'cards',
        filter: ['UI actions'],
      },
      {
        name: 'cards_star',
        filter: ['Business'],
      },
      {
        name: 'carpenter',
        filter: ['Travel'],
      },
      {
        name: 'carry_on_bag',
        filter: ['Travel'],
      },
      {
        name: 'carry_on_bag_checked',
        filter: ['Travel'],
      },
      {
        name: 'carry_on_bag_inactive',
        filter: ['Travel'],
      },
      {
        name: 'carry_on_bag_question',
        filter: ['Travel'],
      },
      {
        name: 'cases',
        filter: ['Business'],
      },
      {
        name: 'casino',
        filter: ['Travel'],
      },
      {
        name: 'cast',
        filter: ['Hardware'],
      },
      {
        name: 'cast_connected',
        filter: ['Hardware'],
      },
      {
        name: 'cast_for_education',
        filter: ['Hardware'],
      },
      {
        name: 'cast_pause',
        filter: ['Hardware'],
      },
      {
        name: 'cast_warning',
        filter: ['Hardware'],
      },
      {
        name: 'castle',
        filter: ['Maps'],
      },
      {
        name: 'catching_pokemon',
        filter: ['social'],
      },
      {
        name: 'category',
        filter: ['Actions'],
      },
      {
        name: 'category_search',
        filter: ['UI actions'],
      },
      {
        name: 'celebration',
        filter: ['Actions'],
      },
      {
        name: 'cell_merge',
        filter: ['Text'],
      },
      {
        name: 'cell_tower',
        filter: ['Communicate'],
      },
      {
        name: 'cell_wifi',
        filter: ['Communicate'],
      },
      {
        name: 'center_focus_strong',
        filter: ['Images'],
      },
      {
        name: 'center_focus_weak',
        filter: ['Images'],
      },
      {
        name: 'chair',
        filter: ['Household'],
      },
      {
        name: 'chair_alt',
        filter: ['Household'],
      },
      {
        name: 'chair_counter',
        filter: ['Household'],
      },
      {
        name: 'chair_fireplace',
        filter: ['Household'],
      },
      {
        name: 'chair_umbrella',
        filter: ['Household'],
      },
      {
        name: 'chalet',
        filter: ['Travel'],
      },
      {
        name: 'change_circle',
        filter: ['UI actions'],
      },
      {
        name: 'change_history',
        filter: ['Actions'],
      },
      {
        name: 'charger',
        filter: ['Android'],
      },
      {
        name: 'charging_station',
        filter: ['places'],
      },
      {
        name: 'chart_data',
        filter: ['Business'],
      },
      {
        name: 'chat',
        filter: ['Communicate'],
      },
      {
        name: 'chat_add_on',
        filter: ['Communicate'],
      },
      {
        name: 'chat_apps_script',
        filter: ['Communicate'],
      },
      {
        name: 'chat_bubble',
        filter: ['Communicate'],
      },
      {
        name: 'chat_bubble_outline',
        filter: ['communication'],
      },
      {
        name: 'chat_dashed',
        filter: ['Communicate'],
      },
      {
        name: 'chat_error',
        filter: ['Communicate'],
      },
      {
        name: 'chat_info',
        filter: ['Communicate'],
      },
      {
        name: 'chat_paste_go',
        filter: ['Communicate'],
      },
      {
        name: 'chat_paste_go_2',
        filter: ['Communicate'],
      },
      {
        name: 'check',
        filter: ['UI actions'],
      },
      {
        name: 'check_box',
        filter: ['UI actions'],
      },
      {
        name: 'check_box_outline_blank',
        filter: ['UI actions'],
      },
      {
        name: 'check_circle',
        filter: ['UI actions'],
      },
      {
        name: 'check_circle_outline',
        filter: ['action'],
      },
      {
        name: 'check_circle_unread',
        filter: ['UI actions'],
      },
      {
        name: 'check_in_out',
        filter: ['Activities'],
      },
      {
        name: 'check_indeterminate_small',
        filter: ['UI actions'],
      },
      {
        name: 'check_small',
        filter: ['UI actions'],
      },
      {
        name: 'checkbook',
        filter: ['Business'],
      },
      {
        name: 'checked_bag',
        filter: ['Travel'],
      },
      {
        name: 'checked_bag_question',
        filter: ['Travel'],
      },
      {
        name: 'checklist',
        filter: ['Text'],
      },
      {
        name: 'checklist_rtl',
        filter: ['Text'],
      },
      {
        name: 'checkroom',
        filter: ['Household'],
      },
      {
        name: 'cheer',
        filter: ['Social'],
      },
      {
        name: 'chef_hat',
        filter: ['Social'],
      },
      {
        name: 'chess',
        filter: ['Social'],
      },
      {
        name: 'chess_bishop',
        filter: ['Social'],
      },
      {
        name: 'chess_bishop_2',
        filter: ['Social'],
      },
      {
        name: 'chess_king',
        filter: ['Social'],
      },
      {
        name: 'chess_king_2',
        filter: ['Social'],
      },
      {
        name: 'chess_knight',
        filter: ['Social'],
      },
      {
        name: 'chess_pawn',
        filter: ['Social'],
      },
      {
        name: 'chess_pawn_2',
        filter: ['Social'],
      },
      {
        name: 'chess_queen',
        filter: ['Social'],
      },
      {
        name: 'chess_rook',
        filter: ['Social'],
      },
      {
        name: 'chevron_backward',
        filter: ['UI actions'],
      },
      {
        name: 'chevron_forward',
        filter: ['UI actions'],
      },
      {
        name: 'chevron_left',
        filter: ['UI actions'],
      },
      {
        name: 'chevron_right',
        filter: ['UI actions'],
      },
      {
        name: 'child_care',
        filter: ['Household'],
      },
      {
        name: 'child_friendly',
        filter: ['Travel'],
      },
      {
        name: 'child_hat',
        filter: ['Social'],
      },
      {
        name: 'chip_extraction',
        filter: ['UI actions'],
      },
      {
        name: 'chips',
        filter: ['UI actions'],
      },
      {
        name: 'chrome_reader_mode',
        filter: ['Actions'],
      },
      {
        name: 'chromecast_2',
        filter: ['Home'],
      },
      {
        name: 'chromecast_device',
        filter: ['Hardware'],
      },
      {
        name: 'chronic',
        filter: ['UI actions'],
      },
      {
        name: 'church',
        filter: ['Maps'],
      },
      {
        name: 'cinematic_blur',
        filter: ['Audio&Video'],
      },
      {
        name: 'circle',
        filter: ['Images'],
      },
      {
        name: 'circle_notifications',
        filter: ['Actions'],
      },
      {
        name: 'circles',
        filter: ['Actions'],
      },
      {
        name: 'circles_ext',
        filter: ['Actions'],
      },
      {
        name: 'clarify',
        filter: ['Text'],
      },
      {
        name: 'class',
        filter: ['action'],
      },
      {
        name: 'clean_hands',
        filter: ['Social'],
      },
      {
        name: 'cleaning',
        filter: ['Activities'],
      },
      {
        name: 'cleaning_bucket',
        filter: ['Home'],
      },
      {
        name: 'cleaning_services',
        filter: ['Maps'],
      },
      {
        name: 'clear',
        filter: ['content'],
      },
      {
        name: 'clear_all',
        filter: ['UI actions'],
      },
      {
        name: 'clear_day',
        filter: ['Social'],
      },
      {
        name: 'climate_mini_split',
        filter: ['Home'],
      },
      {
        name: 'clinical_notes',
        filter: ['Social'],
      },
      {
        name: 'clock_arrow_down',
        filter: ['UI actions'],
      },
      {
        name: 'clock_arrow_up',
        filter: ['UI actions'],
      },
      {
        name: 'clock_loader_10',
        filter: ['UI actions'],
      },
      {
        name: 'clock_loader_20',
        filter: ['UI actions'],
      },
      {
        name: 'clock_loader_40',
        filter: ['UI actions'],
      },
      {
        name: 'clock_loader_60',
        filter: ['UI actions'],
      },
      {
        name: 'clock_loader_80',
        filter: ['UI actions'],
      },
      {
        name: 'clock_loader_90',
        filter: ['UI actions'],
      },
      {
        name: 'close',
        filter: ['UI actions'],
      },
      {
        name: 'close_fullscreen',
        filter: ['UI actions'],
      },
      {
        name: 'close_small',
        filter: ['UI actions'],
      },
      {
        name: 'closed_caption',
        filter: ['Audio&Video'],
      },
      {
        name: 'closed_caption_add',
        filter: ['Audio&Video'],
      },
      {
        name: 'closed_caption_disabled',
        filter: ['Audio&Video'],
      },
      {
        name: 'closed_caption_off',
        filter: ['av'],
      },
      {
        name: 'cloud',
        filter: ['Text'],
      },
      {
        name: 'cloud_alert',
        filter: ['Text'],
      },
      {
        name: 'cloud_circle',
        filter: ['Text'],
      },
      {
        name: 'cloud_done',
        filter: ['Text'],
      },
      {
        name: 'cloud_download',
        filter: ['Text'],
      },
      {
        name: 'cloud_lock',
        filter: ['Text'],
      },
      {
        name: 'cloud_off',
        filter: ['Text'],
      },
      {
        name: 'cloud_queue',
        filter: ['file'],
      },
      {
        name: 'cloud_sync',
        filter: ['Text'],
      },
      {
        name: 'cloud_upload',
        filter: ['Text'],
      },
      {
        name: 'cloudy_snowing',
        filter: ['home'],
      },
      {
        name: 'co2',
        filter: ['Social'],
      },
      {
        name: 'co_present',
        filter: ['Communicate'],
      },
      {
        name: 'code',
        filter: ['Actions'],
      },
      {
        name: 'code_blocks',
        filter: ['Actions'],
      },
      {
        name: 'code_off',
        filter: ['Actions'],
      },
      {
        name: 'coffee',
        filter: ['Household'],
      },
      {
        name: 'coffee_maker',
        filter: ['Household'],
      },
      {
        name: 'cognition',
        filter: ['Social'],
      },
      {
        name: 'cognition_2',
        filter: ['Social'],
      },
      {
        name: 'collapse_all',
        filter: ['UI actions'],
      },
      {
        name: 'collapse_content',
        filter: ['UI actions'],
      },
      {
        name: 'collections',
        filter: ['image'],
      },
      {
        name: 'collections_bookmark',
        filter: ['Actions'],
      },
      {
        name: 'color_lens',
        filter: ['image'],
      },
      {
        name: 'colorize',
        filter: ['Images'],
      },
      {
        name: 'colors',
        filter: ['Text'],
      },
      {
        name: 'combine_columns',
        filter: ['Text'],
      },
      {
        name: 'comedy_mask',
        filter: ['Social'],
      },
      {
        name: 'comic_bubble',
        filter: ['Social'],
      },
      {
        name: 'comment',
        filter: ['Communicate'],
      },
      {
        name: 'comment_bank',
        filter: ['Communicate'],
      },
      {
        name: 'comments_disabled',
        filter: ['Communicate'],
      },
      {
        name: 'commit',
        filter: ['Actions'],
      },
      {
        name: 'communication',
        filter: ['Social'],
      },
      {
        name: 'communities',
        filter: ['Social'],
      },
      {
        name: 'commute',
        filter: ['Transit'],
      },
      {
        name: 'compare',
        filter: ['Images'],
      },
      {
        name: 'compare_arrows',
        filter: ['UI actions'],
      },
      {
        name: 'compass_calibration',
        filter: ['Maps'],
      },
      {
        name: 'component_exchange',
        filter: ['Actions'],
      },
      {
        name: 'compost',
        filter: ['Social'],
      },
      {
        name: 'compress',
        filter: ['UI actions'],
      },
      {
        name: 'computer',
        filter: ['Hardware'],
      },
      {
        name: 'computer_arrow_up',
        filter: ['Hardware'],
      },
      {
        name: 'computer_cancel',
        filter: ['Hardware'],
      },
      {
        name: 'concierge',
        filter: ['Travel'],
      },
      {
        name: 'conditions',
        filter: ['Social'],
      },
      {
        name: 'confirmation_number',
        filter: ['Activities'],
      },
      {
        name: 'congenital',
        filter: ['Social'],
      },
      {
        name: 'connect_without_contact',
        filter: ['Social'],
      },
      {
        name: 'connected_tv',
        filter: ['Hardware'],
      },
      {
        name: 'connecting_airports',
        filter: ['Maps'],
      },
      {
        name: 'construction',
        filter: ['Activities'],
      },
      {
        name: 'contact_emergency',
        filter: ['Communicate'],
      },
      {
        name: 'contact_mail',
        filter: ['Communicate'],
      },
      {
        name: 'contact_page',
        filter: ['Text'],
      },
      {
        name: 'contact_phone',
        filter: ['Communicate'],
      },
      {
        name: 'contact_support',
        filter: ['Communicate'],
      },
      {
        name: 'contactless',
        filter: ['Business'],
      },
      {
        name: 'contactless_off',
        filter: ['Business'],
      },
      {
        name: 'contacts',
        filter: ['Communicate'],
      },
      {
        name: 'contacts_product',
        filter: ['Actions'],
      },
      {
        name: 'content_copy',
        filter: ['Text'],
      },
      {
        name: 'content_cut',
        filter: ['Text'],
      },
      {
        name: 'content_paste',
        filter: ['Text'],
      },
      {
        name: 'content_paste_go',
        filter: ['Text'],
      },
      {
        name: 'content_paste_off',
        filter: ['Text'],
      },
      {
        name: 'content_paste_search',
        filter: ['Text'],
      },
      {
        name: 'contextual_token',
        filter: ['Android'],
      },
      {
        name: 'contextual_token_add',
        filter: ['Android'],
      },
      {
        name: 'contract',
        filter: ['Text'],
      },
      {
        name: 'contract_delete',
        filter: ['Text'],
      },
      {
        name: 'contract_edit',
        filter: ['Text'],
      },
      {
        name: 'contrast',
        filter: ['Images'],
      },
      {
        name: 'contrast_circle',
        filter: ['Images'],
      },
      {
        name: 'contrast_rtl_off',
        filter: ['Images'],
      },
      {
        name: 'contrast_square',
        filter: ['Images'],
      },
      {
        name: 'control_camera',
        filter: ['Audio&Video'],
      },
      {
        name: 'control_point',
        filter: ['image'],
      },
      {
        name: 'control_point_duplicate',
        filter: ['Images'],
      },
      {
        name: 'controller_gen',
        filter: ['Household'],
      },
      {
        name: 'conversation',
        filter: ['Social'],
      },
      {
        name: 'conversion_path',
        filter: ['Business'],
      },
      {
        name: 'conversion_path_off',
        filter: ['Business'],
      },
      {
        name: 'convert_to_text',
        filter: ['Text'],
      },
      {
        name: 'conveyor_belt',
        filter: ['Business'],
      },
      {
        name: 'cookie',
        filter: ['Social'],
      },
      {
        name: 'cookie_off',
        filter: ['Social'],
      },
      {
        name: 'cooking',
        filter: ['Household'],
      },
      {
        name: 'cool_to_dry',
        filter: ['Home'],
      },
      {
        name: 'copy_all',
        filter: ['Text'],
      },
      {
        name: 'copyright',
        filter: ['Business'],
      },
      {
        name: 'coronavirus',
        filter: ['Social'],
      },
      {
        name: 'corporate_fare',
        filter: ['Business'],
      },
      {
        name: 'cottage',
        filter: ['Travel'],
      },
      {
        name: 'counter_0',
        filter: ['Text'],
      },
      {
        name: 'counter_1',
        filter: ['Text'],
      },
      {
        name: 'counter_2',
        filter: ['Text'],
      },
      {
        name: 'counter_3',
        filter: ['Text'],
      },
      {
        name: 'counter_4',
        filter: ['Text'],
      },
      {
        name: 'counter_5',
        filter: ['Text'],
      },
      {
        name: 'counter_6',
        filter: ['Text'],
      },
      {
        name: 'counter_7',
        filter: ['Text'],
      },
      {
        name: 'counter_8',
        filter: ['Text'],
      },
      {
        name: 'counter_9',
        filter: ['Text'],
      },
      {
        name: 'countertops',
        filter: ['Household'],
      },
      {
        name: 'create',
        filter: ['content'],
      },
      {
        name: 'create_new_folder',
        filter: ['UI actions'],
      },
      {
        name: 'credit_card',
        filter: ['Business'],
      },
      {
        name: 'credit_card_clock',
        filter: ['Business'],
      },
      {
        name: 'credit_card_gear',
        filter: ['Business'],
      },
      {
        name: 'credit_card_heart',
        filter: ['Business'],
      },
      {
        name: 'credit_card_off',
        filter: ['Business'],
      },
      {
        name: 'credit_score',
        filter: ['Business'],
      },
      {
        name: 'crib',
        filter: ['Household'],
      },
      {
        name: 'crisis_alert',
        filter: ['Maps'],
      },
      {
        name: 'crop',
        filter: ['Images'],
      },
      {
        name: 'crop_16_9',
        filter: ['Images'],
      },
      {
        name: 'crop_3_2',
        filter: ['Images'],
      },
      {
        name: 'crop_5_4',
        filter: ['Images'],
      },
      {
        name: 'crop_7_5',
        filter: ['Images'],
      },
      {
        name: 'crop_9_16',
        filter: ['Images'],
      },
      {
        name: 'crop_din',
        filter: ['image'],
      },
      {
        name: 'crop_free',
        filter: ['Images'],
      },
      {
        name: 'crop_landscape',
        filter: ['Images'],
      },
      {
        name: 'crop_original',
        filter: ['image'],
      },
      {
        name: 'crop_portrait',
        filter: ['Images'],
      },
      {
        name: 'crop_rotate',
        filter: ['Images'],
      },
      {
        name: 'crop_square',
        filter: ['Images'],
      },
      {
        name: 'crossword',
        filter: ['Social'],
      },
      {
        name: 'crowdsource',
        filter: ['Social'],
      },
      {
        name: 'crown',
        filter: ['Social'],
      },
      {
        name: 'cruelty_free',
        filter: ['Social'],
      },
      {
        name: 'css',
        filter: ['UI actions'],
      },
      {
        name: 'csv',
        filter: ['Text'],
      },
      {
        name: 'currency_bitcoin',
        filter: ['Business'],
      },
      {
        name: 'currency_exchange',
        filter: ['Business'],
      },
      {
        name: 'currency_franc',
        filter: ['Business'],
      },
      {
        name: 'currency_lira',
        filter: ['Business'],
      },
      {
        name: 'currency_pound',
        filter: ['Business'],
      },
      {
        name: 'currency_ruble',
        filter: ['Business'],
      },
      {
        name: 'currency_rupee',
        filter: ['Business'],
      },
      {
        name: 'currency_rupee_circle',
        filter: ['Business'],
      },
      {
        name: 'currency_yen',
        filter: ['Business'],
      },
      {
        name: 'currency_yuan',
        filter: ['Business'],
      },
      {
        name: 'curtains',
        filter: ['Household'],
      },
      {
        name: 'curtains_closed',
        filter: ['Household'],
      },
      {
        name: 'custom_typography',
        filter: ['Text'],
      },
      {
        name: 'cycle',
        filter: ['UI actions'],
      },
      {
        name: 'cyclone',
        filter: ['Social'],
      },
      {
        name: 'dangerous',
        filter: ['Actions'],
      },
      {
        name: 'dark_mode',
        filter: ['Android'],
      },
      {
        name: 'dashboard',
        filter: ['Text'],
      },
      {
        name: 'dashboard_2',
        filter: ['Text'],
      },
      {
        name: 'dashboard_customize',
        filter: ['Text'],
      },
      {
        name: 'data_alert',
        filter: ['UI actions'],
      },
      {
        name: 'data_array',
        filter: ['Text'],
      },
      {
        name: 'data_check',
        filter: ['UI actions'],
      },
      {
        name: 'data_exploration',
        filter: ['Business'],
      },
      {
        name: 'data_info_alert',
        filter: ['UI actions'],
      },
      {
        name: 'data_loss_prevention',
        filter: ['Actions'],
      },
      {
        name: 'data_object',
        filter: ['Text'],
      },
      {
        name: 'data_saver_off',
        filter: ['device'],
      },
      {
        name: 'data_saver_on',
        filter: ['Android'],
      },
      {
        name: 'data_table',
        filter: ['Business'],
      },
      {
        name: 'data_thresholding',
        filter: ['UI actions'],
      },
      {
        name: 'data_usage',
        filter: ['Android'],
      },
      {
        name: 'database',
        filter: ['Business'],
      },
      {
        name: 'database_off',
        filter: ['Business'],
      },
      {
        name: 'database_search',
        filter: ['Business'],
      },
      {
        name: 'database_upload',
        filter: ['Business'],
      },
      {
        name: 'dataset',
        filter: ['UI actions'],
      },
      {
        name: 'dataset_linked',
        filter: ['UI actions'],
      },
      {
        name: 'date_range',
        filter: ['Actions'],
      },
      {
        name: 'deblur',
        filter: ['Images'],
      },
      {
        name: 'deceased',
        filter: ['Social'],
      },
      {
        name: 'decimal_decrease',
        filter: ['Text'],
      },
      {
        name: 'decimal_increase',
        filter: ['Text'],
      },
      {
        name: 'deck',
        filter: ['Household'],
      },
      {
        name: 'dehaze',
        filter: ['Images'],
      },
      {
        name: 'delete',
        filter: ['UI actions'],
      },
      {
        name: 'delete_forever',
        filter: ['UI actions'],
      },
      {
        name: 'delete_history',
        filter: ['Actions'],
      },
      {
        name: 'delete_outline',
        filter: ['action'],
      },
      {
        name: 'delete_sweep',
        filter: ['UI actions'],
      },
      {
        name: 'delivery_dining',
        filter: ['maps'],
      },
      {
        name: 'delivery_truck_bolt',
        filter: ['Business'],
      },
      {
        name: 'delivery_truck_speed',
        filter: ['Business'],
      },
      {
        name: 'demography',
        filter: ['Social'],
      },
      {
        name: 'density_large',
        filter: ['UI actions'],
      },
      {
        name: 'density_medium',
        filter: ['UI actions'],
      },
      {
        name: 'density_small',
        filter: ['UI actions'],
      },
      {
        name: 'dentistry',
        filter: ['Social'],
      },
      {
        name: 'departure_board',
        filter: ['Transit'],
      },
      {
        name: 'deployed_code',
        filter: ['UI actions'],
      },
      {
        name: 'deployed_code_account',
        filter: ['UI actions'],
      },
      {
        name: 'deployed_code_alert',
        filter: ['UI actions'],
      },
      {
        name: 'deployed_code_history',
        filter: ['UI actions'],
      },
      {
        name: 'deployed_code_update',
        filter: ['UI actions'],
      },
      {
        name: 'dermatology',
        filter: ['Social'],
      },
      {
        name: 'description',
        filter: ['Text'],
      },
      {
        name: 'deselect',
        filter: ['Text'],
      },
      {
        name: 'design_services',
        filter: ['Text'],
      },
      {
        name: 'desk',
        filter: ['Household'],
      },
      {
        name: 'deskphone',
        filter: ['Hardware'],
      },
      {
        name: 'desktop_access_disabled',
        filter: ['Hardware'],
      },
      {
        name: 'desktop_cloud',
        filter: ['Hardware'],
      },
      {
        name: 'desktop_cloud_stack',
        filter: ['Hardware'],
      },
      {
        name: 'desktop_landscape',
        filter: ['UI actions'],
      },
      {
        name: 'desktop_landscape_add',
        filter: ['UI actions'],
      },
      {
        name: 'desktop_mac',
        filter: ['Hardware'],
      },
      {
        name: 'desktop_portrait',
        filter: ['UI actions'],
      },
      {
        name: 'desktop_windows',
        filter: ['Hardware'],
      },
      {
        name: 'destruction',
        filter: ['Social'],
      },
      {
        name: 'details',
        filter: ['Images'],
      },
      {
        name: 'detection_and_zone',
        filter: ['Home'],
      },
      {
        name: 'detector',
        filter: ['Home'],
      },
      {
        name: 'detector_alarm',
        filter: ['Home'],
      },
      {
        name: 'detector_battery',
        filter: ['Home'],
      },
      {
        name: 'detector_co',
        filter: ['Home'],
      },
      {
        name: 'detector_offline',
        filter: ['Home'],
      },
      {
        name: 'detector_smoke',
        filter: ['Household'],
      },
      {
        name: 'detector_status',
        filter: ['Home'],
      },
      {
        name: 'developer_board',
        filter: ['Hardware'],
      },
      {
        name: 'developer_board_off',
        filter: ['Hardware'],
      },
      {
        name: 'developer_guide',
        filter: ['Actions'],
      },
      {
        name: 'developer_mode',
        filter: ['device'],
      },
      {
        name: 'developer_mode_tv',
        filter: ['Hardware'],
      },
      {
        name: 'device_band',
        filter: ['Hardware'],
      },
      {
        name: 'device_hub',
        filter: ['Hardware'],
      },
      {
        name: 'device_thermostat',
        filter: ['Hardware'],
      },
      {
        name: 'device_unknown',
        filter: ['hardware'],
      },
      {
        name: 'devices',
        filter: ['Hardware'],
      },
      {
        name: 'devices_fold',
        filter: ['Android'],
      },
      {
        name: 'devices_fold_2',
        filter: ['Android'],
      },
      {
        name: 'devices_off',
        filter: ['Hardware'],
      },
      {
        name: 'devices_other',
        filter: ['Hardware'],
      },
      {
        name: 'devices_wearables',
        filter: ['Hardware'],
      },
      {
        name: 'dew_point',
        filter: ['Social'],
      },
      {
        name: 'diagnosis',
        filter: ['Text'],
      },
      {
        name: 'diagonal_line',
        filter: ['Text'],
      },
      {
        name: 'dialer_sip',
        filter: ['Communicate'],
      },
      {
        name: 'dialogs',
        filter: ['UI actions'],
      },
      {
        name: 'dialpad',
        filter: ['Communicate'],
      },
      {
        name: 'diamond',
        filter: ['Social'],
      },
      {
        name: 'diamond_shine',
        filter: ['Social'],
      },
      {
        name: 'dictionary',
        filter: ['Text'],
      },
      {
        name: 'difference',
        filter: ['Text'],
      },
      {
        name: 'digital_out_of_home',
        filter: ['Audio&Video'],
      },
      {
        name: 'digital_wellbeing',
        filter: ['Social'],
      },
      {
        name: 'dine_heart',
        filter: ['Household'],
      },
      {
        name: 'dine_in',
        filter: ['Social'],
      },
      {
        name: 'dine_lamp',
        filter: ['Household'],
      },
      {
        name: 'dining',
        filter: ['Household'],
      },
      {
        name: 'dinner_dining',
        filter: ['Travel'],
      },
      {
        name: 'directions',
        filter: ['Maps'],
      },
      {
        name: 'directions_alt',
        filter: ['Maps'],
      },
      {
        name: 'directions_alt_off',
        filter: ['Maps'],
      },
      {
        name: 'directions_bike',
        filter: ['Transit'],
      },
      {
        name: 'directions_boat',
        filter: ['Transit'],
      },
      {
        name: 'directions_boat_filled',
        filter: ['maps'],
      },
      {
        name: 'directions_bus',
        filter: ['Transit'],
      },
      {
        name: 'directions_bus_filled',
        filter: ['maps'],
      },
      {
        name: 'directions_car',
        filter: ['Transit'],
      },
      {
        name: 'directions_car_filled',
        filter: ['maps'],
      },
      {
        name: 'directions_off',
        filter: ['Maps'],
      },
      {
        name: 'directions_railway',
        filter: ['Transit'],
      },
      {
        name: 'directions_railway_2',
        filter: ['Transit'],
      },
      {
        name: 'directions_railway_filled',
        filter: ['maps'],
      },
      {
        name: 'directions_run',
        filter: ['Transit'],
      },
      {
        name: 'directions_subway',
        filter: ['Transit'],
      },
      {
        name: 'directions_subway_filled',
        filter: ['maps'],
      },
      {
        name: 'directions_transit',
        filter: ['maps'],
      },
      {
        name: 'directions_transit_filled',
        filter: ['maps'],
      },
      {
        name: 'directions_walk',
        filter: ['Transit'],
      },
      {
        name: 'directory_sync',
        filter: ['UI actions'],
      },
      {
        name: 'dirty_lens',
        filter: ['Images'],
      },
      {
        name: 'disabled_by_default',
        filter: ['UI actions'],
      },
      {
        name: 'disabled_visible',
        filter: ['Privacy'],
      },
      {
        name: 'disc_full',
        filter: ['Hardware'],
      },
      {
        name: 'discount',
        filter: ['device'],
      },
      {
        name: 'discover_tune',
        filter: ['Audio&Video'],
      },
      {
        name: 'dishwasher',
        filter: ['Household'],
      },
      {
        name: 'dishwasher_gen',
        filter: ['Household'],
      },
      {
        name: 'display_external_input',
        filter: ['Android'],
      },
      {
        name: 'display_settings',
        filter: ['Hardware'],
      },
      {
        name: 'distance',
        filter: ['Activities'],
      },
      {
        name: 'diversity_1',
        filter: ['Social'],
      },
      {
        name: 'diversity_2',
        filter: ['Social'],
      },
      {
        name: 'diversity_3',
        filter: ['Social'],
      },
      {
        name: 'diversity_4',
        filter: ['Social'],
      },
      {
        name: 'dns',
        filter: ['Hardware'],
      },
      {
        name: 'do_disturb',
        filter: ['notification'],
      },
      {
        name: 'do_disturb_alt',
        filter: ['notification'],
      },
      {
        name: 'do_disturb_off',
        filter: ['notification'],
      },
      {
        name: 'do_disturb_on',
        filter: ['notification'],
      },
      {
        name: 'do_not_disturb',
        filter: ['notification'],
      },
      {
        name: 'do_not_disturb_alt',
        filter: ['notification'],
      },
      {
        name: 'do_not_disturb_off',
        filter: ['UI actions'],
      },
      {
        name: 'do_not_disturb_on',
        filter: ['UI actions'],
      },
      {
        name: 'do_not_disturb_on_total_silence',
        filter: ['Android'],
      },
      {
        name: 'do_not_step',
        filter: ['Travel'],
      },
      {
        name: 'do_not_touch',
        filter: ['Travel'],
      },
      {
        name: 'dock',
        filter: ['hardware'],
      },
      {
        name: 'dock_to_bottom',
        filter: ['Android'],
      },
      {
        name: 'dock_to_left',
        filter: ['Android'],
      },
      {
        name: 'dock_to_right',
        filter: ['Android'],
      },
      {
        name: 'docs',
        filter: ['Text'],
      },
      {
        name: 'docs_add_on',
        filter: ['Text'],
      },
      {
        name: 'docs_apps_script',
        filter: ['Text'],
      },
      {
        name: 'document_scanner',
        filter: ['Text'],
      },
      {
        name: 'document_search',
        filter: ['Text'],
      },
      {
        name: 'domain',
        filter: ['Business'],
      },
      {
        name: 'domain_add',
        filter: ['Business'],
      },
      {
        name: 'domain_disabled',
        filter: ['Business'],
      },
      {
        name: 'domain_verification',
        filter: ['Actions'],
      },
      {
        name: 'domain_verification_off',
        filter: ['Actions'],
      },
      {
        name: 'domino_mask',
        filter: ['Social'],
      },
      {
        name: 'done',
        filter: ['action'],
      },
      {
        name: 'done_all',
        filter: ['UI actions'],
      },
      {
        name: 'done_outline',
        filter: ['UI actions'],
      },
      {
        name: 'donut_large',
        filter: ['Business'],
      },
      {
        name: 'donut_small',
        filter: ['Business'],
      },
      {
        name: 'door_back',
        filter: ['Household'],
      },
      {
        name: 'door_front',
        filter: ['Household'],
      },
      {
        name: 'door_open',
        filter: ['Home'],
      },
      {
        name: 'door_sensor',
        filter: ['Home'],
      },
      {
        name: 'door_sliding',
        filter: ['Household'],
      },
      {
        name: 'doorbell',
        filter: ['Household'],
      },
      {
        name: 'doorbell_3p',
        filter: ['Household'],
      },
      {
        name: 'doorbell_chime',
        filter: ['Home'],
      },
      {
        name: 'double_arrow',
        filter: ['UI actions'],
      },
      {
        name: 'downhill_skiing',
        filter: ['Activities'],
      },
      {
        name: 'download',
        filter: ['UI actions'],
      },
      {
        name: 'download_2',
        filter: ['UI actions'],
      },
      {
        name: 'download_done',
        filter: ['UI actions'],
      },
      {
        name: 'download_for_offline',
        filter: ['UI actions'],
      },
      {
        name: 'downloading',
        filter: ['UI actions'],
      },
      {
        name: 'draft',
        filter: ['Text'],
      },
      {
        name: 'draft_orders',
        filter: ['Actions'],
      },
      {
        name: 'drafts',
        filter: ['Communicate'],
      },
      {
        name: 'drag_click',
        filter: ['UI actions'],
      },
      {
        name: 'drag_handle',
        filter: ['Text'],
      },
      {
        name: 'drag_indicator',
        filter: ['UI actions'],
      },
      {
        name: 'drag_pan',
        filter: ['UI actions'],
      },
      {
        name: 'draw',
        filter: ['Text'],
      },
      {
        name: 'draw_abstract',
        filter: ['Text'],
      },
      {
        name: 'draw_collage',
        filter: ['Text'],
      },
      {
        name: 'dresser',
        filter: ['Household'],
      },
      {
        name: 'drive_eta',
        filter: ['notification'],
      },
      {
        name: 'drive_export',
        filter: ['Text'],
      },
      {
        name: 'drive_file_move',
        filter: ['Text'],
      },
      {
        name: 'drive_file_move_outline',
        filter: ['file'],
      },
      {
        name: 'drive_file_move_rtl',
        filter: ['file'],
      },
      {
        name: 'drive_file_rename_outline',
        filter: ['file'],
      },
      {
        name: 'drive_folder_upload',
        filter: ['Text'],
      },
      {
        name: 'drone',
        filter: ['Social'],
      },
      {
        name: 'drone_2',
        filter: ['Social'],
      },
      {
        name: 'dropdown',
        filter: ['UI actions'],
      },
      {
        name: 'dropper_eye',
        filter: ['Images'],
      },
      {
        name: 'dry',
        filter: ['Household'],
      },
      {
        name: 'dry_cleaning',
        filter: ['Maps'],
      },
      {
        name: 'dual_screen',
        filter: ['Android'],
      },
      {
        name: 'duo',
        filter: ['Communicate'],
      },
      {
        name: 'dvr',
        filter: ['Android'],
      },
      {
        name: 'dynamic_feed',
        filter: ['Actions'],
      },
      {
        name: 'dynamic_form',
        filter: ['UI actions'],
      },
      {
        name: 'e911_avatar',
        filter: ['Communicate'],
      },
      {
        name: 'e911_emergency',
        filter: ['Privacy'],
      },
      {
        name: 'e_mobiledata',
        filter: ['Android'],
      },
      {
        name: 'e_mobiledata_badge',
        filter: ['Android'],
      },
      {
        name: 'ear_sound',
        filter: ['Audio&Video'],
      },
      {
        name: 'earbud_case',
        filter: ['Hardware'],
      },
      {
        name: 'earbud_left',
        filter: ['Hardware'],
      },
      {
        name: 'earbud_right',
        filter: ['Hardware'],
      },
      {
        name: 'earbuds',
        filter: ['Hardware'],
      },
      {
        name: 'earbuds_2',
        filter: ['Hardware'],
      },
      {
        name: 'earbuds_battery',
        filter: ['Hardware'],
      },
      {
        name: 'early_on',
        filter: ['Home'],
      },
      {
        name: 'earthquake',
        filter: ['Social'],
      },
      {
        name: 'east',
        filter: ['Maps'],
      },
      {
        name: 'ecg',
        filter: ['Hardware'],
      },
      {
        name: 'ecg_heart',
        filter: ['Activities'],
      },
      {
        name: 'eco',
        filter: ['Social'],
      },
      {
        name: 'eda',
        filter: ['Activities'],
      },
      {
        name: 'edgesensor_high',
        filter: ['device'],
      },
      {
        name: 'edgesensor_low',
        filter: ['device'],
      },
      {
        name: 'edit',
        filter: ['Images'],
      },
      {
        name: 'edit_arrow_down',
        filter: ['UI actions'],
      },
      {
        name: 'edit_arrow_up',
        filter: ['UI actions'],
      },
      {
        name: 'edit_attributes',
        filter: ['Maps'],
      },
      {
        name: 'edit_audio',
        filter: ['Audio&Video'],
      },
      {
        name: 'edit_calendar',
        filter: ['Actions'],
      },
      {
        name: 'edit_document',
        filter: ['Text'],
      },
      {
        name: 'edit_location',
        filter: ['Maps'],
      },
      {
        name: 'edit_location_alt',
        filter: ['Maps'],
      },
      {
        name: 'edit_note',
        filter: ['Text'],
      },
      {
        name: 'edit_notifications',
        filter: ['Actions'],
      },
      {
        name: 'edit_off',
        filter: ['Text'],
      },
      {
        name: 'edit_road',
        filter: ['Maps'],
      },
      {
        name: 'edit_square',
        filter: ['Actions'],
      },
      {
        name: 'editor_choice',
        filter: ['Social'],
      },
      {
        name: 'egg',
        filter: ['Social'],
      },
      {
        name: 'egg_alt',
        filter: ['Social'],
      },
      {
        name: 'eject',
        filter: ['UI actions'],
      },
      {
        name: 'elderly',
        filter: ['Social'],
      },
      {
        name: 'elderly_woman',
        filter: ['Social'],
      },
      {
        name: 'electric_bike',
        filter: ['Transit'],
      },
      {
        name: 'electric_bolt',
        filter: ['Household'],
      },
      {
        name: 'electric_car',
        filter: ['Transit'],
      },
      {
        name: 'electric_meter',
        filter: ['Household'],
      },
      {
        name: 'electric_moped',
        filter: ['Transit'],
      },
      {
        name: 'electric_rickshaw',
        filter: ['Transit'],
      },
      {
        name: 'electric_scooter',
        filter: ['Transit'],
      },
      {
        name: 'electrical_services',
        filter: ['Maps'],
      },
      {
        name: 'elevation',
        filter: ['Activities'],
      },
      {
        name: 'elevator',
        filter: ['Travel'],
      },
      {
        name: 'email',
        filter: ['communication'],
      },
      {
        name: 'emergency',
        filter: ['Maps'],
      },
      {
        name: 'emergency_heat',
        filter: ['Household'],
      },
      {
        name: 'emergency_heat_2',
        filter: ['Household'],
      },
      {
        name: 'emergency_home',
        filter: ['Household'],
      },
      {
        name: 'emergency_recording',
        filter: ['Household'],
      },
      {
        name: 'emergency_share',
        filter: ['Household'],
      },
      {
        name: 'emergency_share_off',
        filter: ['Household'],
      },
      {
        name: 'emoji_emotions',
        filter: ['social'],
      },
      {
        name: 'emoji_events',
        filter: ['social'],
      },
      {
        name: 'emoji_food_beverage',
        filter: ['Social'],
      },
      {
        name: 'emoji_language',
        filter: ['Hardware'],
      },
      {
        name: 'emoji_nature',
        filter: ['Social'],
      },
      {
        name: 'emoji_objects',
        filter: ['Social'],
      },
      {
        name: 'emoji_people',
        filter: ['Social'],
      },
      {
        name: 'emoji_symbols',
        filter: ['Social'],
      },
      {
        name: 'emoji_transportation',
        filter: ['Social'],
      },
      {
        name: 'emoticon',
        filter: ['Social'],
      },
      {
        name: 'empty_dashboard',
        filter: ['UI actions'],
      },
      {
        name: 'enable',
        filter: ['UI actions'],
      },
      {
        name: 'encrypted',
        filter: ['Privacy'],
      },
      {
        name: 'encrypted_add',
        filter: ['Privacy'],
      },
      {
        name: 'encrypted_add_circle',
        filter: ['Privacy'],
      },
      {
        name: 'encrypted_minus_circle',
        filter: ['Privacy'],
      },
      {
        name: 'encrypted_off',
        filter: ['Privacy'],
      },
      {
        name: 'endocrinology',
        filter: ['Social'],
      },
      {
        name: 'energy',
        filter: ['Business'],
      },
      {
        name: 'energy_program_saving',
        filter: ['Household'],
      },
      {
        name: 'energy_program_time_used',
        filter: ['Household'],
      },
      {
        name: 'energy_savings_leaf',
        filter: ['Household'],
      },
      {
        name: 'engineering',
        filter: ['Activities'],
      },
      {
        name: 'enhanced_encryption',
        filter: ['Privacy'],
      },
      {
        name: 'ent',
        filter: ['Social'],
      },
      {
        name: 'enterprise',
        filter: ['Business'],
      },
      {
        name: 'enterprise_off',
        filter: ['Business'],
      },
      {
        name: 'equal',
        filter: ['Text'],
      },
      {
        name: 'equalizer',
        filter: ['Audio&Video'],
      },
      {
        name: 'eraser_size_1',
        filter: ['Text'],
      },
      {
        name: 'eraser_size_2',
        filter: ['Text'],
      },
      {
        name: 'eraser_size_3',
        filter: ['Text'],
      },
      {
        name: 'eraser_size_4',
        filter: ['Text'],
      },
      {
        name: 'eraser_size_5',
        filter: ['Text'],
      },
      {
        name: 'error',
        filter: ['Actions'],
      },
      {
        name: 'error_med',
        filter: ['UI actions'],
      },
      {
        name: 'error_outline',
        filter: ['alert'],
      },
      {
        name: 'escalator',
        filter: ['Travel'],
      },
      {
        name: 'escalator_warning',
        filter: ['Travel'],
      },
      {
        name: 'euro',
        filter: ['Business'],
      },
      {
        name: 'euro_symbol',
        filter: ['Business'],
      },
      {
        name: 'ev_mobiledata_badge',
        filter: ['Android'],
      },
      {
        name: 'ev_shadow',
        filter: ['Images'],
      },
      {
        name: 'ev_shadow_add',
        filter: ['Images'],
      },
      {
        name: 'ev_shadow_minus',
        filter: ['Images'],
      },
      {
        name: 'ev_station',
        filter: ['Maps'],
      },
      {
        name: 'event',
        filter: ['Actions'],
      },
      {
        name: 'event_available',
        filter: ['Actions'],
      },
      {
        name: 'event_busy',
        filter: ['Actions'],
      },
      {
        name: 'event_list',
        filter: ['UI actions'],
      },
      {
        name: 'event_note',
        filter: ['Actions'],
      },
      {
        name: 'event_repeat',
        filter: ['Actions'],
      },
      {
        name: 'event_seat',
        filter: ['Household'],
      },
      {
        name: 'event_upcoming',
        filter: ['Actions'],
      },
      {
        name: 'exclamation',
        filter: ['Privacy'],
      },
      {
        name: 'exercise',
        filter: ['Activities'],
      },
      {
        name: 'exit_to_app',
        filter: ['UI actions'],
      },
      {
        name: 'expand',
        filter: ['UI actions'],
      },
      {
        name: 'expand_all',
        filter: ['UI actions'],
      },
      {
        name: 'expand_circle_down',
        filter: ['UI actions'],
      },
      {
        name: 'expand_circle_right',
        filter: ['UI actions'],
      },
      {
        name: 'expand_circle_up',
        filter: ['UI actions'],
      },
      {
        name: 'expand_content',
        filter: ['UI actions'],
      },
      {
        name: 'expand_less',
        filter: ['navigation'],
      },
      {
        name: 'expand_more',
        filter: ['navigation'],
      },
      {
        name: 'expansion_panels',
        filter: ['UI actions'],
      },
      {
        name: 'experiment',
        filter: ['Activities'],
      },
      {
        name: 'explicit',
        filter: ['Audio&Video'],
      },
      {
        name: 'explore',
        filter: ['Maps'],
      },
      {
        name: 'explore_nearby',
        filter: ['Maps'],
      },
      {
        name: 'explore_off',
        filter: ['Maps'],
      },
      {
        name: 'explosion',
        filter: ['Social'],
      },
      {
        name: 'export_notes',
        filter: ['Text'],
      },
      {
        name: 'exposure',
        filter: ['Images'],
      },
      {
        name: 'exposure_neg_1',
        filter: ['Images'],
      },
      {
        name: 'exposure_neg_2',
        filter: ['Images'],
      },
      {
        name: 'exposure_plus_1',
        filter: ['Images'],
      },
      {
        name: 'exposure_plus_2',
        filter: ['Images'],
      },
      {
        name: 'exposure_zero',
        filter: ['Images'],
      },
      {
        name: 'extension',
        filter: ['Actions'],
      },
      {
        name: 'extension_off',
        filter: ['UI actions'],
      },
      {
        name: 'eye_tracking',
        filter: ['Audio&Video'],
      },
      {
        name: 'eyeglasses',
        filter: ['Social'],
      },
      {
        name: 'eyeglasses_2',
        filter: ['Social'],
      },
      {
        name: 'eyeglasses_2_sound',
        filter: ['Social'],
      },
      {
        name: 'face',
        filter: ['Social'],
      },
      {
        name: 'face_2',
        filter: ['Social'],
      },
      {
        name: 'face_3',
        filter: ['Social'],
      },
      {
        name: 'face_4',
        filter: ['Social'],
      },
      {
        name: 'face_5',
        filter: ['Social'],
      },
      {
        name: 'face_6',
        filter: ['Social'],
      },
      {
        name: 'face_down',
        filter: ['Social'],
      },
      {
        name: 'face_left',
        filter: ['Social'],
      },
      {
        name: 'face_nod',
        filter: ['Social'],
      },
      {
        name: 'face_retouching_natural',
        filter: ['image'],
      },
      {
        name: 'face_retouching_off',
        filter: ['Images'],
      },
      {
        name: 'face_right',
        filter: ['Social'],
      },
      {
        name: 'face_shake',
        filter: ['Social'],
      },
      {
        name: 'face_unlock',
        filter: ['action'],
      },
      {
        name: 'face_up',
        filter: ['Social'],
      },
      {
        name: 'fact_check',
        filter: ['Text'],
      },
      {
        name: 'factory',
        filter: ['Maps'],
      },
      {
        name: 'falling',
        filter: ['Social'],
      },
      {
        name: 'familiar_face_and_zone',
        filter: ['Home'],
      },
      {
        name: 'family_group',
        filter: ['Social'],
      },
      {
        name: 'family_history',
        filter: ['Business'],
      },
      {
        name: 'family_home',
        filter: ['Household'],
      },
      {
        name: 'family_link',
        filter: ['Activities'],
      },
      {
        name: 'family_restroom',
        filter: ['Travel'],
      },
      {
        name: 'family_star',
        filter: ['Social'],
      },
      {
        name: 'fan_focus',
        filter: ['Transit'],
      },
      {
        name: 'fan_indirect',
        filter: ['Transit'],
      },
      {
        name: 'farsight_digital',
        filter: ['Home'],
      },
      {
        name: 'fast_forward',
        filter: ['Audio&Video'],
      },
      {
        name: 'fast_rewind',
        filter: ['Audio&Video'],
      },
      {
        name: 'fastfood',
        filter: ['Maps'],
      },
      {
        name: 'faucet',
        filter: ['Household'],
      },
      {
        name: 'favorite',
        filter: ['UI actions'],
      },
      {
        name: 'favorite_border',
        filter: ['action'],
      },
      {
        name: 'fax',
        filter: ['Hardware'],
      },
      {
        name: 'feature_search',
        filter: ['Actions'],
      },
      {
        name: 'featured_play_list',
        filter: ['Audio&Video'],
      },
      {
        name: 'featured_seasonal_and_gifts',
        filter: ['Activities'],
      },
      {
        name: 'featured_video',
        filter: ['Audio&Video'],
      },
      {
        name: 'feed',
        filter: ['search'],
      },
      {
        name: 'feedback',
        filter: ['Actions'],
      },
      {
        name: 'female',
        filter: ['Social'],
      },
      {
        name: 'femur',
        filter: ['Social'],
      },
      {
        name: 'femur_alt',
        filter: ['Social'],
      },
      {
        name: 'fence',
        filter: ['Household'],
      },
      {
        name: 'fertile',
        filter: ['Activities'],
      },
      {
        name: 'festival',
        filter: ['Travel'],
      },
      {
        name: 'fiber_dvr',
        filter: ['Audio&Video'],
      },
      {
        name: 'fiber_manual_record',
        filter: ['Audio&Video'],
      },
      {
        name: 'fiber_new',
        filter: ['Audio&Video'],
      },
      {
        name: 'fiber_pin',
        filter: ['Audio&Video'],
      },
      {
        name: 'fiber_smart_record',
        filter: ['Audio&Video'],
      },
      {
        name: 'file_copy',
        filter: ['Text'],
      },
      {
        name: 'file_copy_off',
        filter: ['Text'],
      },
      {
        name: 'file_download',
        filter: ['file'],
      },
      {
        name: 'file_download_done',
        filter: ['file'],
      },
      {
        name: 'file_download_off',
        filter: ['UI actions'],
      },
      {
        name: 'file_export',
        filter: ['UI actions'],
      },
      {
        name: 'file_json',
        filter: ['UI actions'],
      },
      {
        name: 'file_map',
        filter: ['Maps'],
      },
      {
        name: 'file_map_stack',
        filter: ['Maps'],
      },
      {
        name: 'file_open',
        filter: ['UI actions'],
      },
      {
        name: 'file_png',
        filter: ['Images'],
      },
      {
        name: 'file_present',
        filter: ['Text'],
      },
      {
        name: 'file_save',
        filter: ['Text'],
      },
      {
        name: 'file_save_off',
        filter: ['Text'],
      },
      {
        name: 'file_upload',
        filter: ['file'],
      },
      {
        name: 'file_upload_off',
        filter: ['UI actions'],
      },
      {
        name: 'files',
        filter: ['Text'],
      },
      {
        name: 'filter',
        filter: ['Images'],
      },
      {
        name: 'filter_1',
        filter: ['Images'],
      },
      {
        name: 'filter_2',
        filter: ['Images'],
      },
      {
        name: 'filter_3',
        filter: ['Images'],
      },
      {
        name: 'filter_4',
        filter: ['Images'],
      },
      {
        name: 'filter_5',
        filter: ['Images'],
      },
      {
        name: 'filter_6',
        filter: ['Images'],
      },
      {
        name: 'filter_7',
        filter: ['Images'],
      },
      {
        name: 'filter_8',
        filter: ['Images'],
      },
      {
        name: 'filter_9',
        filter: ['Images'],
      },
      {
        name: 'filter_9_plus',
        filter: ['Images'],
      },
      {
        name: 'filter_alt',
        filter: ['UI actions'],
      },
      {
        name: 'filter_alt_off',
        filter: ['UI actions'],
      },
      {
        name: 'filter_arrow_right',
        filter: ['UI actions'],
      },
      {
        name: 'filter_b_and_w',
        filter: ['Images'],
      },
      {
        name: 'filter_center_focus',
        filter: ['Images'],
      },
      {
        name: 'filter_drama',
        filter: ['Images'],
      },
      {
        name: 'filter_frames',
        filter: ['Images'],
      },
      {
        name: 'filter_hdr',
        filter: ['image'],
      },
      {
        name: 'filter_list',
        filter: ['UI actions'],
      },
      {
        name: 'filter_list_alt',
        filter: ['action'],
      },
      {
        name: 'filter_list_off',
        filter: ['UI actions'],
      },
      {
        name: 'filter_none',
        filter: ['Images'],
      },
      {
        name: 'filter_retrolux',
        filter: ['Images'],
      },
      {
        name: 'filter_tilt_shift',
        filter: ['Images'],
      },
      {
        name: 'filter_vintage',
        filter: ['Images'],
      },
      {
        name: 'finance',
        filter: ['Business'],
      },
      {
        name: 'finance_chip',
        filter: ['Text'],
      },
      {
        name: 'finance_mode',
        filter: ['Business'],
      },
      {
        name: 'find_in_page',
        filter: ['Text'],
      },
      {
        name: 'find_replace',
        filter: ['Actions'],
      },
      {
        name: 'fingerprint',
        filter: ['Actions'],
      },
      {
        name: 'fingerprint_off',
        filter: ['Actions'],
      },
      {
        name: 'fire_extinguisher',
        filter: ['Household'],
      },
      {
        name: 'fire_hydrant',
        filter: ['Maps'],
      },
      {
        name: 'fire_hydrant_alt',
        filter: ['maps'],
      },
      {
        name: 'fire_truck',
        filter: ['Maps'],
      },
      {
        name: 'fireplace',
        filter: ['Household'],
      },
      {
        name: 'first_page',
        filter: ['UI actions'],
      },
      {
        name: 'fit_page',
        filter: ['Text'],
      },
      {
        name: 'fit_page_height',
        filter: ['Text'],
      },
      {
        name: 'fit_page_width',
        filter: ['Text'],
      },
      {
        name: 'fit_screen',
        filter: ['UI actions'],
      },
      {
        name: 'fit_width',
        filter: ['Text'],
      },
      {
        name: 'fitbit',
        filter: ['social'],
      },
      {
        name: 'fitness_center',
        filter: ['Travel'],
      },
      {
        name: 'fitness_tracker',
        filter: ['Hardware'],
      },
      {
        name: 'fitness_trackers',
        filter: ['Hardware'],
      },
      {
        name: 'flag',
        filter: ['Maps'],
      },
      {
        name: 'flag_2',
        filter: ['Maps'],
      },
      {
        name: 'flag_check',
        filter: ['Maps'],
      },
      {
        name: 'flag_circle',
        filter: ['Maps'],
      },
      {
        name: 'flaky',
        filter: ['Images'],
      },
      {
        name: 'flare',
        filter: ['Images'],
      },
      {
        name: 'flash_auto',
        filter: ['Images'],
      },
      {
        name: 'flash_off',
        filter: ['Images'],
      },
      {
        name: 'flash_on',
        filter: ['Images'],
      },
      {
        name: 'flashlight_off',
        filter: ['Android'],
      },
      {
        name: 'flashlight_on',
        filter: ['Android'],
      },
      {
        name: 'flatware',
        filter: ['Household'],
      },
      {
        name: 'flex_direction',
        filter: ['Text'],
      },
      {
        name: 'flex_no_wrap',
        filter: ['Text'],
      },
      {
        name: 'flex_wrap',
        filter: ['Text'],
      },
      {
        name: 'flight',
        filter: ['Transit'],
      },
      {
        name: 'flight_class',
        filter: ['Maps'],
      },
      {
        name: 'flight_land',
        filter: ['Transit'],
      },
      {
        name: 'flight_takeoff',
        filter: ['Transit'],
      },
      {
        name: 'flights_and_hotels',
        filter: ['Travel'],
      },
      {
        name: 'flip',
        filter: ['Images'],
      },
      {
        name: 'flip_camera_android',
        filter: ['Images'],
      },
      {
        name: 'flip_camera_ios',
        filter: ['Images'],
      },
      {
        name: 'flip_to_back',
        filter: ['Text'],
      },
      {
        name: 'flip_to_front',
        filter: ['Text'],
      },
      {
        name: 'float_landscape_2',
        filter: ['UI actions'],
      },
      {
        name: 'float_portrait_2',
        filter: ['UI actions'],
      },
      {
        name: 'flood',
        filter: ['Social'],
      },
      {
        name: 'floor',
        filter: ['Activities'],
      },
      {
        name: 'floor_lamp',
        filter: ['Home'],
      },
      {
        name: 'flowchart',
        filter: ['Business'],
      },
      {
        name: 'flowsheet',
        filter: ['Business'],
      },
      {
        name: 'fluid',
        filter: ['Social'],
      },
      {
        name: 'fluid_balance',
        filter: ['Social'],
      },
      {
        name: 'fluid_med',
        filter: ['Social'],
      },
      {
        name: 'fluorescent',
        filter: ['Images'],
      },
      {
        name: 'flutter',
        filter: ['Actions'],
      },
      {
        name: 'flutter_dash',
        filter: ['Actions'],
      },
      {
        name: 'flyover',
        filter: ['Transit'],
      },
      {
        name: 'fmd_bad',
        filter: ['Maps'],
      },
      {
        name: 'fmd_good',
        filter: ['device'],
      },
      {
        name: 'foggy',
        filter: ['Social'],
      },
      {
        name: 'folded_hands',
        filter: ['Social'],
      },
      {
        name: 'folder',
        filter: ['Text'],
      },
      {
        name: 'folder_check',
        filter: ['Text'],
      },
      {
        name: 'folder_check_2',
        filter: ['Text'],
      },
      {
        name: 'folder_code',
        filter: ['Text'],
      },
      {
        name: 'folder_copy',
        filter: ['Text'],
      },
      {
        name: 'folder_data',
        filter: ['Text'],
      },
      {
        name: 'folder_delete',
        filter: ['Text'],
      },
      {
        name: 'folder_eye',
        filter: ['Text'],
      },
      {
        name: 'folder_info',
        filter: ['Text'],
      },
      {
        name: 'folder_limited',
        filter: ['Text'],
      },
      {
        name: 'folder_managed',
        filter: ['Text'],
      },
      {
        name: 'folder_match',
        filter: ['Text'],
      },
      {
        name: 'folder_off',
        filter: ['Text'],
      },
      {
        name: 'folder_open',
        filter: ['Text'],
      },
      {
        name: 'folder_shared',
        filter: ['Text'],
      },
      {
        name: 'folder_special',
        filter: ['Text'],
      },
      {
        name: 'folder_supervised',
        filter: ['Text'],
      },
      {
        name: 'folder_zip',
        filter: ['Text'],
      },
      {
        name: 'follow_the_signs',
        filter: ['Social'],
      },
      {
        name: 'font_download',
        filter: ['Text'],
      },
      {
        name: 'font_download_off',
        filter: ['Text'],
      },
      {
        name: 'food_bank',
        filter: ['Travel'],
      },
      {
        name: 'foot_bones',
        filter: ['Social'],
      },
      {
        name: 'footprint',
        filter: ['Social'],
      },
      {
        name: 'for_you',
        filter: ['Communicate'],
      },
      {
        name: 'forest',
        filter: ['Social'],
      },
      {
        name: 'fork_left',
        filter: ['Transit'],
      },
      {
        name: 'fork_right',
        filter: ['Transit'],
      },
      {
        name: 'fork_spoon',
        filter: ['Household'],
      },
      {
        name: 'forklift',
        filter: ['Business'],
      },
      {
        name: 'format_align_center',
        filter: ['Text'],
      },
      {
        name: 'format_align_justify',
        filter: ['Text'],
      },
      {
        name: 'format_align_left',
        filter: ['Text'],
      },
      {
        name: 'format_align_right',
        filter: ['Text'],
      },
      {
        name: 'format_bold',
        filter: ['Text'],
      },
      {
        name: 'format_clear',
        filter: ['Text'],
      },
      {
        name: 'format_color_fill',
        filter: ['Text'],
      },
      {
        name: 'format_color_reset',
        filter: ['Text'],
      },
      {
        name: 'format_color_text',
        filter: ['Text'],
      },
      {
        name: 'format_h1',
        filter: ['Text'],
      },
      {
        name: 'format_h2',
        filter: ['Text'],
      },
      {
        name: 'format_h3',
        filter: ['Text'],
      },
      {
        name: 'format_h4',
        filter: ['Text'],
      },
      {
        name: 'format_h5',
        filter: ['Text'],
      },
      {
        name: 'format_h6',
        filter: ['Text'],
      },
      {
        name: 'format_image_left',
        filter: ['Text'],
      },
      {
        name: 'format_image_right',
        filter: ['Text'],
      },
      {
        name: 'format_indent_decrease',
        filter: ['Text'],
      },
      {
        name: 'format_indent_increase',
        filter: ['Text'],
      },
      {
        name: 'format_ink_highlighter',
        filter: ['Text'],
      },
      {
        name: 'format_italic',
        filter: ['Text'],
      },
      {
        name: 'format_letter_spacing',
        filter: ['Text'],
      },
      {
        name: 'format_letter_spacing_2',
        filter: ['Text'],
      },
      {
        name: 'format_letter_spacing_standard',
        filter: ['Text'],
      },
      {
        name: 'format_letter_spacing_wide',
        filter: ['Text'],
      },
      {
        name: 'format_letter_spacing_wider',
        filter: ['Text'],
      },
      {
        name: 'format_line_spacing',
        filter: ['Text'],
      },
      {
        name: 'format_list_bulleted',
        filter: ['Text'],
      },
      {
        name: 'format_list_bulleted_add',
        filter: ['Text'],
      },
      {
        name: 'format_list_numbered',
        filter: ['Text'],
      },
      {
        name: 'format_list_numbered_rtl',
        filter: ['Text'],
      },
      {
        name: 'format_overline',
        filter: ['Text'],
      },
      {
        name: 'format_paint',
        filter: ['Text'],
      },
      {
        name: 'format_paragraph',
        filter: ['Text'],
      },
      {
        name: 'format_quote',
        filter: ['Text'],
      },
      {
        name: 'format_quote_off',
        filter: ['Text'],
      },
      {
        name: 'format_shapes',
        filter: ['Text'],
      },
      {
        name: 'format_size',
        filter: ['Text'],
      },
      {
        name: 'format_strikethrough',
        filter: ['Text'],
      },
      {
        name: 'format_text_clip',
        filter: ['Text'],
      },
      {
        name: 'format_text_overflow',
        filter: ['Text'],
      },
      {
        name: 'format_text_wrap',
        filter: ['Text'],
      },
      {
        name: 'format_textdirection_l_to_r',
        filter: ['Text'],
      },
      {
        name: 'format_textdirection_r_to_l',
        filter: ['Text'],
      },
      {
        name: 'format_textdirection_vertical',
        filter: ['Text'],
      },
      {
        name: 'format_underlined',
        filter: ['Text'],
      },
      {
        name: 'format_underlined_squiggle',
        filter: ['Text'],
      },
      {
        name: 'forms_add_on',
        filter: ['Text'],
      },
      {
        name: 'forms_apps_script',
        filter: ['Text'],
      },
      {
        name: 'fort',
        filter: ['Maps'],
      },
      {
        name: 'forum',
        filter: ['Communicate'],
      },
      {
        name: 'forward',
        filter: ['UI actions'],
      },
      {
        name: 'forward_10',
        filter: ['Audio&Video'],
      },
      {
        name: 'forward_30',
        filter: ['Audio&Video'],
      },
      {
        name: 'forward_5',
        filter: ['Audio&Video'],
      },
      {
        name: 'forward_circle',
        filter: ['Audio&Video'],
      },
      {
        name: 'forward_media',
        filter: ['Audio&Video'],
      },
      {
        name: 'forward_to_inbox',
        filter: ['Communicate'],
      },
      {
        name: 'foundation',
        filter: ['Household'],
      },
      {
        name: 'fragrance',
        filter: ['Household'],
      },
      {
        name: 'frame_bug',
        filter: ['UI actions'],
      },
      {
        name: 'frame_exclamation',
        filter: ['UI actions'],
      },
      {
        name: 'frame_inspect',
        filter: ['Text'],
      },
      {
        name: 'frame_person',
        filter: ['Audio&Video'],
      },
      {
        name: 'frame_person_mic',
        filter: ['Audio&Video'],
      },
      {
        name: 'frame_person_off',
        filter: ['Audio&Video'],
      },
      {
        name: 'frame_reload',
        filter: ['Text'],
      },
      {
        name: 'frame_source',
        filter: ['Text'],
      },
      {
        name: 'free_breakfast',
        filter: ['places'],
      },
      {
        name: 'free_cancellation',
        filter: ['Actions'],
      },
      {
        name: 'front_hand',
        filter: ['Social'],
      },
      {
        name: 'front_loader',
        filter: ['Business'],
      },
      {
        name: 'full_coverage',
        filter: ['Text'],
      },
      {
        name: 'full_hd',
        filter: ['Audio&Video'],
      },
      {
        name: 'full_stacked_bar_chart',
        filter: ['Business'],
      },
      {
        name: 'fullscreen',
        filter: ['UI actions'],
      },
      {
        name: 'fullscreen_exit',
        filter: ['UI actions'],
      },
      {
        name: 'fullscreen_portrait',
        filter: ['UI actions'],
      },
      {
        name: 'function',
        filter: ['Text'],
      },
      {
        name: 'functions',
        filter: ['Text'],
      },
      {
        name: 'funicular',
        filter: ['Transit'],
      },
      {
        name: 'g_mobiledata',
        filter: ['Android'],
      },
      {
        name: 'g_mobiledata_badge',
        filter: ['Android'],
      },
      {
        name: 'g_translate',
        filter: ['Communicate'],
      },
      {
        name: 'gallery_thumbnail',
        filter: ['Images'],
      },
      {
        name: 'gamepad',
        filter: ['Hardware'],
      },
      {
        name: 'games',
        filter: ['av'],
      },
      {
        name: 'garage',
        filter: ['Household'],
      },
      {
        name: 'garage_check',
        filter: ['Transit'],
      },
      {
        name: 'garage_door',
        filter: ['Household'],
      },
      {
        name: 'garage_home',
        filter: ['Household'],
      },
      {
        name: 'garage_money',
        filter: ['Transit'],
      },
      {
        name: 'garden_cart',
        filter: ['Social'],
      },
      {
        name: 'gas_meter',
        filter: ['Household'],
      },
      {
        name: 'gastroenterology',
        filter: ['Social'],
      },
      {
        name: 'gate',
        filter: ['Household'],
      },
      {
        name: 'gavel',
        filter: ['Social'],
      },
      {
        name: 'general_device',
        filter: ['Hardware'],
      },
      {
        name: 'generating_tokens',
        filter: ['action'],
      },
      {
        name: 'genetics',
        filter: ['Social'],
      },
      {
        name: 'genres',
        filter: ['Audio&Video'],
      },
      {
        name: 'gesture',
        filter: ['Actions'],
      },
      {
        name: 'gesture_select',
        filter: ['Actions'],
      },
      {
        name: 'get_app',
        filter: ['action'],
      },
      {
        name: 'gif',
        filter: ['Images'],
      },
      {
        name: 'gif_2',
        filter: ['Images'],
      },
      {
        name: 'gif_box',
        filter: ['Images'],
      },
      {
        name: 'girl',
        filter: ['Social'],
      },
      {
        name: 'gite',
        filter: ['Travel'],
      },
      {
        name: 'glass_cup',
        filter: ['Activities'],
      },
      {
        name: 'globe',
        filter: ['Maps'],
      },
      {
        name: 'globe_asia',
        filter: ['Maps'],
      },
      {
        name: 'globe_book',
        filter: ['Social'],
      },
      {
        name: 'globe_location_pin',
        filter: ['Maps'],
      },
      {
        name: 'globe_uk',
        filter: ['Maps'],
      },
      {
        name: 'glucose',
        filter: ['Social'],
      },
      {
        name: 'glyphs',
        filter: ['Text'],
      },
      {
        name: 'go_to_line',
        filter: ['UI actions'],
      },
      {
        name: 'golf_course',
        filter: ['Travel'],
      },
      {
        name: 'gondola_lift',
        filter: ['Transit'],
      },
      {
        name: 'google_home_devices',
        filter: ['Hardware'],
      },
      {
        name: 'google_tv_remote',
        filter: ['Home'],
      },
      {
        name: 'google_wifi',
        filter: ['Home'],
      },
      {
        name: 'gpp_bad',
        filter: ['Android'],
      },
      {
        name: 'gpp_good',
        filter: ['device'],
      },
      {
        name: 'gpp_maybe',
        filter: ['Android'],
      },
      {
        name: 'gps_fixed',
        filter: ['device'],
      },
      {
        name: 'gps_not_fixed',
        filter: ['device'],
      },
      {
        name: 'gps_off',
        filter: ['device'],
      },
      {
        name: 'grade',
        filter: ['action'],
      },
      {
        name: 'gradient',
        filter: ['Images'],
      },
      {
        name: 'grading',
        filter: ['Text'],
      },
      {
        name: 'grain',
        filter: ['Images'],
      },
      {
        name: 'graph_1',
        filter: ['Business'],
      },
      {
        name: 'graph_2',
        filter: ['Business'],
      },
      {
        name: 'graph_3',
        filter: ['Business'],
      },
      {
        name: 'graph_4',
        filter: ['Business'],
      },
      {
        name: 'graph_5',
        filter: ['Business'],
      },
      {
        name: 'graph_6',
        filter: ['Business'],
      },
      {
        name: 'graph_7',
        filter: ['Business'],
      },
      {
        name: 'graphic_eq',
        filter: ['Android'],
      },
      {
        name: 'grass',
        filter: ['Household'],
      },
      {
        name: 'grid_3x3',
        filter: ['Android'],
      },
      {
        name: 'grid_3x3_off',
        filter: ['Android'],
      },
      {
        name: 'grid_4x4',
        filter: ['Android'],
      },
      {
        name: 'grid_goldenratio',
        filter: ['Android'],
      },
      {
        name: 'grid_guides',
        filter: ['Text'],
      },
      {
        name: 'grid_off',
        filter: ['Images'],
      },
      {
        name: 'grid_on',
        filter: ['Images'],
      },
      {
        name: 'grid_view',
        filter: ['Text'],
      },
      {
        name: 'grocery',
        filter: ['Household'],
      },
      {
        name: 'group',
        filter: ['Social'],
      },
      {
        name: 'group_add',
        filter: ['Social'],
      },
      {
        name: 'group_off',
        filter: ['Social'],
      },
      {
        name: 'group_remove',
        filter: ['Social'],
      },
      {
        name: 'group_search',
        filter: ['Communicate'],
      },
      {
        name: 'group_work',
        filter: ['Social'],
      },
      {
        name: 'grouped_bar_chart',
        filter: ['Business'],
      },
      {
        name: 'groups',
        filter: ['Social'],
      },
      {
        name: 'groups_2',
        filter: ['Social'],
      },
      {
        name: 'groups_3',
        filter: ['Social'],
      },
      {
        name: 'guardian',
        filter: ['Social'],
      },
      {
        name: 'gynecology',
        filter: ['Social'],
      },
      {
        name: 'h_mobiledata',
        filter: ['Android'],
      },
      {
        name: 'h_mobiledata_badge',
        filter: ['Android'],
      },
      {
        name: 'h_plus_mobiledata',
        filter: ['Android'],
      },
      {
        name: 'h_plus_mobiledata_badge',
        filter: ['Android'],
      },
      {
        name: 'hail',
        filter: ['Transit'],
      },
      {
        name: 'hallway',
        filter: ['Household'],
      },
      {
        name: 'hanami_dango',
        filter: ['Maps'],
      },
      {
        name: 'hand_bones',
        filter: ['Social'],
      },
      {
        name: 'hand_gesture',
        filter: ['Actions'],
      },
      {
        name: 'hand_gesture_off',
        filter: ['Actions'],
      },
      {
        name: 'hand_meal',
        filter: ['Social'],
      },
      {
        name: 'hand_package',
        filter: ['Social'],
      },
      {
        name: 'handheld_controller',
        filter: ['Hardware'],
      },
      {
        name: 'handshake',
        filter: ['Social'],
      },
      {
        name: 'handyman',
        filter: ['Maps'],
      },
      {
        name: 'hangout_video',
        filter: ['Audio&Video'],
      },
      {
        name: 'hangout_video_off',
        filter: ['Audio&Video'],
      },
      {
        name: 'hard_disk',
        filter: ['Hardware'],
      },
      {
        name: 'hard_drive',
        filter: ['Hardware'],
      },
      {
        name: 'hard_drive_2',
        filter: ['Hardware'],
      },
      {
        name: 'hardware',
        filter: ['Household'],
      },
      {
        name: 'hd',
        filter: ['Audio&Video'],
      },
      {
        name: 'hdr_auto',
        filter: ['Images'],
      },
      {
        name: 'hdr_auto_select',
        filter: ['Images'],
      },
      {
        name: 'hdr_enhanced_select',
        filter: ['Images'],
      },
      {
        name: 'hdr_off',
        filter: ['Images'],
      },
      {
        name: 'hdr_off_select',
        filter: ['Images'],
      },
      {
        name: 'hdr_on',
        filter: ['Images'],
      },
      {
        name: 'hdr_on_select',
        filter: ['Images'],
      },
      {
        name: 'hdr_plus',
        filter: ['Images'],
      },
      {
        name: 'hdr_plus_off',
        filter: ['Images'],
      },
      {
        name: 'hdr_strong',
        filter: ['Images'],
      },
      {
        name: 'hdr_weak',
        filter: ['Images'],
      },
      {
        name: 'head_mounted_device',
        filter: ['Hardware'],
      },
      {
        name: 'headphones',
        filter: ['Hardware'],
      },
      {
        name: 'headphones_battery',
        filter: ['Hardware'],
      },
      {
        name: 'headset',
        filter: ['hardware'],
      },
      {
        name: 'headset_mic',
        filter: ['Hardware'],
      },
      {
        name: 'headset_off',
        filter: ['Hardware'],
      },
      {
        name: 'healing',
        filter: ['Images'],
      },
      {
        name: 'health_and_beauty',
        filter: ['Household'],
      },
      {
        name: 'health_and_safety',
        filter: ['Social'],
      },
      {
        name: 'health_cross',
        filter: ['Social'],
      },
      {
        name: 'health_metrics',
        filter: ['Activities'],
      },
      {
        name: 'heap_snapshot_large',
        filter: ['Text'],
      },
      {
        name: 'heap_snapshot_multiple',
        filter: ['Text'],
      },
      {
        name: 'heap_snapshot_thumbnail',
        filter: ['Text'],
      },
      {
        name: 'hearing',
        filter: ['Audio&Video'],
      },
      {
        name: 'hearing_aid',
        filter: ['Audio&Video'],
      },
      {
        name: 'hearing_aid_disabled',
        filter: ['Audio&Video'],
      },
      {
        name: 'hearing_aid_disabled_left',
        filter: ['Audio&Video'],
      },
      {
        name: 'hearing_aid_left',
        filter: ['Audio&Video'],
      },
      {
        name: 'hearing_disabled',
        filter: ['Audio&Video'],
      },
      {
        name: 'heart_broken',
        filter: ['Social'],
      },
      {
        name: 'heart_check',
        filter: ['UI actions'],
      },
      {
        name: 'heart_minus',
        filter: ['UI actions'],
      },
      {
        name: 'heart_plus',
        filter: ['UI actions'],
      },
      {
        name: 'heart_smile',
        filter: ['Social'],
      },
      {
        name: 'heat',
        filter: ['Home'],
      },
      {
        name: 'heat_pump',
        filter: ['Household'],
      },
      {
        name: 'heat_pump_balance',
        filter: ['Home'],
      },
      {
        name: 'height',
        filter: ['Text'],
      },
      {
        name: 'helicopter',
        filter: ['Social'],
      },
      {
        name: 'help',
        filter: ['Actions'],
      },
      {
        name: 'help_center',
        filter: ['Actions'],
      },
      {
        name: 'help_clinic',
        filter: ['Actions'],
      },
      {
        name: 'help_outline',
        filter: ['action'],
      },
      {
        name: 'hematology',
        filter: ['Social'],
      },
      {
        name: 'hevc',
        filter: ['Images'],
      },
      {
        name: 'hexagon',
        filter: ['Text'],
      },
      {
        name: 'hide',
        filter: ['UI actions'],
      },
      {
        name: 'hide_image',
        filter: ['Images'],
      },
      {
        name: 'hide_source',
        filter: ['UI actions'],
      },
      {
        name: 'high_chair',
        filter: ['Household'],
      },
      {
        name: 'high_density',
        filter: ['Images'],
      },
      {
        name: 'high_quality',
        filter: ['Audio&Video'],
      },
      {
        name: 'high_res',
        filter: ['Images'],
      },
      {
        name: 'highlight',
        filter: ['Household'],
      },
      {
        name: 'highlight_alt',
        filter: ['action'],
      },
      {
        name: 'highlight_keyboard_focus',
        filter: ['UI actions'],
      },
      {
        name: 'highlight_mouse_cursor',
        filter: ['UI actions'],
      },
      {
        name: 'highlight_off',
        filter: ['action'],
      },
      {
        name: 'highlight_text_cursor',
        filter: ['UI actions'],
      },
      {
        name: 'highlighter_size_1',
        filter: ['Text'],
      },
      {
        name: 'highlighter_size_2',
        filter: ['Text'],
      },
      {
        name: 'highlighter_size_3',
        filter: ['Text'],
      },
      {
        name: 'highlighter_size_4',
        filter: ['Text'],
      },
      {
        name: 'highlighter_size_5',
        filter: ['Text'],
      },
      {
        name: 'hiking',
        filter: ['Activities'],
      },
      {
        name: 'history',
        filter: ['Actions'],
      },
      {
        name: 'history_2',
        filter: ['Actions'],
      },
      {
        name: 'history_edu',
        filter: ['Text'],
      },
      {
        name: 'history_off',
        filter: ['Actions'],
      },
      {
        name: 'history_toggle_off',
        filter: ['Actions'],
      },
      {
        name: 'hive',
        filter: ['Social'],
      },
      {
        name: 'hls',
        filter: ['UI actions'],
      },
      {
        name: 'hls_off',
        filter: ['UI actions'],
      },
      {
        name: 'holiday_village',
        filter: ['Travel'],
      },
      {
        name: 'home',
        filter: ['UI actions'],
      },
      {
        name: 'home_and_garden',
        filter: ['Household'],
      },
      {
        name: 'home_app_logo',
        filter: ['Actions'],
      },
      {
        name: 'home_filled',
        filter: ['action'],
      },
      {
        name: 'home_health',
        filter: ['Social'],
      },
      {
        name: 'home_improvement_and_tools',
        filter: ['Household'],
      },
      {
        name: 'home_iot_device',
        filter: ['Household'],
      },
      {
        name: 'home_max',
        filter: ['Hardware'],
      },
      {
        name: 'home_max_dots',
        filter: ['Home'],
      },
      {
        name: 'home_mini',
        filter: ['Hardware'],
      },
      {
        name: 'home_pin',
        filter: ['Maps'],
      },
      {
        name: 'home_repair_service',
        filter: ['Maps'],
      },
      {
        name: 'home_speaker',
        filter: ['Home'],
      },
      {
        name: 'home_storage',
        filter: ['Home'],
      },
      {
        name: 'home_work',
        filter: ['Maps'],
      },
      {
        name: 'horizontal_distribute',
        filter: ['Text'],
      },
      {
        name: 'horizontal_rule',
        filter: ['Text'],
      },
      {
        name: 'horizontal_split',
        filter: ['Text'],
      },
      {
        name: 'host',
        filter: ['Hardware'],
      },
      {
        name: 'hot_tub',
        filter: ['Household'],
      },
      {
        name: 'hotel',
        filter: ['Travel'],
      },
      {
        name: 'hotel_class',
        filter: ['Actions'],
      },
      {
        name: 'hourglass',
        filter: ['Actions'],
      },
      {
        name: 'hourglass_arrow_down',
        filter: ['UI actions'],
      },
      {
        name: 'hourglass_arrow_up',
        filter: ['UI actions'],
      },
      {
        name: 'hourglass_bottom',
        filter: ['Communicate'],
      },
      {
        name: 'hourglass_disabled',
        filter: ['Actions'],
      },
      {
        name: 'hourglass_empty',
        filter: ['Actions'],
      },
      {
        name: 'hourglass_full',
        filter: ['action'],
      },
      {
        name: 'hourglass_pause',
        filter: ['Actions'],
      },
      {
        name: 'hourglass_top',
        filter: ['Communicate'],
      },
      {
        name: 'house',
        filter: ['Household'],
      },
      {
        name: 'house_siding',
        filter: ['Household'],
      },
      {
        name: 'house_with_shield',
        filter: ['Home'],
      },
      {
        name: 'houseboat',
        filter: ['Travel'],
      },
      {
        name: 'household_supplies',
        filter: ['Household'],
      },
      {
        name: 'hov',
        filter: ['Transit'],
      },
      {
        name: 'how_to_reg',
        filter: ['Actions'],
      },
      {
        name: 'how_to_vote',
        filter: ['Activities'],
      },
      {
        name: 'hr_resting',
        filter: ['Activities'],
      },
      {
        name: 'html',
        filter: ['UI actions'],
      },
      {
        name: 'http',
        filter: ['Actions'],
      },
      {
        name: 'https',
        filter: ['action'],
      },
      {
        name: 'hub',
        filter: ['Communicate'],
      },
      {
        name: 'humerus',
        filter: ['Social'],
      },
      {
        name: 'humerus_alt',
        filter: ['Social'],
      },
      {
        name: 'humidity_high',
        filter: ['Household'],
      },
      {
        name: 'humidity_indoor',
        filter: ['Home'],
      },
      {
        name: 'humidity_low',
        filter: ['Household'],
      },
      {
        name: 'humidity_mid',
        filter: ['Household'],
      },
      {
        name: 'humidity_percentage',
        filter: ['Social'],
      },
      {
        name: 'hvac',
        filter: ['Household'],
      },
      {
        name: 'hvac_max_defrost',
        filter: ['Transit'],
      },
      {
        name: 'ice_skating',
        filter: ['Activities'],
      },
      {
        name: 'icecream',
        filter: ['Travel'],
      },
      {
        name: 'id_card',
        filter: ['Privacy'],
      },
      {
        name: 'identity_aware_proxy',
        filter: ['Privacy'],
      },
      {
        name: 'identity_platform',
        filter: ['Social'],
      },
      {
        name: 'ifl',
        filter: ['Activities'],
      },
      {
        name: 'iframe',
        filter: ['UI actions'],
      },
      {
        name: 'iframe_off',
        filter: ['UI actions'],
      },
      {
        name: 'image',
        filter: ['Images'],
      },
      {
        name: 'image_arrow_up',
        filter: ['Images'],
      },
      {
        name: 'image_aspect_ratio',
        filter: ['Images'],
      },
      {
        name: 'image_inset',
        filter: ['Images'],
      },
      {
        name: 'image_not_supported',
        filter: ['image'],
      },
      {
        name: 'image_search',
        filter: ['Images'],
      },
      {
        name: 'imagesearch_roller',
        filter: ['Text'],
      },
      {
        name: 'imagesmode',
        filter: ['Images'],
      },
      {
        name: 'immunology',
        filter: ['Social'],
      },
      {
        name: 'import_contacts',
        filter: ['Communicate'],
      },
      {
        name: 'import_export',
        filter: ['communication'],
      },
      {
        name: 'important_devices',
        filter: ['Hardware'],
      },
      {
        name: 'in_home_mode',
        filter: ['Household'],
      },
      {
        name: 'inactive_order',
        filter: ['Business'],
      },
      {
        name: 'inbox',
        filter: ['Communicate'],
      },
      {
        name: 'inbox_customize',
        filter: ['Communicate'],
      },
      {
        name: 'inbox_text',
        filter: ['Communicate'],
      },
      {
        name: 'inbox_text_asterisk',
        filter: ['Communicate'],
      },
      {
        name: 'inbox_text_person',
        filter: ['Communicate'],
      },
      {
        name: 'inbox_text_share',
        filter: ['Communicate'],
      },
      {
        name: 'incomplete_circle',
        filter: ['Images'],
      },
      {
        name: 'indeterminate_check_box',
        filter: ['UI actions'],
      },
      {
        name: 'indeterminate_question_box',
        filter: ['Actions'],
      },
      {
        name: 'info',
        filter: ['Actions'],
      },
      {
        name: 'info_i',
        filter: ['Actions'],
      },
      {
        name: 'info_outline',
        filter: ['action'],
      },
      {
        name: 'infrared',
        filter: ['Social'],
      },
      {
        name: 'ink_eraser',
        filter: ['Text'],
      },
      {
        name: 'ink_eraser_off',
        filter: ['Text'],
      },
      {
        name: 'ink_highlighter',
        filter: ['Text'],
      },
      {
        name: 'ink_highlighter_move',
        filter: ['Text'],
      },
      {
        name: 'ink_marker',
        filter: ['Text'],
      },
      {
        name: 'ink_pen',
        filter: ['Text'],
      },
      {
        name: 'ink_selection',
        filter: ['Text'],
      },
      {
        name: 'inpatient',
        filter: ['Social'],
      },
      {
        name: 'input',
        filter: ['Actions'],
      },
      {
        name: 'input_circle',
        filter: ['UI actions'],
      },
      {
        name: 'insert_chart',
        filter: ['Business'],
      },
      {
        name: 'insert_chart_outlined',
        filter: ['editor'],
      },
      {
        name: 'insert_comment',
        filter: ['editor'],
      },
      {
        name: 'insert_drive_file',
        filter: ['editor'],
      },
      {
        name: 'insert_emoticon',
        filter: ['editor'],
      },
      {
        name: 'insert_invitation',
        filter: ['editor'],
      },
      {
        name: 'insert_link',
        filter: ['editor'],
      },
      {
        name: 'insert_page_break',
        filter: ['Text'],
      },
      {
        name: 'insert_photo',
        filter: ['editor'],
      },
      {
        name: 'insert_text',
        filter: ['Text'],
      },
      {
        name: 'insights',
        filter: ['content'],
      },
      {
        name: 'install_desktop',
        filter: ['UI actions'],
      },
      {
        name: 'install_mobile',
        filter: ['action'],
      },
      {
        name: 'instant_mix',
        filter: ['Audio&Video'],
      },
      {
        name: 'integration_instructions',
        filter: ['Text'],
      },
      {
        name: 'interactive_space',
        filter: ['Activities'],
      },
      {
        name: 'interests',
        filter: ['Actions'],
      },
      {
        name: 'interpreter_mode',
        filter: ['Audio&Video'],
      },
      {
        name: 'inventory',
        filter: ['Text'],
      },
      {
        name: 'inventory_2',
        filter: ['Communicate'],
      },
      {
        name: 'invert_colors',
        filter: ['Images'],
      },
      {
        name: 'invert_colors_off',
        filter: ['Images'],
      },
      {
        name: 'ios',
        filter: ['Android'],
      },
      {
        name: 'ios_share',
        filter: ['UI actions'],
      },
      {
        name: 'iron',
        filter: ['Household'],
      },
      {
        name: 'iso',
        filter: ['image'],
      },
      {
        name: 'jamboard_kiosk',
        filter: ['Hardware'],
      },
      {
        name: 'japanese_curry',
        filter: ['Travel'],
      },
      {
        name: 'japanese_flag',
        filter: ['Travel'],
      },
      {
        name: 'javascript',
        filter: ['UI actions'],
      },
      {
        name: 'join',
        filter: ['Text'],
      },
      {
        name: 'join_full',
        filter: ['action'],
      },
      {
        name: 'join_inner',
        filter: ['Text'],
      },
      {
        name: 'join_left',
        filter: ['Text'],
      },
      {
        name: 'join_right',
        filter: ['Text'],
      },
      {
        name: 'joystick',
        filter: ['Hardware'],
      },
      {
        name: 'jump_to_element',
        filter: ['UI actions'],
      },
      {
        name: 'kanji_alcohol',
        filter: ['Maps'],
      },
      {
        name: 'kayaking',
        filter: ['Activities'],
      },
      {
        name: 'kebab_dining',
        filter: ['Maps'],
      },
      {
        name: 'keep',
        filter: ['Actions'],
      },
      {
        name: 'keep_off',
        filter: ['Actions'],
      },
      {
        name: 'keep_public',
        filter: ['Actions'],
      },
      {
        name: 'kettle',
        filter: ['Household'],
      },
      {
        name: 'key',
        filter: ['UI actions'],
      },
      {
        name: 'key_off',
        filter: ['UI actions'],
      },
      {
        name: 'key_vertical',
        filter: ['UI actions'],
      },
      {
        name: 'key_visualizer',
        filter: ['Privacy'],
      },
      {
        name: 'keyboard',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_alt',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_arrow_down',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_arrow_left',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_arrow_right',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_arrow_up',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_backspace',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_capslock',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_capslock_badge',
        filter: ['Android'],
      },
      {
        name: 'keyboard_command_key',
        filter: ['UI actions'],
      },
      {
        name: 'keyboard_control_key',
        filter: ['UI actions'],
      },
      {
        name: 'keyboard_double_arrow_down',
        filter: ['UI actions'],
      },
      {
        name: 'keyboard_double_arrow_left',
        filter: ['UI actions', 'hardware'],
      },
      {
        name: 'keyboard_double_arrow_right',
        filter: ['UI actions'],
      },
      {
        name: 'keyboard_double_arrow_up',
        filter: ['UI actions'],
      },
      {
        name: 'keyboard_external_input',
        filter: ['Android'],
      },
      {
        name: 'keyboard_full',
        filter: ['Android'],
      },
      {
        name: 'keyboard_hide',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_keys',
        filter: ['Android'],
      },
      {
        name: 'keyboard_lock',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_lock_off',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_off',
        filter: ['Android'],
      },
      {
        name: 'keyboard_onscreen',
        filter: ['Android'],
      },
      {
        name: 'keyboard_option_key',
        filter: ['UI actions'],
      },
      {
        name: 'keyboard_previous_language',
        filter: ['Android'],
      },
      {
        name: 'keyboard_return',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_tab',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_tab_rtl',
        filter: ['Hardware'],
      },
      {
        name: 'keyboard_voice',
        filter: ['hardware'],
      },
      {
        name: 'kid_star',
        filter: ['Social'],
      },
      {
        name: 'king_bed',
        filter: ['Household'],
      },
      {
        name: 'kitchen',
        filter: ['Household'],
      },
      {
        name: 'kitesurfing',
        filter: ['Activities'],
      },
      {
        name: 'lab_panel',
        filter: ['Social'],
      },
      {
        name: 'lab_profile',
        filter: ['Text'],
      },
      {
        name: 'lab_research',
        filter: ['Social'],
      },
      {
        name: 'label',
        filter: ['Actions'],
      },
      {
        name: 'label_important',
        filter: ['Actions'],
      },
      {
        name: 'label_important_outline',
        filter: ['action'],
      },
      {
        name: 'label_off',
        filter: ['Actions'],
      },
      {
        name: 'labs',
        filter: ['Social'],
      },
      {
        name: 'lan',
        filter: ['Communicate'],
      },
      {
        name: 'landscape',
        filter: ['Images'],
      },
      {
        name: 'landscape_2',
        filter: ['Images'],
      },
      {
        name: 'landscape_2_edit',
        filter: ['Images'],
      },
      {
        name: 'landscape_2_off',
        filter: ['Images'],
      },
      {
        name: 'landslide',
        filter: ['Social'],
      },
      {
        name: 'language',
        filter: ['Actions'],
      },
      {
        name: 'language_chinese_array',
        filter: ['Text'],
      },
      {
        name: 'language_chinese_cangjie',
        filter: ['Text'],
      },
      {
        name: 'language_chinese_dayi',
        filter: ['Text'],
      },
      {
        name: 'language_chinese_pinyin',
        filter: ['Text'],
      },
      {
        name: 'language_chinese_quick',
        filter: ['Text'],
      },
      {
        name: 'language_chinese_wubi',
        filter: ['Text'],
      },
      {
        name: 'language_french',
        filter: ['Text'],
      },
      {
        name: 'language_gb_english',
        filter: ['Text'],
      },
      {
        name: 'language_international',
        filter: ['Text'],
      },
      {
        name: 'language_japanese_kana',
        filter: ['Text'],
      },
      {
        name: 'language_korean_latin',
        filter: ['Text'],
      },
      {
        name: 'language_pinyin',
        filter: ['Text'],
      },
      {
        name: 'language_spanish',
        filter: ['Text'],
      },
      {
        name: 'language_us',
        filter: ['Text'],
      },
      {
        name: 'language_us_colemak',
        filter: ['Text'],
      },
      {
        name: 'language_us_dvorak',
        filter: ['Text'],
      },
      {
        name: 'laps',
        filter: ['Activities'],
      },
      {
        name: 'laptop',
        filter: ['hardware'],
      },
      {
        name: 'laptop_car',
        filter: ['Hardware'],
      },
      {
        name: 'laptop_chromebook',
        filter: ['Hardware'],
      },
      {
        name: 'laptop_mac',
        filter: ['Hardware'],
      },
      {
        name: 'laptop_windows',
        filter: ['Hardware'],
      },
      {
        name: 'lasso_select',
        filter: ['Text'],
      },
      {
        name: 'last_page',
        filter: ['UI actions'],
      },
      {
        name: 'launch',
        filter: ['action'],
      },
      {
        name: 'laundry',
        filter: ['Home'],
      },
      {
        name: 'layers',
        filter: ['Maps'],
      },
      {
        name: 'layers_clear',
        filter: ['Maps'],
      },
      {
        name: 'lda',
        filter: ['Hardware'],
      },
      {
        name: 'leaderboard',
        filter: ['Business'],
      },
      {
        name: 'leak_add',
        filter: ['Images'],
      },
      {
        name: 'leak_remove',
        filter: ['Images'],
      },
      {
        name: 'left_click',
        filter: ['UI actions'],
      },
      {
        name: 'left_panel_close',
        filter: ['UI actions'],
      },
      {
        name: 'left_panel_open',
        filter: ['UI actions'],
      },
      {
        name: 'legend_toggle',
        filter: ['Business'],
      },
      {
        name: 'lens',
        filter: ['image'],
      },
      {
        name: 'lens_blur',
        filter: ['Images'],
      },
      {
        name: 'letter_switch',
        filter: ['Text'],
      },
      {
        name: 'library_add',
        filter: ['UI actions'],
      },
      {
        name: 'library_add_check',
        filter: ['Audio&Video'],
      },
      {
        name: 'library_books',
        filter: ['Audio&Video'],
      },
      {
        name: 'library_music',
        filter: ['Audio&Video'],
      },
      {
        name: 'license',
        filter: ['Actions'],
      },
      {
        name: 'lift_to_talk',
        filter: ['Hardware'],
      },
      {
        name: 'light',
        filter: ['Household'],
      },
      {
        name: 'light_group',
        filter: ['Home'],
      },
      {
        name: 'light_mode',
        filter: ['Android'],
      },
      {
        name: 'light_off',
        filter: ['Household'],
      },
      {
        name: 'lightbulb',
        filter: ['Actions'],
      },
      {
        name: 'lightbulb_2',
        filter: ['Household'],
      },
      {
        name: 'lightbulb_circle',
        filter: ['Actions'],
      },
      {
        name: 'lightbulb_outline',
        filter: ['action'],
      },
      {
        name: 'lightning_stand',
        filter: ['Hardware'],
      },
      {
        name: 'line_axis',
        filter: ['Text'],
      },
      {
        name: 'line_curve',
        filter: ['Text'],
      },
      {
        name: 'line_end',
        filter: ['Text'],
      },
      {
        name: 'line_end_arrow',
        filter: ['Text'],
      },
      {
        name: 'line_end_arrow_notch',
        filter: ['Text'],
      },
      {
        name: 'line_end_circle',
        filter: ['Text'],
      },
      {
        name: 'line_end_diamond',
        filter: ['Text'],
      },
      {
        name: 'line_end_square',
        filter: ['Text'],
      },
      {
        name: 'line_start',
        filter: ['Text'],
      },
      {
        name: 'line_start_arrow',
        filter: ['Text'],
      },
      {
        name: 'line_start_arrow_notch',
        filter: ['Text'],
      },
      {
        name: 'line_start_circle',
        filter: ['Text'],
      },
      {
        name: 'line_start_diamond',
        filter: ['Text'],
      },
      {
        name: 'line_start_square',
        filter: ['Text'],
      },
      {
        name: 'line_style',
        filter: ['Text'],
      },
      {
        name: 'line_weight',
        filter: ['Text'],
      },
      {
        name: 'linear_scale',
        filter: ['Text'],
      },
      {
        name: 'link',
        filter: ['Communicate'],
      },
      {
        name: 'link_off',
        filter: ['Communicate'],
      },
      {
        name: 'linked_camera',
        filter: ['Images'],
      },
      {
        name: 'linked_services',
        filter: ['UI actions'],
      },
      {
        name: 'liquor',
        filter: ['Travel'],
      },
      {
        name: 'list',
        filter: ['Text'],
      },
      {
        name: 'list_alt',
        filter: ['Text'],
      },
      {
        name: 'list_alt_add',
        filter: ['Text'],
      },
      {
        name: 'list_alt_check',
        filter: ['Text'],
      },
      {
        name: 'lists',
        filter: ['Actions'],
      },
      {
        name: 'live_help',
        filter: ['Communicate'],
      },
      {
        name: 'live_tv',
        filter: ['Hardware'],
      },
      {
        name: 'living',
        filter: ['Household'],
      },
      {
        name: 'local_activity',
        filter: ['Maps'],
      },
      {
        name: 'local_airport',
        filter: ['maps'],
      },
      {
        name: 'local_atm',
        filter: ['Maps'],
      },
      {
        name: 'local_bar',
        filter: ['Travel'],
      },
      {
        name: 'local_cafe',
        filter: ['Travel'],
      },
      {
        name: 'local_car_wash',
        filter: ['Maps'],
      },
      {
        name: 'local_convenience_store',
        filter: ['Maps'],
      },
      {
        name: 'local_dining',
        filter: ['Travel'],
      },
      {
        name: 'local_drink',
        filter: ['Maps'],
      },
      {
        name: 'local_fire_department',
        filter: ['Maps'],
      },
      {
        name: 'local_florist',
        filter: ['Maps'],
      },
      {
        name: 'local_gas_station',
        filter: ['Maps'],
      },
      {
        name: 'local_grocery_store',
        filter: ['maps'],
      },
      {
        name: 'local_hospital',
        filter: ['Maps'],
      },
      {
        name: 'local_hotel',
        filter: ['maps'],
      },
      {
        name: 'local_laundry_service',
        filter: ['Maps'],
      },
      {
        name: 'local_library',
        filter: ['Maps'],
      },
      {
        name: 'local_mall',
        filter: ['Maps'],
      },
      {
        name: 'local_movies',
        filter: ['maps'],
      },
      {
        name: 'local_offer',
        filter: ['maps'],
      },
      {
        name: 'local_parking',
        filter: ['Maps'],
      },
      {
        name: 'local_pharmacy',
        filter: ['Maps'],
      },
      {
        name: 'local_phone',
        filter: ['maps'],
      },
      {
        name: 'local_pizza',
        filter: ['Maps'],
      },
      {
        name: 'local_play',
        filter: ['maps'],
      },
      {
        name: 'local_police',
        filter: ['Maps'],
      },
      {
        name: 'local_post_office',
        filter: ['Maps'],
      },
      {
        name: 'local_printshop',
        filter: ['maps'],
      },
      {
        name: 'local_see',
        filter: ['Maps'],
      },
      {
        name: 'local_shipping',
        filter: ['Transit'],
      },
      {
        name: 'local_taxi',
        filter: ['Transit'],
      },
      {
        name: 'location_away',
        filter: ['Maps'],
      },
      {
        name: 'location_chip',
        filter: ['Text'],
      },
      {
        name: 'location_city',
        filter: ['Travel'],
      },
      {
        name: 'location_disabled',
        filter: ['Maps'],
      },
      {
        name: 'location_home',
        filter: ['Maps'],
      },
      {
        name: 'location_off',
        filter: ['Maps'],
      },
      {
        name: 'location_on',
        filter: ['Maps'],
      },
      {
        name: 'location_pin',
        filter: ['maps'],
      },
      {
        name: 'location_searching',
        filter: ['Maps'],
      },
      {
        name: 'lock',
        filter: ['Actions'],
      },
      {
        name: 'lock_clock',
        filter: ['Actions'],
      },
      {
        name: 'lock_open',
        filter: ['Actions'],
      },
      {
        name: 'lock_open_circle',
        filter: ['Actions'],
      },
      {
        name: 'lock_open_right',
        filter: ['Actions'],
      },
      {
        name: 'lock_outline',
        filter: ['action'],
      },
      {
        name: 'lock_person',
        filter: ['Actions'],
      },
      {
        name: 'lock_reset',
        filter: ['Actions'],
      },
      {
        name: 'login',
        filter: ['UI actions'],
      },
      {
        name: 'logo_dev',
        filter: ['Actions'],
      },
      {
        name: 'logout',
        filter: ['UI actions'],
      },
      {
        name: 'looks',
        filter: ['Images'],
      },
      {
        name: 'looks_3',
        filter: ['Images'],
      },
      {
        name: 'looks_4',
        filter: ['Images'],
      },
      {
        name: 'looks_5',
        filter: ['Images'],
      },
      {
        name: 'looks_6',
        filter: ['Images'],
      },
      {
        name: 'looks_one',
        filter: ['Images'],
      },
      {
        name: 'looks_two',
        filter: ['Images'],
      },
      {
        name: 'loop',
        filter: ['av'],
      },
      {
        name: 'loupe',
        filter: ['Images'],
      },
      {
        name: 'low_density',
        filter: ['Images'],
      },
      {
        name: 'low_priority',
        filter: ['Text'],
      },
      {
        name: 'lowercase',
        filter: ['Text'],
      },
      {
        name: 'loyalty',
        filter: ['Business'],
      },
      {
        name: 'lte_mobiledata',
        filter: ['Android'],
      },
      {
        name: 'lte_mobiledata_badge',
        filter: ['Android'],
      },
      {
        name: 'lte_plus_mobiledata',
        filter: ['Android'],
      },
      {
        name: 'lte_plus_mobiledata_badge',
        filter: ['Android'],
      },
      {
        name: 'luggage',
        filter: ['Travel'],
      },
      {
        name: 'lunch_dining',
        filter: ['Travel'],
      },
      {
        name: 'lyrics',
        filter: ['Audio&Video'],
      },
      {
        name: 'macro_auto',
        filter: ['Images'],
      },
      {
        name: 'macro_off',
        filter: ['Images'],
      },
      {
        name: 'magnification_large',
        filter: ['UI actions'],
      },
      {
        name: 'magnification_small',
        filter: ['UI actions'],
      },
      {
        name: 'magnify_docked',
        filter: ['Android'],
      },
      {
        name: 'magnify_fullscreen',
        filter: ['Android'],
      },
      {
        name: 'mail',
        filter: ['Communicate'],
      },
      {
        name: 'mail_asterisk',
        filter: ['Communicate'],
      },
      {
        name: 'mail_lock',
        filter: ['Communicate'],
      },
      {
        name: 'mail_off',
        filter: ['Communicate'],
      },
      {
        name: 'mail_outline',
        filter: ['communication'],
      },
      {
        name: 'mail_shield',
        filter: ['Communicate'],
      },
      {
        name: 'male',
        filter: ['Social'],
      },
      {
        name: 'man',
        filter: ['Social'],
      },
      {
        name: 'man_2',
        filter: ['Social'],
      },
      {
        name: 'man_3',
        filter: ['Social'],
      },
      {
        name: 'man_4',
        filter: ['Social'],
      },
      {
        name: 'manage_accounts',
        filter: ['Actions'],
      },
      {
        name: 'manage_history',
        filter: ['Actions'],
      },
      {
        name: 'manage_search',
        filter: ['UI actions'],
      },
      {
        name: 'manga',
        filter: ['Social'],
      },
      {
        name: 'manufacturing',
        filter: ['Actions'],
      },
      {
        name: 'map',
        filter: ['Maps'],
      },
      {
        name: 'map_pin_heart',
        filter: ['Maps'],
      },
      {
        name: 'map_pin_review',
        filter: ['Maps'],
      },
      {
        name: 'map_search',
        filter: ['Maps'],
      },
      {
        name: 'maps_home_work',
        filter: ['navigation'],
      },
      {
        name: 'maps_ugc',
        filter: ['Maps'],
      },
      {
        name: 'margin',
        filter: ['Text'],
      },
      {
        name: 'mark_as_unread',
        filter: ['Communicate'],
      },
      {
        name: 'mark_chat_read',
        filter: ['Communicate'],
      },
      {
        name: 'mark_chat_unread',
        filter: ['Communicate'],
      },
      {
        name: 'mark_email_read',
        filter: ['Communicate'],
      },
      {
        name: 'mark_email_unread',
        filter: ['Communicate'],
      },
      {
        name: 'mark_unread_chat_alt',
        filter: ['Communicate'],
      },
      {
        name: 'markdown',
        filter: ['Text'],
      },
      {
        name: 'markdown_copy',
        filter: ['Text'],
      },
      {
        name: 'markdown_paste',
        filter: ['Text'],
      },
      {
        name: 'markunread',
        filter: ['content'],
      },
      {
        name: 'markunread_mailbox',
        filter: ['Communicate'],
      },
      {
        name: 'masked_transitions',
        filter: ['Images'],
      },
      {
        name: 'masked_transitions_add',
        filter: ['Images'],
      },
      {
        name: 'masks',
        filter: ['Social'],
      },
      {
        name: 'massage',
        filter: ['Social'],
      },
      {
        name: 'match_case',
        filter: ['Text'],
      },
      {
        name: 'match_case_off',
        filter: ['Text'],
      },
      {
        name: 'match_word',
        filter: ['Text'],
      },
      {
        name: 'matter',
        filter: ['Household'],
      },
      {
        name: 'maximize',
        filter: ['UI actions'],
      },
      {
        name: 'meal_dinner',
        filter: ['Maps'],
      },
      {
        name: 'meal_lunch',
        filter: ['Maps'],
      },
      {
        name: 'measuring_tape',
        filter: ['Actions'],
      },
      {
        name: 'media_bluetooth_off',
        filter: ['Android'],
      },
      {
        name: 'media_bluetooth_on',
        filter: ['Android'],
      },
      {
        name: 'media_link',
        filter: ['Audio&Video'],
      },
      {
        name: 'media_output',
        filter: ['Hardware'],
      },
      {
        name: 'media_output_off',
        filter: ['Hardware'],
      },
      {
        name: 'mediation',
        filter: ['Business'],
      },
      {
        name: 'medical_information',
        filter: ['Social'],
      },
      {
        name: 'medical_mask',
        filter: ['Social'],
      },
      {
        name: 'medical_services',
        filter: ['Maps'],
      },
      {
        name: 'medication',
        filter: ['Social'],
      },
      {
        name: 'medication_liquid',
        filter: ['Social'],
      },
      {
        name: 'meeting_room',
        filter: ['Business'],
      },
      {
        name: 'memory',
        filter: ['Hardware'],
      },
      {
        name: 'memory_alt',
        filter: ['Hardware'],
      },
      {
        name: 'menstrual_health',
        filter: ['Activities'],
      },
      {
        name: 'menu',
        filter: ['UI actions'],
      },
      {
        name: 'menu_book',
        filter: ['Text'],
      },
      {
        name: 'menu_book_2',
        filter: ['Social'],
      },
      {
        name: 'menu_open',
        filter: ['UI actions'],
      },
      {
        name: 'merge',
        filter: ['Hardware'],
      },
      {
        name: 'merge_type',
        filter: ['Text'],
      },
      {
        name: 'message',
        filter: ['communication'],
      },
      {
        name: 'metabolism',
        filter: ['Social'],
      },
      {
        name: 'metro',
        filter: ['Transit'],
      },
      {
        name: 'mfg_nest_yale_lock',
        filter: ['Home'],
      },
      {
        name: 'mic',
        filter: ['Audio&Video'],
      },
      {
        name: 'mic_alert',
        filter: ['Audio&Video'],
      },
      {
        name: 'mic_double',
        filter: ['Audio&Video'],
      },
      {
        name: 'mic_external_off',
        filter: ['Images'],
      },
      {
        name: 'mic_external_on',
        filter: ['Images'],
      },
      {
        name: 'mic_none',
        filter: ['av'],
      },
      {
        name: 'mic_off',
        filter: ['Audio&Video'],
      },
      {
        name: 'microbiology',
        filter: ['Social'],
      },
      {
        name: 'microwave',
        filter: ['Household'],
      },
      {
        name: 'microwave_gen',
        filter: ['Household'],
      },
      {
        name: 'military_tech',
        filter: ['Social'],
      },
      {
        name: 'mimo',
        filter: ['Hardware'],
      },
      {
        name: 'mimo_disconnect',
        filter: ['Hardware'],
      },
      {
        name: 'mindfulness',
        filter: ['Activities'],
      },
      {
        name: 'minimize',
        filter: ['UI actions'],
      },
      {
        name: 'minor_crash',
        filter: ['Maps'],
      },
      {
        name: 'mintmark',
        filter: ['Business'],
      },
      {
        name: 'miscellaneous_services',
        filter: ['maps'],
      },
      {
        name: 'missed_video_call',
        filter: ['Audio&Video'],
      },
      {
        name: 'missing_controller',
        filter: ['Hardware'],
      },
      {
        name: 'mist',
        filter: ['Social'],
      },
      {
        name: 'mitre',
        filter: ['Business'],
      },
      {
        name: 'mixture_med',
        filter: ['Social'],
      },
      {
        name: 'mms',
        filter: ['Communicate'],
      },
      {
        name: 'mobile',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_2',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_3',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_alert',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_arrow_down',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_arrow_right',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_arrow_up_right',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_block',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_camera',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_camera_front',
        filter: ['Images'],
      },
      {
        name: 'mobile_camera_rear',
        filter: ['Images'],
      },
      {
        name: 'mobile_cancel',
        filter: ['Communicate'],
      },
      {
        name: 'mobile_cast',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_charge',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_chat',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_check',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_code',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_dots',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_friendly',
        filter: ['device'],
      },
      {
        name: 'mobile_gear',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_hand',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_hand_left',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_hand_left_off',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_hand_off',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_info',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_landscape',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_layout',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_lock_landscape',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_lock_portrait',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_loupe',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_menu',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_off',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_question',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_rotate',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_rotate_lock',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_screen_share',
        filter: ['communication'],
      },
      {
        name: 'mobile_screensaver',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_sensor_hi',
        filter: ['Android'],
      },
      {
        name: 'mobile_sensor_lo',
        filter: ['Android'],
      },
      {
        name: 'mobile_share',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_share_stack',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_sound',
        filter: ['Communicate'],
      },
      {
        name: 'mobile_sound_2',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_sound_off',
        filter: ['Communicate'],
      },
      {
        name: 'mobile_speaker',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_text',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_text_2',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_theft',
        filter: ['Privacy'],
      },
      {
        name: 'mobile_ticket',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_vibrate',
        filter: ['Hardware'],
      },
      {
        name: 'mobile_wrench',
        filter: ['Android'],
      },
      {
        name: 'mobiledata_off',
        filter: ['Android'],
      },
      {
        name: 'mode',
        filter: ['editor'],
      },
      {
        name: 'mode_comment',
        filter: ['Communicate'],
      },
      {
        name: 'mode_cool',
        filter: ['Household'],
      },
      {
        name: 'mode_cool_off',
        filter: ['Household'],
      },
      {
        name: 'mode_dual',
        filter: ['Home'],
      },
      {
        name: 'mode_edit',
        filter: ['editor'],
      },
      {
        name: 'mode_edit_outline',
        filter: ['editor'],
      },
      {
        name: 'mode_fan',
        filter: ['Household'],
      },
      {
        name: 'mode_fan_off',
        filter: ['Household'],
      },
      {
        name: 'mode_heat',
        filter: ['Household'],
      },
      {
        name: 'mode_heat_cool',
        filter: ['Household'],
      },
      {
        name: 'mode_heat_off',
        filter: ['Household'],
      },
      {
        name: 'mode_night',
        filter: ['Household'],
      },
      {
        name: 'mode_of_travel',
        filter: ['Maps'],
      },
      {
        name: 'mode_off_on',
        filter: ['Household'],
      },
      {
        name: 'mode_standby',
        filter: ['Android'],
      },
      {
        name: 'model_training',
        filter: ['Actions'],
      },
      {
        name: 'modeling',
        filter: ['UI actions'],
      },
      {
        name: 'monetization_on',
        filter: ['editor'],
      },
      {
        name: 'money',
        filter: ['Business'],
      },
      {
        name: 'money_bag',
        filter: ['Business'],
      },
      {
        name: 'money_off',
        filter: ['Business'],
      },
      {
        name: 'money_off_csred',
        filter: ['editor'],
      },
      {
        name: 'money_range',
        filter: ['Business'],
      },
      {
        name: 'monitor',
        filter: ['Hardware'],
      },
      {
        name: 'monitor_heart',
        filter: ['Social'],
      },
      {
        name: 'monitor_weight',
        filter: ['Hardware'],
      },
      {
        name: 'monitor_weight_gain',
        filter: ['Activities'],
      },
      {
        name: 'monitor_weight_loss',
        filter: ['Activities'],
      },
      {
        name: 'monitoring',
        filter: ['Business'],
      },
      {
        name: 'monochrome_photos',
        filter: ['Images'],
      },
      {
        name: 'monorail',
        filter: ['Transit'],
      },
      {
        name: 'mood',
        filter: ['Social'],
      },
      {
        name: 'mood_bad',
        filter: ['Social'],
      },
      {
        name: 'moon_stars',
        filter: ['Social'],
      },
      {
        name: 'mop',
        filter: ['Household'],
      },
      {
        name: 'moped',
        filter: ['Transit'],
      },
      {
        name: 'moped_package',
        filter: ['Transit'],
      },
      {
        name: 'more',
        filter: ['Actions'],
      },
      {
        name: 'more_down',
        filter: ['UI actions'],
      },
      {
        name: 'more_horiz',
        filter: ['UI actions'],
      },
      {
        name: 'more_time',
        filter: ['Actions'],
      },
      {
        name: 'more_up',
        filter: ['UI actions'],
      },
      {
        name: 'more_vert',
        filter: ['UI actions'],
      },
      {
        name: 'mosque',
        filter: ['Maps'],
      },
      {
        name: 'motion_blur',
        filter: ['Images'],
      },
      {
        name: 'motion_mode',
        filter: ['Images'],
      },
      {
        name: 'motion_photos_auto',
        filter: ['Images'],
      },
      {
        name: 'motion_photos_off',
        filter: ['image'],
      },
      {
        name: 'motion_photos_on',
        filter: ['Images'],
      },
      {
        name: 'motion_photos_pause',
        filter: ['image'],
      },
      {
        name: 'motion_photos_paused',
        filter: ['Images'],
      },
      {
        name: 'motion_play',
        filter: ['Images'],
      },
      {
        name: 'motion_sensor_active',
        filter: ['Home'],
      },
      {
        name: 'motion_sensor_alert',
        filter: ['Home'],
      },
      {
        name: 'motion_sensor_idle',
        filter: ['Home'],
      },
      {
        name: 'motion_sensor_urgent',
        filter: ['Home'],
      },
      {
        name: 'motorcycle',
        filter: ['Transit'],
      },
      {
        name: 'mountain_flag',
        filter: ['Social'],
      },
      {
        name: 'mountain_steam',
        filter: ['Travel'],
      },
      {
        name: 'mouse',
        filter: ['Hardware'],
      },
      {
        name: 'mouse_lock',
        filter: ['Hardware'],
      },
      {
        name: 'mouse_lock_off',
        filter: ['Hardware'],
      },
      {
        name: 'move',
        filter: ['Maps'],
      },
      {
        name: 'move_down',
        filter: ['UI actions'],
      },
      {
        name: 'move_group',
        filter: ['UI actions'],
      },
      {
        name: 'move_item',
        filter: ['UI actions'],
      },
      {
        name: 'move_location',
        filter: ['Maps'],
      },
      {
        name: 'move_selection_down',
        filter: ['UI actions'],
      },
      {
        name: 'move_selection_left',
        filter: ['UI actions'],
      },
      {
        name: 'move_selection_right',
        filter: ['UI actions'],
      },
      {
        name: 'move_selection_up',
        filter: ['UI actions'],
      },
      {
        name: 'move_to_inbox',
        filter: ['Communicate'],
      },
      {
        name: 'move_up',
        filter: ['UI actions'],
      },
      {
        name: 'moved_location',
        filter: ['Maps'],
      },
      {
        name: 'movie',
        filter: ['Audio&Video'],
      },
      {
        name: 'movie_creation',
        filter: ['image'],
      },
      {
        name: 'movie_edit',
        filter: ['Audio&Video'],
      },
      {
        name: 'movie_filter',
        filter: ['image'],
      },
      {
        name: 'movie_info',
        filter: ['Audio&Video'],
      },
      {
        name: 'movie_off',
        filter: ['Audio&Video'],
      },
      {
        name: 'movie_speaker',
        filter: ['Audio&Video'],
      },
      {
        name: 'moving',
        filter: ['Maps'],
      },
      {
        name: 'moving_beds',
        filter: ['Social'],
      },
      {
        name: 'moving_ministry',
        filter: ['Maps'],
      },
      {
        name: 'mp',
        filter: ['Images'],
      },
      {
        name: 'multicooker',
        filter: ['Household'],
      },
      {
        name: 'multiline_chart',
        filter: ['Business'],
      },
      {
        name: 'multimodal_hand_eye',
        filter: ['UI actions'],
      },
      {
        name: 'multiple_airports',
        filter: ['Maps'],
      },
      {
        name: 'multiple_stop',
        filter: ['Maps'],
      },
      {
        name: 'museum',
        filter: ['Travel'],
      },
      {
        name: 'music_cast',
        filter: ['Audio&Video'],
      },
      {
        name: 'music_history',
        filter: ['Audio&Video'],
      },
      {
        name: 'music_note',
        filter: ['Audio&Video'],
      },
      {
        name: 'music_note_add',
        filter: ['Audio&Video'],
      },
      {
        name: 'music_off',
        filter: ['Audio&Video'],
      },
      {
        name: 'music_video',
        filter: ['Audio&Video'],
      },
      {
        name: 'my_location',
        filter: ['Maps'],
      },
      {
        name: 'mystery',
        filter: ['Social'],
      },
      {
        name: 'nat',
        filter: ['Communicate'],
      },
      {
        name: 'nature',
        filter: ['Images'],
      },
      {
        name: 'nature_people',
        filter: ['Images'],
      },
      {
        name: 'navigate_before',
        filter: ['image'],
      },
      {
        name: 'navigate_next',
        filter: ['image'],
      },
      {
        name: 'navigation',
        filter: ['Maps'],
      },
      {
        name: 'near_me',
        filter: ['Maps'],
      },
      {
        name: 'near_me_disabled',
        filter: ['Maps'],
      },
      {
        name: 'nearby',
        filter: ['Android'],
      },
      {
        name: 'nearby_error',
        filter: ['Android'],
      },
      {
        name: 'nearby_off',
        filter: ['Android'],
      },
      {
        name: 'nephrology',
        filter: ['Social'],
      },
      {
        name: 'nest_audio',
        filter: ['Home'],
      },
      {
        name: 'nest_cam_floodlight',
        filter: ['Home'],
      },
      {
        name: 'nest_cam_indoor',
        filter: ['Home'],
      },
      {
        name: 'nest_cam_iq',
        filter: ['Home'],
      },
      {
        name: 'nest_cam_iq_outdoor',
        filter: ['Home'],
      },
      {
        name: 'nest_cam_magnet_mount',
        filter: ['Home'],
      },
      {
        name: 'nest_cam_outdoor',
        filter: ['Home'],
      },
      {
        name: 'nest_cam_stand',
        filter: ['Home'],
      },
      {
        name: 'nest_cam_wall_mount',
        filter: ['Home'],
      },
      {
        name: 'nest_cam_wired_stand',
        filter: ['Home'],
      },
      {
        name: 'nest_clock_farsight_analog',
        filter: ['Home'],
      },
      {
        name: 'nest_clock_farsight_digital',
        filter: ['Home'],
      },
      {
        name: 'nest_connect',
        filter: ['Home'],
      },
      {
        name: 'nest_detect',
        filter: ['Home'],
      },
      {
        name: 'nest_display',
        filter: ['Home'],
      },
      {
        name: 'nest_display_max',
        filter: ['Home'],
      },
      {
        name: 'nest_doorbell_visitor',
        filter: ['Home'],
      },
      {
        name: 'nest_eco_leaf',
        filter: ['Home'],
      },
      {
        name: 'nest_farsight_cool',
        filter: ['Home'],
      },
      {
        name: 'nest_farsight_dual',
        filter: ['Home'],
      },
      {
        name: 'nest_farsight_eco',
        filter: ['Home'],
      },
      {
        name: 'nest_farsight_heat',
        filter: ['Home'],
      },
      {
        name: 'nest_farsight_seasonal',
        filter: ['Home'],
      },
      {
        name: 'nest_farsight_weather',
        filter: ['Home'],
      },
      {
        name: 'nest_found_savings',
        filter: ['Home'],
      },
      {
        name: 'nest_heat_link_e',
        filter: ['Home'],
      },
      {
        name: 'nest_heat_link_gen_3',
        filter: ['Home'],
      },
      {
        name: 'nest_hello_doorbell',
        filter: ['Home'],
      },
      {
        name: 'nest_mini',
        filter: ['Home'],
      },
      {
        name: 'nest_multi_room',
        filter: ['Home'],
      },
      {
        name: 'nest_protect',
        filter: ['Home'],
      },
      {
        name: 'nest_remote_comfort_sensor',
        filter: ['Home'],
      },
      {
        name: 'nest_secure_alarm',
        filter: ['Home'],
      },
      {
        name: 'nest_sunblock',
        filter: ['Home'],
      },
      {
        name: 'nest_tag',
        filter: ['Home'],
      },
      {
        name: 'nest_thermostat',
        filter: ['Home'],
      },
      {
        name: 'nest_thermostat_e_eu',
        filter: ['Home'],
      },
      {
        name: 'nest_thermostat_gen_3',
        filter: ['Home'],
      },
      {
        name: 'nest_thermostat_sensor',
        filter: ['Home'],
      },
      {
        name: 'nest_thermostat_sensor_eu',
        filter: ['Home'],
      },
      {
        name: 'nest_thermostat_zirconium_eu',
        filter: ['Home'],
      },
      {
        name: 'nest_true_radiant',
        filter: ['Home'],
      },
      {
        name: 'nest_wake_on_approach',
        filter: ['Home'],
      },
      {
        name: 'nest_wake_on_press',
        filter: ['Home'],
      },
      {
        name: 'nest_wifi_point',
        filter: ['Home'],
      },
      {
        name: 'nest_wifi_pro',
        filter: ['Home'],
      },
      {
        name: 'nest_wifi_pro_2',
        filter: ['Home'],
      },
      {
        name: 'nest_wifi_router',
        filter: ['Home'],
      },
      {
        name: 'network_cell',
        filter: ['Android'],
      },
      {
        name: 'network_check',
        filter: ['Android'],
      },
      {
        name: 'network_intel_node',
        filter: ['Communicate'],
      },
      {
        name: 'network_intelligence',
        filter: ['Communicate'],
      },
      {
        name: 'network_intelligence_history',
        filter: ['Communicate'],
      },
      {
        name: 'network_intelligence_update',
        filter: ['Communicate'],
      },
      {
        name: 'network_locked',
        filter: ['Android'],
      },
      {
        name: 'network_manage',
        filter: ['Communicate'],
      },
      {
        name: 'network_node',
        filter: ['Business'],
      },
      {
        name: 'network_ping',
        filter: ['Android'],
      },
      {
        name: 'network_wifi',
        filter: ['Android'],
      },
      {
        name: 'network_wifi_1_bar',
        filter: ['Android'],
      },
      {
        name: 'network_wifi_1_bar_locked',
        filter: ['Android'],
      },
      {
        name: 'network_wifi_2_bar',
        filter: ['Android'],
      },
      {
        name: 'network_wifi_2_bar_locked',
        filter: ['Android'],
      },
      {
        name: 'network_wifi_3_bar',
        filter: ['Android'],
      },
      {
        name: 'network_wifi_3_bar_locked',
        filter: ['Android'],
      },
      {
        name: 'network_wifi_locked',
        filter: ['Android'],
      },
      {
        name: 'neurology',
        filter: ['Social'],
      },
      {
        name: 'new_label',
        filter: ['Actions'],
      },
      {
        name: 'new_releases',
        filter: ['av'],
      },
      {
        name: 'new_window',
        filter: ['UI actions'],
      },
      {
        name: 'news',
        filter: ['Text'],
      },
      {
        name: 'newsmode',
        filter: ['Text'],
      },
      {
        name: 'newspaper',
        filter: ['Text'],
      },
      {
        name: 'newsstand',
        filter: ['Activities'],
      },
      {
        name: 'next_plan',
        filter: ['Communicate'],
      },
      {
        name: 'next_week',
        filter: ['Business'],
      },
      {
        name: 'nfc',
        filter: ['Android'],
      },
      {
        name: 'nfc_off',
        filter: ['Android'],
      },
      {
        name: 'night_shelter',
        filter: ['Travel'],
      },
      {
        name: 'night_sight_auto',
        filter: ['Images'],
      },
      {
        name: 'night_sight_auto_off',
        filter: ['Images'],
      },
      {
        name: 'night_sight_max',
        filter: ['Hardware'],
      },
      {
        name: 'nightlife',
        filter: ['Travel'],
      },
      {
        name: 'nightlight',
        filter: ['Android'],
      },
      {
        name: 'nightlight_round',
        filter: ['action'],
      },
      {
        name: 'nights_stay',
        filter: ['social'],
      },
      {
        name: 'no_accounts',
        filter: ['Actions'],
      },
      {
        name: 'no_adult_content',
        filter: ['Social'],
      },
      {
        name: 'no_backpack',
        filter: ['Activities'],
      },
      {
        name: 'no_cell',
        filter: ['places'],
      },
      {
        name: 'no_crash',
        filter: ['Transit'],
      },
      {
        name: 'no_drinks',
        filter: ['Travel'],
      },
      {
        name: 'no_encryption',
        filter: ['Privacy'],
      },
      {
        name: 'no_encryption_gmailerrorred',
        filter: ['notification'],
      },
      {
        name: 'no_flash',
        filter: ['Images'],
      },
      {
        name: 'no_food',
        filter: ['Travel'],
      },
      {
        name: 'no_luggage',
        filter: ['Travel'],
      },
      {
        name: 'no_meals',
        filter: ['Maps'],
      },
      {
        name: 'no_meals_ouline',
        filter: ['maps'],
      },
      {
        name: 'no_meeting_room',
        filter: ['Business'],
      },
      {
        name: 'no_photography',
        filter: ['Images'],
      },
      {
        name: 'no_sim',
        filter: ['Hardware'],
      },
      {
        name: 'no_sound',
        filter: ['Audio&Video'],
      },
      {
        name: 'no_stroller',
        filter: ['Travel'],
      },
      {
        name: 'no_transfer',
        filter: ['Transit'],
      },
      {
        name: 'noise_aware',
        filter: ['Android'],
      },
      {
        name: 'noise_control_off',
        filter: ['Android'],
      },
      {
        name: 'noise_control_on',
        filter: ['Android'],
      },
      {
        name: 'nordic_walking',
        filter: ['Activities'],
      },
      {
        name: 'north',
        filter: ['Maps'],
      },
      {
        name: 'north_east',
        filter: ['Maps'],
      },
      {
        name: 'north_west',
        filter: ['Maps'],
      },
      {
        name: 'not_accessible',
        filter: ['Social'],
      },
      {
        name: 'not_accessible_forward',
        filter: ['Social'],
      },
      {
        name: 'not_interested',
        filter: ['av'],
      },
      {
        name: 'not_listed_location',
        filter: ['Maps'],
      },
      {
        name: 'not_started',
        filter: ['Audio&Video'],
      },
      {
        name: 'note',
        filter: ['av'],
      },
      {
        name: 'note_add',
        filter: ['Text'],
      },
      {
        name: 'note_alt',
        filter: ['Text'],
      },
      {
        name: 'note_stack',
        filter: ['Text'],
      },
      {
        name: 'note_stack_add',
        filter: ['Text'],
      },
      {
        name: 'notes',
        filter: ['Text'],
      },
      {
        name: 'notification_add',
        filter: ['Actions'],
      },
      {
        name: 'notification_important',
        filter: ['Actions'],
      },
      {
        name: 'notification_multiple',
        filter: ['Communicate'],
      },
      {
        name: 'notification_settings',
        filter: ['Communicate'],
      },
      {
        name: 'notification_sound',
        filter: ['Communicate'],
      },
      {
        name: 'notifications',
        filter: ['Communicate'],
      },
      {
        name: 'notifications_active',
        filter: ['Communicate'],
      },
      {
        name: 'notifications_none',
        filter: ['social'],
      },
      {
        name: 'notifications_off',
        filter: ['Communicate'],
      },
      {
        name: 'notifications_paused',
        filter: ['Communicate'],
      },
      {
        name: 'notifications_unread',
        filter: ['Communicate'],
      },
      {
        name: 'numbers',
        filter: ['Text'],
      },
      {
        name: 'nutrition',
        filter: ['Social'],
      },
      {
        name: 'ods',
        filter: ['Communicate'],
      },
      {
        name: 'odt',
        filter: ['Communicate'],
      },
      {
        name: 'offline_bolt',
        filter: ['Actions'],
      },
      {
        name: 'offline_pin',
        filter: ['Actions'],
      },
      {
        name: 'offline_pin_off',
        filter: ['Actions'],
      },
      {
        name: 'offline_share',
        filter: ['navigation'],
      },
      {
        name: 'oil_barrel',
        filter: ['Social'],
      },
      {
        name: 'okonomiyaki',
        filter: ['Travel'],
      },
      {
        name: 'on_device_training',
        filter: ['Actions'],
      },
      {
        name: 'on_hub_device',
        filter: ['Home'],
      },
      {
        name: 'oncology',
        filter: ['Social'],
      },
      {
        name: 'ondemand_video',
        filter: ['notification'],
      },
      {
        name: 'online_prediction',
        filter: ['Actions'],
      },
      {
        name: 'onsen',
        filter: ['Activities'],
      },
      {
        name: 'opacity',
        filter: ['Images'],
      },
      {
        name: 'open_in_browser',
        filter: ['Actions'],
      },
      {
        name: 'open_in_full',
        filter: ['UI actions'],
      },
      {
        name: 'open_in_new',
        filter: ['UI actions'],
      },
      {
        name: 'open_in_new_down',
        filter: ['UI actions'],
      },
      {
        name: 'open_in_new_off',
        filter: ['UI actions'],
      },
      {
        name: 'open_jam',
        filter: ['Hardware'],
      },
      {
        name: 'open_run',
        filter: ['UI actions'],
      },
      {
        name: 'open_with',
        filter: ['UI actions'],
      },
      {
        name: 'ophthalmology',
        filter: ['Social'],
      },
      {
        name: 'oral_disease',
        filter: ['Social'],
      },
      {
        name: 'orbit',
        filter: ['Social'],
      },
      {
        name: 'order_approve',
        filter: ['Business'],
      },
      {
        name: 'order_play',
        filter: ['Business'],
      },
      {
        name: 'orders',
        filter: ['Business'],
      },
      {
        name: 'orthopedics',
        filter: ['Social'],
      },
      {
        name: 'other_admission',
        filter: ['Text'],
      },
      {
        name: 'other_houses',
        filter: ['Travel'],
      },
      {
        name: 'outbound',
        filter: ['Actions'],
      },
      {
        name: 'outbox',
        filter: ['Communicate'],
      },
      {
        name: 'outbox_alt',
        filter: ['Communicate'],
      },
      {
        name: 'outdoor_garden',
        filter: ['Social'],
      },
      {
        name: 'outdoor_grill',
        filter: ['Household'],
      },
      {
        name: 'outgoing_mail',
        filter: ['Communicate'],
      },
      {
        name: 'outlet',
        filter: ['Household'],
      },
      {
        name: 'outlined_flag',
        filter: ['content'],
      },
      {
        name: 'outpatient',
        filter: ['Social'],
      },
      {
        name: 'outpatient_med',
        filter: ['Social'],
      },
      {
        name: 'output',
        filter: ['UI actions'],
      },
      {
        name: 'output_circle',
        filter: ['UI actions'],
      },
      {
        name: 'oven',
        filter: ['Household'],
      },
      {
        name: 'oven_gen',
        filter: ['Household'],
      },
      {
        name: 'overview',
        filter: ['Text'],
      },
      {
        name: 'overview_key',
        filter: ['Android'],
      },
      {
        name: 'owl',
        filter: ['Social'],
      },
      {
        name: 'oxygen_saturation',
        filter: ['Social'],
      },
      {
        name: 'p2p',
        filter: ['Hardware'],
      },
      {
        name: 'pace',
        filter: ['Activities'],
      },
      {
        name: 'pacemaker',
        filter: ['Hardware'],
      },
      {
        name: 'package',
        filter: ['Maps'],
      },
      {
        name: 'package_2',
        filter: ['Maps'],
      },
      {
        name: 'padding',
        filter: ['Text'],
      },
      {
        name: 'padel',
        filter: ['Activities'],
      },
      {
        name: 'page_control',
        filter: ['UI actions'],
      },
      {
        name: 'page_footer',
        filter: ['Text'],
      },
      {
        name: 'page_header',
        filter: ['Text'],
      },
      {
        name: 'page_info',
        filter: ['UI actions'],
      },
      {
        name: 'page_menu_ios',
        filter: ['UI actions'],
      },
      {
        name: 'pageless',
        filter: ['Text'],
      },
      {
        name: 'pages',
        filter: ['Text'],
      },
      {
        name: 'pageview',
        filter: ['Actions'],
      },
      {
        name: 'paid',
        filter: ['Business'],
      },
      {
        name: 'palette',
        filter: ['Images'],
      },
      {
        name: 'pallet',
        filter: ['Business'],
      },
      {
        name: 'pan_tool',
        filter: ['Actions'],
      },
      {
        name: 'pan_tool_alt',
        filter: ['Actions'],
      },
      {
        name: 'pan_zoom',
        filter: ['Actions'],
      },
      {
        name: 'panorama',
        filter: ['Images'],
      },
      {
        name: 'panorama_fish_eye',
        filter: ['image'],
      },
      {
        name: 'panorama_horizontal',
        filter: ['Images'],
      },
      {
        name: 'panorama_horizontal_select',
        filter: ['image'],
      },
      {
        name: 'panorama_photosphere',
        filter: ['Images'],
      },
      {
        name: 'panorama_photosphere_select',
        filter: ['image'],
      },
      {
        name: 'panorama_vertical',
        filter: ['Images'],
      },
      {
        name: 'panorama_vertical_select',
        filter: ['image'],
      },
      {
        name: 'panorama_wide_angle',
        filter: ['Images'],
      },
      {
        name: 'panorama_wide_angle_select',
        filter: ['image'],
      },
      {
        name: 'paragliding',
        filter: ['Activities'],
      },
      {
        name: 'parent_child_dining',
        filter: ['Maps'],
      },
      {
        name: 'park',
        filter: ['Maps'],
      },
      {
        name: 'parking_meter',
        filter: ['Transit'],
      },
      {
        name: 'parking_sign',
        filter: ['Transit'],
      },
      {
        name: 'parking_valet',
        filter: ['Transit'],
      },
      {
        name: 'partly_cloudy_day',
        filter: ['Social'],
      },
      {
        name: 'partly_cloudy_night',
        filter: ['Social'],
      },
      {
        name: 'partner_exchange',
        filter: ['Social'],
      },
      {
        name: 'partner_heart',
        filter: ['Social'],
      },
      {
        name: 'partner_reports',
        filter: ['UI actions'],
      },
      {
        name: 'party_mode',
        filter: ['Images'],
      },
      {
        name: 'passkey',
        filter: ['Privacy'],
      },
      {
        name: 'password',
        filter: ['Android'],
      },
      {
        name: 'password_2',
        filter: ['Android'],
      },
      {
        name: 'password_2_off',
        filter: ['Android'],
      },
      {
        name: 'patient_list',
        filter: ['UI actions'],
      },
      {
        name: 'pattern',
        filter: ['Android'],
      },
      {
        name: 'pause',
        filter: ['Audio&Video'],
      },
      {
        name: 'pause_circle',
        filter: ['Audio&Video'],
      },
      {
        name: 'pause_circle_filled',
        filter: ['av'],
      },
      {
        name: 'pause_circle_outline',
        filter: ['av'],
      },
      {
        name: 'pause_presentation',
        filter: ['Communicate'],
      },
      {
        name: 'payment',
        filter: ['action'],
      },
      {
        name: 'payment_arrow_down',
        filter: ['Business'],
      },
      {
        name: 'payment_card',
        filter: ['Business'],
      },
      {
        name: 'payments',
        filter: ['Business'],
      },
      {
        name: 'pedal_bike',
        filter: ['Transit'],
      },
      {
        name: 'pediatrics',
        filter: ['Social'],
      },
      {
        name: 'pen_size_1',
        filter: ['Text'],
      },
      {
        name: 'pen_size_2',
        filter: ['Text'],
      },
      {
        name: 'pen_size_3',
        filter: ['Text'],
      },
      {
        name: 'pen_size_4',
        filter: ['Text'],
      },
      {
        name: 'pen_size_5',
        filter: ['Text'],
      },
      {
        name: 'pending',
        filter: ['Actions'],
      },
      {
        name: 'pending_actions',
        filter: ['Text'],
      },
      {
        name: 'pentagon',
        filter: ['Text'],
      },
      {
        name: 'people',
        filter: ['social'],
      },
      {
        name: 'people_alt',
        filter: ['social'],
      },
      {
        name: 'people_outline',
        filter: ['social'],
      },
      {
        name: 'percent',
        filter: ['Text'],
      },
      {
        name: 'percent_discount',
        filter: ['Business'],
      },
      {
        name: 'pergola',
        filter: ['Maps'],
      },
      {
        name: 'perm_camera_mic',
        filter: ['Images'],
      },
      {
        name: 'perm_contact_calendar',
        filter: ['Actions'],
      },
      {
        name: 'perm_data_setting',
        filter: ['Android'],
      },
      {
        name: 'perm_device_information',
        filter: ['action'],
      },
      {
        name: 'perm_identity',
        filter: ['action'],
      },
      {
        name: 'perm_media',
        filter: ['Text'],
      },
      {
        name: 'perm_phone_msg',
        filter: ['Communicate'],
      },
      {
        name: 'perm_scan_wifi',
        filter: ['Android'],
      },
      {
        name: 'person',
        filter: ['Social'],
      },
      {
        name: 'person_2',
        filter: ['Social'],
      },
      {
        name: 'person_3',
        filter: ['Social'],
      },
      {
        name: 'person_4',
        filter: ['Social'],
      },
      {
        name: 'person_add',
        filter: ['Social'],
      },
      {
        name: 'person_add_alt',
        filter: ['social'],
      },
      {
        name: 'person_add_alt_1',
        filter: ['social'],
      },
      {
        name: 'person_add_disabled',
        filter: ['Actions'],
      },
      {
        name: 'person_alert',
        filter: ['Social'],
      },
      {
        name: 'person_apron',
        filter: ['Social'],
      },
      {
        name: 'person_book',
        filter: ['Text'],
      },
      {
        name: 'person_cancel',
        filter: ['Social'],
      },
      {
        name: 'person_celebrate',
        filter: ['Activities'],
      },
      {
        name: 'person_check',
        filter: ['Social'],
      },
      {
        name: 'person_edit',
        filter: ['Actions'],
      },
      {
        name: 'person_heart',
        filter: ['Social'],
      },
      {
        name: 'person_off',
        filter: ['Social'],
      },
      {
        name: 'person_outline',
        filter: ['social'],
      },
      {
        name: 'person_pin',
        filter: ['Maps'],
      },
      {
        name: 'person_pin_circle',
        filter: ['Maps'],
      },
      {
        name: 'person_play',
        filter: ['Activities'],
      },
      {
        name: 'person_raised_hand',
        filter: ['Social'],
      },
      {
        name: 'person_remove',
        filter: ['Social'],
      },
      {
        name: 'person_remove_alt_1',
        filter: ['social'],
      },
      {
        name: 'person_search',
        filter: ['Communicate'],
      },
      {
        name: 'person_shield',
        filter: ['Privacy'],
      },
      {
        name: 'personal_bag',
        filter: ['Travel'],
      },
      {
        name: 'personal_bag_off',
        filter: ['Travel'],
      },
      {
        name: 'personal_bag_question',
        filter: ['Travel'],
      },
      {
        name: 'personal_injury',
        filter: ['Activities'],
      },
      {
        name: 'personal_places',
        filter: ['Travel'],
      },
      {
        name: 'personal_video',
        filter: ['notification'],
      },
      {
        name: 'pest_control',
        filter: ['Maps'],
      },
      {
        name: 'pest_control_rodent',
        filter: ['Maps'],
      },
      {
        name: 'pet_supplies',
        filter: ['Maps'],
      },
      {
        name: 'pets',
        filter: ['Social'],
      },
      {
        name: 'phishing',
        filter: ['Activities'],
      },
      {
        name: 'phone',
        filter: ['communication'],
      },
      {
        name: 'phone_android',
        filter: ['hardware'],
      },
      {
        name: 'phone_bluetooth_speaker',
        filter: ['Communicate'],
      },
      {
        name: 'phone_callback',
        filter: ['Communicate'],
      },
      {
        name: 'phone_disabled',
        filter: ['Communicate'],
      },
      {
        name: 'phone_enabled',
        filter: ['Communicate'],
      },
      {
        name: 'phone_forwarded',
        filter: ['Communicate'],
      },
      {
        name: 'phone_in_talk',
        filter: ['Communicate'],
      },
      {
        name: 'phone_iphone',
        filter: ['hardware'],
      },
      {
        name: 'phone_locked',
        filter: ['Communicate'],
      },
      {
        name: 'phone_missed',
        filter: ['Communicate'],
      },
      {
        name: 'phone_paused',
        filter: ['Communicate'],
      },
      {
        name: 'phonelink',
        filter: ['hardware'],
      },
      {
        name: 'phonelink_erase',
        filter: ['communication'],
      },
      {
        name: 'phonelink_lock',
        filter: ['communication'],
      },
      {
        name: 'phonelink_off',
        filter: ['hardware'],
      },
      {
        name: 'phonelink_ring',
        filter: ['communication'],
      },
      {
        name: 'phonelink_setup',
        filter: ['communication'],
      },
      {
        name: 'photo',
        filter: ['Images'],
      },
      {
        name: 'photo_album',
        filter: ['Images'],
      },
      {
        name: 'photo_auto_merge',
        filter: ['Images'],
      },
      {
        name: 'photo_camera',
        filter: ['Images'],
      },
      {
        name: 'photo_camera_back',
        filter: ['Images'],
      },
      {
        name: 'photo_camera_front',
        filter: ['Images'],
      },
      {
        name: 'photo_filter',
        filter: ['image'],
      },
      {
        name: 'photo_frame',
        filter: ['Images'],
      },
      {
        name: 'photo_library',
        filter: ['Images'],
      },
      {
        name: 'photo_prints',
        filter: ['Images'],
      },
      {
        name: 'photo_size_select_actual',
        filter: ['image'],
      },
      {
        name: 'photo_size_select_large',
        filter: ['Images'],
      },
      {
        name: 'photo_size_select_small',
        filter: ['Images'],
      },
      {
        name: 'php',
        filter: ['UI actions'],
      },
      {
        name: 'physical_therapy',
        filter: ['Activities'],
      },
      {
        name: 'piano',
        filter: ['Activities'],
      },
      {
        name: 'piano_off',
        filter: ['Activities'],
      },
      {
        name: 'pickleball',
        filter: ['Activities'],
      },
      {
        name: 'picture_as_pdf',
        filter: ['Images'],
      },
      {
        name: 'picture_in_picture',
        filter: ['Communicate'],
      },
      {
        name: 'picture_in_picture_alt',
        filter: ['Communicate'],
      },
      {
        name: 'picture_in_picture_center',
        filter: ['Communicate'],
      },
      {
        name: 'picture_in_picture_large',
        filter: ['Communicate'],
      },
      {
        name: 'picture_in_picture_medium',
        filter: ['Communicate'],
      },
      {
        name: 'picture_in_picture_mobile',
        filter: ['Communicate'],
      },
      {
        name: 'picture_in_picture_off',
        filter: ['Communicate'],
      },
      {
        name: 'picture_in_picture_small',
        filter: ['Communicate'],
      },
      {
        name: 'pie_chart',
        filter: ['Business'],
      },
      {
        name: 'pie_chart_outline',
        filter: ['editor'],
      },
      {
        name: 'pie_chart_outlined',
        filter: ['editor'],
      },
      {
        name: 'pill',
        filter: ['Social'],
      },
      {
        name: 'pill_off',
        filter: ['Social'],
      },
      {
        name: 'pin',
        filter: ['Android'],
      },
      {
        name: 'pin_drop',
        filter: ['Maps'],
      },
      {
        name: 'pin_end',
        filter: ['Actions'],
      },
      {
        name: 'pin_invoke',
        filter: ['Actions'],
      },
      {
        name: 'pinboard',
        filter: ['Actions'],
      },
      {
        name: 'pinboard_unread',
        filter: ['Actions'],
      },
      {
        name: 'pinch',
        filter: ['UI actions'],
      },
      {
        name: 'pinch_zoom_in',
        filter: ['Actions'],
      },
      {
        name: 'pinch_zoom_out',
        filter: ['Actions'],
      },
      {
        name: 'pip',
        filter: ['UI actions'],
      },
      {
        name: 'pip_exit',
        filter: ['UI actions'],
      },
      {
        name: 'pivot_table_chart',
        filter: ['Text'],
      },
      {
        name: 'pix',
        filter: ['social'],
      },
      {
        name: 'place',
        filter: ['maps'],
      },
      {
        name: 'place_item',
        filter: ['UI actions'],
      },
      {
        name: 'plagiarism',
        filter: ['Text'],
      },
      {
        name: 'plane_contrails',
        filter: ['Transit'],
      },
      {
        name: 'planet',
        filter: ['Social'],
      },
      {
        name: 'planner_banner_ad_pt',
        filter: ['Images'],
      },
      {
        name: 'planner_review',
        filter: ['Business'],
      },
      {
        name: 'play_arrow',
        filter: ['Audio&Video'],
      },
      {
        name: 'play_circle',
        filter: ['Audio&Video'],
      },
      {
        name: 'play_circle_filled',
        filter: ['av'],
      },
      {
        name: 'play_circle_outline',
        filter: ['av'],
      },
      {
        name: 'play_disabled',
        filter: ['Audio&Video'],
      },
      {
        name: 'play_for_work',
        filter: ['Communicate'],
      },
      {
        name: 'play_lesson',
        filter: ['Audio&Video'],
      },
      {
        name: 'play_pause',
        filter: ['Audio&Video'],
      },
      {
        name: 'playground',
        filter: ['Social'],
      },
      {
        name: 'playground_2',
        filter: ['Social'],
      },
      {
        name: 'playing_cards',
        filter: ['Social'],
      },
      {
        name: 'playlist_add',
        filter: ['Audio&Video'],
      },
      {
        name: 'playlist_add_check',
        filter: ['Audio&Video'],
      },
      {
        name: 'playlist_add_check_circle',
        filter: ['Audio&Video'],
      },
      {
        name: 'playlist_add_circle',
        filter: ['Audio&Video'],
      },
      {
        name: 'playlist_play',
        filter: ['Audio&Video'],
      },
      {
        name: 'playlist_remove',
        filter: ['Audio&Video'],
      },
      {
        name: 'plug_connect',
        filter: ['Hardware'],
      },
      {
        name: 'plumbing',
        filter: ['Maps'],
      },
      {
        name: 'plus_one',
        filter: ['social'],
      },
      {
        name: 'podcasts',
        filter: ['Audio&Video'],
      },
      {
        name: 'podiatry',
        filter: ['Activities'],
      },
      {
        name: 'podium',
        filter: ['Business'],
      },
      {
        name: 'point_of_sale',
        filter: ['Hardware'],
      },
      {
        name: 'point_scan',
        filter: ['UI actions'],
      },
      {
        name: 'poker_chip',
        filter: ['Social'],
      },
      {
        name: 'policy',
        filter: ['Privacy'],
      },
      {
        name: 'policy_alert',
        filter: ['Privacy'],
      },
      {
        name: 'poll',
        filter: ['social'],
      },
      {
        name: 'polyline',
        filter: ['Text'],
      },
      {
        name: 'polymer',
        filter: ['Actions'],
      },
      {
        name: 'pool',
        filter: ['Travel'],
      },
      {
        name: 'portable_wifi_off',
        filter: ['Android'],
      },
      {
        name: 'portrait',
        filter: ['image'],
      },
      {
        name: 'position_bottom_left',
        filter: ['UI actions'],
      },
      {
        name: 'position_bottom_right',
        filter: ['UI actions'],
      },
      {
        name: 'position_top_right',
        filter: ['UI actions'],
      },
      {
        name: 'post',
        filter: ['Text'],
      },
      {
        name: 'post_add',
        filter: ['Text'],
      },
      {
        name: 'potted_plant',
        filter: ['Social'],
      },
      {
        name: 'power',
        filter: ['Hardware'],
      },
      {
        name: 'power_input',
        filter: ['Hardware'],
      },
      {
        name: 'power_off',
        filter: ['Hardware'],
      },
      {
        name: 'power_settings_circle',
        filter: ['Actions'],
      },
      {
        name: 'power_settings_new',
        filter: ['Actions'],
      },
      {
        name: 'prayer_times',
        filter: ['Social'],
      },
      {
        name: 'precision_manufacturing',
        filter: ['Business'],
      },
      {
        name: 'pregnancy',
        filter: ['Social'],
      },
      {
        name: 'pregnant_woman',
        filter: ['Social'],
      },
      {
        name: 'preliminary',
        filter: ['UI actions'],
      },
      {
        name: 'prescriptions',
        filter: ['Social'],
      },
      {
        name: 'present_to_all',
        filter: ['Communicate'],
      },
      {
        name: 'preview',
        filter: ['Actions'],
      },
      {
        name: 'preview_off',
        filter: ['Actions'],
      },
      {
        name: 'price_change',
        filter: ['Business'],
      },
      {
        name: 'price_check',
        filter: ['Business'],
      },
      {
        name: 'print',
        filter: ['Hardware'],
      },
      {
        name: 'print_add',
        filter: ['Hardware'],
      },
      {
        name: 'print_connect',
        filter: ['Hardware'],
      },
      {
        name: 'print_disabled',
        filter: ['Hardware'],
      },
      {
        name: 'print_error',
        filter: ['Hardware'],
      },
      {
        name: 'print_lock',
        filter: ['Hardware'],
      },
      {
        name: 'priority',
        filter: ['Actions'],
      },
      {
        name: 'priority_high',
        filter: ['Actions'],
      },
      {
        name: 'privacy',
        filter: ['Audio&Video'],
      },
      {
        name: 'privacy_tip',
        filter: ['Privacy'],
      },
      {
        name: 'private_connectivity',
        filter: ['Privacy'],
      },
      {
        name: 'problem',
        filter: ['Actions'],
      },
      {
        name: 'procedure',
        filter: ['Social'],
      },
      {
        name: 'process_chart',
        filter: ['Text'],
      },
      {
        name: 'production_quantity_limits',
        filter: ['Business'],
      },
      {
        name: 'productivity',
        filter: ['Home'],
      },
      {
        name: 'progress_activity',
        filter: ['UI actions'],
      },
      {
        name: 'prompt_suggestion',
        filter: ['UI actions'],
      },
      {
        name: 'propane',
        filter: ['Household'],
      },
      {
        name: 'propane_tank',
        filter: ['Household'],
      },
      {
        name: 'psychiatry',
        filter: ['Social'],
      },
      {
        name: 'psychology',
        filter: ['Social'],
      },
      {
        name: 'psychology_alt',
        filter: ['Social'],
      },
      {
        name: 'public',
        filter: ['Social'],
      },
      {
        name: 'public_off',
        filter: ['Social'],
      },
      {
        name: 'publish',
        filter: ['UI actions'],
      },
      {
        name: 'published_with_changes',
        filter: ['Actions'],
      },
      {
        name: 'pulmonology',
        filter: ['Social'],
      },
      {
        name: 'pulse_alert',
        filter: ['Social'],
      },
      {
        name: 'punch_clock',
        filter: ['Hardware'],
      },
      {
        name: 'push_pin',
        filter: ['content'],
      },
      {
        name: 'qr_code',
        filter: ['Business'],
      },
      {
        name: 'qr_code_2',
        filter: ['Business'],
      },
      {
        name: 'qr_code_2_add',
        filter: ['Business'],
      },
      {
        name: 'qr_code_scanner',
        filter: ['Business'],
      },
      {
        name: 'query_builder',
        filter: ['action'],
      },
      {
        name: 'query_stats',
        filter: ['Business'],
      },
      {
        name: 'question_answer',
        filter: ['action'],
      },
      {
        name: 'question_exchange',
        filter: ['UI actions'],
      },
      {
        name: 'question_mark',
        filter: ['Actions'],
      },
      {
        name: 'queue',
        filter: ['av'],
      },
      {
        name: 'queue_music',
        filter: ['Audio&Video'],
      },
      {
        name: 'queue_play_next',
        filter: ['Audio&Video'],
      },
      {
        name: 'quick_phrases',
        filter: ['Android'],
      },
      {
        name: 'quick_reference',
        filter: ['UI actions'],
      },
      {
        name: 'quick_reference_all',
        filter: ['UI actions'],
      },
      {
        name: 'quick_reorder',
        filter: ['Business'],
      },
      {
        name: 'quickreply',
        filter: ['Communicate'],
      },
      {
        name: 'quiz',
        filter: ['Social'],
      },
      {
        name: 'r_mobiledata',
        filter: ['Android'],
      },
      {
        name: 'radar',
        filter: ['Android'],
      },
      {
        name: 'radio',
        filter: ['Audio&Video'],
      },
      {
        name: 'radio_button_checked',
        filter: ['UI actions'],
      },
      {
        name: 'radio_button_partial',
        filter: ['UI actions'],
      },
      {
        name: 'radio_button_unchecked',
        filter: ['UI actions'],
      },
      {
        name: 'radiology',
        filter: ['Social'],
      },
      {
        name: 'railway_alert',
        filter: ['Transit'],
      },
      {
        name: 'railway_alert_2',
        filter: ['Transit'],
      },
      {
        name: 'rainy',
        filter: ['Social'],
      },
      {
        name: 'rainy_heavy',
        filter: ['Social'],
      },
      {
        name: 'rainy_light',
        filter: ['Social'],
      },
      {
        name: 'rainy_snow',
        filter: ['Social'],
      },
      {
        name: 'ramen_dining',
        filter: ['Travel'],
      },
      {
        name: 'ramp_left',
        filter: ['Hardware'],
      },
      {
        name: 'ramp_right',
        filter: ['Hardware'],
      },
      {
        name: 'range_hood',
        filter: ['Household'],
      },
      {
        name: 'rate_review',
        filter: ['Actions'],
      },
      {
        name: 'raven',
        filter: ['Social'],
      },
      {
        name: 'raw_off',
        filter: ['Images'],
      },
      {
        name: 'raw_on',
        filter: ['Images'],
      },
      {
        name: 'read_more',
        filter: ['Text'],
      },
      {
        name: 'readiness_score',
        filter: ['Activities'],
      },
      {
        name: 'real_estate_agent',
        filter: ['Activities'],
      },
      {
        name: 'rear_camera',
        filter: ['Hardware'],
      },
      {
        name: 'rebase',
        filter: ['UI actions'],
      },
      {
        name: 'rebase_edit',
        filter: ['UI actions'],
      },
      {
        name: 'receipt',
        filter: ['Business'],
      },
      {
        name: 'receipt_long',
        filter: ['Business'],
      },
      {
        name: 'receipt_long_off',
        filter: ['Business'],
      },
      {
        name: 'recent_actors',
        filter: ['Audio&Video'],
      },
      {
        name: 'recent_patient',
        filter: ['Social'],
      },
      {
        name: 'recenter',
        filter: ['UI actions'],
      },
      {
        name: 'recommend',
        filter: ['Social'],
      },
      {
        name: 'record_voice_over',
        filter: ['Actions'],
      },
      {
        name: 'rectangle',
        filter: ['Text'],
      },
      {
        name: 'recycling',
        filter: ['Social'],
      },
      {
        name: 'redeem',
        filter: ['Business'],
      },
      {
        name: 'redo',
        filter: ['UI actions'],
      },
      {
        name: 'reduce_capacity',
        filter: ['Social'],
      },
      {
        name: 'refresh',
        filter: ['UI actions'],
      },
      {
        name: 'regular_expression',
        filter: ['Text'],
      },
      {
        name: 'relax',
        filter: ['Activities'],
      },
      {
        name: 'release_alert',
        filter: ['Actions'],
      },
      {
        name: 'remember_me',
        filter: ['Hardware'],
      },
      {
        name: 'reminder',
        filter: ['Actions'],
      },
      {
        name: 'remote_gen',
        filter: ['Household'],
      },
      {
        name: 'remove',
        filter: ['UI actions'],
      },
      {
        name: 'remove_circle',
        filter: ['content'],
      },
      {
        name: 'remove_circle_outline',
        filter: ['content'],
      },
      {
        name: 'remove_done',
        filter: ['UI actions'],
      },
      {
        name: 'remove_from_queue',
        filter: ['Audio&Video'],
      },
      {
        name: 'remove_moderator',
        filter: ['Privacy'],
      },
      {
        name: 'remove_red_eye',
        filter: ['image'],
      },
      {
        name: 'remove_road',
        filter: ['Maps'],
      },
      {
        name: 'remove_selection',
        filter: ['Text'],
      },
      {
        name: 'remove_shopping_cart',
        filter: ['Business'],
      },
      {
        name: 'reopen_window',
        filter: ['UI actions'],
      },
      {
        name: 'reorder',
        filter: ['Text'],
      },
      {
        name: 'repartition',
        filter: ['UI actions'],
      },
      {
        name: 'repeat',
        filter: ['Audio&Video'],
      },
      {
        name: 'repeat_on',
        filter: ['Audio&Video'],
      },
      {
        name: 'repeat_one',
        filter: ['Audio&Video'],
      },
      {
        name: 'repeat_one_on',
        filter: ['Audio&Video'],
      },
      {
        name: 'replace_audio',
        filter: ['Audio&Video'],
      },
      {
        name: 'replace_image',
        filter: ['Audio&Video'],
      },
      {
        name: 'replace_video',
        filter: ['Audio&Video'],
      },
      {
        name: 'replay',
        filter: ['Audio&Video'],
      },
      {
        name: 'replay_10',
        filter: ['Audio&Video'],
      },
      {
        name: 'replay_30',
        filter: ['Audio&Video'],
      },
      {
        name: 'replay_5',
        filter: ['Audio&Video'],
      },
      {
        name: 'replay_circle_filled',
        filter: ['av'],
      },
      {
        name: 'reply',
        filter: ['UI actions'],
      },
      {
        name: 'reply_all',
        filter: ['UI actions'],
      },
      {
        name: 'report',
        filter: ['Privacy'],
      },
      {
        name: 'report_gmailerrorred',
        filter: ['content'],
      },
      {
        name: 'report_off',
        filter: ['Privacy'],
      },
      {
        name: 'report_problem',
        filter: ['action'],
      },
      {
        name: 'request_page',
        filter: ['Text'],
      },
      {
        name: 'request_quote',
        filter: ['Text'],
      },
      {
        name: 'reset_brightness',
        filter: ['Images'],
      },
      {
        name: 'reset_exposure',
        filter: ['Images'],
      },
      {
        name: 'reset_focus',
        filter: ['Images'],
      },
      {
        name: 'reset_image',
        filter: ['Text'],
      },
      {
        name: 'reset_iso',
        filter: ['Images'],
      },
      {
        name: 'reset_settings',
        filter: ['Images'],
      },
      {
        name: 'reset_shadow',
        filter: ['Images'],
      },
      {
        name: 'reset_shutter_speed',
        filter: ['Images'],
      },
      {
        name: 'reset_tv',
        filter: ['Hardware'],
      },
      {
        name: 'reset_white_balance',
        filter: ['Images'],
      },
      {
        name: 'reset_wrench',
        filter: ['Hardware'],
      },
      {
        name: 'resize',
        filter: ['UI actions'],
      },
      {
        name: 'respiratory_rate',
        filter: ['Social'],
      },
      {
        name: 'responsive_layout',
        filter: ['UI actions'],
      },
      {
        name: 'rest_area',
        filter: ['Maps'],
      },
      {
        name: 'restart_alt',
        filter: ['UI actions'],
      },
      {
        name: 'restaurant',
        filter: ['Maps'],
      },
      {
        name: 'restaurant_menu',
        filter: ['maps'],
      },
      {
        name: 'restore',
        filter: ['action'],
      },
      {
        name: 'restore_from_trash',
        filter: ['UI actions'],
      },
      {
        name: 'restore_page',
        filter: ['Text'],
      },
      {
        name: 'resume',
        filter: ['Audio&Video'],
      },
      {
        name: 'reviews',
        filter: ['Communicate'],
      },
      {
        name: 'rewarded_ads',
        filter: ['Activities'],
      },
      {
        name: 'rheumatology',
        filter: ['Social'],
      },
      {
        name: 'rib_cage',
        filter: ['Social'],
      },
      {
        name: 'rice_bowl',
        filter: ['Travel'],
      },
      {
        name: 'right_click',
        filter: ['UI actions'],
      },
      {
        name: 'right_panel_close',
        filter: ['UI actions'],
      },
      {
        name: 'right_panel_open',
        filter: ['UI actions'],
      },
      {
        name: 'ring_volume',
        filter: ['Communicate'],
      },
      {
        name: 'ripples',
        filter: ['UI actions'],
      },
      {
        name: 'road',
        filter: ['Transit'],
      },
      {
        name: 'robot',
        filter: ['Hardware'],
      },
      {
        name: 'robot_2',
        filter: ['Hardware'],
      },
      {
        name: 'rocket',
        filter: ['Social'],
      },
      {
        name: 'rocket_launch',
        filter: ['Social'],
      },
      {
        name: 'roller_shades',
        filter: ['Household'],
      },
      {
        name: 'roller_shades_closed',
        filter: ['Household'],
      },
      {
        name: 'roller_skating',
        filter: ['Activities'],
      },
      {
        name: 'roofing',
        filter: ['Household'],
      },
      {
        name: 'room',
        filter: ['action'],
      },
      {
        name: 'room_preferences',
        filter: ['Business'],
      },
      {
        name: 'room_service',
        filter: ['Travel'],
      },
      {
        name: 'rotate_90_degrees_ccw',
        filter: ['Images'],
      },
      {
        name: 'rotate_90_degrees_cw',
        filter: ['Images'],
      },
      {
        name: 'rotate_auto',
        filter: ['UI actions'],
      },
      {
        name: 'rotate_left',
        filter: ['Images'],
      },
      {
        name: 'rotate_right',
        filter: ['Images'],
      },
      {
        name: 'roundabout_left',
        filter: ['Hardware'],
      },
      {
        name: 'roundabout_right',
        filter: ['Hardware'],
      },
      {
        name: 'rounded_corner',
        filter: ['Actions'],
      },
      {
        name: 'route',
        filter: ['Hardware'],
      },
      {
        name: 'router',
        filter: ['Hardware'],
      },
      {
        name: 'router_off',
        filter: ['Hardware'],
      },
      {
        name: 'routine',
        filter: ['Social'],
      },
      {
        name: 'rowing',
        filter: ['Activities'],
      },
      {
        name: 'rss_feed',
        filter: ['Android'],
      },
      {
        name: 'rsvp',
        filter: ['Actions'],
      },
      {
        name: 'rtt',
        filter: ['Communicate'],
      },
      {
        name: 'rubric',
        filter: ['Text'],
      },
      {
        name: 'rule',
        filter: ['Actions'],
      },
      {
        name: 'rule_folder',
        filter: ['Text'],
      },
      {
        name: 'rule_settings',
        filter: ['UI actions'],
      },
      {
        name: 'run_circle',
        filter: ['Maps'],
      },
      {
        name: 'running_with_errors',
        filter: ['Actions'],
      },
      {
        name: 'rv_hookup',
        filter: ['Transit'],
      },
      {
        name: 'safety_check',
        filter: ['Maps'],
      },
      {
        name: 'safety_check_off',
        filter: ['Maps'],
      },
      {
        name: 'safety_divider',
        filter: ['Social'],
      },
      {
        name: 'sailing',
        filter: ['Transit'],
      },
      {
        name: 'salinity',
        filter: ['Social'],
      },
      {
        name: 'sanitizer',
        filter: ['Social'],
      },
      {
        name: 'satellite',
        filter: ['Maps'],
      },
      {
        name: 'satellite_alt',
        filter: ['Communicate'],
      },
      {
        name: 'sauna',
        filter: ['Activities'],
      },
      {
        name: 'save',
        filter: ['Hardware'],
      },
      {
        name: 'save_alt',
        filter: ['content'],
      },
      {
        name: 'save_as',
        filter: ['Actions'],
      },
      {
        name: 'save_clock',
        filter: ['Hardware'],
      },
      {
        name: 'saved_search',
        filter: ['UI actions'],
      },
      {
        name: 'savings',
        filter: ['Business'],
      },
      {
        name: 'scale',
        filter: ['Hardware'],
      },
      {
        name: 'scan',
        filter: ['Text'],
      },
      {
        name: 'scan_delete',
        filter: ['Text'],
      },
      {
        name: 'scanner',
        filter: ['Hardware'],
      },
      {
        name: 'scatter_plot',
        filter: ['Business'],
      },
      {
        name: 'scene',
        filter: ['Household'],
      },
      {
        name: 'schedule',
        filter: ['Actions'],
      },
      {
        name: 'schedule_send',
        filter: ['Communicate'],
      },
      {
        name: 'schema',
        filter: ['Business'],
      },
      {
        name: 'school',
        filter: ['Activities'],
      },
      {
        name: 'science',
        filter: ['Activities'],
      },
      {
        name: 'science_off',
        filter: ['Activities'],
      },
      {
        name: 'scooter',
        filter: ['Transit'],
      },
      {
        name: 'score',
        filter: ['Communicate'],
      },
      {
        name: 'scoreboard',
        filter: ['Activities'],
      },
      {
        name: 'screen_lock_landscape',
        filter: ['device'],
      },
      {
        name: 'screen_lock_portrait',
        filter: ['device'],
      },
      {
        name: 'screen_lock_rotation',
        filter: ['device'],
      },
      {
        name: 'screen_record',
        filter: ['Android'],
      },
      {
        name: 'screen_rotation',
        filter: ['device'],
      },
      {
        name: 'screen_rotation_alt',
        filter: ['Android'],
      },
      {
        name: 'screen_rotation_up',
        filter: ['Android'],
      },
      {
        name: 'screen_search_desktop',
        filter: ['Hardware'],
      },
      {
        name: 'screen_share',
        filter: ['Hardware'],
      },
      {
        name: 'screenshot',
        filter: ['device'],
      },
      {
        name: 'screenshot_frame',
        filter: ['Android'],
      },
      {
        name: 'screenshot_frame_2',
        filter: ['Android'],
      },
      {
        name: 'screenshot_keyboard',
        filter: ['Android'],
      },
      {
        name: 'screenshot_monitor',
        filter: ['Hardware'],
      },
      {
        name: 'screenshot_region',
        filter: ['Android'],
      },
      {
        name: 'screenshot_tablet',
        filter: ['Hardware'],
      },
      {
        name: 'script',
        filter: ['Text'],
      },
      {
        name: 'scrollable_header',
        filter: ['Actions'],
      },
      {
        name: 'scuba_diving',
        filter: ['Activities'],
      },
      {
        name: 'sd',
        filter: ['Audio&Video'],
      },
      {
        name: 'sd_card',
        filter: ['Hardware'],
      },
      {
        name: 'sd_card_alert',
        filter: ['Hardware'],
      },
      {
        name: 'sd_storage',
        filter: ['device'],
      },
      {
        name: 'sdk',
        filter: ['Actions'],
      },
      {
        name: 'search',
        filter: ['UI actions'],
      },
      {
        name: 'search_activity',
        filter: ['Actions'],
      },
      {
        name: 'search_check',
        filter: ['UI actions'],
      },
      {
        name: 'search_check_2',
        filter: ['UI actions'],
      },
      {
        name: 'search_gear',
        filter: ['UI actions'],
      },
      {
        name: 'search_hands_free',
        filter: ['Actions'],
      },
      {
        name: 'search_insights',
        filter: ['Business'],
      },
      {
        name: 'search_off',
        filter: ['UI actions'],
      },
      {
        name: 'seat_cool_left',
        filter: ['Transit'],
      },
      {
        name: 'seat_cool_right',
        filter: ['Transit'],
      },
      {
        name: 'seat_heat_left',
        filter: ['Transit'],
      },
      {
        name: 'seat_heat_right',
        filter: ['Transit'],
      },
      {
        name: 'seat_vent_left',
        filter: ['Transit'],
      },
      {
        name: 'seat_vent_right',
        filter: ['Transit'],
      },
      {
        name: 'security',
        filter: ['Privacy'],
      },
      {
        name: 'security_key',
        filter: ['Hardware'],
      },
      {
        name: 'security_update',
        filter: ['device'],
      },
      {
        name: 'security_update_good',
        filter: ['device'],
      },
      {
        name: 'security_update_warning',
        filter: ['device'],
      },
      {
        name: 'segment',
        filter: ['Text'],
      },
      {
        name: 'select',
        filter: ['Text'],
      },
      {
        name: 'select_all',
        filter: ['UI actions'],
      },
      {
        name: 'select_check_box',
        filter: ['UI actions'],
      },
      {
        name: 'select_to_speak',
        filter: ['Audio&Video'],
      },
      {
        name: 'select_window',
        filter: ['Actions'],
      },
      {
        name: 'select_window_2',
        filter: ['Actions'],
      },
      {
        name: 'select_window_off',
        filter: ['Actions'],
      },
      {
        name: 'self_care',
        filter: ['Home'],
      },
      {
        name: 'self_improvement',
        filter: ['Activities'],
      },
      {
        name: 'sell',
        filter: ['Business'],
      },
      {
        name: 'send',
        filter: ['Communicate'],
      },
      {
        name: 'send_and_archive',
        filter: ['Communicate'],
      },
      {
        name: 'send_money',
        filter: ['Business'],
      },
      {
        name: 'send_time_extension',
        filter: ['UI actions'],
      },
      {
        name: 'send_to_mobile',
        filter: ['device'],
      },
      {
        name: 'sensor_door',
        filter: ['Household'],
      },
      {
        name: 'sensor_occupied',
        filter: ['Household'],
      },
      {
        name: 'sensor_window',
        filter: ['Household'],
      },
      {
        name: 'sensors',
        filter: ['Household'],
      },
      {
        name: 'sensors_krx',
        filter: ['Home'],
      },
      {
        name: 'sensors_krx_off',
        filter: ['Home'],
      },
      {
        name: 'sensors_off',
        filter: ['Household'],
      },
      {
        name: 'sentiment_calm',
        filter: ['Social'],
      },
      {
        name: 'sentiment_content',
        filter: ['Social'],
      },
      {
        name: 'sentiment_dissatisfied',
        filter: ['Social'],
      },
      {
        name: 'sentiment_excited',
        filter: ['Social'],
      },
      {
        name: 'sentiment_extremely_dissatisfied',
        filter: ['Social'],
      },
      {
        name: 'sentiment_frustrated',
        filter: ['Social'],
      },
      {
        name: 'sentiment_neutral',
        filter: ['Social'],
      },
      {
        name: 'sentiment_sad',
        filter: ['Social'],
      },
      {
        name: 'sentiment_satisfied',
        filter: ['Social'],
      },
      {
        name: 'sentiment_satisfied_alt',
        filter: ['communication'],
      },
      {
        name: 'sentiment_stressed',
        filter: ['Social'],
      },
      {
        name: 'sentiment_very_dissatisfied',
        filter: ['Social'],
      },
      {
        name: 'sentiment_very_satisfied',
        filter: ['Social'],
      },
      {
        name: 'sentiment_worried',
        filter: ['Social'],
      },
      {
        name: 'serif',
        filter: ['Text'],
      },
      {
        name: 'server_person',
        filter: ['Hardware'],
      },
      {
        name: 'service_toolbox',
        filter: ['Activities'],
      },
      {
        name: 'set_meal',
        filter: ['Maps'],
      },
      {
        name: 'settings',
        filter: ['UI actions'],
      },
      {
        name: 'settings_accessibility',
        filter: ['UI actions'],
      },
      {
        name: 'settings_account_box',
        filter: ['Actions'],
      },
      {
        name: 'settings_alert',
        filter: ['Home'],
      },
      {
        name: 'settings_applications',
        filter: ['UI actions'],
      },
      {
        name: 'settings_b_roll',
        filter: ['Images'],
      },
      {
        name: 'settings_backup_restore',
        filter: ['UI actions'],
      },
      {
        name: 'settings_bluetooth',
        filter: ['Communicate'],
      },
      {
        name: 'settings_brightness',
        filter: ['Images'],
      },
      {
        name: 'settings_cell',
        filter: ['action'],
      },
      {
        name: 'settings_cinematic_blur',
        filter: ['Images'],
      },
      {
        name: 'settings_ethernet',
        filter: ['Hardware'],
      },
      {
        name: 'settings_heart',
        filter: ['UI actions'],
      },
      {
        name: 'settings_input_antenna',
        filter: ['Hardware'],
      },
      {
        name: 'settings_input_component',
        filter: ['Hardware'],
      },
      {
        name: 'settings_input_composite',
        filter: ['action'],
      },
      {
        name: 'settings_input_hdmi',
        filter: ['Hardware'],
      },
      {
        name: 'settings_input_svideo',
        filter: ['Hardware'],
      },
      {
        name: 'settings_motion_mode',
        filter: ['Images'],
      },
      {
        name: 'settings_night_sight',
        filter: ['Images'],
      },
      {
        name: 'settings_overscan',
        filter: ['Actions'],
      },
      {
        name: 'settings_panorama',
        filter: ['Images'],
      },
      {
        name: 'settings_phone',
        filter: ['Communicate'],
      },
      {
        name: 'settings_photo_camera',
        filter: ['Images'],
      },
      {
        name: 'settings_power',
        filter: ['Actions'],
      },
      {
        name: 'settings_remote',
        filter: ['Hardware'],
      },
      {
        name: 'settings_seating',
        filter: ['Social'],
      },
      {
        name: 'settings_slow_motion',
        filter: ['Images'],
      },
      {
        name: 'settings_suggest',
        filter: ['device'],
      },
      {
        name: 'settings_system_daydream',
        filter: ['Android'],
      },
      {
        name: 'settings_timelapse',
        filter: ['Images'],
      },
      {
        name: 'settings_video_camera',
        filter: ['Images'],
      },
      {
        name: 'settings_voice',
        filter: ['Audio&Video'],
      },
      {
        name: 'settop_component',
        filter: ['Hardware'],
      },
      {
        name: 'severe_cold',
        filter: ['Social'],
      },
      {
        name: 'shadow',
        filter: ['Actions'],
      },
      {
        name: 'shadow_add',
        filter: ['Actions'],
      },
      {
        name: 'shadow_minus',
        filter: ['Actions'],
      },
      {
        name: 'shape_line',
        filter: ['Text'],
      },
      {
        name: 'shapes',
        filter: ['Text'],
      },
      {
        name: 'share',
        filter: ['Social'],
      },
      {
        name: 'share_eta',
        filter: ['Maps'],
      },
      {
        name: 'share_location',
        filter: ['Maps'],
      },
      {
        name: 'share_off',
        filter: ['Social'],
      },
      {
        name: 'share_reviews',
        filter: ['UI actions'],
      },
      {
        name: 'share_windows',
        filter: ['UI actions'],
      },
      {
        name: 'shaved_ice',
        filter: ['Maps'],
      },
      {
        name: 'sheets_rtl',
        filter: ['Text'],
      },
      {
        name: 'shelf_auto_hide',
        filter: ['UI actions'],
      },
      {
        name: 'shelf_position',
        filter: ['UI actions'],
      },
      {
        name: 'shelves',
        filter: ['Household'],
      },
      {
        name: 'shield',
        filter: ['Privacy'],
      },
      {
        name: 'shield_lock',
        filter: ['Privacy'],
      },
      {
        name: 'shield_locked',
        filter: ['Privacy'],
      },
      {
        name: 'shield_moon',
        filter: ['Household'],
      },
      {
        name: 'shield_person',
        filter: ['Privacy'],
      },
      {
        name: 'shield_question',
        filter: ['Privacy'],
      },
      {
        name: 'shield_toggle',
        filter: ['Privacy'],
      },
      {
        name: 'shield_watch',
        filter: ['Social'],
      },
      {
        name: 'shield_with_heart',
        filter: ['Home'],
      },
      {
        name: 'shield_with_house',
        filter: ['Home'],
      },
      {
        name: 'shift',
        filter: ['Actions'],
      },
      {
        name: 'shift_lock',
        filter: ['Actions'],
      },
      {
        name: 'shift_lock_off',
        filter: ['Actions'],
      },
      {
        name: 'shop',
        filter: ['Business'],
      },
      {
        name: 'shop_2',
        filter: ['action'],
      },
      {
        name: 'shop_two',
        filter: ['Business'],
      },
      {
        name: 'shopping_bag',
        filter: ['Business'],
      },
      {
        name: 'shopping_bag_speed',
        filter: ['Business'],
      },
      {
        name: 'shopping_basket',
        filter: ['Business'],
      },
      {
        name: 'shopping_cart',
        filter: ['Business'],
      },
      {
        name: 'shopping_cart_checkout',
        filter: ['UI actions'],
      },
      {
        name: 'shopping_cart_off',
        filter: ['Business'],
      },
      {
        name: 'shoppingmode',
        filter: ['Business'],
      },
      {
        name: 'short_stay',
        filter: ['Social'],
      },
      {
        name: 'short_text',
        filter: ['Text'],
      },
      {
        name: 'shortcut',
        filter: ['device'],
      },
      {
        name: 'show_chart',
        filter: ['Business'],
      },
      {
        name: 'shower',
        filter: ['Household'],
      },
      {
        name: 'shuffle',
        filter: ['Audio&Video'],
      },
      {
        name: 'shuffle_on',
        filter: ['Audio&Video'],
      },
      {
        name: 'shutter_speed',
        filter: ['Images'],
      },
      {
        name: 'shutter_speed_add',
        filter: ['Images'],
      },
      {
        name: 'shutter_speed_minus',
        filter: ['Images'],
      },
      {
        name: 'sick',
        filter: ['Social'],
      },
      {
        name: 'side_navigation',
        filter: ['UI actions'],
      },
      {
        name: 'sign_language',
        filter: ['Social'],
      },
      {
        name: 'signal_cellular_0_bar',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_1_bar',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_2_bar',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_3_bar',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_4_bar',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_add',
        filter: ['Communicate'],
      },
      {
        name: 'signal_cellular_alt',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_alt_1_bar',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_alt_2_bar',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_connected_no_internet_0_bar',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_connected_no_internet_1_bar',
        filter: ['device'],
      },
      {
        name: 'signal_cellular_connected_no_internet_2_bar',
        filter: ['device'],
      },
      {
        name: 'signal_cellular_connected_no_internet_3_bar',
        filter: ['device'],
      },
      {
        name: 'signal_cellular_connected_no_internet_4_bar',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_no_sim',
        filter: ['device'],
      },
      {
        name: 'signal_cellular_nodata',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_null',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_off',
        filter: ['Android'],
      },
      {
        name: 'signal_cellular_pause',
        filter: ['Android'],
      },
      {
        name: 'signal_disconnected',
        filter: ['Android'],
      },
      {
        name: 'signal_wifi_0_bar',
        filter: ['Android'],
      },
      {
        name: 'signal_wifi_1_bar',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_1_bar_lock',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_2_bar',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_2_bar_lock',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_3_bar',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_3_bar_lock',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_4_bar',
        filter: ['Android'],
      },
      {
        name: 'signal_wifi_4_bar_lock',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_bad',
        filter: ['Android'],
      },
      {
        name: 'signal_wifi_connected_no_internet_0',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_connected_no_internet_1',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_connected_no_internet_2',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_connected_no_internet_3',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_connected_no_internet_4',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_off',
        filter: ['Android'],
      },
      {
        name: 'signal_wifi_statusbar_1_bar',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_statusbar_2_bar',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_statusbar_3_bar',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_statusbar_4_bar',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_statusbar_connected_no_internet',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_statusbar_connected_no_internet_1',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_statusbar_connected_no_internet_2',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_statusbar_connected_no_internet_3',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_statusbar_connected_no_internet_4',
        filter: ['device'],
      },
      {
        name: 'signal_wifi_statusbar_not_connected',
        filter: ['Android'],
      },
      {
        name: 'signal_wifi_statusbar_null',
        filter: ['Android'],
      },
      {
        name: 'signature',
        filter: ['Text'],
      },
      {
        name: 'signpost',
        filter: ['Maps'],
      },
      {
        name: 'sim_card',
        filter: ['Hardware'],
      },
      {
        name: 'sim_card_alert',
        filter: ['notification'],
      },
      {
        name: 'sim_card_download',
        filter: ['Android'],
      },
      {
        name: 'simulation',
        filter: ['Social'],
      },
      {
        name: 'single_bed',
        filter: ['Household'],
      },
      {
        name: 'sip',
        filter: ['Communicate'],
      },
      {
        name: 'siren',
        filter: ['Social'],
      },
      {
        name: 'siren_check',
        filter: ['Social'],
      },
      {
        name: 'siren_open',
        filter: ['Social'],
      },
      {
        name: 'siren_question',
        filter: ['Social'],
      },
      {
        name: 'skateboarding',
        filter: ['Activities'],
      },
      {
        name: 'skeleton',
        filter: ['Social'],
      },
      {
        name: 'skillet',
        filter: ['Household'],
      },
      {
        name: 'skillet_cooktop',
        filter: ['Household'],
      },
      {
        name: 'skip_next',
        filter: ['Audio&Video'],
      },
      {
        name: 'skip_previous',
        filter: ['Audio&Video'],
      },
      {
        name: 'skull',
        filter: ['Social'],
      },
      {
        name: 'skull_list',
        filter: ['Social'],
      },
      {
        name: 'slab_serif',
        filter: ['Text'],
      },
      {
        name: 'sledding',
        filter: ['Activities'],
      },
      {
        name: 'sleep_score',
        filter: ['Activities'],
      },
      {
        name: 'slide_library',
        filter: ['Text'],
      },
      {
        name: 'sliders',
        filter: ['UI actions'],
      },
      {
        name: 'slideshow',
        filter: ['Images'],
      },
      {
        name: 'slow_motion_video',
        filter: ['Audio&Video'],
      },
      {
        name: 'smart_button',
        filter: ['action'],
      },
      {
        name: 'smart_card_reader',
        filter: ['Hardware'],
      },
      {
        name: 'smart_card_reader_off',
        filter: ['Hardware'],
      },
      {
        name: 'smart_display',
        filter: ['Hardware'],
      },
      {
        name: 'smart_outlet',
        filter: ['Household'],
      },
      {
        name: 'smart_screen',
        filter: ['hardware'],
      },
      {
        name: 'smart_toy',
        filter: ['Hardware'],
      },
      {
        name: 'smartphone',
        filter: ['hardware'],
      },
      {
        name: 'smb_share',
        filter: ['Text'],
      },
      {
        name: 'smoke_free',
        filter: ['Travel'],
      },
      {
        name: 'smoking_rooms',
        filter: ['Travel'],
      },
      {
        name: 'sms',
        filter: ['Communicate'],
      },
      {
        name: 'sms_failed',
        filter: ['notification'],
      },
      {
        name: 'snippet_folder',
        filter: ['Text'],
      },
      {
        name: 'snooze',
        filter: ['Actions'],
      },
      {
        name: 'snowboarding',
        filter: ['Activities'],
      },
      {
        name: 'snowing',
        filter: ['Social'],
      },
      {
        name: 'snowing_heavy',
        filter: ['Social'],
      },
      {
        name: 'snowmobile',
        filter: ['Transit'],
      },
      {
        name: 'snowshoeing',
        filter: ['Activities'],
      },
      {
        name: 'soap',
        filter: ['Household'],
      },
      {
        name: 'soba',
        filter: ['Maps'],
      },
      {
        name: 'social_distance',
        filter: ['Social'],
      },
      {
        name: 'social_leaderboard',
        filter: ['Social'],
      },
      {
        name: 'solar_power',
        filter: ['Social'],
      },
      {
        name: 'solo_dining',
        filter: ['Maps'],
      },
      {
        name: 'sort',
        filter: ['UI actions'],
      },
      {
        name: 'sort_by_alpha',
        filter: ['UI actions'],
      },
      {
        name: 'sos',
        filter: ['Maps'],
      },
      {
        name: 'sound_detection_dog_barking',
        filter: ['Audio&Video'],
      },
      {
        name: 'sound_detection_glass_break',
        filter: ['Audio&Video'],
      },
      {
        name: 'sound_detection_loud_sound',
        filter: ['Audio&Video'],
      },
      {
        name: 'sound_sampler',
        filter: ['Audio&Video'],
      },
      {
        name: 'soup_kitchen',
        filter: ['Maps'],
      },
      {
        name: 'source',
        filter: ['action'],
      },
      {
        name: 'source_environment',
        filter: ['Business'],
      },
      {
        name: 'source_notes',
        filter: ['Text'],
      },
      {
        name: 'south',
        filter: ['Maps'],
      },
      {
        name: 'south_america',
        filter: ['Social'],
      },
      {
        name: 'south_east',
        filter: ['Maps'],
      },
      {
        name: 'south_west',
        filter: ['Maps'],
      },
      {
        name: 'spa',
        filter: ['Travel'],
      },
      {
        name: 'space_bar',
        filter: ['Text'],
      },
      {
        name: 'space_dashboard',
        filter: ['Text'],
      },
      {
        name: 'spatial_audio',
        filter: ['Audio&Video'],
      },
      {
        name: 'spatial_audio_off',
        filter: ['Audio&Video'],
      },
      {
        name: 'spatial_speaker',
        filter: ['Audio&Video'],
      },
      {
        name: 'spatial_tracking',
        filter: ['Audio&Video'],
      },
      {
        name: 'speaker',
        filter: ['Hardware'],
      },
      {
        name: 'speaker_group',
        filter: ['Hardware'],
      },
      {
        name: 'speaker_notes',
        filter: ['Communicate'],
      },
      {
        name: 'speaker_notes_off',
        filter: ['Communicate'],
      },
      {
        name: 'speaker_phone',
        filter: ['Communicate'],
      },
      {
        name: 'special_character',
        filter: ['Text'],
      },
      {
        name: 'specific_gravity',
        filter: ['Social'],
      },
      {
        name: 'speech_to_text',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_0_25',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_0_2x',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_0_5',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_0_5x',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_0_75',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_0_7x',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_1_2',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_1_25',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_1_2x',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_1_5',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_1_5x',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_1_75',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_1_7x',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_2x',
        filter: ['Audio&Video'],
      },
      {
        name: 'speed_camera',
        filter: ['Transit'],
      },
      {
        name: 'spellcheck',
        filter: ['Text'],
      },
      {
        name: 'split_scene',
        filter: ['Audio&Video'],
      },
      {
        name: 'split_scene_down',
        filter: ['Audio&Video'],
      },
      {
        name: 'split_scene_left',
        filter: ['Audio&Video'],
      },
      {
        name: 'split_scene_right',
        filter: ['Audio&Video'],
      },
      {
        name: 'split_scene_up',
        filter: ['Audio&Video'],
      },
      {
        name: 'splitscreen',
        filter: ['Android'],
      },
      {
        name: 'splitscreen_add',
        filter: ['Android'],
      },
      {
        name: 'splitscreen_bottom',
        filter: ['Android'],
      },
      {
        name: 'splitscreen_landscape',
        filter: ['UI actions'],
      },
      {
        name: 'splitscreen_left',
        filter: ['Android'],
      },
      {
        name: 'splitscreen_portrait',
        filter: ['UI actions'],
      },
      {
        name: 'splitscreen_right',
        filter: ['Android'],
      },
      {
        name: 'splitscreen_top',
        filter: ['Android'],
      },
      {
        name: 'splitscreen_vertical_add',
        filter: ['Android'],
      },
      {
        name: 'spo2',
        filter: ['Activities'],
      },
      {
        name: 'spoke',
        filter: ['Communicate'],
      },
      {
        name: 'sports',
        filter: ['Activities'],
      },
      {
        name: 'sports_and_outdoors',
        filter: ['Activities'],
      },
      {
        name: 'sports_bar',
        filter: ['Travel'],
      },
      {
        name: 'sports_baseball',
        filter: ['Activities'],
      },
      {
        name: 'sports_basketball',
        filter: ['Activities'],
      },
      {
        name: 'sports_cricket',
        filter: ['Activities'],
      },
      {
        name: 'sports_esports',
        filter: ['Activities'],
      },
      {
        name: 'sports_football',
        filter: ['Activities'],
      },
      {
        name: 'sports_golf',
        filter: ['Activities'],
      },
      {
        name: 'sports_gymnastics',
        filter: ['Activities'],
      },
      {
        name: 'sports_handball',
        filter: ['Activities'],
      },
      {
        name: 'sports_hockey',
        filter: ['Activities'],
      },
      {
        name: 'sports_kabaddi',
        filter: ['Activities'],
      },
      {
        name: 'sports_martial_arts',
        filter: ['Activities'],
      },
      {
        name: 'sports_mma',
        filter: ['Activities'],
      },
      {
        name: 'sports_motorsports',
        filter: ['Activities'],
      },
      {
        name: 'sports_rugby',
        filter: ['Activities'],
      },
      {
        name: 'sports_score',
        filter: ['Activities'],
      },
      {
        name: 'sports_soccer',
        filter: ['Activities'],
      },
      {
        name: 'sports_tennis',
        filter: ['Activities'],
      },
      {
        name: 'sports_volleyball',
        filter: ['Activities'],
      },
      {
        name: 'sprinkler',
        filter: ['Household'],
      },
      {
        name: 'sprint',
        filter: ['Activities'],
      },
      {
        name: 'square',
        filter: ['Text'],
      },
      {
        name: 'square_dot',
        filter: ['Social'],
      },
      {
        name: 'square_foot',
        filter: ['Actions'],
      },
      {
        name: 'ssid_chart',
        filter: ['Business'],
      },
      {
        name: 'stack',
        filter: ['UI actions'],
      },
      {
        name: 'stack_group',
        filter: ['UI actions'],
      },
      {
        name: 'stack_hexagon',
        filter: ['Text'],
      },
      {
        name: 'stack_off',
        filter: ['UI actions'],
      },
      {
        name: 'stack_star',
        filter: ['UI actions'],
      },
      {
        name: 'stacked_bar_chart',
        filter: ['Business'],
      },
      {
        name: 'stacked_email',
        filter: ['Communicate'],
      },
      {
        name: 'stacked_inbox',
        filter: ['Communicate'],
      },
      {
        name: 'stacked_line_chart',
        filter: ['Business'],
      },
      {
        name: 'stacks',
        filter: ['UI actions'],
      },
      {
        name: 'stadia_controller',
        filter: ['Home'],
      },
      {
        name: 'stadium',
        filter: ['Maps'],
      },
      {
        name: 'stairs',
        filter: ['Travel'],
      },
      {
        name: 'stairs_2',
        filter: ['Travel'],
      },
      {
        name: 'star',
        filter: ['UI actions'],
      },
      {
        name: 'star_border',
        filter: ['toggle'],
      },
      {
        name: 'star_border_purple500',
        filter: ['toggle'],
      },
      {
        name: 'star_half',
        filter: ['UI actions'],
      },
      {
        name: 'star_outline',
        filter: ['toggle'],
      },
      {
        name: 'star_purple500',
        filter: ['toggle'],
      },
      {
        name: 'star_rate',
        filter: ['UI actions'],
      },
      {
        name: 'star_rate_half',
        filter: ['UI actions'],
      },
      {
        name: 'star_shine',
        filter: ['Social'],
      },
      {
        name: 'stars',
        filter: ['Actions'],
      },
      {
        name: 'stars_2',
        filter: ['Social'],
      },
      {
        name: 'start',
        filter: ['UI actions'],
      },
      {
        name: 'stat_0',
        filter: ['UI actions'],
      },
      {
        name: 'stat_1',
        filter: ['UI actions'],
      },
      {
        name: 'stat_2',
        filter: ['UI actions'],
      },
      {
        name: 'stat_3',
        filter: ['UI actions'],
      },
      {
        name: 'stat_minus_1',
        filter: ['UI actions'],
      },
      {
        name: 'stat_minus_2',
        filter: ['UI actions'],
      },
      {
        name: 'stat_minus_3',
        filter: ['UI actions'],
      },
      {
        name: 'stay_current_landscape',
        filter: ['communication'],
      },
      {
        name: 'stay_current_portrait',
        filter: ['communication'],
      },
      {
        name: 'stay_primary_landscape',
        filter: ['communication'],
      },
      {
        name: 'stay_primary_portrait',
        filter: ['communication'],
      },
      {
        name: 'steering_wheel_heat',
        filter: ['Transit'],
      },
      {
        name: 'step',
        filter: ['UI actions'],
      },
      {
        name: 'step_into',
        filter: ['UI actions'],
      },
      {
        name: 'step_out',
        filter: ['UI actions'],
      },
      {
        name: 'step_over',
        filter: ['UI actions'],
      },
      {
        name: 'steppers',
        filter: ['UI actions'],
      },
      {
        name: 'steps',
        filter: ['Activities'],
      },
      {
        name: 'stethoscope',
        filter: ['Social'],
      },
      {
        name: 'stethoscope_arrow',
        filter: ['Social'],
      },
      {
        name: 'stethoscope_check',
        filter: ['Social'],
      },
      {
        name: 'sticky_note',
        filter: ['Text'],
      },
      {
        name: 'sticky_note_2',
        filter: ['Text'],
      },
      {
        name: 'stock_media',
        filter: ['Text'],
      },
      {
        name: 'stockpot',
        filter: ['Household'],
      },
      {
        name: 'stop',
        filter: ['Audio&Video'],
      },
      {
        name: 'stop_circle',
        filter: ['Audio&Video'],
      },
      {
        name: 'stop_screen_share',
        filter: ['Hardware'],
      },
      {
        name: 'storage',
        filter: ['Android'],
      },
      {
        name: 'store',
        filter: ['Business'],
      },
      {
        name: 'store_mall_directory',
        filter: ['maps'],
      },
      {
        name: 'storefront',
        filter: ['Business'],
      },
      {
        name: 'storm',
        filter: ['Activities'],
      },
      {
        name: 'straight',
        filter: ['Hardware'],
      },
      {
        name: 'straighten',
        filter: ['Images'],
      },
      {
        name: 'strategy',
        filter: ['Social'],
      },
      {
        name: 'stream',
        filter: ['Audio&Video'],
      },
      {
        name: 'streetview',
        filter: ['Maps'],
      },
      {
        name: 'stress_management',
        filter: ['Activities'],
      },
      {
        name: 'strikethrough_s',
        filter: ['Business'],
      },
      {
        name: 'stroke_full',
        filter: ['Text'],
      },
      {
        name: 'stroke_partial',
        filter: ['Text'],
      },
      {
        name: 'stroller',
        filter: ['Household'],
      },
      {
        name: 'style',
        filter: ['Images'],
      },
      {
        name: 'styler',
        filter: ['Household'],
      },
      {
        name: 'stylus',
        filter: ['Android'],
      },
      {
        name: 'stylus_brush',
        filter: ['Text'],
      },
      {
        name: 'stylus_fountain_pen',
        filter: ['Text'],
      },
      {
        name: 'stylus_highlighter',
        filter: ['Text'],
      },
      {
        name: 'stylus_laser_pointer',
        filter: ['Text'],
      },
      {
        name: 'stylus_note',
        filter: ['Android'],
      },
      {
        name: 'stylus_pen',
        filter: ['Text'],
      },
      {
        name: 'stylus_pencil',
        filter: ['Text'],
      },
      {
        name: 'subdirectory_arrow_left',
        filter: ['UI actions'],
      },
      {
        name: 'subdirectory_arrow_right',
        filter: ['UI actions'],
      },
      {
        name: 'subheader',
        filter: ['UI actions'],
      },
      {
        name: 'subject',
        filter: ['Text'],
      },
      {
        name: 'subscript',
        filter: ['Text'],
      },
      {
        name: 'subscriptions',
        filter: ['Audio&Video'],
      },
      {
        name: 'subtitles',
        filter: ['Audio&Video'],
      },
      {
        name: 'subtitles_gear',
        filter: ['Audio&Video'],
      },
      {
        name: 'subtitles_off',
        filter: ['Text'],
      },
      {
        name: 'subway',
        filter: ['Transit'],
      },
      {
        name: 'subway_walk',
        filter: ['Transit'],
      },
      {
        name: 'summarize',
        filter: ['Text'],
      },
      {
        name: 'sunny',
        filter: ['Social'],
      },
      {
        name: 'sunny_snowing',
        filter: ['Social'],
      },
      {
        name: 'superscript',
        filter: ['Text'],
      },
      {
        name: 'supervised_user_circle',
        filter: ['Actions'],
      },
      {
        name: 'supervised_user_circle_off',
        filter: ['Actions'],
      },
      {
        name: 'supervisor_account',
        filter: ['Actions'],
      },
      {
        name: 'support',
        filter: ['Actions'],
      },
      {
        name: 'support_agent',
        filter: ['Social'],
      },
      {
        name: 'surfing',
        filter: ['Activities'],
      },
      {
        name: 'surgical',
        filter: ['Social'],
      },
      {
        name: 'surround_sound',
        filter: ['Audio&Video'],
      },
      {
        name: 'swap_calls',
        filter: ['Communicate'],
      },
      {
        name: 'swap_driving_apps',
        filter: ['Transit'],
      },
      {
        name: 'swap_driving_apps_wheel',
        filter: ['Transit'],
      },
      {
        name: 'swap_horiz',
        filter: ['UI actions'],
      },
      {
        name: 'swap_horizontal_circle',
        filter: ['UI actions'],
      },
      {
        name: 'swap_vert',
        filter: ['UI actions'],
      },
      {
        name: 'swap_vertical_circle',
        filter: ['UI actions'],
      },
      {
        name: 'sweep',
        filter: ['UI actions'],
      },
      {
        name: 'swipe',
        filter: ['Actions'],
      },
      {
        name: 'swipe_down',
        filter: ['UI actions'],
      },
      {
        name: 'swipe_down_alt',
        filter: ['UI actions'],
      },
      {
        name: 'swipe_left',
        filter: ['UI actions'],
      },
      {
        name: 'swipe_left_alt',
        filter: ['UI actions'],
      },
      {
        name: 'swipe_right',
        filter: ['UI actions'],
      },
      {
        name: 'swipe_right_alt',
        filter: ['UI actions'],
      },
      {
        name: 'swipe_up',
        filter: ['UI actions'],
      },
      {
        name: 'swipe_up_alt',
        filter: ['UI actions'],
      },
      {
        name: 'swipe_vertical',
        filter: ['UI actions'],
      },
      {
        name: 'switch',
        filter: ['Household'],
      },
      {
        name: 'switch_access',
        filter: ['UI actions'],
      },
      {
        name: 'switch_access_2',
        filter: ['UI actions'],
      },
      {
        name: 'switch_access_3',
        filter: ['UI actions'],
      },
      {
        name: 'switch_access_shortcut',
        filter: ['UI actions'],
      },
      {
        name: 'switch_access_shortcut_add',
        filter: ['UI actions'],
      },
      {
        name: 'switch_account',
        filter: ['Activities'],
      },
      {
        name: 'switch_camera',
        filter: ['Images'],
      },
      {
        name: 'switch_left',
        filter: ['UI actions'],
      },
      {
        name: 'switch_right',
        filter: ['UI actions'],
      },
      {
        name: 'switch_video',
        filter: ['Images'],
      },
      {
        name: 'switches',
        filter: ['UI actions'],
      },
      {
        name: 'sword_rose',
        filter: ['Social'],
      },
      {
        name: 'swords',
        filter: ['Activities'],
      },
      {
        name: 'symptoms',
        filter: ['Social'],
      },
      {
        name: 'synagogue',
        filter: ['Maps'],
      },
      {
        name: 'sync',
        filter: ['UI actions'],
      },
      {
        name: 'sync_alt',
        filter: ['UI actions'],
      },
      {
        name: 'sync_arrow_down',
        filter: ['UI actions'],
      },
      {
        name: 'sync_arrow_up',
        filter: ['UI actions'],
      },
      {
        name: 'sync_desktop',
        filter: ['UI actions'],
      },
      {
        name: 'sync_disabled',
        filter: ['UI actions'],
      },
      {
        name: 'sync_lock',
        filter: ['Privacy'],
      },
      {
        name: 'sync_problem',
        filter: ['UI actions'],
      },
      {
        name: 'sync_saved_locally',
        filter: ['UI actions'],
      },
      {
        name: 'sync_saved_locally_off',
        filter: ['UI actions'],
      },
      {
        name: 'syringe',
        filter: ['Social'],
      },
      {
        name: 'system_security_update',
        filter: ['device'],
      },
      {
        name: 'system_security_update_good',
        filter: ['device'],
      },
      {
        name: 'system_security_update_warning',
        filter: ['device'],
      },
      {
        name: 'system_update',
        filter: ['notification'],
      },
      {
        name: 'system_update_alt',
        filter: ['UI actions'],
      },
      {
        name: 'tab',
        filter: ['UI actions'],
      },
      {
        name: 'tab_close',
        filter: ['UI actions'],
      },
      {
        name: 'tab_close_inactive',
        filter: ['UI actions'],
      },
      {
        name: 'tab_close_right',
        filter: ['UI actions'],
      },
      {
        name: 'tab_duplicate',
        filter: ['UI actions'],
      },
      {
        name: 'tab_group',
        filter: ['UI actions'],
      },
      {
        name: 'tab_inactive',
        filter: ['UI actions'],
      },
      {
        name: 'tab_move',
        filter: ['UI actions'],
      },
      {
        name: 'tab_new_right',
        filter: ['UI actions'],
      },
      {
        name: 'tab_recent',
        filter: ['UI actions'],
      },
      {
        name: 'tab_search',
        filter: ['UI actions'],
      },
      {
        name: 'tab_unselected',
        filter: ['UI actions'],
      },
      {
        name: 'table',
        filter: ['Text'],
      },
      {
        name: 'table_bar',
        filter: ['Household'],
      },
      {
        name: 'table_chart',
        filter: ['Text'],
      },
      {
        name: 'table_chart_view',
        filter: ['Text'],
      },
      {
        name: 'table_convert',
        filter: ['Text'],
      },
      {
        name: 'table_edit',
        filter: ['Text'],
      },
      {
        name: 'table_eye',
        filter: ['Text'],
      },
      {
        name: 'table_lamp',
        filter: ['Home'],
      },
      {
        name: 'table_large',
        filter: ['Household'],
      },
      {
        name: 'table_restaurant',
        filter: ['Household'],
      },
      {
        name: 'table_rows',
        filter: ['Text'],
      },
      {
        name: 'table_rows_narrow',
        filter: ['Text'],
      },
      {
        name: 'table_sign',
        filter: ['Social'],
      },
      {
        name: 'table_view',
        filter: ['Text'],
      },
      {
        name: 'tablet',
        filter: ['Hardware'],
      },
      {
        name: 'tablet_android',
        filter: ['Hardware'],
      },
      {
        name: 'tablet_camera',
        filter: ['Hardware'],
      },
      {
        name: 'tablet_mac',
        filter: ['Hardware'],
      },
      {
        name: 'tabs',
        filter: ['UI actions'],
      },
      {
        name: 'tactic',
        filter: ['Social'],
      },
      {
        name: 'tag',
        filter: ['Text'],
      },
      {
        name: 'tag_faces',
        filter: ['image'],
      },
      {
        name: 'takeout_dining',
        filter: ['Maps'],
      },
      {
        name: 'takeout_dining_2',
        filter: ['Maps'],
      },
      {
        name: 'tamper_detection_off',
        filter: ['Household'],
      },
      {
        name: 'tamper_detection_on',
        filter: ['Home'],
      },
      {
        name: 'tap_and_play',
        filter: ['notification'],
      },
      {
        name: 'tapas',
        filter: ['Travel'],
      },
      {
        name: 'target',
        filter: ['Actions'],
      },
      {
        name: 'task',
        filter: ['Text'],
      },
      {
        name: 'task_alt',
        filter: ['Actions'],
      },
      {
        name: 'tatami_seat',
        filter: ['Maps'],
      },
      {
        name: 'taunt',
        filter: ['Social'],
      },
      {
        name: 'taxi_alert',
        filter: ['Transit'],
      },
      {
        name: 'team_dashboard',
        filter: ['Text'],
      },
      {
        name: 'temp_preferences_eco',
        filter: ['Home'],
      },
      {
        name: 'temple_buddhist',
        filter: ['Maps'],
      },
      {
        name: 'temple_hindu',
        filter: ['Maps'],
      },
      {
        name: 'tenancy',
        filter: ['Business'],
      },
      {
        name: 'terminal',
        filter: ['UI actions'],
      },
      {
        name: 'terrain',
        filter: ['maps'],
      },
      {
        name: 'text_ad',
        filter: ['Text'],
      },
      {
        name: 'text_compare',
        filter: ['Text'],
      },
      {
        name: 'text_decrease',
        filter: ['Text'],
      },
      {
        name: 'text_fields',
        filter: ['Text'],
      },
      {
        name: 'text_fields_alt',
        filter: ['Text'],
      },
      {
        name: 'text_format',
        filter: ['Text'],
      },
      {
        name: 'text_increase',
        filter: ['Text'],
      },
      {
        name: 'text_rotate_up',
        filter: ['Text'],
      },
      {
        name: 'text_rotate_vertical',
        filter: ['Text'],
      },
      {
        name: 'text_rotation_angledown',
        filter: ['Text'],
      },
      {
        name: 'text_rotation_angleup',
        filter: ['Text'],
      },
      {
        name: 'text_rotation_down',
        filter: ['Text'],
      },
      {
        name: 'text_rotation_none',
        filter: ['Text'],
      },
      {
        name: 'text_select_end',
        filter: ['Text'],
      },
      {
        name: 'text_select_jump_to_beginning',
        filter: ['Text'],
      },
      {
        name: 'text_select_jump_to_end',
        filter: ['Text'],
      },
      {
        name: 'text_select_move_back_character',
        filter: ['Text'],
      },
      {
        name: 'text_select_move_back_word',
        filter: ['Text'],
      },
      {
        name: 'text_select_move_down',
        filter: ['Text'],
      },
      {
        name: 'text_select_move_forward_character',
        filter: ['Text'],
      },
      {
        name: 'text_select_move_forward_word',
        filter: ['Text'],
      },
      {
        name: 'text_select_move_up',
        filter: ['Text'],
      },
      {
        name: 'text_select_start',
        filter: ['Text'],
      },
      {
        name: 'text_snippet',
        filter: ['Text'],
      },
      {
        name: 'text_to_speech',
        filter: ['Audio&Video'],
      },
      {
        name: 'text_up',
        filter: ['Text'],
      },
      {
        name: 'textsms',
        filter: ['communication'],
      },
      {
        name: 'texture',
        filter: ['Images'],
      },
      {
        name: 'texture_add',
        filter: ['Images'],
      },
      {
        name: 'texture_minus',
        filter: ['Images'],
      },
      {
        name: 'theater_comedy',
        filter: ['Maps'],
      },
      {
        name: 'theaters',
        filter: ['Activities'],
      },
      {
        name: 'thermometer',
        filter: ['Household'],
      },
      {
        name: 'thermometer_add',
        filter: ['Household'],
      },
      {
        name: 'thermometer_gain',
        filter: ['Household'],
      },
      {
        name: 'thermometer_loss',
        filter: ['Household'],
      },
      {
        name: 'thermometer_minus',
        filter: ['Household'],
      },
      {
        name: 'thermostat',
        filter: ['Android'],
      },
      {
        name: 'thermostat_arrow_down',
        filter: ['UI actions'],
      },
      {
        name: 'thermostat_arrow_up',
        filter: ['UI actions'],
      },
      {
        name: 'thermostat_auto',
        filter: ['Household'],
      },
      {
        name: 'thermostat_carbon',
        filter: ['Household'],
      },
      {
        name: 'things_to_do',
        filter: ['Maps'],
      },
      {
        name: 'thread_unread',
        filter: ['Communicate'],
      },
      {
        name: 'threat_intelligence',
        filter: ['Communicate'],
      },
      {
        name: 'thumb_down',
        filter: ['Social'],
      },
      {
        name: 'thumb_down_alt',
        filter: ['social'],
      },
      {
        name: 'thumb_down_off_alt',
        filter: ['action'],
      },
      {
        name: 'thumb_up',
        filter: ['Social'],
      },
      {
        name: 'thumb_up_alt',
        filter: ['social'],
      },
      {
        name: 'thumb_up_off_alt',
        filter: ['action'],
      },
      {
        name: 'thumbnail_bar',
        filter: ['Text'],
      },
      {
        name: 'thumbs_up_double',
        filter: ['Social'],
      },
      {
        name: 'thumbs_up_down',
        filter: ['Social'],
      },
      {
        name: 'thunderstorm',
        filter: ['Social'],
      },
      {
        name: 'tibia',
        filter: ['Social'],
      },
      {
        name: 'tibia_alt',
        filter: ['Social'],
      },
      {
        name: 'tile_large',
        filter: ['UI actions'],
      },
      {
        name: 'tile_medium',
        filter: ['UI actions'],
      },
      {
        name: 'tile_small',
        filter: ['UI actions'],
      },
      {
        name: 'time_auto',
        filter: ['Actions'],
      },
      {
        name: 'time_to_leave',
        filter: ['notification'],
      },
      {
        name: 'timelapse',
        filter: ['Images'],
      },
      {
        name: 'timeline',
        filter: ['Business'],
      },
      {
        name: 'timer',
        filter: ['Images'],
      },
      {
        name: 'timer_1',
        filter: ['Images'],
      },
      {
        name: 'timer_10',
        filter: ['Images'],
      },
      {
        name: 'timer_10_alt_1',
        filter: ['Actions'],
      },
      {
        name: 'timer_10_select',
        filter: ['Android'],
      },
      {
        name: 'timer_2',
        filter: ['Images'],
      },
      {
        name: 'timer_3',
        filter: ['Images'],
      },
      {
        name: 'timer_3_alt_1',
        filter: ['Actions'],
      },
      {
        name: 'timer_3_select',
        filter: ['Android'],
      },
      {
        name: 'timer_5',
        filter: ['Android'],
      },
      {
        name: 'timer_5_shutter',
        filter: ['Android'],
      },
      {
        name: 'timer_arrow_down',
        filter: ['UI actions'],
      },
      {
        name: 'timer_arrow_up',
        filter: ['UI actions'],
      },
      {
        name: 'timer_off',
        filter: ['Images'],
      },
      {
        name: 'timer_pause',
        filter: ['Actions'],
      },
      {
        name: 'timer_play',
        filter: ['Actions'],
      },
      {
        name: 'tips_and_updates',
        filter: ['action'],
      },
      {
        name: 'tire_repair',
        filter: ['Transit'],
      },
      {
        name: 'title',
        filter: ['Text'],
      },
      {
        name: 'titlecase',
        filter: ['Text'],
      },
      {
        name: 'toast',
        filter: ['UI actions'],
      },
      {
        name: 'toc',
        filter: ['Text'],
      },
      {
        name: 'today',
        filter: ['Actions'],
      },
      {
        name: 'toggle_off',
        filter: ['UI actions'],
      },
      {
        name: 'toggle_on',
        filter: ['UI actions'],
      },
      {
        name: 'token',
        filter: ['UI actions'],
      },
      {
        name: 'toll',
        filter: ['Business'],
      },
      {
        name: 'tonality',
        filter: ['Images'],
      },
      {
        name: 'tonality_2',
        filter: ['Images'],
      },
      {
        name: 'toolbar',
        filter: ['UI actions'],
      },
      {
        name: 'tools_flat_head',
        filter: ['Home'],
      },
      {
        name: 'tools_installation_kit',
        filter: ['Home'],
      },
      {
        name: 'tools_ladder',
        filter: ['Home'],
      },
      {
        name: 'tools_level',
        filter: ['Home'],
      },
      {
        name: 'tools_phillips',
        filter: ['Home'],
      },
      {
        name: 'tools_pliers_wire_stripper',
        filter: ['Home'],
      },
      {
        name: 'tools_power_drill',
        filter: ['Home'],
      },
      {
        name: 'tooltip',
        filter: ['Communicate'],
      },
      {
        name: 'tooltip_2',
        filter: ['Communicate'],
      },
      {
        name: 'top_panel_close',
        filter: ['Text'],
      },
      {
        name: 'top_panel_open',
        filter: ['Text'],
      },
      {
        name: 'topic',
        filter: ['Communicate'],
      },
      {
        name: 'tornado',
        filter: ['Social'],
      },
      {
        name: 'total_dissolved_solids',
        filter: ['Social'],
      },
      {
        name: 'touch_app',
        filter: ['Actions'],
      },
      {
        name: 'touch_double',
        filter: ['Actions'],
      },
      {
        name: 'touch_long',
        filter: ['Actions'],
      },
      {
        name: 'touch_triple',
        filter: ['Actions'],
      },
      {
        name: 'touchpad_mouse',
        filter: ['Hardware'],
      },
      {
        name: 'touchpad_mouse_off',
        filter: ['Hardware'],
      },
      {
        name: 'tour',
        filter: ['Maps'],
      },
      {
        name: 'toys',
        filter: ['Activities'],
      },
      {
        name: 'toys_and_games',
        filter: ['Activities'],
      },
      {
        name: 'toys_fan',
        filter: ['Activities'],
      },
      {
        name: 'track_changes',
        filter: ['Business'],
      },
      {
        name: 'trackpad_input',
        filter: ['Actions'],
      },
      {
        name: 'trackpad_input_2',
        filter: ['Actions'],
      },
      {
        name: 'trackpad_input_3',
        filter: ['Actions'],
      },
      {
        name: 'traffic',
        filter: ['Maps'],
      },
      {
        name: 'traffic_jam',
        filter: ['Transit'],
      },
      {
        name: 'trail_length',
        filter: ['Images'],
      },
      {
        name: 'trail_length_medium',
        filter: ['Images'],
      },
      {
        name: 'trail_length_short',
        filter: ['Images'],
      },
      {
        name: 'train',
        filter: ['Transit'],
      },
      {
        name: 'tram',
        filter: ['Transit'],
      },
      {
        name: 'transcribe',
        filter: ['action'],
      },
      {
        name: 'transfer_within_a_station',
        filter: ['Maps'],
      },
      {
        name: 'transform',
        filter: ['Images'],
      },
      {
        name: 'transgender',
        filter: ['Social'],
      },
      {
        name: 'transit_enterexit',
        filter: ['Maps'],
      },
      {
        name: 'transit_ticket',
        filter: ['Transit'],
      },
      {
        name: 'transition_chop',
        filter: ['Images'],
      },
      {
        name: 'transition_dissolve',
        filter: ['Images'],
      },
      {
        name: 'transition_fade',
        filter: ['Images'],
      },
      {
        name: 'transition_push',
        filter: ['Images'],
      },
      {
        name: 'transition_slide',
        filter: ['Images'],
      },
      {
        name: 'translate',
        filter: ['Actions'],
      },
      {
        name: 'translate_indic',
        filter: ['Actions'],
      },
      {
        name: 'transportation',
        filter: ['Transit'],
      },
      {
        name: 'travel',
        filter: ['Travel'],
      },
      {
        name: 'travel_explore',
        filter: ['Social'],
      },
      {
        name: 'travel_luggage_and_bags',
        filter: ['Travel'],
      },
      {
        name: 'trending_down',
        filter: ['Business'],
      },
      {
        name: 'trending_flat',
        filter: ['Business'],
      },
      {
        name: 'trending_up',
        filter: ['Business'],
      },
      {
        name: 'trip',
        filter: ['Travel'],
      },
      {
        name: 'trip_origin',
        filter: ['Maps'],
      },
      {
        name: 'trolley',
        filter: ['Business'],
      },
      {
        name: 'trolley_cable_car',
        filter: ['Transit'],
      },
      {
        name: 'trophy',
        filter: ['Activities'],
      },
      {
        name: 'troubleshoot',
        filter: ['Business'],
      },
      {
        name: 'try',
        filter: ['action'],
      },
      {
        name: 'tsunami',
        filter: ['Social'],
      },
      {
        name: 'tsv',
        filter: ['Text'],
      },
      {
        name: 'tty',
        filter: ['Hardware'],
      },
      {
        name: 'tune',
        filter: ['Images'],
      },
      {
        name: 'tungsten',
        filter: ['device'],
      },
      {
        name: 'turn_left',
        filter: ['Transit'],
      },
      {
        name: 'turn_right',
        filter: ['Transit'],
      },
      {
        name: 'turn_sharp_left',
        filter: ['Transit'],
      },
      {
        name: 'turn_sharp_right',
        filter: ['Transit'],
      },
      {
        name: 'turn_slight_left',
        filter: ['Transit'],
      },
      {
        name: 'turn_slight_right',
        filter: ['Transit'],
      },
      {
        name: 'turned_in',
        filter: ['action'],
      },
      {
        name: 'turned_in_not',
        filter: ['action'],
      },
      {
        name: 'tv',
        filter: ['Hardware'],
      },
      {
        name: 'tv_displays',
        filter: ['Hardware'],
      },
      {
        name: 'tv_gen',
        filter: ['Household'],
      },
      {
        name: 'tv_guide',
        filter: ['Hardware'],
      },
      {
        name: 'tv_next',
        filter: ['Hardware'],
      },
      {
        name: 'tv_off',
        filter: ['Hardware'],
      },
      {
        name: 'tv_options_edit_channels',
        filter: ['Hardware'],
      },
      {
        name: 'tv_options_input_settings',
        filter: ['Hardware'],
      },
      {
        name: 'tv_remote',
        filter: ['Hardware'],
      },
      {
        name: 'tv_signin',
        filter: ['Hardware'],
      },
      {
        name: 'tv_with_assistant',
        filter: ['Household'],
      },
      {
        name: 'two_pager',
        filter: ['Text'],
      },
      {
        name: 'two_pager_store',
        filter: ['Text'],
      },
      {
        name: 'two_wheeler',
        filter: ['Transit'],
      },
      {
        name: 'type_specimen',
        filter: ['Text'],
      },
      {
        name: 'u_turn_left',
        filter: ['Transit'],
      },
      {
        name: 'u_turn_right',
        filter: ['Transit'],
      },
      {
        name: 'udon',
        filter: ['Maps'],
      },
      {
        name: 'ulna_radius',
        filter: ['Social'],
      },
      {
        name: 'ulna_radius_alt',
        filter: ['Social'],
      },
      {
        name: 'umbrella',
        filter: ['Household'],
      },
      {
        name: 'unarchive',
        filter: ['Communicate'],
      },
      {
        name: 'undo',
        filter: ['UI actions'],
      },
      {
        name: 'unfold_less',
        filter: ['UI actions'],
      },
      {
        name: 'unfold_less_double',
        filter: ['UI actions'],
      },
      {
        name: 'unfold_more',
        filter: ['UI actions'],
      },
      {
        name: 'unfold_more_double',
        filter: ['UI actions'],
      },
      {
        name: 'ungroup',
        filter: ['Text'],
      },
      {
        name: 'universal_currency',
        filter: ['Business'],
      },
      {
        name: 'universal_currency_alt',
        filter: ['Business'],
      },
      {
        name: 'universal_local',
        filter: ['Maps'],
      },
      {
        name: 'unknown_2',
        filter: ['Images'],
      },
      {
        name: 'unknown_5',
        filter: ['UI actions'],
      },
      {
        name: 'unknown_7',
        filter: ['Text'],
      },
      {
        name: 'unknown_document',
        filter: ['Text'],
      },
      {
        name: 'unknown_med',
        filter: ['UI actions'],
      },
      {
        name: 'unlicense',
        filter: ['Actions'],
      },
      {
        name: 'unpaved_road',
        filter: ['Transit'],
      },
      {
        name: 'unpublished',
        filter: ['Actions'],
      },
      {
        name: 'unsubscribe',
        filter: ['Communicate'],
      },
      {
        name: 'upcoming',
        filter: ['Communicate'],
      },
      {
        name: 'update',
        filter: ['Actions'],
      },
      {
        name: 'update_disabled',
        filter: ['Actions'],
      },
      {
        name: 'upgrade',
        filter: ['Actions'],
      },
      {
        name: 'upi_pay',
        filter: ['Business'],
      },
      {
        name: 'upload',
        filter: ['UI actions'],
      },
      {
        name: 'upload_2',
        filter: ['UI actions'],
      },
      {
        name: 'upload_file',
        filter: ['Actions'],
      },
      {
        name: 'uppercase',
        filter: ['Text'],
      },
      {
        name: 'urology',
        filter: ['Social'],
      },
      {
        name: 'usb',
        filter: ['Android'],
      },
      {
        name: 'usb_off',
        filter: ['Android'],
      },
      {
        name: 'user_attributes',
        filter: ['Actions'],
      },
      {
        name: 'vaccines',
        filter: ['Social'],
      },
      {
        name: 'vacuum',
        filter: ['Household'],
      },
      {
        name: 'valve',
        filter: ['Household'],
      },
      {
        name: 'vape_free',
        filter: ['Social'],
      },
      {
        name: 'vaping_rooms',
        filter: ['Social'],
      },
      {
        name: 'variable_add',
        filter: ['Text'],
      },
      {
        name: 'variable_insert',
        filter: ['Text'],
      },
      {
        name: 'variable_remove',
        filter: ['Text'],
      },
      {
        name: 'variables',
        filter: ['Text'],
      },
      {
        name: 'ventilator',
        filter: ['Hardware'],
      },
      {
        name: 'verified',
        filter: ['Actions'],
      },
      {
        name: 'verified_off',
        filter: ['Actions'],
      },
      {
        name: 'verified_user',
        filter: ['Privacy'],
      },
      {
        name: 'vertical_align_bottom',
        filter: ['Text'],
      },
      {
        name: 'vertical_align_center',
        filter: ['Text'],
      },
      {
        name: 'vertical_align_top',
        filter: ['Text'],
      },
      {
        name: 'vertical_distribute',
        filter: ['Text'],
      },
      {
        name: 'vertical_shades',
        filter: ['Household'],
      },
      {
        name: 'vertical_shades_closed',
        filter: ['Household'],
      },
      {
        name: 'vertical_split',
        filter: ['Text'],
      },
      {
        name: 'vibration',
        filter: ['notification'],
      },
      {
        name: 'video_call',
        filter: ['Audio&Video'],
      },
      {
        name: 'video_camera_back',
        filter: ['Audio&Video'],
      },
      {
        name: 'video_camera_back_add',
        filter: ['Audio&Video'],
      },
      {
        name: 'video_camera_front',
        filter: ['Audio&Video'],
      },
      {
        name: 'video_camera_front_off',
        filter: ['Audio&Video'],
      },
      {
        name: 'video_chat',
        filter: ['Communicate'],
      },
      {
        name: 'video_file',
        filter: ['Text'],
      },
      {
        name: 'video_label',
        filter: ['Audio&Video'],
      },
      {
        name: 'video_library',
        filter: ['Audio&Video'],
      },
      {
        name: 'video_search',
        filter: ['Audio&Video'],
      },
      {
        name: 'video_settings',
        filter: ['Audio&Video'],
      },
      {
        name: 'video_stable',
        filter: ['Audio&Video'],
      },
      {
        name: 'videocam',
        filter: ['Audio&Video'],
      },
      {
        name: 'videocam_alert',
        filter: ['Audio&Video'],
      },
      {
        name: 'videocam_off',
        filter: ['Audio&Video'],
      },
      {
        name: 'videogame_asset',
        filter: ['Hardware'],
      },
      {
        name: 'videogame_asset_off',
        filter: ['Hardware'],
      },
      {
        name: 'view_agenda',
        filter: ['Text'],
      },
      {
        name: 'view_apps',
        filter: ['UI actions'],
      },
      {
        name: 'view_array',
        filter: ['Text'],
      },
      {
        name: 'view_carousel',
        filter: ['Text'],
      },
      {
        name: 'view_column',
        filter: ['Text'],
      },
      {
        name: 'view_column_2',
        filter: ['Text'],
      },
      {
        name: 'view_comfy',
        filter: ['Images'],
      },
      {
        name: 'view_comfy_alt',
        filter: ['UI actions'],
      },
      {
        name: 'view_compact',
        filter: ['Images'],
      },
      {
        name: 'view_compact_alt',
        filter: ['UI actions'],
      },
      {
        name: 'view_cozy',
        filter: ['UI actions'],
      },
      {
        name: 'view_day',
        filter: ['Text'],
      },
      {
        name: 'view_headline',
        filter: ['Text'],
      },
      {
        name: 'view_in_ar',
        filter: ['Audio&Video'],
      },
      {
        name: 'view_in_ar_off',
        filter: ['Audio&Video'],
      },
      {
        name: 'view_kanban',
        filter: ['UI actions'],
      },
      {
        name: 'view_list',
        filter: ['Text'],
      },
      {
        name: 'view_module',
        filter: ['Text'],
      },
      {
        name: 'view_object_track',
        filter: ['Text'],
      },
      {
        name: 'view_quilt',
        filter: ['Text'],
      },
      {
        name: 'view_real_size',
        filter: ['Images'],
      },
      {
        name: 'view_sidebar',
        filter: ['Text'],
      },
      {
        name: 'view_stream',
        filter: ['Text'],
      },
      {
        name: 'view_timeline',
        filter: ['UI actions'],
      },
      {
        name: 'view_week',
        filter: ['Text'],
      },
      {
        name: 'vignette',
        filter: ['Images'],
      },
      {
        name: 'vignette_2',
        filter: ['Images'],
      },
      {
        name: 'villa',
        filter: ['Travel'],
      },
      {
        name: 'visibility',
        filter: ['Actions'],
      },
      {
        name: 'visibility_lock',
        filter: ['Actions'],
      },
      {
        name: 'visibility_off',
        filter: ['Actions'],
      },
      {
        name: 'vital_signs',
        filter: ['Social'],
      },
      {
        name: 'vo2_max',
        filter: ['Activities'],
      },
      {
        name: 'voice_chat',
        filter: ['Communicate'],
      },
      {
        name: 'voice_over_off',
        filter: ['Actions'],
      },
      {
        name: 'voice_selection',
        filter: ['Audio&Video'],
      },
      {
        name: 'voice_selection_off',
        filter: ['Audio&Video'],
      },
      {
        name: 'voicemail',
        filter: ['Communicate'],
      },
      {
        name: 'voicemail_2',
        filter: ['Communicate'],
      },
      {
        name: 'volcano',
        filter: ['Social'],
      },
      {
        name: 'volume_down',
        filter: ['Audio&Video'],
      },
      {
        name: 'volume_down_alt',
        filter: ['Audio&Video'],
      },
      {
        name: 'volume_mute',
        filter: ['Audio&Video'],
      },
      {
        name: 'volume_off',
        filter: ['Audio&Video'],
      },
      {
        name: 'volume_up',
        filter: ['Audio&Video'],
      },
      {
        name: 'volunteer_activism',
        filter: ['Activities'],
      },
      {
        name: 'voting_chip',
        filter: ['Text'],
      },
      {
        name: 'vpn_key',
        filter: ['Privacy'],
      },
      {
        name: 'vpn_key_alert',
        filter: ['Privacy'],
      },
      {
        name: 'vpn_key_off',
        filter: ['Privacy'],
      },
      {
        name: 'vpn_lock',
        filter: ['Privacy'],
      },
      {
        name: 'vpn_lock_2',
        filter: ['Privacy'],
      },
      {
        name: 'vr180_create2d',
        filter: ['Images'],
      },
      {
        name: 'vr180_create2d_off',
        filter: ['Images'],
      },
      {
        name: 'vrpano',
        filter: ['Images'],
      },
      {
        name: 'wall_art',
        filter: ['Household'],
      },
      {
        name: 'wall_lamp',
        filter: ['Home'],
      },
      {
        name: 'wallet',
        filter: ['Business'],
      },
      {
        name: 'wallpaper',
        filter: ['Android'],
      },
      {
        name: 'wallpaper_slideshow',
        filter: ['Android'],
      },
      {
        name: 'wand_shine',
        filter: ['Actions'],
      },
      {
        name: 'wand_stars',
        filter: ['Actions'],
      },
      {
        name: 'ward',
        filter: ['Social'],
      },
      {
        name: 'warehouse',
        filter: ['Maps'],
      },
      {
        name: 'warning',
        filter: ['Actions'],
      },
      {
        name: 'warning_amber',
        filter: ['alert'],
      },
      {
        name: 'warning_off',
        filter: ['Actions'],
      },
      {
        name: 'wash',
        filter: ['Household'],
      },
      {
        name: 'washoku',
        filter: ['Travel'],
      },
      {
        name: 'watch',
        filter: ['Hardware'],
      },
      {
        name: 'watch_arrow',
        filter: ['Hardware'],
      },
      {
        name: 'watch_button_press',
        filter: ['Hardware'],
      },
      {
        name: 'watch_check',
        filter: ['Hardware'],
      },
      {
        name: 'watch_later',
        filter: ['action'],
      },
      {
        name: 'watch_off',
        filter: ['Hardware'],
      },
      {
        name: 'watch_screentime',
        filter: ['Actions'],
      },
      {
        name: 'watch_vibration',
        filter: ['Hardware'],
      },
      {
        name: 'watch_wake',
        filter: ['Hardware'],
      },
      {
        name: 'water',
        filter: ['Activities'],
      },
      {
        name: 'water_bottle',
        filter: ['Social'],
      },
      {
        name: 'water_bottle_large',
        filter: ['Social'],
      },
      {
        name: 'water_damage',
        filter: ['Household'],
      },
      {
        name: 'water_do',
        filter: ['Social'],
      },
      {
        name: 'water_drop',
        filter: ['Social'],
      },
      {
        name: 'water_ec',
        filter: ['Social'],
      },
      {
        name: 'water_full',
        filter: ['Activities'],
      },
      {
        name: 'water_heater',
        filter: ['Household'],
      },
      {
        name: 'water_lock',
        filter: ['Actions'],
      },
      {
        name: 'water_loss',
        filter: ['Activities'],
      },
      {
        name: 'water_lux',
        filter: ['Social'],
      },
      {
        name: 'water_medium',
        filter: ['Activities'],
      },
      {
        name: 'water_orp',
        filter: ['Social'],
      },
      {
        name: 'water_ph',
        filter: ['Social'],
      },
      {
        name: 'water_pump',
        filter: ['Home'],
      },
      {
        name: 'water_voc',
        filter: ['Social'],
      },
      {
        name: 'waterfall_chart',
        filter: ['Business'],
      },
      {
        name: 'waves',
        filter: ['Activities'],
      },
      {
        name: 'waving_hand',
        filter: ['Social'],
      },
      {
        name: 'wb_auto',
        filter: ['Images'],
      },
      {
        name: 'wb_cloudy',
        filter: ['image'],
      },
      {
        name: 'wb_incandescent',
        filter: ['Images'],
      },
      {
        name: 'wb_iridescent',
        filter: ['Images'],
      },
      {
        name: 'wb_shade',
        filter: ['Images'],
      },
      {
        name: 'wb_sunny',
        filter: ['Images'],
      },
      {
        name: 'wb_twighlight',
        filter: ['image'],
      },
      {
        name: 'wb_twilight',
        filter: ['Images'],
      },
      {
        name: 'wc',
        filter: ['Social'],
      },
      {
        name: 'weather_hail',
        filter: ['Social'],
      },
      {
        name: 'weather_mix',
        filter: ['Social'],
      },
      {
        name: 'weather_snowy',
        filter: ['Home'],
      },
      {
        name: 'web',
        filter: ['Actions'],
      },
      {
        name: 'web_asset',
        filter: ['Actions'],
      },
      {
        name: 'web_asset_off',
        filter: ['Actions'],
      },
      {
        name: 'web_stories',
        filter: ['Images'],
      },
      {
        name: 'web_traffic',
        filter: ['Actions'],
      },
      {
        name: 'webhook',
        filter: ['Actions'],
      },
      {
        name: 'weekend',
        filter: ['Household'],
      },
      {
        name: 'weight',
        filter: ['Social'],
      },
      {
        name: 'west',
        filter: ['Maps'],
      },
      {
        name: 'whatshot',
        filter: ['Social'],
      },
      {
        name: 'wheelchair_pickup',
        filter: ['Travel'],
      },
      {
        name: 'where_to_vote',
        filter: ['Maps'],
      },
      {
        name: 'widget_medium',
        filter: ['UI actions'],
      },
      {
        name: 'widget_small',
        filter: ['UI actions'],
      },
      {
        name: 'widget_width',
        filter: ['UI actions'],
      },
      {
        name: 'widgets',
        filter: ['Android'],
      },
      {
        name: 'width_full',
        filter: ['UI actions'],
      },
      {
        name: 'width_normal',
        filter: ['UI actions'],
      },
      {
        name: 'width_wide',
        filter: ['UI actions'],
      },
      {
        name: 'wifi',
        filter: ['Android'],
      },
      {
        name: 'wifi_1_bar',
        filter: ['Android'],
      },
      {
        name: 'wifi_2_bar',
        filter: ['Android'],
      },
      {
        name: 'wifi_add',
        filter: ['Communicate'],
      },
      {
        name: 'wifi_calling',
        filter: ['Communicate'],
      },
      {
        name: 'wifi_calling_1',
        filter: ['device'],
      },
      {
        name: 'wifi_calling_2',
        filter: ['device'],
      },
      {
        name: 'wifi_calling_3',
        filter: ['device'],
      },
      {
        name: 'wifi_calling_bar_1',
        filter: ['Android'],
      },
      {
        name: 'wifi_calling_bar_2',
        filter: ['Android'],
      },
      {
        name: 'wifi_calling_bar_3',
        filter: ['Android'],
      },
      {
        name: 'wifi_channel',
        filter: ['Communicate'],
      },
      {
        name: 'wifi_find',
        filter: ['Android'],
      },
      {
        name: 'wifi_home',
        filter: ['Android'],
      },
      {
        name: 'wifi_lock',
        filter: ['Android'],
      },
      {
        name: 'wifi_notification',
        filter: ['Android'],
      },
      {
        name: 'wifi_off',
        filter: ['Android'],
      },
      {
        name: 'wifi_password',
        filter: ['Privacy'],
      },
      {
        name: 'wifi_protected_setup',
        filter: ['Actions'],
      },
      {
        name: 'wifi_proxy',
        filter: ['Communicate'],
      },
      {
        name: 'wifi_tethering',
        filter: ['Android'],
      },
      {
        name: 'wifi_tethering_error',
        filter: ['Android'],
      },
      {
        name: 'wifi_tethering_off',
        filter: ['Android'],
      },
      {
        name: 'wind_power',
        filter: ['Social'],
      },
      {
        name: 'window',
        filter: ['Household'],
      },
      {
        name: 'window_closed',
        filter: ['Home'],
      },
      {
        name: 'window_open',
        filter: ['Home'],
      },
      {
        name: 'window_sensor',
        filter: ['Home'],
      },
      {
        name: 'windshield_defrost_auto',
        filter: ['Transit'],
      },
      {
        name: 'windshield_defrost_front',
        filter: ['Transit'],
      },
      {
        name: 'windshield_defrost_rear',
        filter: ['Transit'],
      },
      {
        name: 'windshield_heat_front',
        filter: ['Transit'],
      },
      {
        name: 'wine_bar',
        filter: ['Maps'],
      },
      {
        name: 'woman',
        filter: ['Social'],
      },
      {
        name: 'woman_2',
        filter: ['Social'],
      },
      {
        name: 'work',
        filter: ['Business'],
      },
      {
        name: 'work_alert',
        filter: ['Business'],
      },
      {
        name: 'work_history',
        filter: ['Business'],
      },
      {
        name: 'work_off',
        filter: ['action'],
      },
      {
        name: 'work_outline',
        filter: ['action'],
      },
      {
        name: 'work_update',
        filter: ['Business'],
      },
      {
        name: 'workspace_premium',
        filter: ['Social'],
      },
      {
        name: 'workspaces',
        filter: ['Social'],
      },
      {
        name: 'workspaces_filled',
        filter: ['file'],
      },
      {
        name: 'workspaces_outline',
        filter: ['file'],
      },
      {
        name: 'wounds_injuries',
        filter: ['Social'],
      },
      {
        name: 'wrap_text',
        filter: ['Text'],
      },
      {
        name: 'wrist',
        filter: ['Social'],
      },
      {
        name: 'wrong_location',
        filter: ['Maps'],
      },
      {
        name: 'wysiwyg',
        filter: ['Actions'],
      },
      {
        name: 'yakitori',
        filter: ['Maps'],
      },
      {
        name: 'yard',
        filter: ['Household'],
      },
      {
        name: 'yoshoku',
        filter: ['Travel'],
      },
      {
        name: 'your_trips',
        filter: ['Travel'],
      },
      {
        name: 'youtube_activity',
        filter: ['Actions'],
      },
      {
        name: 'youtube_searched_for',
        filter: ['UI actions'],
      },
      {
        name: 'zone_person_alert',
        filter: ['Home'],
      },
      {
        name: 'zone_person_idle',
        filter: ['Home'],
      },
      {
        name: 'zone_person_urgent',
        filter: ['Home'],
      },
      {
        name: 'zoom_in',
        filter: ['UI actions'],
      },
      {
        name: 'zoom_in_map',
        filter: ['Maps'],
      },
      {
        name: 'zoom_out',
        filter: ['UI actions'],
      },
      {
        name: 'zoom_out_map',
        filter: ['Maps'],
      },
    ];
  }
}
