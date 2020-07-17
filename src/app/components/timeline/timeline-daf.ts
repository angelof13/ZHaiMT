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
 */
interface text_style { content: string; draw: point; };
interface texts_style { text: text_style[], align_style: string, font_size: number, font_type: string };

interface boxes_info { task: string, start: point, length?: number, end?: point };
/**************************************************************************************数据类型接口结束************************************************************************************************************/

@Injectable({
    providedIn: 'root'
})

class TimelineDataAndFunction {
    /**
    * @description 常见比例及对应分割方法抽成数组,便于维护
    */
    private resolution_ratio_and_divide: { w: number, h: number, n: number }[] = [/* 注释用来对齐数据*/
        { w: 1280 /**/, h: 960  /**/, n: 5  /**/ },
        { w: 1792 /**/, h: 868  /**/, n: 7  /**/ },
        { w: 1920 /**/, h: 1200 /**/, n: 13 /**/ },
        { w: 1920 /**/, h: 1400 /**/, n: 9  /**/ },
        { w: 2048 /**/, h: 1152 /**/, n: 13 /**/ },
        { w: 2048 /**/, h: 1536 /**/, n: 9  /**/ },
        { w: 2560 /**/, h: 1080 /**/, n: 17 /**/ },
        { w: 2560 /**/, h: 1600 /**/, n: 13 /**/ },
        { w: 2800 /**/, h: 2100 /**/, n: 9  /**/ },//一下显示分辨率纯靠猜测,无实机测试
        { w: 3440 /**/, h: 1440 /**/, n: 17 /**/ },
        { w: 3840 /**/, h: 1080 /**/, n: 25 /**/ },
        { w: 3840 /**/, h: 2400 /**/, n: 19 /**/ },
        { w: 4096 /**/, h: 3072 /**/, n: 17 /**/ },
        { w: 6400 /**/, h: 4096 /**/, n: 25 /**/ },
        { w: 6400 /**/, h: 4800 /**/, n: 21 /**/ },
        { w: 7680 /**/, h: 4800 /**/, n: 25 /**/ }
    ];
    private resolution_ratio_and_divide_num = this.resolution_ratio_and_divide.length;

