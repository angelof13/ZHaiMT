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

  /**
 * @description 画出最多二维数组的线
 * @param {CanvasRenderingContext2D} draw_map 传入可绘制区域信息,即 canvas.getContext('2D')
 * @param {[[{ start: point; end: point; }]]} lines_info 需要绘制的线的信息
 */
  drawText(draw_map: CanvasRenderingContext2D, texts_info: { text: { content: string; draw: point; }[], align_style: string, font_size: number, font_type: string }) {
    switch (texts_info.align_style) {
      case "start": draw_map.textAlign = "start"; break;
      case "end": draw_map.textAlign = "end"; break;
      case "left": draw_map.textAlign = "left"; break;
      case "center": draw_map.textAlign = "center"; break;
      case "right": draw_map.textAlign = "right"; break;
    }
    draw_map.font = texts_info.font_size + "px " + texts_info.font_type;
    for (let i = 0; i < texts_info.text.length; i++) {
      draw_map.beginPath();
      draw_map.fillText(texts_info.text[i].content, texts_info.text[i].draw.x, texts_info.text[i].draw.y);
      draw_map.stroke();
    }
  }

  /**
  * @description 画出带文字的框
  * @param {CanvasRenderingContext2D} draw_map 传入可绘制区域信息,即 canvas.getContext('2D')
  * @param boxes_info 需要绘制的框的信息
  */
  drawBox(draw_map: CanvasRenderingContext2D, timeline_width: number, timeline_height: number, boxes_info: { task: string, start: point, length?: number, end?: point }[]) {
    let box_height: number;
    if (boxes_info.length < 8) {
      box_height = timeline_height >> 3;
    } else {
      box_height = boxes_info.length;
    }

    for (let i = 0; i < boxes_info.length; i++) {
      draw_map.beginPath();
      draw_map.rect(boxes_info[i].start.x, boxes_info[i].start.y, boxes_info[i].length, box_height);
      draw_map.stroke();
      draw_map.fillStyle = "#FF0000";
      draw_map.fillRect(boxes_info[i].start.x, boxes_info[i].start.y, boxes_info[i].length, box_height);
      draw_map.fillStyle = "#000000";
      this.drawText(draw_map, { text: [{ content: boxes_info[i].task, draw: { x: (boxes_info[i].start.x + boxes_info[i].length / 2), y: (boxes_info[i].start.y + box_height / 2 + 15) } }], align_style: "center", font_size: 30, font_type: "Microsoft YaHei" });

    }
  }
}
