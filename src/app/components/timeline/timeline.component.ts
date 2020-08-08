import { Component, OnInit, Renderer2 } from '@angular/core';
import { fromEvent } from 'rxjs';

import { TimelineDataAndFunction, current_mode, task_info } from './timeline-daf';

import { DrawService } from '../../service/draw.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [DatePipe]
})
export class TimelineComponent implements OnInit {

  timeline_canvas: HTMLCanvasElement;
  timeline_drawmap: CanvasRenderingContext2D;
  task_canvas: HTMLCanvasElement;
  task_drawmap: CanvasRenderingContext2D;
  temp_task_info: task_info;
  temp_task_starttime: string;
  temp_task_endtime: string;

  constructor(private draw: DrawService, private tl_daf: TimelineDataAndFunction, private render: Renderer2, private datepipe: DatePipe) { }

  addTask(e) {
    let temp = new Date();
    this.temp_task_starttime = this.datepipe.transform(temp, "yyyy-MM-ddTHH:mm:ss");
    this.temp_task_endtime = this.temp_task_starttime;
    document.getElementById("task").style.display = "block";
    document.getElementById("main_right").style.display = "none";
    this.tl_daf.addTask(e);
  }
  changeTask(e) {
    this.tl_daf.addTask(e);
  }
  deleteTask(e) {
    this.tl_daf.addTask(e);
  }
  timelineSet(e) {

    console.log((<HTMLInputElement>this.render.selectRootElement("#task_start_time")).value);
    console.log(this.temp_task_starttime);
    this.tl_daf.addTask(e);
  }

  /**
   * @description 改变窗口大小时，更新值的方法
   */
  private update(): void {
    /**更新time_line Canvas画布,重新绘制背景 */
    this.timeline_drawmap = this.tl_daf.timelineSelfAdaption(this.timeline_canvas, current_mode.day);

    this.draw.drawLine(this.timeline_drawmap, [this.tl_daf.getLinesInfo()]);
    this.draw.drawText(this.timeline_drawmap, this.tl_daf.getTimeTextInfo());

    this.task_drawmap = this.tl_daf.taskSelfAdaption(this.task_canvas, current_mode.day);
    this.draw.drawBox(this.task_drawmap, this.tl_daf.getViewTaskBox());
  }

  private init() {
    this.temp_task_info = { task: "", start_time: 0, end_time: 0, daily_repeat: false, is_end: false };
    console.log();
    this.timeline_canvas = this.render.selectRootElement("#timeline_canvas");
    this.task_canvas = this.render.selectRootElement("#task_canvas");

    this.tl_daf.reRight(this.timeline_canvas, "main_right");
    this.tl_daf.reRight(this.task_canvas, "main_right");
    document.getElementById("task").onclick = function (event) {
      console.log(event);
      document.getElementById("task").style.display = "none";
    }

  }
  ngOnInit(): void {
    this.init();
    this.tl_daf.init();
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
