import { Component, OnInit, Renderer2 } from '@angular/core';
import { fromEvent } from 'rxjs';

import { TimelineDataAndFunction, current_mode, boxes_info } from './timeline-daf';

import { DrawService } from '../../service/draw.service';
//import { TimelineAdaptioneService } from '../../service/timeline-adaptione.service'


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  timeline_canvas: HTMLCanvasElement;
  timeline_drawmap: CanvasRenderingContext2D;
  task_canvas: HTMLCanvasElement;
  task_drawmap: CanvasRenderingContext2D;
  constructor(private draw: DrawService, private tl_daf: TimelineDataAndFunction, private render: Renderer2) { }

  /**
   * @description 改变窗口大小时，更新值的方法
   */
  private update(): void {
    /**更新time_line Canvas画布,重新绘制背景 */
    this.timeline_drawmap = this.tl_daf.timelineSelfAdaption(this.timeline_canvas, current_mode.day);

    this.draw.drawLine(this.timeline_drawmap, [this.tl_daf.getLinesInfo()]);
    this.draw.drawText(this.timeline_drawmap, this.tl_daf.getTimeTextInfo());


    this.task_drawmap = this.task_canvas.getContext("2d");
    this.task_drawmap = this.tl_daf.taskSelfAdaption(this.task_canvas, current_mode.day);
    this.draw.drawBox(this.task_drawmap, this.tl_daf.getViewTaskBox());
  }

  ngOnInit(): void {
    this.tl_daf.init();
    this.timeline_canvas = this.render.selectRootElement("#timeline_canvas");
    this.task_canvas = this.render.selectRootElement("#task_canvas");
    this.update();

    fromEvent(window, 'resize').subscribe((event) => {
      //这里表示当窗口大小发生变化时所做的事，也就是说可以对多个图表进行大小调整
      this.update();
    })
  }

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked() {
  }
}
