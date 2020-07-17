import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ShadeService } from '../../service/shade.service';
import { fromEvent,interval, Subscription, timer } from 'rxjs';



@Component({
  selector: 'app-shade',
  templateUrl: './shade.component.html',
  styleUrls: ['./shade.component.scss'],
})
export class ShadeComponent implements OnInit {

  eject_direction: string = "left";
  
  constructor(private render: Renderer2,private shade_service: ShadeService) { }

  

  
  ngOnInit(): void {

   
    

  }
  ngAfterViewInit(): void {

    let eject_direction = this.get_eject_direction();

    this.shade_init(eject_direction)
    fromEvent(window, 'resize').subscribe((event) => {
      let eject_direction = this.get_eject_direction();
      this.eject_direction = eject_direction;
      this.shade_init(eject_direction);
    })

    
  }

  shade_init(eject_direction: string){
    var date = new Date();
    // 计算当前毫秒票数
    var milliseconds = (date.getTime()+28800000)%86400000;
    let canvas = this.render.selectRootElement("#myCanvas");
    let shade_canvas =this.render.selectRootElement("#shade_canvas");

    // 获取被复制的canvas的长和宽
    let width = canvas.parentElement.offsetWidth;
    let height = canvas.parentElement.offsetHeight;

    let ctx=canvas.getContext("2d");
    let shade_ctx = shade_canvas.getContext("2d");
    // 设置canvas的长和宽
    shade_canvas.width = width;
    shade_canvas.height =height;
    // 复制canvas的内容
    let imageData = ctx.getImageData(0,0,width,height);
    shade_ctx.putImageData(imageData,0,0);
    
    this.shade_service.current_time_shade_canvas(shade_canvas,eject_direction)
  }

  /**
   * @description 判断渲染方向
   */
  get_eject_direction(): string {
    let height: number = document.body.offsetHeight;
    let width: number = document.body.offsetWidth;
    if(height>width){
      return "top"
    }else{
      return "left"
    }
  }
}
