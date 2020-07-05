import { Injectable } from '@angular/core';

/**
 * @interface canvas_info
 * @description 记录canvas的信息
 * @param canvas_event 获取并保存页面中的canvas元素
 * @param canvas_height 设置canvas的高
 * @param canvas_width 设置canvas的宽
 */
export interface canvas_info {
  canvas_event?: HTMLCanvasElement;
  canvas_height: number;
  canvas_width: number;
}
/**
 * @interface horizontal_vertical
 * @description 用于描述画线是水平(h)还是竖直(v)
 */
export enum horizontal_vertical { h, v }

/**
 * @interface line_info
 * @description 设置画线的参数
 * @param start_point 设置线条的起始点，与设置方向相同的竖直同时设置起始和终止间隔
 * @param line_num 设置画线的数量
 * @param length 设置线条的长度，值小于1时，为canvas_info设置的相应长度的倍数，大于1则为线条实际长度
 *        @example 设置为0.8 且HorV设置为V是，长度实际为canvas_info.canvas_height * length
 * @param HorV 水平或垂直
 */
export interface line_info {
  start_point?: { x: number, y: number };
  line_num: number;
  length: number;
  HorV: horizontal_vertical;
}

/**
 * @description 画线的初始坐标
 */
let init_point = { x: 40, y: 40 };

@Injectable({
  providedIn: 'root'
})

export class DrawService {

  constructor() { }
  /**
   * @param {canvas_info} canvas 传入canvas信息
   * @param {line_info} line 设置画线信息
   * @returns {boolean} 返回是否执行成功
   */
  drawEquidistantLine(canvas: canvas_info, lines: line_info[]): boolean {
    if (!canvas.canvas_event) {
      return false;
    }
    canvas.canvas_event.height = canvas.canvas_height;
    canvas.canvas_event.width = canvas.canvas_width;
    let draw_map = canvas.canvas_event.getContext("2d");
    let interval: number;
    for (let line_info_num = 0; line_info_num < lines.length; line_info_num++) {
      init_point.x = lines[line_info_num].start_point.x;
      init_point.y = lines[line_info_num].start_point.y;
      let length = lines[line_info_num].length < 0 ? 0 :
        lines[line_info_num].length > 1 ? lines[line_info_num].length :
          (lines[line_info_num].length * (lines[line_info_num].HorV == horizontal_vertical.h ? canvas.canvas_event.width : canvas.canvas_event.height));

      if (lines[line_info_num].HorV == horizontal_vertical.h) {

        interval = ((canvas.canvas_height - (init_point.y * 2)) / (lines[line_info_num].line_num - 1));
        for (let num = 0, coordinate_a = (init_point.y + interval * num), coordinate_b = init_point.x + length;
          num < lines[line_info_num].line_num;
          num++, coordinate_a = (init_point.y + interval * num)) {
          draw_map.beginPath();
          draw_map.moveTo(init_point.x, coordinate_a);
          draw_map.lineTo(coordinate_b, coordinate_a);
          draw_map.stroke();
        }
      } else {
        interval = ((canvas.canvas_width - (init_point.x * 2)) / (lines[line_info_num].line_num - 1));
        for (let num = 0, coordinate_a = (init_point.x + interval * num), coordinate_b = init_point.y + length;
          num < lines[line_info_num].line_num;
          num++, coordinate_a = (init_point.x + interval * num)) {
          draw_map.beginPath();
          draw_map.moveTo(coordinate_a, init_point.y);
          draw_map.lineTo(coordinate_a, coordinate_b);
          draw_map.stroke();
        }
      }
    }
    return true;
  }
}
