import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ShadeService } from '../../service/shade.service';

@Component({
  selector: 'app-shade',
  templateUrl: './shade.component.html',
  styleUrls: ['./shade.component.scss']
})
export class ShadeComponent implements OnInit {

  constructor(private render: Renderer2,private shade_service: ShadeService) { }

  ngOnInit(): void {
    setTimeout(service=>{
      let canvas = this.render.selectRootElement("#myCanvas");
      let shade_canvas =this.render.selectRootElement("#shade_canvas");
      let shade = this.render.selectRootElement("#shade");
      let width = canvas.parentElement.offsetWidth;
      let height = canvas.parentElement.offsetHeight;
  
      let ctx=canvas.getContext("2d");
      let shade_ctx = shade_canvas.getContext("2d");
  
      shade_canvas.width = width;
      shade_canvas.height =height;
      
      let imageData = ctx.getImageData(0,0,width,height);
      shade_ctx.putImageData(imageData,0,0);
  
      shade_ctx.font="30px Arial";
      shade_ctx.fillText("Hello World",600,400);
  
      this.shade_service.canvasBlackAndWhiteFilters(shade_canvas,0,0,width/2,height);
    },1000)
   
    
    
  }

}
