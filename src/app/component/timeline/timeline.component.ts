import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

import * as datatype from './timeline_datatype';

import { canvas_info, horizontal_vertical as HV, line_info } from '../../service/draw.service';
import { DrawService } from '../../service/draw.service';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  value_line: line_info;
  canvas: canvas_info = { canvas_height: 0, canvas_width: 0 };

  constructor(private draw: DrawService) { }

  private upDate(): void {
    if (this.canvas.canvas_event) {
      this.canvas.canvas_height = this.canvas.canvas_event.parentElement.offsetHeight;
      this.canvas.canvas_width = this.canvas.canvas_event.parentElement.offsetWidth;
    }
  }

  ngOnInit(): void {
    this.upDate();
    this.value_line = { line_num: 12, length: 0.8, HorV: HV.v };
  }
  let
  ngAfterViewInit(): void {
    let that = this;
    this.canvas.canvas_event = <HTMLCanvasElement>document.getElementById("myCanvas");
    this.upDate();

    that.draw.drawEquidistantLine(this.canvas, this.value_line);

    fromEvent(window, 'resize').subscribe((event) => {
      //这里表示当窗口大小发生变化时所做的事，也就是说可以对多个图表进行大小调整
      that.upDate();
      that.draw.drawEquidistantLine(that.canvas, this.value_line);
    })
  }
}
