import { Component, OnInit } from '@angular/core';
import {DrawService } from '../../service/draw.service';
import {line_info} from '../../service/draw.service';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  
  canvas:HTMLCanvasElement;
  value_line:line_info;

  constructor(private draw:DrawService) { }

  ngOnInit(): void {
    this.value_line={line_num:1,length:1,HorV:1};
    //this.draw.draw_line(<HTMLCanvasElement>this.canvas,this.value_line);
  }

  ngAfterViewInit(): void {
    let that=this;
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
    that.draw.draw_line(that.canvas,this.value_line);
    
    window.onresize = function () {
      //这里表示当窗口大小发生变化时所做的事，也就是说可以对多个图表进行大小调整
      that.draw.draw_line(that.canvas,this.value_line);
    }
  }
}
