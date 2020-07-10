import { Component, OnInit, Renderer2 } from '@angular/core';
import { fromEvent } from 'rxjs';

import { TimelineDataAndFunction } from './timeline-daf';

import { DrawService } from '../../service/draw.service';
//import { TimelineAdaptioneService } from '../../service/timeline-adaptione.service'


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  canvas: HTMLCanvasElement;

  constructor(private draw: DrawService, private tl_daf: TimelineDataAndFunction, private render: Renderer2) { }

  /**
   * @description 改变窗口大小时，更新值的方法
   */
  private update(): void {
    let canvas_area = { area_width: this.canvas.parentElement.offsetWidth, area_height: this.canvas.parentElement.offsetHeight };

    let adp_result = this.tl_daf.timelineSelfAdaption(canvas_area, true);

    if (adp_result) {
      this.canvas.width = canvas_area.area_width;
      this.canvas.height = canvas_area.area_height;

      let draw_map = this.canvas.getContext("2d");
      this.draw.drawEquidistantLine(draw_map, canvas_area.area_width, canvas_area.area_height, [this.tl_daf.get_line_info()]);
    }
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
