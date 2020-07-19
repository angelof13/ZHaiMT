import { Injectable } from '@angular/core';

export { TimelineDataAndFunction, current_mode, boxes_info }

/**************************************************************************************数据类型接口************************************************************************************************************/
interface point { x: number, y: number; };

enum current_mode { "day", "month", "year" };

/**
 * @param start 设置线条的起点
 * @param end 设置线条的终点
 */
interface line_info { start: point; end: point; };

/**
 * @param text 设置文字内容
 * @param draw 设置文字位置
 * @param align_style 文字对齐方式
 */
interface texts_style { text: { content: string; draw: point; }[], align_style: string, font_size: number, font_type: string };

/**
 * @param task 设置任务内容
 * @param start 设置开始位置
 * @param width 设置任务盒子的宽
 * @param height 设置任务盒子的高
 */
interface boxes_info { task: string, start: point, width: number, height: number };
/**************************************************************************************数据类型接口结束************************************************************************************************************/

@Injectable({
    providedIn: 'root'
})

class TimelineDataAndFunction {
    /**
    * @description 全分辨率分割24份
    */
    private divide: number = 25;
    /**
     * @description 记录宽高比
     */
    private area_info_w_ge_h: boolean;
    /**
    * @description timeline界面背景层的画线的信息
    */
    private lines_info: line_info[] = [];
    /**
    * @description 一天的时间间隔数组
    */
    private time_info_date: texts_style = { text: [], align_style: "center", font_size: 15, font_type: "cascadia code PL" };
    /**
    * @description 画线和边缘的间距
    */
    private space = 0.02;
    /**
    * @description start_time 起始时间,单位为分,范围0~~1440;
    * @description time_interval 时间间隔;
    */
    private start_time = Number(new Date(new Date().toDateString()).getTime()) + 90 * 60 * 1000;
    private time_interval = 0;

    constructor() { }
    /**
     * @param end_number 初始化后数组中成员个数
     */
    private initLineInfo(end_number: number) {
        this.lines_info = [];
        for (let i = 0; i < end_number; i++) {
            this.lines_info.push({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
        }
    }
    /**
     * @param flag 要初始化的哪一个字符数组
     * @param end_number 初始化后数组中成员个数
     */
    private initTextInfo(end_number: number) {
        this.time_info_date.text = [];
        for (let i = 0; i < end_number; i++) {
            this.time_info_date.text.push({ content: "", draw: { x: 0, y: 0 } });
        }
    }
    getLinesInfo(): line_info[] {
        if (this.lines_info.length != 0) {
            return this.lines_info;
        } else {
            return [];
        }
    }
    getTimeTextInfo(): texts_style {
        return this.time_info_date;
    }

    /**
     * @description 自适应修改背景坐标
     * @param timeline_canvas:绘制的canvas画板
     */
    timelineSelfAdaption(timeline_canvas: HTMLCanvasElement, type: current_mode): CanvasRenderingContext2D {
        /**更新绘制区域大小 */
        timeline_canvas.width = timeline_canvas.parentElement.offsetWidth;
        timeline_canvas.height = timeline_canvas.parentElement.offsetHeight;
        /**更新宽高比 */
        this.area_info_w_ge_h = timeline_canvas.width >= timeline_canvas.height;

        /**全部按宽大于高的屏幕计算,根据宽高比进行转换 */
        let adaption_info = { width: (this.area_info_w_ge_h ? timeline_canvas.width : timeline_canvas.height), height: (this.area_info_w_ge_h ? timeline_canvas.height : timeline_canvas.width) };

        let line_num = this.divide;
        let space_w = ((0.5 + adaption_info.width * this.space) | 0);
        let line_interval = ((0.5 + (adaption_info.width - space_w * 2) / (line_num - 1)) | 0);

        this.initLineInfo(0);
        this.initTextInfo(line_num);
        if (type == current_mode.day) {
            this.time_interval = (1440 / (line_num - 1)) * 60 * 1000;
        } else if (type == current_mode.month) {
            this.time_interval = (30 / (line_num - 1)) * 86400 * 1000;
        } else if (type == current_mode.year) {
            this.time_interval = (10 / (line_num - 1)) * 31536000 * 1000;
        }
        if (this.area_info_w_ge_h) {
            this.time_info_date.align_style = "center";
            for (let m_i = 0; m_i < line_num; m_i++) {
                this.lines_info.push({ start: { x: (space_w + m_i * line_interval), y: 40 }, end: { x: (space_w + m_i * line_interval), y: (adaption_info.height - 40) } });
                this.setTimeText(m_i, { x: this.lines_info[m_i].start.x, y: this.lines_info[m_i].start.y - 5 }, type);
            }
        } else {
            this.time_info_date.align_style = "right";
            for (let m_i = 0; m_i < line_num; m_i++) {
                this.lines_info.push({ start: { x: 60, y: (space_w + m_i * line_interval) }, end: { x: (adaption_info.height - 60), y: (space_w + m_i * line_interval) } });
                this.setTimeText(m_i, { x: this.lines_info[m_i].start.x - 3, y: this.lines_info[m_i].start.y + this.time_info_date.font_size / 4 }, type);
            }
        }
        return timeline_canvas.getContext('2d');
    }

    /**
    * @description 得到时间表数组
    * @param start_time 开始的时间,单位:分
    */
    setTimeText(flag: number, draw_poing: point, type: current_mode) {
        if (type == current_mode.day) {
            let temp = new Date(this.start_time + flag * this.time_interval);
            let temp_h = temp.getHours(), temp_m = temp.getMinutes();
            this.time_info_date.text[flag].content = ((temp_h <= 9 ? "0" : "") + temp_h) + ":" + ((temp_m <= 9 ? "0" : "") + temp_m);
            this.time_info_date.text[flag].draw = draw_poing;
        } else if (type == current_mode.month) {
            /**
             * @TODO 设置月份信息
             */
        }
        return;
    }

    /**
    * @description 获取并修改任务图案
    * @param task_canvas:绘制canvas画板
    */
    taskSelfAdaption(task_canvas: HTMLCanvasElement, type: current_mode): CanvasRenderingContext2D {
        /**更新绘制区域大小 */
        task_canvas.style.left = this.lines_info[0].start.x + "px";
        task_canvas.style.top = this.lines_info[0].start.y + "px";
        task_canvas.width = this.lines_info[this.lines_info.length - 1].start.x - this.lines_info[0].start.x;
        task_canvas.height = this.lines_info[0].end.y - this.lines_info[0].start.y;

        if (type == current_mode.day) {

        } else if (type == current_mode.month) {

        } else if (type == current_mode.year) {

        }
        return task_canvas.getContext("2d");
    }
}

