import { Injectable } from '@angular/core';

export interface canvas_info {
  canvas_event?: HTMLCanvasElement;
  canvas_height: number;
  canvas_width: number;
}

export enum horizontal_vertical {
  h, v
}
export interface line_info {
  line_num: number;
  length: number;
  HorV: horizontal_vertical;
}

const init_point = { x: 40, y: 40 };

@Injectable({
  providedIn: 'root'
})

export class DrawService {

  constructor() { }

  /**
  * @param {canvas_info} canvas canvas信息
  */
  drawEquidistantLine(canvas: canvas_info, line: line_info): Boolean {
    if (!canvas.canvas_event) {
      return false;
    }

    canvas.canvas_event.height = canvas.canvas_height;
    canvas.canvas_event.width = canvas.canvas_width;
    let draw_map = canvas.canvas_event.getContext("2d");
    let interval: number;
    let length = line.length > 3 ? line.length :
      (line.length * (line.HorV == horizontal_vertical.h ? canvas.canvas_event.width : canvas.canvas_event.height));

    if (line.HorV == horizontal_vertical.h) {

      interval = ((canvas.canvas_height - (init_point.y * 2)) / line.line_num);
      for (let num = 0, coordinate_a = (init_point.y + interval * num), coordinate_b = init_point.x + length;
        num < line.line_num;
        num++, coordinate_a = (init_point.y + interval * num)) {
        draw_map.beginPath();
        draw_map.moveTo(init_point.x, coordinate_a);
        draw_map.lineTo(coordinate_b, coordinate_a);
        draw_map.stroke();
      }
    } else {

      interval = ((canvas.canvas_width - (init_point.x * 2)) / line.line_num);
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
