import { Injectable } from '@angular/core';

export interface line_info {
  line_num:number;
  length:number;
  HorV:number
}

@Injectable({
  providedIn: 'root'
})

export class DrawService {
  
  constructor() { }


  draw_line(canvas:any,Info_line:line_info):Boolean{

    let cxt=canvas.getContext("2d");
    cxt.fillStyle = "#35B7F6";
    cxt.fillRect(0,0,150,75); 
    return true;
  }
}
