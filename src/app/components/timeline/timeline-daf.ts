import { Directive, Injectable } from '@angular/core';
import { DataTransmissionService } from "../../service/data-transmission.service";
import { ShadeService } from '../../service/shade.service';

export { TimelineDataAndFunction, current_mode, boxes_info, task_info }

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
 * @param task_map 和task_info的映射
 */
interface boxes_info { task: string, start: point, width: number, height: number, task_map: number };

interface task_info { id?: number, task: string, start_time: number, end_time: number, cycle: number, is_end: boolean }
/**************************************************************************************数据类型接口结束************************************************************************************************************/

@Directive({
    selector: 'app-timeline'
})
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
    private time_info_date: texts_style = { text: [], align_style: "center", font_size: 15, font_type: "CascadiaCodePL" };
    /**
    * @description 画线和边缘的间距
    */
    private space = 0.02;

    /**
     * @description 常用时间计数,单位ms,减少计算
     */
    private t_min = 60000;
    private t_hour = 3600000;
    private t_day = 86400000;
    private t_month = [2419200000, 2505600000, 2592000000, 2678400000];
    private t_year = [31536000000, 31622400000];

    /**
    * @description start_time 起始时间,单位为ms,按min计算范围为0~~1440;
    * @description end_time 图标的结束时间
    * @description time_interval 时间间隔;
    */
    private start_time = Number(new Date(new Date().toDateString()).getTime()) + 90 * this.t_min;
    private end_time = this.start_time + this.t_day;
    private time_interval = 0;

    /**
     * @description 保存所有任务
     */
    private task_all: task_info[] = [];

    /**
     * @description 保存所有要绘制的任务
     */
    private task_boxes: boxes_info[] = [];

    constructor(private op_db: DataTransmissionService, private shade: ShadeService) { }

    /**
     * @description 初始化,获取数据
     */
    init(flag: any) {
        this.op_db.init("task_table", this.task_all, flag);
    }

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
     * @param end_number 初始化后数组中成员个数
     */
    private initTextInfo(end_number: number) {
        this.time_info_date.text = [];
        for (let i = 0; i < end_number; i++) {
            this.time_info_date.text.push({ content: "", draw: { x: 0, y: 0 } });
        }
    }

    /**
     * @description 获取背景画线信息
     */
    getLinesInfo(): line_info[] {
        return this.lines_info;
    }
    /**
     * @description 获取背景画线对应的时间信息
     */
    getTimeTextInfo(): texts_style {
        return this.time_info_date;
    }
    /**
     * @description 获取绘制任务的方盒信息
     */
    getViewTaskBox(): boxes_info[] {
        return this.task_boxes;
    }

    /**
    * @description 得到时间表数组
    * @param flag 距离开始的第几个时间点
    * @param draw_poing 绘制的点
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
     * @description 判读鼠标右键是否在task上
     * @param cursor_point 光标右键的位置
     * @returns -1:未在task上,其他:所在的task_box映射的task_all中的数值
     */
    inBoxesInfo(cursor_point: { x: number, y: number }): number {
        for (let i = 0; i < this.task_boxes.length; i++) {
            if ((this.task_boxes[i].start.x + this.lines_info[0].start.x <= cursor_point.x) && (cursor_point.x <= this.task_boxes[i].start.x + this.task_boxes[i].width + this.lines_info[0].start.x) &&
                (this.task_boxes[i].start.y + this.lines_info[0].start.y <= cursor_point.y) && (cursor_point.y <= this.task_boxes[i].start.y + this.task_boxes[i].height + this.lines_info[0].start.y)) {
                return this.task_boxes[i].task_map;
            }
        }
        return -1;
    }

    /**
     * @description 获取相应脚标的任务信息
     */
    getTask(operator: number): task_info {
        return this.task_all[operator];
    }
    /**
     * @description 添加任务
     */
    addTask(task: task_info) {
        this.op_db.setValue(task);
        this.task_all.push(task);
    }
    /**
     * @description 更新相应脚标的任务信息
     */
    updateTask(operator: number) {
        this.op_db.updateValue(this.task_all[operator]);
    }
    /**
     * @description 更新相应脚标的任务信息
     */
    deleteTask(operator: number) {
        this.op_db.removeValue(this.task_all[operator].id);
        if (operator > -1) {
            this.task_all.splice(operator, 1);
        }
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
            this.time_interval = this.t_day / (line_num - 1);
        } else if (type == current_mode.month) {
            this.time_interval = this.t_month[2] / (line_num - 1);
        } else if (type == current_mode.year) {
            this.time_interval = this.t_year[0] / (line_num - 1);
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
    * @description 获取并修改任务图案
    * @param task_canvas:绘制canvas画板
    */
    taskSelfAdaption(task_canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        /**更新绘制区域大小 */
        task_canvas.style.left = this.lines_info[0].start.x + "px";
        task_canvas.style.top = this.lines_info[0].start.y + "px";
        task_canvas.width = this.area_info_w_ge_h ? (this.lines_info[this.lines_info.length - 1].start.x - this.lines_info[0].start.x) : (this.lines_info[0].end.x - this.lines_info[0].start.x);
        task_canvas.height = this.area_info_w_ge_h ? (this.lines_info[0].end.y - this.lines_info[0].start.y) : (this.lines_info[this.lines_info.length - 1].start.y - this.lines_info[0].start.y);
        let temp_line_length = this.area_info_w_ge_h ? task_canvas.width : task_canvas.height;
        this.task_boxes = [];
        if (this.task_all.length != 0) {
            for (let task_num = 0; task_num < this.task_all.length; task_num++) {
                let temp: boxes_info = { task: "", width: 0, height: 0, start: { x: 0, y: 0 }, task_map: task_num };
                if (this.task_all[task_num].cycle == 1) {
                    let now_day = new Date(new Date().toDateString()).getTime();
                    let start_time: number = 0, end_time: number = 0;
                    if ((this.task_all[task_num].end_time - this.task_all[task_num].start_time) < this.t_day) {
                        start_time = now_day + new Date(this.task_all[task_num].start_time).getHours() * this.t_hour + new Date(this.task_all[task_num].start_time).getMinutes() * this.t_min + new Date(this.task_all[task_num].start_time).getSeconds() * 1000;
                        end_time = now_day + new Date(this.task_all[task_num].end_time).getHours() * this.t_hour + new Date(this.task_all[task_num].end_time).getMinutes() * this.t_min + new Date(this.task_all[task_num].end_time).getSeconds() * 1000;
                    } else {
                        start_time = this.start_time;
                        end_time = this.end_time;
                    }
                    this.task_all[task_num].start_time = start_time;
                    this.task_all[task_num].end_time = end_time;
                }
                if ((this.task_all[task_num].start_time <= this.start_time) && (this.task_all[task_num].end_time > this.start_time && this.task_all[task_num].end_time <= this.end_time)) {
                    temp.task = this.task_all[task_num].task;
                    temp.start = { x: 0, y: 0 };
                    temp.width = (this.task_all[task_num].end_time - this.start_time) * temp_line_length / this.t_day;
                } else if ((this.start_time <= this.task_all[task_num].start_time && this.task_all[task_num].start_time <= this.end_time) && (this.start_time < this.task_all[task_num].end_time && this.task_all[task_num].end_time <= this.end_time)) {
                    temp.task = this.task_all[task_num].task;
                    temp.start = { x: (this.task_all[task_num].start_time - this.start_time) * temp_line_length / this.t_day, y: 0 };
                    temp.width = (this.task_all[task_num].end_time - this.task_all[task_num].start_time) * temp_line_length / this.t_day;
                } else if ((this.start_time <= this.task_all[task_num].start_time && this.task_all[task_num].start_time <= this.end_time) && (this.end_time < this.task_all[task_num].end_time)) {
                    temp.task = this.task_all[task_num].task;
                    temp.start = { x: (this.task_all[task_num].start_time - this.start_time) * temp_line_length / this.t_day, y: 0 };
                    temp.width = (this.end_time - this.task_all[task_num].start_time) * temp_line_length / this.t_day;
                } else if (this.task_all[task_num].start_time < this.start_time && this.end_time < this.task_all[task_num].end_time) {
                    temp.task = this.task_all[task_num].task;
                    temp.start = { x: 0, y: 0 };
                    temp.width = temp_line_length;
                }
                else {
                    continue;
                }
                if (this.area_info_w_ge_h == false) {
                    temp.start.y = temp.start.x;
                    temp.start.x = 0;
                    temp.height = temp.width;
                    temp.width = 0;
                }
                this.task_boxes.push(temp);
            }
            let temp_n = this.task_boxes.length < 10 ? 10 : this.task_boxes.length;
            let temp_length = (this.area_info_w_ge_h == false ? task_canvas.width / temp_n : task_canvas.height / temp_n) | 0;
            for (let task_view = 0; task_view < this.task_boxes.length; task_view++) {
                if (this.area_info_w_ge_h == false) {
                    this.task_boxes[task_view].start.x = temp_length * task_view;
                    this.task_boxes[task_view].width = temp_length;
                } else {
                    this.task_boxes[task_view].start.y = temp_length * task_view;
                    this.task_boxes[task_view].height = temp_length;
                }
            }
        }
        this.shade.current_time_shade_canvas(task_canvas, this.area_info_w_ge_h ? "left" : "top", this.start_time, this.end_time);

        return task_canvas.getContext("2d");
    }
}