    /**
    * @description timeline界面背景层的画线的信息
    */
    private lines_info: line_info[][] = [[], [], []];
    /**
    * @description 一天的时间间隔数组
    */
    private time_info_day: texts_style = { text: [], align_style: "center", font_size: 15, font_type: "cascadia code PL" };
    private time_info_month: texts_style = { text: [], align_style: "center", font_size: 45, font_type: "cascadia code PL" };;
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
     * @param flag 要初始化的哪一个数组
     * @param end_number 初始化后数组中成员个数
     */
    private initLineInfo(flag: number, end_number: number) {
        this.lines_info[flag] = [];
        for (let i = 0; i < end_number; i++) {
            this.lines_info[flag].push({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
        }
    }
    /**
     * @param flag 要初始化的哪一个字符数组
     * @param end_number 初始化后数组中成员个数
     */
    private initTextInfo(type: current_mode, end_number: number) {
        if (type == current_mode.day) {
            this.time_info_day.text = [];
            for (let i = 0; i < end_number; i++) {
                this.time_info_day.text.push({ content: "", draw: { x: 0, y: 0 } });
            }
        } else if (type == current_mode.month) {
            /**
             * @TODO 初始化月份数组
             */
        }
    }
    getLinesInfo(lines_array_num: number): line_info[][] {
        if (lines_array_num == 1) {
            if (this.lines_info[0].length != 0) {
                return [this.lines_info[0]];
            } else {
                return null;
            }
        } else if (lines_array_num == 2) {
            if (this.lines_info[1].length != 0 && this.lines_info[2].length != 0) {
                return [this.lines_info[1], this.lines_info[2]];
            } else {
                return null;
            }
        } else {
            return null
        }
    }
    getTimeTextInfo(type: current_mode) {
        if (type == current_mode.day) {
            return this.time_info_day;
        } else if (type == current_mode.month) {
            /**
             * @TODO 抛出月份数组
             */
        }
    }

    /**
     * @description 将传进的宽高修改为离它最近且大于它的常见显示器宽高，并判断是否需要重新绘制
     * @param area_info:允许绘制的区域
     */
    timelineSelfAdaption(area_info: { area_width: number; area_height: number }, type: current_mode): void {

        let area_info_w_ge_h = area_info.area_width >= area_info.area_height;
        let adaption_info = { width: (area_info_w_ge_h ? area_info.area_width : area_info.area_height), height: (area_info_w_ge_h ? area_info.area_height : area_info.area_width) };
        for (let rrad_i = 0; rrad_i < this.resolution_ratio_and_divide_num; rrad_i++) {
            if (adaption_info.width <= this.resolution_ratio_and_divide[rrad_i].w && adaption_info.height <= this.resolution_ratio_and_divide[rrad_i].h) {
                let line_num = this.resolution_ratio_and_divide[rrad_i].n, space_w = ((0.5 + adaption_info.width * this.space) | 0), space_h = ((0.5 + adaption_info.height * this.space) | 0);
                let line_interval = ((0.5 + (adaption_info.width - space_w * 2) / (line_num - 1)) | 0);
                let two_line_interval = [((0.5 + (adaption_info.width - space_w * 2) / (7)) | 0), ((0.5 + (adaption_info.height - space_h * 2) / (5)) | 0)];
                if (type == current_mode.day) {
                    this.initLineInfo(0, 0);
                    this.initTextInfo(0, line_num);
                    this.time_interval = (1440 / (line_num - 1)) * 60 * 1000;
                } else if (type == current_mode.month && (this.lines_info[1].length != 6 || this.lines_info[2].length != 4)) {
                    this.initLineInfo(1, 6);
                    this.initLineInfo(2, 4);
                    this.initTextInfo(2, 31);
                }
                if (area_info_w_ge_h) {
                    if (type == current_mode.day) {
                        for (let m_i = 0; m_i < line_num; m_i++) {
                            this.lines_info[0].push({ start: { x: (space_w + m_i * line_interval), y: 40 }, end: { x: (space_w + m_i * line_interval), y: (adaption_info.height - 40) } });
                            this.setTimeText(m_i, { x: this.lines_info[0][m_i].start.x, y: this.lines_info[0][m_i].start.y - 5 }, type);
                        }
                        this.time_info_day.align_style = "center";
                    } else if (type == current_mode.month && (this.lines_info[1].length != 6 || this.lines_info[2].length != 4)) {
                        for (let m_i = 0; m_i < this.lines_info[1].length; m_i++) {
                            this.lines_info[1][m_i].end.x = this.lines_info[1][m_i].start.x = (space_w + two_line_interval[0] * (m_i + 1));
                            this.lines_info[1][m_i].end.y = adaption_info.height - (this.lines_info[1][m_i].start.y = space_h);
                        }
                        for (let m_i = 0; m_i < this.lines_info[2].length; m_i++) {
                            this.lines_info[2][m_i].end.x = adaption_info.width - (this.lines_info[2][m_i].start.x = space_w);
                            this.lines_info[2][m_i].end.y = this.lines_info[2][m_i].start.y = (space_h + two_line_interval[1] * (m_i + 1));
                        }
                    }
                } else {
                    if (type == current_mode.day) {
                        for (let m_i = 0; m_i < line_num; m_i++) {
                            this.lines_info[0].push({ start: { x: 60, y: (space_w + m_i * line_interval) }, end: { x: (adaption_info.height - 60), y: (space_w + m_i * line_interval) } });
                            this.setTimeText(m_i, { x: this.lines_info[0][m_i].start.x - 3, y: this.lines_info[0][m_i].start.y + this.time_info_day.font_size / 4 }, type);
                        }
                        this.time_info_day.align_style = "right";
                    } else if (type == current_mode.month && (this.lines_info[1].length != 6 || this.lines_info[2].length != 4)) {
                        for (let m_i = 0; m_i < this.lines_info[1].length; m_i++) {
                            this.lines_info[1][m_i].end.x = adaption_info.height - (this.lines_info[1][m_i].start.x = space_h);
                            this.lines_info[1][m_i].end.y = this.lines_info[1][m_i].start.y = (space_w + two_line_interval[0] * (m_i + 1));
                        }
                        for (let m_i = 0; m_i < this.lines_info[2].length; m_i++) {
                            this.lines_info[2][m_i].end.x = this.lines_info[2][m_i].start.x = space_h + two_line_interval[1] * (m_i + 1);
                            this.lines_info[2][m_i].end.y = adaption_info.width - (this.lines_info[2][m_i].start.y = space_w);
                        }
                    }
                }
                break;
            }
        }
        return;
    }

    /**
    * @description 得到时间表数组
    * @param start_time 开始的时间,单位:分
    */
    setTimeText(flag: number, draw_poing: point, type: current_mode) {
        if (type == current_mode.day) {
            let temp = new Date(this.start_time + flag * this.time_interval);
            let temp_h = temp.getHours(), temp_m = temp.getMinutes();
            this.time_info_day.text[flag].content = ((temp_h <= 9 ? "0" : "") + temp_h) + ":" + ((temp_m <= 9 ? "0" : "") + temp_m);
            this.time_info_day.text[flag].draw = draw_poing;
        } else if (type == current_mode.month) {
            /**
             * @TODO 设置月份信息
             */
        }
        return;
    }



}

