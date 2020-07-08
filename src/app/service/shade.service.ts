import { Injectable } from '@angular/core';
import { Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShadeService {

  constructor() { }

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

  

}
