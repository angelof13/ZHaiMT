import { Component, OnInit, Renderer2 } from '@angular/core';
import { fromEvent } from 'rxjs';

import * as datatype from './timeline_datatype';

import { canvas_info, line_info, DrawService } from '../../service/draw.service';
import { TimelineAdaptioneService } from '../../service/timeline-adaptione.service'


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  canvas: canvas_info = { canvas_height: 0, canvas_width: 0 };

  constructor(private draw: DrawService, private tl_adp: TimelineAdaptioneService, private render: Renderer2) { }

  /**
   * @description 改变窗口大小时，更新值的方法
   */
  private update(): void {
    let cabvas_area = { area_width: this.canvas.canvas_event.parentElement.offsetWidth, area_height: this.canvas.canvas_event.parentElement.offsetHeight };

    let adp_result = this.tl_adp.timelineSelfAdaption(cabvas_area);

    if (adp_result) {
      this.canvas.canvas_width = cabvas_area.area_width;
      this.canvas.canvas_height = cabvas_area.area_height;
      this.draw.drawEquidistantLine(this.canvas, [this.tl_adp.get_line_info()]);
    }
  }

  ngOnInit(): void {
    this.canvas.canvas_event = this.render.selectRootElement("#timeline_canvas");
    this.update();
    fromEvent(window, 'resize').subscribe((event) => {
      //这里表示当窗口大小发生变化时所做的事，也就是说可以对多个图表进行大小调整
      this.update();
      //this.draw.drawEquidistantLine(this.canvas, this.value_line);
    })
  }

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked() {
  }
}
