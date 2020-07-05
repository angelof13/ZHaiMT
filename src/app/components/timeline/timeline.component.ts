import { Component, OnInit, Renderer2 } from '@angular/core';
import { fromEvent } from 'rxjs';

import * as datatype from './timeline_datatype';

import { canvas_info, horizontal_vertical as HV, line_info, horizontal_vertical } from '../../service/draw.service';
import { DrawService } from '../../service/draw.service';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  value_line: line_info[] = [{ start_point: { x: 0, y: 0 }, line_num: 3, length: 0, HorV: horizontal_vertical.v }];
  canvas: canvas_info = { canvas_height: 0, canvas_width: 0 };
  window_is_resize: boolean;
  old_adaption_info = { height: -500, width: -500, w_ge_h: false };

  constructor(private draw: DrawService, private render: Renderer2) { }

  /**
   * @todo self_adaption~~>timeline_self_adaption(adaption_info:{height:number,width:number,w_ge_h:boolean}),并抽成一个单独服务timeline_adaption.service)
   */
  private self_adaption(): void {
    if (this.canvas.canvas_event) {
      let adaption_info = {
        height: this.canvas.canvas_event.parentElement.offsetHeight, width: this.canvas.canvas_event.parentElement.offsetWidth,
        w_ge_h: this.canvas.canvas_event.parentElement.offsetWidth >= this.canvas.canvas_event.parentElement.offsetHeight
      };
      console.log(adaption_info.height, adaption_info.w_ge_h);
      if ((Math.abs(adaption_info.height - this.old_adaption_info.height) >= 500) || (Math.abs(adaption_info.width - this.old_adaption_info.width) >= 500) || (adaption_info.w_ge_h != this.old_adaption_info.w_ge_h)) {
        //所有线的长度都为0.95
        this.value_line[0].length = 0.95;
        /**
        * 根据窗口大小自适应画线规则
        */
        if ((adaption_info.width <= 1366 && adaption_info.height <= 768) || (adaption_info.height <= 1366 && adaption_info.width <= 768)) {
          this.value_line[0].line_num = 6;
          adaption_info.width = 1366;
          adaption_info.height = 768;
        } else if ((adaption_info.width <= 1960 && adaption_info.height <= 1080) || (adaption_info.height <= 1960 && adaption_info.width <= 1080)) {
          this.value_line[0].line_num = 12;
          adaption_info.width = 1960;
          adaption_info.height = 1080;
        } else if ((adaption_info.width <= 2560 && adaption_info.height <= 1440) || (adaption_info.height <= 2560 && adaption_info.width <= 1440)) {
          this.value_line[0].line_num = 12;
          adaption_info.width = 2560;
          adaption_info.height = 1440;
        } else if ((adaption_info.width <= 3840 && adaption_info.height <= 1080) || (adaption_info.height <= 3840 && adaption_info.width <= 1080)) {
          this.value_line[0].line_num = 24;
          adaption_info.width = 3840;
          adaption_info.height = 1080;
        } else if ((adaption_info.width <= 4096 && adaption_info.height <= 3112) || (adaption_info.height <= 4096 && adaption_info.width <= 3112)) {
          this.value_line[0].line_num = 18;
          adaption_info.width = 4096;
          adaption_info.height = 3112;
        } else if ((adaption_info.width <= 7680 && adaption_info.height <= 4320) || (adaption_info.height <= 7680 && adaption_info.width <= 4320)) {
          this.value_line[0].line_num = 24;
          adaption_info.width = 7680;
          adaption_info.height = 4320;
        }
        if (((2560 <= adaption_info.width && adaption_info.width <= 3840) && adaption_info.height <= 1080)) { }


        if (adaption_info.w_ge_h) {
          this.value_line[0].HorV = horizontal_vertical.v;
          this.value_line[0].start_point.x = adaption_info.width * 0.02;
          this.value_line[0].start_point.y = 40;

        } else {
          this.value_line[0].HorV = horizontal_vertical.h;
          this.value_line[0].start_point.x = 30;
          this.value_line[0].start_point.y = adaption_info.height * 0.01;
        }

        this.update(adaption_info.height, adaption_info.width);
        this.old_adaption_info = adaption_info;
      }
    }
  }

  /**
   * @description 改变窗口大小时，更新值的方法
   */
  private update(height: number, width: number): void {
    this.canvas.canvas_height = height;
    this.canvas.canvas_width = width;
    this.draw.drawEquidistantLine(this.canvas, this.value_line);
  }

  ngOnInit(): void {
    this.canvas.canvas_event = this.render.selectRootElement("#timeline_canvas");
    this.self_adaption();

    fromEvent(window, 'resize').subscribe((event) => {
      //这里表示当窗口大小发生变化时所做的事，也就是说可以对多个图表进行大小调整
      this.self_adaption();
      //this.draw.drawEquidistantLine(this.canvas, this.value_line);
    })
  }

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked() {
  }
}
