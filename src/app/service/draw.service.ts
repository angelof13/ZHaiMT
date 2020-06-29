import { Injectable } from '@angular/core';

export interface Canvas_info {
  canvas_event?:HTMLCanvasElement;
  canvas_height:number;
  canvas_width:number;
}

export interface line_info {
  line_num:number;
  length:number;
  HorV:number;
}

@Injectable({
  providedIn: 'root'
})

export class DrawService {
  
  constructor() { }

  /**
  * @param {Canvas_info} canvas canvas信息
  */
  draw_line(canvas:Canvas_info,Info_line:line_info):Boolean{
    if(!canvas.canvas_event){
      console.log("none");
      return false;
    }
    canvas.canvas_event.height = canvas.canvas_height;
    canvas.canvas_event.width = canvas.canvas_width;
    let draw_map=canvas.canvas_event.getContext("2d");
    draw_map.lineCap="round";
    draw_map.beginPath();
    draw_map.moveTo(20,20);
    draw_map.lineTo(20,50);
    draw_map.lineTo(90,50);
    draw_map.lineTo(90,500);
    draw_map.strokeStyle="red";
    draw_map.stroke();
    return true;
  }
}
