import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@dotos/dui/translator';
import { Icon, IconType } from './icon';

@Injectable({providedIn:'root'})
export class IconPickerService {

  constructor(
    private http: HttpClient,
    protected translate: TranslateService,
    @Inject('apiBase') private _apiBase: string) {

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getIcons(ipIconPack: string): Icon[] {
    let icons: Icon[] = [];
    const faIcons = this.getFaIcons().map(icon => {
      icon.type = IconType.FONT;
      return icon;
    });
    icons = icons.concat(faIcons);
    return icons;
  }

  getSVGIcons(dir: string,iconpath:string): Observable<any> {
    let params: HttpParams = new HttpParams().set('dir', dir).set("iconpath",iconpath);
    return this.http.get(this._apiBase + '/lib/iconlist', { params: params });
  }

  getFontIcons(dir: string,fontpath:string): Observable<any> {
    let params: HttpParams = new HttpParams().set('dir', dir).set("fontpath",fontpath);
    return this.http.get(this._apiBase + '/lib/fonticonlist', { params: params });
  }

  private getFaIcons(): Icon[] {
    return [
      {
        'name': this.translate.instant("3d_rotation"),
        'id': '3d_rotation',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("ac_unit"),
        'id': 'ac_unit',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("access_alarm"),
        'id': 'access_alarm',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("access_alarms"),
        'id': 'access_alarms',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("access_time"),
        'id': 'access_time',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("accessibility"),
        'id': 'accessibility',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("accessible"),
        'id': 'accessible',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("account_balance"),
        'id': 'account_balance',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("account_balance_wallet"),
        'id': 'account_balance_wallet',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("account_box"),
        'id': 'account_box',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("account_circle"),
        'id': 'account_circle',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("adb"),
        'id': 'adb',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("add"),
        'id': 'add',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("add_a_photo"),
        'id': 'add_a_photo',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("add_alarm"),
        'id': 'add_alarm',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("add_alert"),
        'id': 'add_alert',
        'filter': ['alert']
      },
      {
        'name': this.translate.instant("add_box"),
        'id': 'add_box',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("add_circle"),
        'id': 'add_circle',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("add_circle_outline"),
        'id': 'add_circle_outline',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("add_location"),
        'id': 'add_location',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("add_shopping_cart"),
        'id': 'add_shopping_cart',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("add_to_photos"),
        'id': 'add_to_photos',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("add_to_queue"),
        'id': 'add_to_queue',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("adjust"),
        'id': 'adjust',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("airline_seat_flat"),
        'id': 'airline_seat_flat',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("airline_seat_flat_angled"),
        'id': 'airline_seat_flat_angled',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("airline_seat_individual_suite"),
        'id': 'airline_seat_individual_suite',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("airline_seat_legroom_extra"),
        'id': 'airline_seat_legroom_extra',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("airline_seat_legroom_normal"),
        'id': 'airline_seat_legroom_normal',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("airline_seat_legroom_reduced"),
        'id': 'airline_seat_legroom_reduced',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("airline_seat_recline_extra"),
        'id': 'airline_seat_recline_extra',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("airline_seat_recline_normal"),
        'id': 'airline_seat_recline_normal',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("airplanemode_active"),
        'id': 'airplanemode_active',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("airplanemode_inactive"),
        'id': 'airplanemode_inactive',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("airplay"),
        'id': 'airplay',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("airport_shuttle"),
        'id': 'airport_shuttle',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("alarm"),
        'id': 'alarm',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("alarm_add"),
        'id': 'alarm_add',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("alarm_off"),
        'id': 'alarm_off',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("alarm_on"),
        'id': 'alarm_on',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("album"),
        'id': 'album',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("all_inclusive"),
        'id': 'all_inclusive',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("all_out"),
        'id': 'all_out',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("android"),
        'id': 'android',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("announcement"),
        'id': 'announcement',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("apps"),
        'id': 'apps',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("archive"),
        'id': 'archive',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("arrow_back"),
        'id': 'arrow_back',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("arrow_downward"),
        'id': 'arrow_downward',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("arrow_drop_down"),
        'id': 'arrow_drop_down',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("arrow_drop_down_circle"),
        'id': 'arrow_drop_down_circle',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("arrow_drop_up"),
        'id': 'arrow_drop_up',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("arrow_forward"),
        'id': 'arrow_forward',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("arrow_upward"),
        'id': 'arrow_upward',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("art_track"),
        'id': 'art_track',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("aspect_ratio"),
        'id': 'aspect_ratio',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("assessment"),
        'id': 'assessment',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("assignment"),
        'id': 'assignment',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("assignment_ind"),
        'id': 'assignment_ind',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("assignment_late"),
        'id': 'assignment_late',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("assignment_return"),
        'id': 'assignment_return',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("assignment_returned"),
        'id': 'assignment_returned',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("assignment_turned_in"),
        'id': 'assignment_turned_in',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("assistant"),
        'id': 'assistant',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("assistant_photo"),
        'id': 'assistant_photo',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("attach_file"),
        'id': 'attach_file',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("attach_money"),
        'id': 'attach_money',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("attachment"),
        'id': 'attachment',
        'filter': ['file']
      },
      {
        'name': this.translate.instant("audiotrack"),
        'id': 'audiotrack',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("autorenew"),
        'id': 'autorenew',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("av_timer"),
        'id': 'av_timer',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("backspace"),
        'id': 'backspace',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("backup"),
        'id': 'backup',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("battery_alert"),
        'id': 'battery_alert',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("battery_charging_full"),
        'id': 'battery_charging_full',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("battery_full"),
        'id': 'battery_full',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("battery_std"),
        'id': 'battery_std',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("battery_unknown"),
        'id': 'battery_unknown',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("beach_access"),
        'id': 'beach_access',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("beenhere"),
        'id': 'beenhere',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("block"),
        'id': 'block',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("bluetooth"),
        'id': 'bluetooth',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("bluetooth_audio"),
        'id': 'bluetooth_audio',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("bluetooth_connected"),
        'id': 'bluetooth_connected',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("bluetooth_disabled"),
        'id': 'bluetooth_disabled',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("bluetooth_searching"),
        'id': 'bluetooth_searching',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("blur_circular"),
        'id': 'blur_circular',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("blur_linear"),
        'id': 'blur_linear',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("blur_off"),
        'id': 'blur_off',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("blur_on"),
        'id': 'blur_on',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("book"),
        'id': 'book',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("bookmark"),
        'id': 'bookmark',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("bookmark_border"),
        'id': 'bookmark_border',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("border_all"),
        'id': 'border_all',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("border_bottom"),
        'id': 'border_bottom',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("border_clear"),
        'id': 'border_clear',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("border_color"),
        'id': 'border_color',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("border_horizontal"),
        'id': 'border_horizontal',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("border_inner"),
        'id': 'border_inner',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("border_left"),
        'id': 'border_left',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("border_outer"),
        'id': 'border_outer',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("border_right"),
        'id': 'border_right',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("border_style"),
        'id': 'border_style',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("border_top"),
        'id': 'border_top',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("border_vertical"),
        'id': 'border_vertical',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("branding_watermark"),
        'id': 'branding_watermark',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("brightness_1"),
        'id': 'brightness_1',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("brightness_2"),
        'id': 'brightness_2',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("brightness_3"),
        'id': 'brightness_3',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("brightness_4"),
        'id': 'brightness_4',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("brightness_5"),
        'id': 'brightness_5',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("brightness_6"),
        'id': 'brightness_6',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("brightness_7"),
        'id': 'brightness_7',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("brightness_auto"),
        'id': 'brightness_auto',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("brightness_high"),
        'id': 'brightness_high',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("brightness_low"),
        'id': 'brightness_low',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("brightness_medium"),
        'id': 'brightness_medium',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("broken_image"),
        'id': 'broken_image',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("brush"),
        'id': 'brush',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("bubble_chart"),
        'id': 'bubble_chart',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("bug_report"),
        'id': 'bug_report',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("build"),
        'id': 'build',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("burst_mode"),
        'id': 'burst_mode',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("business"),
        'id': 'business',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("business_center"),
        'id': 'business_center',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("cached"),
        'id': 'cached',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("cake"),
        'id': 'cake',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("call"),
        'id': 'call',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("call_end"),
        'id': 'call_end',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("call_made"),
        'id': 'call_made',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("call_merge"),
        'id': 'call_merge',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("call_missed"),
        'id': 'call_missed',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("call_missed_outgoing"),
        'id': 'call_missed_outgoing',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("call_received"),
        'id': 'call_received',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("call_split"),
        'id': 'call_split',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("call_to_action"),
        'id': 'call_to_action',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("camera"),
        'id': 'camera',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("camera_alt"),
        'id': 'camera_alt',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("camera_enhance"),
        'id': 'camera_enhance',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("camera_front"),
        'id': 'camera_front',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("camera_rear"),
        'id': 'camera_rear',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("camera_roll"),
        'id': 'camera_roll',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("cancel"),
        'id': 'cancel',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("card_giftcard"),
        'id': 'card_giftcard',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("card_membership"),
        'id': 'card_membership',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("card_travel"),
        'id': 'card_travel',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("casino"),
        'id': 'casino',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("cast"),
        'id': 'cast',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("cast_connected"),
        'id': 'cast_connected',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("center_focus_strong"),
        'id': 'center_focus_strong',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("center_focus_weak"),
        'id': 'center_focus_weak',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("change_history"),
        'id': 'change_history',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("chat"),
        'id': 'chat',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("chat_bubble"),
        'id': 'chat_bubble',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("chat_bubble_outline"),
        'id': 'chat_bubble_outline',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("check"),
        'id': 'check',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("check_box"),
        'id': 'check_box',
        'filter': ['toggle']
      },
      {
        'name': this.translate.instant("check_box_outline_blank"),
        'id': 'check_box_outline_blank',
        'filter': ['toggle']
      },
      {
        'name': this.translate.instant("check_circle"),
        'id': 'check_circle',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("chevron_left"),
        'id': 'chevron_left',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("chevron_right"),
        'id': 'chevron_right',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("child_care"),
        'id': 'child_care',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("child_friendly"),
        'id': 'child_friendly',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("chrome_reader_mode"),
        'id': 'chrome_reader_mode',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("class"),
        'id': 'class',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("clear"),
        'id': 'clear',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("clear_all"),
        'id': 'clear_all',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("close"),
        'id': 'close',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("closed_caption"),
        'id': 'closed_caption',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("cloud"),
        'id': 'cloud',
        'filter': ['file']
      },
      {
        'name': this.translate.instant("cloud_circle"),
        'id': 'cloud_circle',
        'filter': ['file']
      },
      {
        'name': this.translate.instant("cloud_done"),
        'id': 'cloud_done',
        'filter': ['file']
      },
      {
        'name': this.translate.instant("cloud_download"),
        'id': 'cloud_download',
        'filter': ['file']
      },
      {
        'name': this.translate.instant("cloud_off"),
        'id': 'cloud_off',
        'filter': ['file']
      },
      {
        'name': this.translate.instant("cloud_queue"),
        'id': 'cloud_queue',
        'filter': ['file']
      },
      {
        'name': this.translate.instant("cloud_upload"),
        'id': 'cloud_upload',
        'filter': ['file']
      },
      {
        'name': this.translate.instant("code"),
        'id': 'code',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("collections"),
        'id': 'collections',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("collections_bookmark"),
        'id': 'collections_bookmark',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("color_lens"),
        'id': 'color_lens',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("colorize"),
        'id': 'colorize',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("comment"),
        'id': 'comment',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("compare"),
        'id': 'compare',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("compare_arrows"),
        'id': 'compare_arrows',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("computer"),
        'id': 'computer',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("confirmation_number"),
        'id': 'confirmation_number',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("contact_mail"),
        'id': 'contact_mail',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("contact_phone"),
        'id': 'contact_phone',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("contacts"),
        'id': 'contacts',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("content_copy"),
        'id': 'content_copy',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("content_cut"),
        'id': 'content_cut',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("content_paste"),
        'id': 'content_paste',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("control_point"),
        'id': 'control_point',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("control_point_duplicate"),
        'id': 'control_point_duplicate',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("copyright"),
        'id': 'copyright',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("create"),
        'id': 'create',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("create_new_folder"),
        'id': 'create_new_folder',
        'filter': ['file']
      },
      {
        'name': this.translate.instant("credit_card"),
        'id': 'credit_card',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("crop"),
        'id': 'crop',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("crop_16_9"),
        'id': 'crop_16_9',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("crop_3_2"),
        'id': 'crop_3_2',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("crop_5_4"),
        'id': 'crop_5_4',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("crop_7_5"),
        'id': 'crop_7_5',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("crop_din"),
        'id': 'crop_din',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("crop_free"),
        'id': 'crop_free',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("crop_landscape"),
        'id': 'crop_landscape',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("crop_original"),
        'id': 'crop_original',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("crop_portrait"),
        'id': 'crop_portrait',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("crop_rotate"),
        'id': 'crop_rotate',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("crop_square"),
        'id': 'crop_square',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("dashboard"),
        'id': 'dashboard',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("data_usage"),
        'id': 'data_usage',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("date_range"),
        'id': 'date_range',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("dehaze"),
        'id': 'dehaze',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("delete"),
        'id': 'delete',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("delete_forever"),
        'id': 'delete_forever',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("delete_sweep"),
        'id': 'delete_sweep',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("description"),
        'id': 'description',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("desktop_mac"),
        'id': 'desktop_mac',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("desktop_windows"),
        'id': 'desktop_windows',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("details"),
        'id': 'details',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("developer_board"),
        'id': 'developer_board',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("developer_mode"),
        'id': 'developer_mode',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("device_hub"),
        'id': 'device_hub',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("devices"),
        'id': 'devices',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("devices_other"),
        'id': 'devices_other',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("dialer_sip"),
        'id': 'dialer_sip',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("dialpad"),
        'id': 'dialpad',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("directions"),
        'id': 'directions',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("directions_bike"),
        'id': 'directions_bike',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("directions_boat"),
        'id': 'directions_boat',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("directions_bus"),
        'id': 'directions_bus',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("directions_car"),
        'id': 'directions_car',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("directions_railway"),
        'id': 'directions_railway',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("directions_run"),
        'id': 'directions_run',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("directions_subway"),
        'id': 'directions_subway',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("directions_transit"),
        'id': 'directions_transit',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("directions_walk"),
        'id': 'directions_walk',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("disc_full"),
        'id': 'disc_full',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("dns"),
        'id': 'dns',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("do_not_disturb"),
        'id': 'do_not_disturb',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("do_not_disturb_alt"),
        'id': 'do_not_disturb_alt',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("do_not_disturb_off"),
        'id': 'do_not_disturb_off',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("do_not_disturb_on"),
        'id': 'do_not_disturb_on',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("dock"),
        'id': 'dock',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("domain"),
        'id': 'domain',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("done"),
        'id': 'done',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("done_all"),
        'id': 'done_all',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("donut_large"),
        'id': 'donut_large',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("donut_small"),
        'id': 'donut_small',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("drafts"),
        'id': 'drafts',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("drag_handle"),
        'id': 'drag_handle',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("drive_eta"),
        'id': 'drive_eta',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("dvr"),
        'id': 'dvr',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("edit"),
        'id': 'edit',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("edit_location"),
        'id': 'edit_location',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("eject"),
        'id': 'eject',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("email"),
        'id': 'email',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("enhanced_encryption"),
        'id': 'enhanced_encryption',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("equalizer"),
        'id': 'equalizer',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("error"),
        'id': 'error',
        'filter': ['alert']
      },
      {
        'name': this.translate.instant("error_outline"),
        'id': 'error_outline',
        'filter': ['alert']
      },
      {
        'name': this.translate.instant("euro_symbol"),
        'id': 'euro_symbol',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("ev_station"),
        'id': 'ev_station',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("event"),
        'id': 'event',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("event_available"),
        'id': 'event_available',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("event_busy"),
        'id': 'event_busy',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("event_note"),
        'id': 'event_note',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("event_seat"),
        'id': 'event_seat',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("exit_to_app"),
        'id': 'exit_to_app',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("expand_less"),
        'id': 'expand_less',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("expand_more"),
        'id': 'expand_more',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("explicit"),
        'id': 'explicit',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("explore"),
        'id': 'explore',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("exposure"),
        'id': 'exposure',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("exposure_neg_1"),
        'id': 'exposure_neg_1',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("exposure_neg_2"),
        'id': 'exposure_neg_2',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("exposure_plus_1"),
        'id': 'exposure_plus_1',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("exposure_plus_2"),
        'id': 'exposure_plus_2',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("exposure_zero"),
        'id': 'exposure_zero',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("extension"),
        'id': 'extension',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("face"),
        'id': 'face',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("fast_forward"),
        'id': 'fast_forward',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("fast_rewind"),
        'id': 'fast_rewind',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("favorite"),
        'id': 'favorite',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("favorite_border"),
        'id': 'favorite_border',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("featured_play_list"),
        'id': 'featured_play_list',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("featured_video"),
        'id': 'featured_video',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("feedback"),
        'id': 'feedback',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("fiber_dvr"),
        'id': 'fiber_dvr',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("fiber_manual_record"),
        'id': 'fiber_manual_record',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("fiber_new"),
        'id': 'fiber_new',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("fiber_pin"),
        'id': 'fiber_pin',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("fiber_smart_record"),
        'id': 'fiber_smart_record',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("file_download"),
        'id': 'file_download',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("file_upload"),
        'id': 'file_upload',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("filter"),
        'id': 'filter',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_1"),
        'id': 'filter_1',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_2"),
        'id': 'filter_2',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_3"),
        'id': 'filter_3',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_4"),
        'id': 'filter_4',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_5"),
        'id': 'filter_5',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_6"),
        'id': 'filter_6',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_7"),
        'id': 'filter_7',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_8"),
        'id': 'filter_8',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_9"),
        'id': 'filter_9',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_9_plus"),
        'id': 'filter_9_plus',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_b_and_w"),
        'id': 'filter_b_and_w',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_center_focus"),
        'id': 'filter_center_focus',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_drama"),
        'id': 'filter_drama',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_frames"),
        'id': 'filter_frames',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_hdr"),
        'id': 'filter_hdr',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_list"),
        'id': 'filter_list',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("filter_none"),
        'id': 'filter_none',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_tilt_shift"),
        'id': 'filter_tilt_shift',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("filter_vintage"),
        'id': 'filter_vintage',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("find_in_page"),
        'id': 'find_in_page',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("find_replace"),
        'id': 'find_replace',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("fingerprint"),
        'id': 'fingerprint',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("first_page"),
        'id': 'first_page',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("fitness_center"),
        'id': 'fitness_center',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("flag"),
        'id': 'flag',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("flare"),
        'id': 'flare',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("flash_auto"),
        'id': 'flash_auto',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("flash_off"),
        'id': 'flash_off',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("flash_on"),
        'id': 'flash_on',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("flight"),
        'id': 'flight',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("flight_land"),
        'id': 'flight_land',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("flight_takeoff"),
        'id': 'flight_takeoff',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("flip"),
        'id': 'flip',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("flip_to_back"),
        'id': 'flip_to_back',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("flip_to_front"),
        'id': 'flip_to_front',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("folder"),
        'id': 'folder',
        'filter': ['file']
      },
      {
        'name': this.translate.instant("folder_open"),
        'id': 'folder_open',
        'filter': ['file']
      },
      {
        'name': this.translate.instant("folder_shared"),
        'id': 'folder_shared',
        'filter': ['file']
      },
      {
        'name': this.translate.instant("folder_special"),
        'id': 'folder_special',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("font_download"),
        'id': 'font_download',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("format_align_center"),
        'id': 'format_align_center',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_align_justify"),
        'id': 'format_align_justify',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_align_left"),
        'id': 'format_align_left',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_align_right"),
        'id': 'format_align_right',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_bold"),
        'id': 'format_bold',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_clear"),
        'id': 'format_clear',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_color_fill"),
        'id': 'format_color_fill',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_color_reset"),
        'id': 'format_color_reset',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_color_text"),
        'id': 'format_color_text',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_indent_decrease"),
        'id': 'format_indent_decrease',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_indent_increase"),
        'id': 'format_indent_increase',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_italic"),
        'id': 'format_italic',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_line_spacing"),
        'id': 'format_line_spacing',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_list_bulleted"),
        'id': 'format_list_bulleted',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_list_numbered"),
        'id': 'format_list_numbered',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_paint"),
        'id': 'format_paint',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_quote"),
        'id': 'format_quote',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_shapes"),
        'id': 'format_shapes',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_size"),
        'id': 'format_size',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_strikethrough"),
        'id': 'format_strikethrough',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_textdirection_l_to_r"),
        'id': 'format_textdirection_l_to_r',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_textdirection_r_to_l"),
        'id': 'format_textdirection_r_to_l',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("format_underlined"),
        'id': 'format_underlined',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("forum"),
        'id': 'forum',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("forward"),
        'id': 'forward',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("forward_10"),
        'id': 'forward_10',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("forward_30"),
        'id': 'forward_30',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("forward_5"),
        'id': 'forward_5',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("free_breakfast"),
        'id': 'free_breakfast',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("fullscreen"),
        'id': 'fullscreen',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("fullscreen_exit"),
        'id': 'fullscreen_exit',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("functions"),
        'id': 'functions',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("g_translate"),
        'id': 'g_translate',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("gamepad"),
        'id': 'gamepad',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("games"),
        'id': 'games',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("gavel"),
        'id': 'gavel',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("gesture"),
        'id': 'gesture',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("get_app"),
        'id': 'get_app',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("gif"),
        'id': 'gif',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("golf_course"),
        'id': 'golf_course',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("gps_fixed"),
        'id': 'gps_fixed',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("gps_not_fixed"),
        'id': 'gps_not_fixed',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("gps_off"),
        'id': 'gps_off',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("grade"),
        'id': 'grade',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("gradient"),
        'id': 'gradient',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("grain"),
        'id': 'grain',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("graphic_eq"),
        'id': 'graphic_eq',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("grid_off"),
        'id': 'grid_off',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("grid_on"),
        'id': 'grid_on',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("group"),
        'id': 'group',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("group_add"),
        'id': 'group_add',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("group_work"),
        'id': 'group_work',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("hd"),
        'id': 'hd',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("hdr_off"),
        'id': 'hdr_off',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("hdr_on"),
        'id': 'hdr_on',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("hdr_strong"),
        'id': 'hdr_strong',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("hdr_weak"),
        'id': 'hdr_weak',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("headset"),
        'id': 'headset',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("headset_mic"),
        'id': 'headset_mic',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("healing"),
        'id': 'healing',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("hearing"),
        'id': 'hearing',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("help"),
        'id': 'help',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("help_outline"),
        'id': 'help_outline',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("high_quality"),
        'id': 'high_quality',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("highlight"),
        'id': 'highlight',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("highlight_off"),
        'id': 'highlight_off',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("history"),
        'id': 'history',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("home"),
        'id': 'home',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("hot_tub"),
        'id': 'hot_tub',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("hotel"),
        'id': 'hotel',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("hourglass_empty"),
        'id': 'hourglass_empty',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("hourglass_full"),
        'id': 'hourglass_full',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("http"),
        'id': 'http',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("https"),
        'id': 'https',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("image"),
        'id': 'image',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("image_aspect_ratio"),
        'id': 'image_aspect_ratio',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("import_contacts"),
        'id': 'import_contacts',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("import_export"),
        'id': 'import_export',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("important_devices"),
        'id': 'important_devices',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("inbox"),
        'id': 'inbox',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("indeterminate_check_box"),
        'id': 'indeterminate_check_box',
        'filter': ['toggle']
      },
      {
        'name': this.translate.instant("info"),
        'id': 'info',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("input"),
        'id': 'input',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("insert_chart"),
        'id': 'insert_chart',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("insert_comment"),
        'id': 'insert_comment',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("insert_drive_file"),
        'id': 'insert_drive_file',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("insert_emoticon"),
        'id': 'insert_emoticon',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("insert_invitation"),
        'id': 'insert_invitation',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("insert_link"),
        'id': 'insert_link',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("insert_photo"),
        'id': 'insert_photo',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("invert_colors"),
        'id': 'invert_colors',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("invert_colors_off"),
        'id': 'invert_colors_off',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("iso"),
        'id': 'iso',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("keyboard"),
        'id': 'keyboard',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("keyboard_arrow_down"),
        'id': 'keyboard_arrow_down',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("keyboard_arrow_left"),
        'id': 'keyboard_arrow_left',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("keyboard_arrow_right"),
        'id': 'keyboard_arrow_right',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("keyboard_arrow_up"),
        'id': 'keyboard_arrow_up',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("keyboard_backspace"),
        'id': 'keyboard_backspace',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("keyboard_capslock"),
        'id': 'keyboard_capslock',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("keyboard_hide"),
        'id': 'keyboard_hide',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("keyboard_return"),
        'id': 'keyboard_return',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("keyboard_tab"),
        'id': 'keyboard_tab',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("keyboard_voice"),
        'id': 'keyboard_voice',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("kitchen"),
        'id': 'kitchen',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("label"),
        'id': 'label',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("label_outline"),
        'id': 'label_outline',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("landscape"),
        'id': 'landscape',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("language"),
        'id': 'language',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("laptop"),
        'id': 'laptop',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("laptop_chromebook"),
        'id': 'laptop_chromebook',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("laptop_mac"),
        'id': 'laptop_mac',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("laptop_windows"),
        'id': 'laptop_windows',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("last_page"),
        'id': 'last_page',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("launch"),
        'id': 'launch',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("layers"),
        'id': 'layers',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("layers_clear"),
        'id': 'layers_clear',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("leak_add"),
        'id': 'leak_add',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("leak_remove"),
        'id': 'leak_remove',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("lens"),
        'id': 'lens',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("library_add"),
        'id': 'library_add',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("library_books"),
        'id': 'library_books',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("library_music"),
        'id': 'library_music',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("lightbulb_outline"),
        'id': 'lightbulb_outline',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("line_style"),
        'id': 'line_style',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("line_weight"),
        'id': 'line_weight',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("linear_scale"),
        'id': 'linear_scale',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("link"),
        'id': 'link',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("linked_camera"),
        'id': 'linked_camera',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("list"),
        'id': 'list',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("live_help"),
        'id': 'live_help',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("live_tv"),
        'id': 'live_tv',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("local_activity"),
        'id': 'local_activity',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_airport"),
        'id': 'local_airport',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_atm"),
        'id': 'local_atm',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_bar"),
        'id': 'local_bar',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_cafe"),
        'id': 'local_cafe',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_car_wash"),
        'id': 'local_car_wash',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_convenience_store"),
        'id': 'local_convenience_store',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_dining"),
        'id': 'local_dining',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_drink"),
        'id': 'local_drink',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_florist"),
        'id': 'local_florist',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_gas_station"),
        'id': 'local_gas_station',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_grocery_store"),
        'id': 'local_grocery_store',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_hospital"),
        'id': 'local_hospital',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_hotel"),
        'id': 'local_hotel',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_laundry_service"),
        'id': 'local_laundry_service',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_library"),
        'id': 'local_library',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_mall"),
        'id': 'local_mall',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_movies"),
        'id': 'local_movies',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_offer"),
        'id': 'local_offer',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_parking"),
        'id': 'local_parking',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_pharmacy"),
        'id': 'local_pharmacy',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_phone"),
        'id': 'local_phone',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_pizza"),
        'id': 'local_pizza',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_play"),
        'id': 'local_play',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_post_office"),
        'id': 'local_post_office',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_printshop"),
        'id': 'local_printshop',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_see"),
        'id': 'local_see',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_shipping"),
        'id': 'local_shipping',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("local_taxi"),
        'id': 'local_taxi',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("location_city"),
        'id': 'location_city',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("location_disabled"),
        'id': 'location_disabled',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("location_off"),
        'id': 'location_off',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("location_on"),
        'id': 'location_on',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("location_searching"),
        'id': 'location_searching',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("lock"),
        'id': 'lock',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("lock_open"),
        'id': 'lock_open',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("lock_outline"),
        'id': 'lock_outline',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("looks"),
        'id': 'looks',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("looks_3"),
        'id': 'looks_3',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("looks_4"),
        'id': 'looks_4',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("looks_5"),
        'id': 'looks_5',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("looks_6"),
        'id': 'looks_6',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("looks_one"),
        'id': 'looks_one',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("looks_two"),
        'id': 'looks_two',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("loop"),
        'id': 'loop',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("loupe"),
        'id': 'loupe',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("low_priority"),
        'id': 'low_priority',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("loyalty"),
        'id': 'loyalty',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("mail"),
        'id': 'mail',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("mail_outline"),
        'id': 'mail_outline',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("map"),
        'id': 'map',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("markunread"),
        'id': 'markunread',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("markunread_mailbox"),
        'id': 'markunread_mailbox',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("memory"),
        'id': 'memory',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("menu"),
        'id': 'menu',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("merge_type"),
        'id': 'merge_type',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("message"),
        'id': 'message',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("mic"),
        'id': 'mic',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("mic_none"),
        'id': 'mic_none',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("mic_off"),
        'id': 'mic_off',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("mms"),
        'id': 'mms',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("mode_comment"),
        'id': 'mode_comment',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("mode_edit"),
        'id': 'mode_edit',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("monetization_on"),
        'id': 'monetization_on',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("money_off"),
        'id': 'money_off',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("monochrome_photos"),
        'id': 'monochrome_photos',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("mood"),
        'id': 'mood',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("mood_bad"),
        'id': 'mood_bad',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("more"),
        'id': 'more',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("more_horiz"),
        'id': 'more_horiz',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("more_vert"),
        'id': 'more_vert',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("motorcycle"),
        'id': 'motorcycle',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("mouse"),
        'id': 'mouse',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("move_to_inbox"),
        'id': 'move_to_inbox',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("movie"),
        'id': 'movie',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("movie_creation"),
        'id': 'movie_creation',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("movie_filter"),
        'id': 'movie_filter',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("multiline_chart"),
        'id': 'multiline_chart',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("music_note"),
        'id': 'music_note',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("music_video"),
        'id': 'music_video',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("my_location"),
        'id': 'my_location',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("nature"),
        'id': 'nature',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("nature_people"),
        'id': 'nature_people',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("navigate_before"),
        'id': 'navigate_before',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("navigate_next"),
        'id': 'navigate_next',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("navigation"),
        'id': 'navigation',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("near_me"),
        'id': 'near_me',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("network_cell"),
        'id': 'network_cell',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("network_check"),
        'id': 'network_check',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("network_locked"),
        'id': 'network_locked',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("network_wifi"),
        'id': 'network_wifi',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("new_releases"),
        'id': 'new_releases',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("next_week"),
        'id': 'next_week',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("nfc"),
        'id': 'nfc',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("no_encryption"),
        'id': 'no_encryption',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("no_sim"),
        'id': 'no_sim',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("not_interested"),
        'id': 'not_interested',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("note"),
        'id': 'note',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("note_add"),
        'id': 'note_add',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("notifications"),
        'id': 'notifications',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("notifications_active"),
        'id': 'notifications_active',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("notifications_none"),
        'id': 'notifications_none',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("notifications_off"),
        'id': 'notifications_off',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("notifications_paused"),
        'id': 'notifications_paused',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("offline_pin"),
        'id': 'offline_pin',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("ondemand_video"),
        'id': 'ondemand_video',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("opacity"),
        'id': 'opacity',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("open_in_browser"),
        'id': 'open_in_browser',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("open_in_new"),
        'id': 'open_in_new',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("open_with"),
        'id': 'open_with',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("pages"),
        'id': 'pages',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("pageview"),
        'id': 'pageview',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("palette"),
        'id': 'palette',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("pan_tool"),
        'id': 'pan_tool',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("panorama"),
        'id': 'panorama',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("panorama_fish_eye"),
        'id': 'panorama_fish_eye',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("panorama_horizontal"),
        'id': 'panorama_horizontal',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("panorama_vertical"),
        'id': 'panorama_vertical',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("panorama_wide_angle"),
        'id': 'panorama_wide_angle',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("party_mode"),
        'id': 'party_mode',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("pause"),
        'id': 'pause',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("pause_circle_filled"),
        'id': 'pause_circle_filled',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("pause_circle_outline"),
        'id': 'pause_circle_outline',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("payment"),
        'id': 'payment',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("people"),
        'id': 'people',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("people_outline"),
        'id': 'people_outline',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("perm_camera_mic"),
        'id': 'perm_camera_mic',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("perm_contact_calendar"),
        'id': 'perm_contact_calendar',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("perm_data_setting"),
        'id': 'perm_data_setting',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("perm_device_information"),
        'id': 'perm_device_information',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("perm_identity"),
        'id': 'perm_identity',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("perm_media"),
        'id': 'perm_media',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("perm_phone_msg"),
        'id': 'perm_phone_msg',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("perm_scan_wifi"),
        'id': 'perm_scan_wifi',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("person"),
        'id': 'person',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("person_add"),
        'id': 'person_add',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("person_outline"),
        'id': 'person_outline',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("person_pin"),
        'id': 'person_pin',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("person_pin_circle"),
        'id': 'person_pin_circle',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("personal_video"),
        'id': 'personal_video',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("pets"),
        'id': 'pets',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("phone"),
        'id': 'phone',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("phone_android"),
        'id': 'phone_android',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("phone_bluetooth_speaker"),
        'id': 'phone_bluetooth_speaker',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("phone_forwarded"),
        'id': 'phone_forwarded',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("phone_in_talk"),
        'id': 'phone_in_talk',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("phone_iphone"),
        'id': 'phone_iphone',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("phone_locked"),
        'id': 'phone_locked',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("phone_missed"),
        'id': 'phone_missed',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("phone_paused"),
        'id': 'phone_paused',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("phonelink"),
        'id': 'phonelink',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("phonelink_erase"),
        'id': 'phonelink_erase',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("phonelink_lock"),
        'id': 'phonelink_lock',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("phonelink_off"),
        'id': 'phonelink_off',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("phonelink_ring"),
        'id': 'phonelink_ring',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("phonelink_setup"),
        'id': 'phonelink_setup',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("photo"),
        'id': 'photo',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("photo_album"),
        'id': 'photo_album',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("photo_camera"),
        'id': 'photo_camera',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("photo_filter"),
        'id': 'photo_filter',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("photo_library"),
        'id': 'photo_library',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("photo_size_select_actual"),
        'id': 'photo_size_select_actual',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("photo_size_select_large"),
        'id': 'photo_size_select_large',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("photo_size_select_small"),
        'id': 'photo_size_select_small',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("picture_as_pdf"),
        'id': 'picture_as_pdf',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("picture_in_picture"),
        'id': 'picture_in_picture',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("picture_in_picture_alt"),
        'id': 'picture_in_picture_alt',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("pie_chart"),
        'id': 'pie_chart',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("pie_chart_outlined"),
        'id': 'pie_chart_outlined',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("pin_drop"),
        'id': 'pin_drop',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("place"),
        'id': 'place',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("play_arrow"),
        'id': 'play_arrow',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("play_circle_filled"),
        'id': 'play_circle_filled',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("play_circle_outline"),
        'id': 'play_circle_outline',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("play_for_work"),
        'id': 'play_for_work',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("playlist_add"),
        'id': 'playlist_add',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("playlist_add_check"),
        'id': 'playlist_add_check',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("playlist_play"),
        'id': 'playlist_play',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("plus_one"),
        'id': 'plus_one',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("poll"),
        'id': 'poll',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("polymer"),
        'id': 'polymer',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("pool"),
        'id': 'pool',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("portable_wifi_off"),
        'id': 'portable_wifi_off',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("portrait"),
        'id': 'portrait',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("power"),
        'id': 'power',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("power_input"),
        'id': 'power_input',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("power_settings_new"),
        'id': 'power_settings_new',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("pregnant_woman"),
        'id': 'pregnant_woman',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("present_to_all"),
        'id': 'present_to_all',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("print"),
        'id': 'print',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("priority_high"),
        'id': 'priority_high',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("public"),
        'id': 'public',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("publish"),
        'id': 'publish',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("query_builder"),
        'id': 'query_builder',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("question_answer"),
        'id': 'question_answer',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("queue"),
        'id': 'queue',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("queue_music"),
        'id': 'queue_music',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("queue_play_next"),
        'id': 'queue_play_next',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("radio"),
        'id': 'radio',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("radio_button_checked"),
        'id': 'radio_button_checked',
        'filter': ['toggle']
      },
      {
        'name': this.translate.instant("radio_button_unchecked"),
        'id': 'radio_button_unchecked',
        'filter': ['toggle']
      },
      {
        'name': this.translate.instant("rate_review"),
        'id': 'rate_review',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("receipt"),
        'id': 'receipt',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("recent_actors"),
        'id': 'recent_actors',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("record_voice_over"),
        'id': 'record_voice_over',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("redeem"),
        'id': 'redeem',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("redo"),
        'id': 'redo',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("refresh"),
        'id': 'refresh',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("remove"),
        'id': 'remove',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("remove_circle"),
        'id': 'remove_circle',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("remove_circle_outline"),
        'id': 'remove_circle_outline',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("remove_from_queue"),
        'id': 'remove_from_queue',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("remove_red_eye"),
        'id': 'remove_red_eye',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("remove_shopping_cart"),
        'id': 'remove_shopping_cart',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("reorder"),
        'id': 'reorder',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("repeat"),
        'id': 'repeat',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("repeat_one"),
        'id': 'repeat_one',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("replay"),
        'id': 'replay',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("replay_10"),
        'id': 'replay_10',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("replay_30"),
        'id': 'replay_30',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("replay_5"),
        'id': 'replay_5',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("reply"),
        'id': 'reply',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("reply_all"),
        'id': 'reply_all',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("report"),
        'id': 'report',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("report_problem"),
        'id': 'report_problem',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("restaurant"),
        'id': 'restaurant',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("restaurant_menu"),
        'id': 'restaurant_menu',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("restore"),
        'id': 'restore',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("restore_page"),
        'id': 'restore_page',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("ring_volume"),
        'id': 'ring_volume',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("room"),
        'id': 'room',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("room_service"),
        'id': 'room_service',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("rotate_90_degrees_ccw"),
        'id': 'rotate_90_degrees_ccw',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("rotate_left"),
        'id': 'rotate_left',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("rotate_right"),
        'id': 'rotate_right',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("rounded_corner"),
        'id': 'rounded_corner',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("router"),
        'id': 'router',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("rowing"),
        'id': 'rowing',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("rss_feed"),
        'id': 'rss_feed',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("rv_hookup"),
        'id': 'rv_hookup',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("satellite"),
        'id': 'satellite',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("save"),
        'id': 'save',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("scanner"),
        'id': 'scanner',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("schedule"),
        'id': 'schedule',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("school"),
        'id': 'school',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("screen_lock_landscape"),
        'id': 'screen_lock_landscape',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("screen_lock_portrait"),
        'id': 'screen_lock_portrait',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("screen_lock_rotation"),
        'id': 'screen_lock_rotation',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("screen_rotation"),
        'id': 'screen_rotation',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("screen_share"),
        'id': 'screen_share',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("sd_card"),
        'id': 'sd_card',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("sd_storage"),
        'id': 'sd_storage',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("search"),
        'id': 'search',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("security"),
        'id': 'security',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("select_all"),
        'id': 'select_all',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("send"),
        'id': 'send',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("sentiment_dissatisfied"),
        'id': 'sentiment_dissatisfied',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("sentiment_neutral"),
        'id': 'sentiment_neutral',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("sentiment_satisfied"),
        'id': 'sentiment_satisfied',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("sentiment_very_dissatisfied"),
        'id': 'sentiment_very_dissatisfied',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("sentiment_very_satisfied"),
        'id': 'sentiment_very_satisfied',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("settings"),
        'id': 'settings',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_applications"),
        'id': 'settings_applications',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_backup_restore"),
        'id': 'settings_backup_restore',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_bluetooth"),
        'id': 'settings_bluetooth',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_brightness"),
        'id': 'settings_brightness',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_cell"),
        'id': 'settings_cell',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_ethernet"),
        'id': 'settings_ethernet',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_input_antenna"),
        'id': 'settings_input_antenna',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_input_component"),
        'id': 'settings_input_component',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_input_composite"),
        'id': 'settings_input_composite',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_input_hdmi"),
        'id': 'settings_input_hdmi',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_input_svideo"),
        'id': 'settings_input_svideo',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_overscan"),
        'id': 'settings_overscan',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_phone"),
        'id': 'settings_phone',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_power"),
        'id': 'settings_power',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_remote"),
        'id': 'settings_remote',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("settings_system_daydream"),
        'id': 'settings_system_daydream',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("settings_voice"),
        'id': 'settings_voice',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("share"),
        'id': 'share',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("shop"),
        'id': 'shop',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("shop_two"),
        'id': 'shop_two',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("shopping_basket"),
        'id': 'shopping_basket',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("shopping_cart"),
        'id': 'shopping_cart',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("short_text"),
        'id': 'short_text',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("show_chart"),
        'id': 'show_chart',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("shuffle"),
        'id': 'shuffle',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("signal_cellular_4_bar"),
        'id': 'signal_cellular_4_bar',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("signal_cellular_connected_no_internet_4_bar"),
        'id': 'signal_cellular_connected_no_internet_4_bar',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("signal_cellular_no_sim"),
        'id': 'signal_cellular_no_sim',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("signal_cellular_null"),
        'id': 'signal_cellular_null',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("signal_cellular_off"),
        'id': 'signal_cellular_off',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("signal_wifi_4_bar"),
        'id': 'signal_wifi_4_bar',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("signal_wifi_4_bar_lock"),
        'id': 'signal_wifi_4_bar_lock',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("signal_wifi_off"),
        'id': 'signal_wifi_off',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("sim_card"),
        'id': 'sim_card',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("sim_card_alert"),
        'id': 'sim_card_alert',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("skip_next"),
        'id': 'skip_next',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("skip_previous"),
        'id': 'skip_previous',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("slideshow"),
        'id': 'slideshow',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("slow_motion_video"),
        'id': 'slow_motion_video',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("smartphone"),
        'id': 'smartphone',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("smoke_free"),
        'id': 'smoke_free',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("smoking_rooms"),
        'id': 'smoking_rooms',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("sms"),
        'id': 'sms',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("sms_failed"),
        'id': 'sms_failed',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("snooze"),
        'id': 'snooze',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("sort"),
        'id': 'sort',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("sort_by_alpha"),
        'id': 'sort_by_alpha',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("spa"),
        'id': 'spa',
        'filter': ['places']
      },
      {
        'name': this.translate.instant("space_bar"),
        'id': 'space_bar',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("speaker"),
        'id': 'speaker',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("speaker_group"),
        'id': 'speaker_group',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("speaker_notes"),
        'id': 'speaker_notes',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("speaker_notes_off"),
        'id': 'speaker_notes_off',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("speaker_phone"),
        'id': 'speaker_phone',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("spellcheck"),
        'id': 'spellcheck',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("star"),
        'id': 'star',
        'filter': ['toggle']
      },
      {
        'name': this.translate.instant("star_border"),
        'id': 'star_border',
        'filter': ['toggle']
      },
      {
        'name': this.translate.instant("star_half"),
        'id': 'star_half',
        'filter': ['toggle']
      },
      {
        'name': this.translate.instant("stars"),
        'id': 'stars',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("stay_current_landscape"),
        'id': 'stay_current_landscape',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("stay_current_portrait"),
        'id': 'stay_current_portrait',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("stay_primary_landscape"),
        'id': 'stay_primary_landscape',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("stay_primary_portrait"),
        'id': 'stay_primary_portrait',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("stop"),
        'id': 'stop',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("stop_screen_share"),
        'id': 'stop_screen_share',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("storage"),
        'id': 'storage',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("store"),
        'id': 'store',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("store_mall_directory"),
        'id': 'store_mall_directory',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("straighten"),
        'id': 'straighten',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("streetview"),
        'id': 'streetview',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("strikethrough_s"),
        'id': 'strikethrough_s',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("style"),
        'id': 'style',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("subdirectory_arrow_left"),
        'id': 'subdirectory_arrow_left',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("subdirectory_arrow_right"),
        'id': 'subdirectory_arrow_right',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("subject"),
        'id': 'subject',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("subscriptions"),
        'id': 'subscriptions',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("subtitles"),
        'id': 'subtitles',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("subway"),
        'id': 'subway',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("supervisor_account"),
        'id': 'supervisor_account',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("surround_sound"),
        'id': 'surround_sound',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("swap_calls"),
        'id': 'swap_calls',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("swap_horiz"),
        'id': 'swap_horiz',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("swap_vert"),
        'id': 'swap_vert',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("swap_vertical_circle"),
        'id': 'swap_vertical_circle',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("switch_camera"),
        'id': 'switch_camera',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("switch_video"),
        'id': 'switch_video',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("sync"),
        'id': 'sync',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("sync_disabled"),
        'id': 'sync_disabled',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("sync_problem"),
        'id': 'sync_problem',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("system_update"),
        'id': 'system_update',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("system_update_alt"),
        'id': 'system_update_alt',
        'filter': ['others']
      },
      {
        'name': this.translate.instant("tab"),
        'id': 'tab',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("tab_unselected"),
        'id': 'tab_unselected',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("tablet"),
        'id': 'tablet',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("tablet_android"),
        'id': 'tablet_android',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("tablet_mac"),
        'id': 'tablet_mac',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("tag_faces"),
        'id': 'tag_faces',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("tap_and_play"),
        'id': 'tap_and_play',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("terrain"),
        'id': 'terrain',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("text_fields"),
        'id': 'text_fields',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("text_format"),
        'id': 'text_format',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("textsms"),
        'id': 'textsms',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("texture"),
        'id': 'texture',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("theaters"),
        'id': 'theaters',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("thumb_down"),
        'id': 'thumb_down',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("thumb_up"),
        'id': 'thumb_up',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("thumbs_up_down"),
        'id': 'thumbs_up_down',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("time_to_leave"),
        'id': 'time_to_leave',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("timelapse"),
        'id': 'timelapse',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("timeline"),
        'id': 'timeline',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("timer"),
        'id': 'timer',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("timer_10"),
        'id': 'timer_10',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("timer_3"),
        'id': 'timer_3',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("timer_off"),
        'id': 'timer_off',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("title"),
        'id': 'title',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("toc"),
        'id': 'toc',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("today"),
        'id': 'today',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("toll"),
        'id': 'toll',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("tonality"),
        'id': 'tonality',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("touch_app"),
        'id': 'touch_app',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("toys"),
        'id': 'toys',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("track_changes"),
        'id': 'track_changes',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("traffic"),
        'id': 'traffic',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("train"),
        'id': 'train',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("tram"),
        'id': 'tram',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("transfer_within_a_station"),
        'id': 'transfer_within_a_station',
        'filter': ['maps']
      },
      {
        'name': this.translate.instant("transform"),
        'id': 'transform',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("translate"),
        'id': 'translate',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("trending_down"),
        'id': 'trending_down',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("trending_flat"),
        'id': 'trending_flat',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("trending_up"),
        'id': 'trending_up',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("tune"),
        'id': 'tune',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("turned_in"),
        'id': 'turned_in',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("turned_in_not"),
        'id': 'turned_in_not',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("tv"),
        'id': 'tv',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("unarchive"),
        'id': 'unarchive',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("undo"),
        'id': 'undo',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("unfold_less"),
        'id': 'unfold_less',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("unfold_more"),
        'id': 'unfold_more',
        'filter': ['navigation']
      },
      {
        'name': this.translate.instant("update"),
        'id': 'update',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("usb"),
        'id': 'usb',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("verified_user"),
        'id': 'verified_user',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("vertical_align_bottom"),
        'id': 'vertical_align_bottom',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("vertical_align_center"),
        'id': 'vertical_align_center',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("vertical_align_top"),
        'id': 'vertical_align_top',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("vibration"),
        'id': 'vibration',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("video_call"),
        'id': 'video_call',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("video_label"),
        'id': 'video_label',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("video_library"),
        'id': 'video_library',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("videocam"),
        'id': 'videocam',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("videocam_off"),
        'id': 'videocam_off',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("videogame_asset"),
        'id': 'videogame_asset',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("view_agenda"),
        'id': 'view_agenda',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("view_array"),
        'id': 'view_array',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("view_carousel"),
        'id': 'view_carousel',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("view_column"),
        'id': 'view_column',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("view_comfy"),
        'id': 'view_comfy',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("view_compact"),
        'id': 'view_compact',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("view_day"),
        'id': 'view_day',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("view_headline"),
        'id': 'view_headline',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("view_list"),
        'id': 'view_list',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("view_module"),
        'id': 'view_module',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("view_quilt"),
        'id': 'view_quilt',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("view_stream"),
        'id': 'view_stream',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("view_week"),
        'id': 'view_week',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("vignette"),
        'id': 'vignette',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("visibility"),
        'id': 'visibility',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("visibility_off"),
        'id': 'visibility_off',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("voice_chat"),
        'id': 'voice_chat',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("voicemail"),
        'id': 'voicemail',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("volume_down"),
        'id': 'volume_down',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("volume_mute"),
        'id': 'volume_mute',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("volume_off"),
        'id': 'volume_off',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("volume_up"),
        'id': 'volume_up',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("vpn_key"),
        'id': 'vpn_key',
        'filter': ['communication']
      },
      {
        'name': this.translate.instant("vpn_lock"),
        'id': 'vpn_lock',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("wallpaper"),
        'id': 'wallpaper',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("warning"),
        'id': 'warning',
        'filter': ['alert']
      },
      {
        'name': this.translate.instant("watch"),
        'id': 'watch',
        'filter': ['hardware']
      },
      {
        'name': this.translate.instant("watch_later"),
        'id': 'watch_later',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("wb_auto"),
        'id': 'wb_auto',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("wb_cloudy"),
        'id': 'wb_cloudy',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("wb_incandescent"),
        'id': 'wb_incandescent',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("wb_iridescent"),
        'id': 'wb_iridescent',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("wb_sunny"),
        'id': 'wb_sunny',
        'filter': ['image']
      },
      {
        'name': this.translate.instant("wc"),
        'id': 'wc',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("web"),
        'id': 'web',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("web_asset"),
        'id': 'web_asset',
        'filter': ['av']
      },
      {
        'name': this.translate.instant("weekend"),
        'id': 'weekend',
        'filter': ['content']
      },
      {
        'name': this.translate.instant("whatshot"),
        'id': 'whatshot',
        'filter': ['social']
      },
      {
        'name': this.translate.instant("widgets"),
        'id': 'widgets',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("wifi"),
        'id': 'wifi',
        'filter': ['notification']
      },
      {
        'name': this.translate.instant("wifi_lock"),
        'id': 'wifi_lock',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("wifi_tethering"),
        'id': 'wifi_tethering',
        'filter': ['device']
      },
      {
        'name': this.translate.instant("work"),
        'id': 'work',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("wrap_text"),
        'id': 'wrap_text',
        'filter': ['editor']
      },
      {
        'name': this.translate.instant("youtube_searched_for"),
        'id': 'youtube_searched_for',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("zoom_in"),
        'id': 'zoom_in',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("zoom_out"),
        'id': 'zoom_out',
        'filter': ['action']
      },
      {
        'name': this.translate.instant("zoom_out_map"),
        'id': 'zoom_out_map',
        'filter': ['maps']
      }
    ];
  }

}
