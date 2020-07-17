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

  canvas: HTMLCanvasElement;
  draw_map: CanvasRenderingContext2D;
  constructor(private draw: DrawService, private tl_daf: TimelineDataAndFunction, private render: Renderer2) { }

  /**
   * @description 改变窗口大小时，更新值的方法
   */
  private update(): void {
    let canvas_area = { area_width: this.canvas.parentElement.offsetWidth, area_height: this.canvas.parentElement.offsetHeight };

    this.tl_daf.timelineSelfAdaption(canvas_area, current_mode.day);
    this.canvas.width = canvas_area.area_width;
    this.canvas.height = canvas_area.area_height;
    this.draw_map = this.canvas.getContext("2d");
    let timeline_day = this.tl_daf.getLinesInfo(1);
    this.draw.drawLine(this.draw_map, timeline_day);
    this.draw.drawText(this.draw_map, this.tl_daf.getTimeTextInfo(current_mode.day));

    let test_box: boxes_info = { start: { x: 0, y: 0 }, task: "测试任务1" };
    test_box.start = { x: 500, y: 200 };
    test_box.length = 200;
    this.draw.drawBox(this.draw_map, (timeline_day[0][timeline_day.length - 1].end.x - timeline_day[0][0].start.x), (timeline_day[0][0].end.y - timeline_day[0][0].start.y), [test_box]);
  }

  ngOnInit(): void {
    this.canvas = this.render.selectRootElement("#timeline_canvas");
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
