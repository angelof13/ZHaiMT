import { Injectable } from '@angular/core';
export { DrawService }

/**************************************************************************************数据类型接口************************************************************************************************************/
interface point { x: number, y: number; };

interface drawstyle { box_color: string[], font_size: number };
/**************************************************************************************数据类型接口结束************************************************************************************************************/

@Injectable({
    providedIn: 'root'
})

class DrawService {
    /**
     * 绘画设置项,以后可单独设置
     */
    draw_style: drawstyle = { box_color: ["rgba(100,30,100,0.8)", "rgba(102,253,204,0.7)", "rgba(204,153,153,0.8)", "rgba(255,153,0,0.8)", "rgba(100,30,30,0.8)", "rgba(204,255,153,0.8)"], font_size: 24 };
    constructor() { }

    /**
     * @description 画出最多二维数组的线
     * @param {CanvasRenderingContext2D} draw_map 传入可绘制区域信息,即 canvas.getContext('2D')
     * @param {[[{ start: point; end: point; }]]} lines_info 需要绘制的线的信息
     */
    drawLine(draw_map: CanvasRenderingContext2D, lines_info: { start: point; end: point; }[][]) {
        draw_map.strokeStyle = "#333";
        for (let i = 0; i < lines_info.length; i++) {
            draw_map.beginPath();
            for (let j = 0; j < lines_info[i].length; j++) {
                draw_map.moveTo(lines_info[i][j].start.x, lines_info[i][j].start.y);
                draw_map.lineTo(lines_info[i][j].end.x, lines_info[i][j].end.y);
            }
            draw_map.stroke();
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
        draw_map.beginPath();
        for (let i = 0; i < texts_info.text.length; i++) {
            draw_map.fillText(texts_info.text[i].content, texts_info.text[i].draw.x, texts_info.text[i].draw.y);
        }
        draw_map.stroke();
    }

    /**
    * @description 画出带文字的框
    * @param {CanvasRenderingContext2D} draw_map 传入可绘制区域信息,即 canvas.getContext('2D')
    * @param boxes_info 需要绘制的框的信息
    */
    drawBox(draw_map: CanvasRenderingContext2D, boxes_info: { task: string, start: point, width: number, height: number }[]) {
        draw_map.lineWidth = 1;
        for (let i = 0; i < boxes_info.length; i++) {
            draw_map.beginPath();
            draw_map.rect(boxes_info[i].start.x, boxes_info[i].start.y, boxes_info[i].width, boxes_info[i].height);
            draw_map.stroke();
            draw_map.fillStyle = this.draw_style.box_color[i % this.draw_style.box_color.length];
            draw_map.fillRect(boxes_info[i].start.x, boxes_info[i].start.y + 1, boxes_info[i].width, boxes_info[i].height - 1);
            draw_map.fillStyle = "rgba(255,255,255,0.8)";
            let temp_text = "";
            let text_num = Math.floor(boxes_info[i].width / this.draw_style.font_size) - 2;
            if (text_num < boxes_info[i].task.length) {
                for (let tx_i = 0; tx_i < text_num; tx_i++) {
                    temp_text += boxes_info[i].task[tx_i];
                }
                temp_text += "...";
            } else {
                temp_text = boxes_info[i].task;
            }
            this.drawText(draw_map, { text: [{ content: temp_text, draw: { x: (boxes_info[i].start.x + boxes_info[i].width / 2), y: (boxes_info[i].start.y + boxes_info[i].height / 2 + this.draw_style.font_size / 2) } }], align_style: "center", font_size: this.draw_style.font_size, font_type: "KaiTi" });
        }
    }
}
