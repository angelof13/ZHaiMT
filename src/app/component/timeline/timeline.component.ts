import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  
  value_window={H:document.body.clientHeight,W:document.body.clientWidth};
  constructor() {}

  ngOnInit(): void {
    let that=this;
    window.onresize = function () {
      //这里表示当窗口大小发生变化时所做的事，也就是说可以对多个图表进行大小调整
      that.value_window.H=document.body.clientHeight;
      that.value_window.W=document.body.clientWidth;
    }
  }

}
