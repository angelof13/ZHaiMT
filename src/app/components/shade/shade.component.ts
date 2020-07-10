import { Component, OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { ShadeService } from '../../service/shade.service';
import { animate,keyframes,style, trigger,state, transition ,AnimationBuilder} from '@angular/animations';
import { Time } from '@angular/common';
import { stringify } from 'querystring';


@Component({
  selector: 'app-shade',
  templateUrl: './shade.component.html',
  styleUrls: ['./shade.component.scss'],
  // animations: [
  //   trigger("myAnimationTrigger",[
  //     state("on",style({background : "black" , opacity:opa,width:"50%"})),
  //     transition("off<=>on",animate("5s", keyframes([
  //       style({ background: "red",width:"0%",opacity: opa, offset: 0 }),
  //       style({ background: "blue",width:"50%",opacity: opa, offset: 0.2 }),
  //       style({ background: "orange",width:"100%",opacity: opa, offset: 0.6 }),
  //       style({ background: "black",width:"50%",opacity: opa, offset: 1 })
  //     ])))
      
      
  //   ]),

  // ],
})
export class ShadeComponent implements OnInit {

  myStatusExp = "off";

  time : Time = {
    hours: 12,
    minutes: 5
  };

  

  constructor(private render: Renderer2,private shade_service: ShadeService,private shade_builder :AnimationBuilder) { }

  /**
   * @param opacity 遮罩的透明度
   * @param color   遮罩的颜色
   * @param element 动画绑定的元素
   * @param current_millisecend  当前的毫秒数
   * @description 设置遮罩动画的效果
   */
  makeAnimation(element: any,opacity:number,color: string,current_millisecend: number) {

    let width = (current_millisecend/86400000+0.002)*100

    // 触发关键帧的位置
    let offset = 2000/(86400000-current_millisecend+2000)

  
    const myAnimation = this.shade_builder.build([
      style({ width: 0,background: "black" }),
      animate(86400000-current_millisecend+2000, keyframes([
        style({ background: color,width:"0.2%",opacity: opacity, offset: 0 }),
        style({ background: color,width:width+"%",opacity: opacity, offset: offset }),
        style({ background: color,width:"99.6%",opacity: opacity, offset: 1 }),
      ]))
    ]);

    const player = myAnimation.create(element);
    
    player.play();
  }

  
  ngOnInit(): void {

    var date = new Date();
    // 计算当前毫秒票数
    var milliseconds = (date.getTime()+28800000)%86400000;

    this.makeAnimation(this.render.selectRootElement("#shade"),0.5,"black",milliseconds);
    // alert(this.myStatusExp)
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
  
      shade_ctx.font="30px Arial";
      shade_ctx.fillText("Hello World",600,400);
      
      let width1 = milliseconds/86400000+0.002
      this.shade_service.canvasBlackAndWhiteFilters(shade_canvas,0,0,width*width1,height);


    },100)
   
    
    
  }

}
