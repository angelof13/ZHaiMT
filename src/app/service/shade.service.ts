import { Injectable } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { animate,keyframes,style, trigger,state, transition ,AnimationBuilder} from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class ShadeService {

  constructor(private shade_builder :AnimationBuilder) { }

  /**
   * 
   * @param x 表示黑白滤镜的右上角的横坐标
   * @param y 表示黑白滤镜的右上角的纵坐标
   * @param width 表示黑白滤镜的长
   * @param height 表示黑白滤镜的高
   * @param canvas 表示要添加黑白滤镜的画布
   * 
   * @description 该方法用来给canvas元素的指定区域添加黑白滤镜效果
   */
  canvasBlackAndWhiteFilters(canvas : HTMLCanvasElement,x: number,y: number ,width: number,height: number) : void {

    var ctx=canvas.getContext("2d");
    // 获取当前需要加滤镜的画布区域
    var imageData=ctx.getImageData(x,y,width,height);

    // 循环遍历像素点并将相应的rgba的值设为这四种rgba平均值
    for(var i=0; i<imageData.data.length-4; i=i+4){
      let average=(imageData.data[i]+imageData.data[i+1]+imageData.data[i+2])/3;
      imageData.data[i]=average;
      imageData.data[i+1]=average;
      imageData.data[i+2]=average;
      imageData.data[i+3]=imageData.data[i+3];
    }

    // 将改变完的画布放回原处
    ctx.putImageData(imageData,x,y)

  }

    /**
   * @param opacity 遮罩的透明度
   * @param color   遮罩的颜色
   * @param element 动画绑定的元素
   * @param current_millisecend  当前的毫秒数
   * @param eject_direction 遮罩弹出方向
   * @description 设置遮罩动画的效果
   */
  makeAnimation(element: any,opacity:number,color: string,current_millisecend: number,eject_direction: string) {

    // 弹出的百分比
    let percentage = (current_millisecend/86400000+0.002)*100


    // 触发关键帧的位置
    let offset = 2000/(86400000-current_millisecend+2000)

  
    const myAnimation =eject_direction=="left"? this.shade_builder.build([

      animate(86400000-current_millisecend+2000+"ms" , keyframes([
        style({ background: color,height: "100%",position:"absolute",bottom:0,width:"0.2%",opacity: opacity, offset: 0 }),
        style({ background: color,height: "100%",position:"absolute",bottom:0,width:percentage+"%",opacity: opacity, offset: offset }),
        style({ background: color,height: "100%",position:"absolute",bottom:0,width:"99.6%",opacity: opacity, offset: 1 }),
      ]))
    ])
    : eject_direction=="top"? this.shade_builder.build([

      animate(86400000-current_millisecend+2000+"ms" , keyframes([
        style({ background: color,width: "100%",position:"absolute",top:0,height:"0.2%",opacity: opacity, offset: 0 }),
        style({ background: color,width: "100%",position:"absolute",top:0,height:percentage+"%",opacity: opacity, offset: offset }),
        style({ background: color,width: "100%",position:"absolute",top:0,height:"99.6%",opacity: opacity, offset: 1 }),
      ]))
    ])
    : eject_direction=="right"? this.shade_builder.build([

      animate(86400000-current_millisecend+2000+"ms" , keyframes([
        style({ background: color,height:"100%",position:"absolute",bottom:0,margin:"0px 0px 0px 99.8%",width:"0.2%",opacity: opacity, offset: 0 }),
        style({ background: color,height:"100%",position:"absolute",bottom:0,margin:"0px 0px 0px "+(100-percentage)+"%",width:percentage+"%",opacity: opacity, offset: offset }),
        style({ background: color,height:"100%",position:"absolute",bottom:0,margin:"0px 0px 0px 0.4%",width:"99.6%",opacity: opacity, offset: 1 }),
      ]))
    ])
    :eject_direction == "bottom"? this.shade_builder.build([

      animate(86400000-current_millisecend+2000+"ms" , keyframes([
        style({ background: color,position:"absolute",bottom:0,width:"100%",opacity: opacity, offset: 0 }),
        style({ background: color,position:"absolute",bottom:0,width:"100%",height:percentage+"%",opacity: opacity, offset: offset }),
        style({ background: color,position:"absolute",bottom:0,width:"100%",height:"99.6%",opacity: opacity, offset: 1 }),
      ]))
    ])
    : this.shade_builder.build([
      style({ width: 0,background: "black" }),
      animate(86400000-current_millisecend+2000+"ms")
    ])
    ;

    const player = myAnimation.create(element);
    
    player.play();
  }


  /**
   * 
   * @param canvas 画布的dom元素
   * @param eject_direction 弹出方向值 top left right bottom
   * @description 根据当前时间增加百分比黑白滤镜
   */
  current_time_shade_canvas(canvas : HTMLCanvasElement, eject_direction: string){

    let width = canvas.parentElement.offsetWidth;
    let height = canvas.parentElement.offsetHeight;
    var date = new Date();
    var milliseconds = (date.getTime()+28800000)%86400000;
    let percentage = milliseconds/86400000+0.002
    switch (eject_direction) {
      case "top":
        this.canvasBlackAndWhiteFilters(canvas,0,0,width,height*percentage);
        break;
      case "bottom":

        this.canvasBlackAndWhiteFilters(canvas,0,height*(1-percentage),width,height*percentage);
        break;
      case "right":

        this.canvasBlackAndWhiteFilters(canvas,width*(1-percentage),0,width*percentage,height);
        break;
      case "left":

        this.canvasBlackAndWhiteFilters(canvas,0,0,width*percentage,height);
        break;
    
      default:
        break;
    }

  }

  current_time_part_shade_canvas(canvas : HTMLCanvasElement, eject_direction: string){

    let width = canvas.parentElement.offsetWidth;
    let height = canvas.parentElement.offsetHeight;
    var date = new Date();
    var milliseconds = (date.getTime()+28800000)%86400000;
    let percentage = milliseconds/86400000+0.002
    switch (eject_direction) {
      case "top":
        this.canvasBlackAndWhiteFilters(canvas,0,0,width,height*percentage);
        break;
      case "bottom":

        this.canvasBlackAndWhiteFilters(canvas,0,height*(1-percentage),width,height*percentage);
        break;
      case "right":

        this.canvasBlackAndWhiteFilters(canvas,width*(1-percentage),0,width*percentage,height);
        break;
      case "left":

        this.canvasBlackAndWhiteFilters(canvas,0,width*percentage-1,2,height);
        break;
    
      default:
        break;
    }

  }

}
