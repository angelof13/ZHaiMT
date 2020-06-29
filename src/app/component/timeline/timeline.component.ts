import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';

import * as datatype from './timeline_datatype';

import {Canvas_info, line_info} from '../../service/draw.service';
import {DrawService } from '../../service/draw.service';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  value_line:line_info;
  canvas:Canvas_info={canvas_height:200 ,canvas_width:300};
  
  constructor(private draw:DrawService) { }

  private update():void{
    if(this.canvas.canvas_event){
      this.canvas.canvas_height=this.canvas.canvas_event.parentElement.offsetHeight;
      this.canvas.canvas_width=this.canvas.canvas_event.parentElement.offsetWidth;
    }
  }

  ngOnInit(): void {
    this.update();
    this.value_line={line_num:4,length:100,HorV:1};
  }

  ngAfterViewInit(): void {
    let that=this;
    this.canvas.canvas_event = <HTMLCanvasElement>document.getElementById("myCanvas");
    this.update();

    that.draw.draw_line(this.canvas,this.value_line);
    
    fromEvent(window,'resize').subscribe((event)=>{
      //这里表示当窗口大小发生变化时所做的事，也就是说可以对多个图表进行大小调整
      that.update();
      that.draw.draw_line(that.canvas,this.value_line);
    })
  }
}
