import { Injectable } from '@angular/core';
import { line_info, horizontal_vertical } from './draw.service'
import { observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimelineAdaptioneService {

  constructor() { }
  //所有线的长度都为0.95
  private value_line: line_info[] = [{ start_point: { x: 0, y: 0 }, line_num: 3, length: 0.95, HorV: horizontal_vertical.v }];
  private old_adaption_info = { height: { min: - 500, max: -500 }, width: { min: -500, max: 500 }, w_ge_h: false };

  get_line_info(): line_info {
    return this.value_line[0];
  }
  /**
 * @description 常见比例及对应分割方法抽成数组,便于维护
 */
  private resolution_ratio_and_divide: { w: number, h: number, n: number }[] = [
    { w: 800, h: 600, n: 4 },
    { w: 1024, h: 768, n: 4 },
    { w: 1280, h: 720, n: 4 },
    { w: 1280, h: 800, n: 6 },
    { w: 1280, h: 960, n: 4 },
    { w: 1366, h: 768, n: 6 },
    { w: 1440, h: 900, n: 6 },
    { w: 1600, h: 900, n: 6 },
    { w: 1600, h: 1200, n: 4 },
    { w: 1680, h: 1050, n: 6 },
    { w: 1792, h: 868, n: 6 },
    { w: 1920, h: 1080, n: 12 },
    { w: 1920, h: 1200, n: 12 },
    { w: 1920, h: 1400, n: 8 },
    { w: 2048, h: 1152, n: 12 },
    { w: 2048, h: 1536, n: 8 },
    { w: 2560, h: 1080, n: 16 },
    { w: 2560, h: 1440, n: 12 },
    { w: 2560, h: 1600, n: 12 },
    { w: 2800, h: 2100, n: 8 },//一下显示分辨率纯靠猜测,无实机测试
    { w: 3440, h: 1440, n: 16 },
    { w: 3840, h: 1080, n: 24 },
    { w: 3840, h: 2160, n: 18 },
    { w: 3840, h: 2400, n: 18 },
    { w: 4096, h: 3072, n: 16 },
    { w: 5120, h: 3200, n: 24 },
    { w: 5120, h: 4096, n: 24 },
    { w: 6400, h: 4096, n: 24 },
    { w: 6400, h: 4800, n: 20 },
    { w: 7680, h: 4320, n: 24 },
    { w: 7680, h: 4800, n: 24 }
  ];

  timeline_self_adaption(area_info: { area_width: number; area_height: number }): boolean {
    let adaption_info = { height: area_info.area_height, width: area_info.area_width, w_ge_h: area_info.area_width >= area_info.area_height };
    let need_draw: boolean = false;

    if (adaption_info.w_ge_h != this.old_adaption_info.w_ge_h ||
      adaption_info.width <= this.old_adaption_info.width.min || adaption_info.width > this.old_adaption_info.width.max ||
      adaption_info.height <= this.old_adaption_info.height.min || adaption_info.height > this.old_adaption_info.height.max) {
      for (let rrad_i = 0; rrad_i < this.resolution_ratio_and_divide.length; rrad_i++) {

        if (adaption_info.width <= this.resolution_ratio_and_divide[rrad_i].w && adaption_info.height <= this.resolution_ratio_and_divide[rrad_i].h) {
          adaption_info.width = this.resolution_ratio_and_divide[rrad_i].w;
          adaption_info.height = this.resolution_ratio_and_divide[rrad_i].h;
          this.value_line[0].line_num = this.resolution_ratio_and_divide[rrad_i].n;
          if (adaption_info.w_ge_h) {
            this.value_line[0].HorV = horizontal_vertical.v;
            this.value_line[0].start_point.x = (0.5 + adaption_info.width * 0.02) | 0;
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

          this.old_adaption_info.width.min = this.resolution_ratio_and_divide[rrad_i - 1].w;
          this.old_adaption_info.width.max = this.resolution_ratio_and_divide[rrad_i].w;
          this.old_adaption_info.height.min = this.resolution_ratio_and_divide[rrad_i - 1].h;
          this.old_adaption_info.height.max = this.resolution_ratio_and_divide[rrad_i].h;
          need_draw = true;
          break;
        }
      }
    }
    return need_draw;
  }
}
