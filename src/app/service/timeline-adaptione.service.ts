import { Injectable } from '@angular/core';
import { line_info, horizontal_vertical } from './draw.service'

@Injectable({
  providedIn: 'root'
})
export class TimelineAdaptioneService {

  constructor() { }
  //所有线的长度都为0.95
  private value_line: line_info[] = [{ start_point: { x: 0, y: 0 }, line_num: 3, length: 0.95, HorV: horizontal_vertical.v }];
  private old_adaption_info = { height: -500, width: -500, w_ge_h: false };

  get_line_info(): line_info {
    return this.value_line[0];
  }
  /**
 * @todo 将所有比例及对应分割方法抽成数组,便于维护
 */
  timeline_self_adaption(area_info: { area_width: number; area_height: number }): boolean {
    let adaption_info = { height: area_info.area_height, width: area_info.area_width, w_ge_h: area_info.area_width >= area_info.area_height };
    let need_draw: boolean = false;
    if ((Math.abs(adaption_info.height - this.old_adaption_info.height) >= 500) || (Math.abs(adaption_info.width - this.old_adaption_info.width) >= 500) || (adaption_info.w_ge_h != this.old_adaption_info.w_ge_h)) {

      need_draw = true;
      /**
      * 根据窗口大小自适应画线规则
      */
      if ((adaption_info.width <= 1366 && adaption_info.height <= 768) || (adaption_info.height <= 1366 && adaption_info.width <= 768)) {
        this.value_line[0].line_num = 6;
        adaption_info.width = 1366;
        adaption_info.height = 768;
      } else if ((adaption_info.width <= 1960 && adaption_info.height <= 1080) || (adaption_info.height <= 1960 && adaption_info.width <= 1080)) {
        this.value_line[0].line_num = 12;
        adaption_info.width = 1960;
        adaption_info.height = 1080;
      } else if ((adaption_info.width <= 2560 && adaption_info.height <= 1440) || (adaption_info.height <= 2560 && adaption_info.width <= 1440)) {
        this.value_line[0].line_num = 12;
        adaption_info.width = 2560;
        adaption_info.height = 1440;
      } else if ((adaption_info.width <= 3840 && adaption_info.height <= 1080) || (adaption_info.height <= 3840 && adaption_info.width <= 1080)) {
        this.value_line[0].line_num = 24;
        adaption_info.width = 3840;
        adaption_info.height = 1080;
      } else if ((adaption_info.width <= 4096 && adaption_info.height <= 3112) || (adaption_info.height <= 4096 && adaption_info.width <= 3112)) {
        this.value_line[0].line_num = 18;
        adaption_info.width = 4096;
        adaption_info.height = 3112;
      } else if ((adaption_info.width <= 7680 && adaption_info.height <= 4320) || (adaption_info.height <= 7680 && adaption_info.width <= 4320)) {
        this.value_line[0].line_num = 24;
        adaption_info.width = 7680;
        adaption_info.height = 4320;
      }
      if (((2560 <= adaption_info.width && adaption_info.width <= 3840) && adaption_info.height <= 1080)) { }


      if (adaption_info.w_ge_h) {
        this.value_line[0].HorV = horizontal_vertical.v;
        this.value_line[0].start_point.x = adaption_info.width * 0.02;
        this.value_line[0].start_point.y = 40;
        area_info.area_width = adaption_info.width;
        area_info.area_height = adaption_info.height;
      } else {
        this.value_line[0].HorV = horizontal_vertical.h;
        this.value_line[0].start_point.x = 30;
        this.value_line[0].start_point.y = adaption_info.height * 0.01;
        area_info.area_width = adaption_info.height;
        area_info.area_height = adaption_info.width;
      }
      this.old_adaption_info = adaption_info;
    }
    return need_draw;
  }
}
