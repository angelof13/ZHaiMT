import { Injectable } from '@angular/core';

/**
 * @interface canvas_info
 * @description 记录canvas的信息
 */
export interface canvas_info {
  /**
   * @description 获取并保存页面中的canvas元素
   */
  canvas_event?: HTMLCanvasElement;
  /**
   * @description 设置canvas的高
   */
  canvas_height: number;
  /**
   * @description 设置canvas的宽
   */
  canvas_width: number;
}
/**
 * @interface horizontal_vertical
 * @description 用于描述画线是水平(h)还是竖直(v)
 */
export enum horizontal_vertical {
  /**
   * @description horizontal 水平的
   */
  h,
  /**
   * @description vertical 垂直的
   */
  v
}

/**
 * @interface line_info
 * @description 设置画线的参数
 */
export interface line_info {
  /**
   * @description 设置画线的数量
   */
  line_num: number;
  /**
   * @description 设置线条的长度，值小于1时，为canvas_info设置的相应长度的倍数，大于1则为线条实际长度
   * @example 设置为0.8 且HorV设置为V是，长度实际为canvas_info.canvas_height * length
   */
  length: number;
  /**
   * @description 水平或垂直
   */
  HorV: horizontal_vertical;
}

/**
 * @description 画线的初始坐标
 */
const init_point = { x: 40, y: 40 };

@Injectable({
  providedIn: 'root'
})

export class DrawService {

  constructor() { }

  /**
   * @description 设置画线的初始坐标
   */
  setInitPoint(x: number, y: number) {
    init_point.x = x;
    init_point.y = y;
  }
  /**
   * @param {canvas_info} canvas 传入canvas信息
   * @param {line_info} line 设置画线信息
   * @returns {boolean} 返回是否执行成功
   */
  drawEquidistantLine(canvas: canvas_info, line: line_info): boolean {
    if (!canvas.canvas_event) {
      return false;
    }
    canvas.canvas_event.height = canvas.canvas_height;
    canvas.canvas_event.width = canvas.canvas_width;
    let draw_map = canvas.canvas_event.getContext("2d");
    let interval: number;
    let length = line.length < 0 ? 0 :
      line.length > 1 ? line.length :
        (line.length * (line.HorV == horizontal_vertical.h ? canvas.canvas_event.width : canvas.canvas_event.height));

    if (line.HorV == horizontal_vertical.h) {

      interval = ((canvas.canvas_height - (init_point.y * 2)) / (line.line_num - 1));
      for (let num = 0, coordinate_a = (init_point.y + interval * num), coordinate_b = init_point.x + length;
        num < line.line_num;
        num++, coordinate_a = (init_point.y + interval * num)) {
        draw_map.beginPath();
        draw_map.moveTo(init_point.x, coordinate_a);
        draw_map.lineTo(coordinate_b, coordinate_a);
        draw_map.stroke();
      }
    } else {

      interval = ((canvas.canvas_width - (init_point.x * 2)) / (line.line_num - 1));
      for (let num = 0, coordinate_a = (init_point.x + interval * num), coordinate_b = init_point.y + length;
        num < line.line_num;
        num++, coordinate_a = (init_point.x + interval * num)) {
        draw_map.beginPath();
        draw_map.moveTo(coordinate_a, init_point.y);
        draw_map.lineTo(coordinate_a, coordinate_b);
        draw_map.stroke();
      }
    }
    return true;
  }
}
