import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';

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
  window_is_resize: boolean;
  constructor(private draw: DrawService) { }

  /**
   * @description 改变窗口大小时，更新值的方法
   */
  private update(): void {
    if (this.canvas.canvas_event) {
      this.canvas.canvas_height = this.canvas.canvas_event.parentElement.offsetHeight;
      this.canvas.canvas_width = this.canvas.canvas_event.parentElement.offsetWidth;
    }

    /**
     * @todo 根据窗口大小自适应画线规则
     */
    this.value_line = { line_num: 12, length: 0.8, HorV: HV.v };
  }

  ngOnInit(): void {
    this.draw.setInitPoint(40, 100);
  }

  ngAfterViewInit(): void {
    //加载完页面后才能获取到canvas元素
    this.canvas.canvas_event = <HTMLCanvasElement>document.getElementById("myCanvas");

    fromEvent(window, 'resize').subscribe((event) => {
      //这里表示当窗口大小发生变化时所做的事，也就是说可以对多个图表进行大小调整
      this.update();
    })
  }

  ngAfterViewChecked() {
    this.update();
    this.draw.drawEquidistantLine(this.canvas, this.value_line);
  }
}
