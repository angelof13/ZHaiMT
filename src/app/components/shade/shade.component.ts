import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ShadeService } from '../../service/shade.service';



@Component({
  selector: 'app-shade',
  templateUrl: './shade.component.html',
  styleUrls: ['./shade.component.scss'],
})
export class ShadeComponent implements OnInit {

  eject_direction: string = "left";
  
  constructor(private render: Renderer2,private shade_service: ShadeService) { }

  

  
  ngOnInit(): void {

    var date = new Date();
    // 计算当前毫秒票数
    var milliseconds = (date.getTime()+28800000)%86400000;

    this.shade_service.makeAnimation(this.render.selectRootElement("#shade"),0.5,"black",milliseconds,"left");
    setTimeout(service=>{

      let canvas = this.render.selectRootElement("#myCanvas");
      let shade_canvas =this.render.selectRootElement("#shade_canvas");
      let width = canvas.parentElement.offsetWidth;
      let height = canvas.parentElement.offsetHeight;
  
      let ctx=canvas.getContext("2d");
      let shade_ctx = shade_canvas.getContext("2d");
  
      shade_canvas.width = width;
      shade_canvas.height =height;
      
      let imageData = ctx.getImageData(0,0,width,height);
      shade_ctx.putImageData(imageData,0,0);
      
      this.shade_service.current_time_shade_canvas(shade_canvas,"left")


    },100)
  }
}
