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

  rightMenu: HTMLElement;
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
  private reRight() {
    this.rightMenu = document.getElementById("rightMenu");
    let rec = 0;
    let _this = this;
    //自定义右键菜单
    this.timeline_canvas.oncontextmenu = function (event) {
      //let event = event || window.event;
      _this.rightMenu.style.display = "block";
      _this.rightMenu.style.top = event.clientY + "px";
      _this.rightMenu.style.left = event.clientX + "px";
      setWidth(_this.rightMenu.getElementsByTagName("ul")[0]);
      return false;
    };
    //点击隐藏菜单
    this.timeline_canvas.onclick = function () {
      _this.rightMenu.style.display = "none"
    };
    //取li中最大的宽度, 并赋给同级所有li
    function setWidth(obj) {
      let maxWidth = 0;
      for (rec = 0; rec < obj.children.length; rec++) {
        let oLi = obj.children[rec];
        let iWidth = oLi.clientWidth - parseInt(oLi.currentStyle ? oLi.currentStyle["paddingLeft"] : getComputedStyle(oLi, null)["paddingLeft"]) * 2
        if (iWidth > maxWidth) maxWidth = iWidth;
      }
      for (rec = 0; rec < obj.children.length; rec++) obj.children[rec].style.width = maxWidth + "px";
    }
  }
  ngOnInit(): void {
    this.tl_daf.init();
    this.timeline_canvas = this.render.selectRootElement("#timeline_canvas");
    this.task_canvas = this.render.selectRootElement("#task_canvas");
    this.update();
    this.reRight();
    fromEvent(window, 'resize').subscribe((event) => {
      //这里表示当窗口大小发生变化时所做的事，也就是说可以对多个图表进行大小调整
      this.update();
    })
  }
  addTask(e) {
    console.log(e);

    this.rightMenu.style.display = "none";
  }
  ngAfterViewInit(): void {
  }

  ngAfterViewChecked() {
  }
}
