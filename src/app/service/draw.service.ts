import { Injectable } from '@angular/core';

export { horizontal_vertical, follow_style, line_info }
export { DrawService }

/**************************************************************************************数据类型接口************************************************************************************************************/
/**
 * @description 用于描述画线是水平(h)还是竖直(v)
 */
enum horizontal_vertical { h, v }

/**
 * @description 用于表示时间的跟随方式
 */
enum follow_style { top, bottom, left, right }

/**
 * @description 设置画线的参数
 * @param line_num 设置画线的数量
 * @param length 设置线条的长度，则值小于1时，为canvas_info设置的相应长度的倍数，大于1则为线条实际长度，值为0时,终点完全与起点相对应
 *        @example 设置为0.8 且HorV设置为V是，长度实际为canvas_info.canvas_height * length
 * @param start_point 设置线条的起点，长度为0时,终点完全与起点相对应
 * @param HorV 水平或垂直
 */
interface line_info {
  line_num: number;
  length: number;
  HorV: horizontal_vertical;
  start_point?: { x: number, y: number };
  follow_time?: time_array_style;
}

interface time_array_style {
  is_draw_time: boolean;
  time_array: string[];
  follow_style_h: follow_style;
  follow_style_v: follow_style;
}

/**************************************************************************************数据类型接口结束************************************************************************************************************/

@Injectable({
  providedIn: 'root'
})

class DrawService {
  /**
   * @description 画线的初始坐标
   */
  private init_point = { x: 40, y: 40 };
  private text_size = 15;
  constructor() { }
  /**
   * @description 得到时间表数组
   * @param divide_part 对一天的划分次数
   * @param start_time 开始的时间,单位:分
   */
  getTimeArrayOneDay(divide_part: number, start_time: number = 180): string[] {
    let s_time = start_time <= 0 ? 0 : start_time >= 1440 ? 0 : start_time, time_array: string[] = [], time_interval = (1440 / divide_part), time_h = ((s_time / 60) | 0), time_m = (start_time - time_h * 60);
    time_array.push(((time_h >= 10 ? "" + time_h : "0" + time_h) + ":" + (time_m >= 10 ? "" + time_m : "0" + time_m)));
    for (let divide_num = 0; divide_num < divide_part; divide_num++) {
      time_m = time_m + time_interval;
      while (time_m >= 60) {
        time_h += 1;
        time_m -= 60;
      }
      time_h = time_h >= 24 ? time_h - 24 : time_h;
      time_array.push(((time_h >= 10 ? "" + time_h : "0" + time_h) + ":" + (time_m >= 10 ? "" + time_m : "0" + time_m)));
    }
    return time_array;
  }

  /**
   * @description 画出等间距的线
   * @param {CanvasRenderingContext2D} draw_map 传入可绘制区域信息,即 canvas.getContext('2D')
   * @param {line_info} line 设置画线信息
   * @returns boolean 返回是否执行成功
   */
  drawEquidistantLine(draw_map: CanvasRenderingContext2D, canvas_width: number, canvas_height: number, line_infos: line_info[]) {
    draw_map.font = this.text_size + "px cascadia code PL";
    draw_map.lineWidth = 1;
    let line_interval: number;
    for (let line_info_num = 0; line_info_num < line_infos.length; line_info_num++) {
      this.init_point.x = line_infos[line_info_num].start_point.x;
      this.init_point.y = line_infos[line_info_num].start_point.y;
      let length: number;

      if (line_infos[line_info_num].length <= 0) {
        length = (line_infos[line_info_num].HorV == horizontal_vertical.h ? (canvas_width - this.init_point.x * 2) : (canvas_height - this.init_point.y * 2));
      } else if (line_infos[line_info_num].length <= 1) {
        length = (0.5 + line_infos[line_info_num].length * (line_infos[line_info_num].HorV == horizontal_vertical.h ? canvas_width : canvas_height)) | 0;
      }
      else {
        length = line_infos[line_info_num].length;
      }

      if (line_infos[line_info_num].HorV == horizontal_vertical.h) {
        line_interval = ((0.5 + (canvas_height - (this.init_point.y * 2)) / (line_infos[line_info_num].line_num - 1)) | 0);
        for (let num = 0, coordinate_a = (this.init_point.y + line_interval * num), coordinate_b = this.init_point.x + length, line_num = line_infos[line_info_num].line_num;
          num < line_num;
          num++, coordinate_a = (this.init_point.y + line_interval * num)) {
          draw_map.beginPath();
          draw_map.moveTo(this.init_point.x, coordinate_a);
          draw_map.lineTo(coordinate_b, coordinate_a);
          draw_map.stroke();
          if (line_infos[line_info_num].follow_time.is_draw_time) {
            let fs = line_infos[line_info_num].follow_time.follow_style_h;
            let point = { x: this.init_point.x - 10, y: coordinate_a - 2 };
            switch (fs) {
              case follow_style.top:
                draw_map.textAlign = "start";
                break;
              case follow_style.bottom:
                draw_map.textAlign = "start";
                point.y += this.text_size + 4;
                break;
              case follow_style.left:
                draw_map.textAlign = "end";
                point.y += (this.text_size / 2) | 0;
                break;
              case follow_style.right:
                draw_map.textAlign = "start";
                point.x += length + 20;
                point.y += (this.text_size / 2) | 0;
                break;
            }
            draw_map.fillText(line_infos[line_info_num].follow_time.time_array[num], point.x, point.y);
          }
        }
      } else {
        line_interval = (0.5 + ((canvas_width - (this.init_point.x * 2)) / (line_infos[line_info_num].line_num - 1)) | 0);
        for (let num = 0, coordinate_a = 0.5 + (this.init_point.x + line_interval * num), coordinate_b = this.init_point.y + length, line_num = line_infos[line_info_num].line_num;
          num < line_num;
          num++, coordinate_a = (this.init_point.x + line_interval * num)) {
          draw_map.beginPath();
          draw_map.moveTo(coordinate_a, this.init_point.y);
          draw_map.lineTo(coordinate_a, coordinate_b);
          draw_map.stroke();
          if (line_infos[line_info_num].follow_time.is_draw_time) {
            let fs = line_infos[line_info_num].follow_time.follow_style_v;
            let point = { x: coordinate_a, y: this.init_point.y - 2 };
            switch (fs) {
              case follow_style.top:
                draw_map.textAlign = "center";
                break;
              case follow_style.bottom:
                draw_map.textAlign = "center";
                point.y += length + this.text_size + 4;
                break;
              case follow_style.left:
                draw_map.textAlign = "end";
                break;
              case follow_style.right:
                draw_map.textAlign = "start";
                break;
            }
            draw_map.fillText(line_infos[line_info_num].follow_time.time_array[num], point.x, point.y);
          }
        }
      }
    }
  }
}
