import { Injectable } from '@angular/core';
export { DrawService }

/**************************************************************************************数据类型接口************************************************************************************************************/
interface point { x: number, y: number; };
/**************************************************************************************数据类型接口结束************************************************************************************************************/

@Injectable({
  providedIn: 'root'
})

class DrawService {
  constructor() { }

  /**
   * @description 画出最多二维数组的线
   * @param {CanvasRenderingContext2D} draw_map 传入可绘制区域信息,即 canvas.getContext('2D')
   * @param {[[{ start: point; end: point; }]]} lines_info 需要绘制的线的信息
   */
  drawLine(draw_map: CanvasRenderingContext2D, lines_info: { start: point; end: point; }[][]) {
    for (let i = 0; i < lines_info.length; i++) {
      for (let j = 0; j < lines_info[i].length; j++) {
        draw_map.beginPath();
        draw_map.moveTo(lines_info[i][j].start.x, lines_info[i][j].start.y);
        draw_map.lineTo(lines_info[i][j].end.x, lines_info[i][j].end.y);
        draw_map.stroke();
      }
    }
  }

}
