import { Injectable } from '@angular/core';

export { TimelineDataAndFunction }

/**************************************************************************************数据类型接口************************************************************************************************************/
interface point { x: number, y: number; };

/**
 * @param start 设置线条的起点
 * @param end 设置线条的终点
 */
interface line_info { start: point; end: point; };

/**
 * @param text 设置文字内容
 * @param draw 设置文字位置
 */
interface text_style { text: string; draw: point; };

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
    * @description 画线和边缘的间距
    */
    private space = 0.02;
    /**
    * @description line_info.time_array的起始时间,单位为分,范围0~~1440;
    */
    private timeline_start_time = 90;

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

    /**
     * @description 将传进的宽高修改为离它最近且大于它的常见显示器宽高，并判断是否需要重新绘制
     * @param area_info:允许绘制的区域
     */
    timelineSelfAdaption(area_info: { area_width: number; area_height: number }): void {

        let area_info_w_ge_h = area_info.area_width >= area_info.area_height;
        let adaption_info = { width: (area_info_w_ge_h ? area_info.area_width : area_info.area_height), height: (area_info_w_ge_h ? area_info.area_height : area_info.area_width) };
        for (let rrad_i = 0; rrad_i < this.resolution_ratio_and_divide_num; rrad_i++) {
            if (adaption_info.width <= this.resolution_ratio_and_divide[rrad_i].w && adaption_info.height <= this.resolution_ratio_and_divide[rrad_i].h) {
                let line_num = this.resolution_ratio_and_divide[rrad_i].n, space_w = ((0.5 + adaption_info.width * this.space) | 0), space_h = ((0.5 + adaption_info.height * this.space) | 0);
                let line_interval = ((0.5 + (adaption_info.width - space_w * 2) / (line_num - 1)) | 0);
                let two_line_interval = [((0.5 + (adaption_info.width - space_w * 2) / (7)) | 0), ((0.5 + (adaption_info.height - space_h * 2) / (5)) | 0)];
                this.initLineInfo(0, 0);
                if (this.lines_info[1].length != 6 || this.lines_info[2].length != 4) {
                    this.initLineInfo(1, 6);
                    this.initLineInfo(2, 4);
                }
                console.log(adaption_info.height);
                if (area_info_w_ge_h) {
                    for (let i = 0; i < line_num; i++) {
                        let point = { start: { x: (space_w + i * line_interval), y: 40 }, end: { x: (space_w + i * line_interval), y: (adaption_info.height - 40) } };
                        this.lines_info[0].push(point);
                    }
                    for (let i = 0; i < this.lines_info[1].length; i++) {
                        this.lines_info[1][i].end.x = this.lines_info[1][i].start.x = (space_w + two_line_interval[0] * (i + 1));
                        this.lines_info[1][i].end.y = adaption_info.height - (this.lines_info[1][i].start.y = space_h);
                    }
                    for (let i = 0; i < this.lines_info[2].length; i++) {
                        this.lines_info[2][i].end.x = adaption_info.width - (this.lines_info[2][i].start.x = space_w);
                        this.lines_info[2][i].end.y = this.lines_info[2][i].start.y = space_h + two_line_interval[2] * (i + 1);
                    }
                } else {
                    for (let i = 0; i < line_num; i++) {
                        let point = { start: { x: 60, y: (space_w + i * line_interval) }, end: { x: (adaption_info.height - 60), y: (space_w + i * line_interval) } };
                        this.lines_info[0].push(point);
                    }
                    for (let i = 0; i < this.lines_info[1].length; i++) {
                        this.lines_info[1][i].end.x = adaption_info.width - (this.lines_info[1][i].start.x = space_w);
                        this.lines_info[1][i].end.y = this.lines_info[1][i].start.y = space_h + two_line_interval[1] * (i + 1);
                    }
                    for (let i = 0; i < this.lines_info[2].length; i++) {
                        this.lines_info[2][i].end.x = this.lines_info[2][i].start.x = space_w + two_line_interval[0] * (i + 1);
                        this.lines_info[2][i].end.y = adaption_info.height - (this.lines_info[2][i].start.y = space_h);
                    }
                }
                break;
            }
        }
        return;
    }

    /**
    * @description 得到时间表数组
    * @param divide_part 对一天的划分次数
    * @param start_time 开始的时间,单位:分
    */
    getTimeArrayOneDay(divide_part: number, start_time: number = 180): string[] {
        let s_time = start_time <= 0 ? 0 : start_time >= 1440 ? 0 : start_time, time_array: string[] = [], time_interval = (1440 / divide_part), time_h = ((s_time / 60) | 0), time_m = (start_time - time_h * 60);
        time_array.push(((time_h >= 10 ? "" + time_h : "0" + time_h) + ":" + (time_m >= 10 ? "" + time_m : "0" + time_m)));
        for (let divide_num = 0; divide_num < divide_part; divide_num++) {
            time_m = time_m + time_interval;
            while (time_m >= 60) {
                time_h += 1;
                time_m -= 60;
            }
            time_h = time_h >= 24 ? time_h - 24 : time_h;
            time_array.push(((time_h >= 10 ? "" + time_h : "0" + time_h) + ":" + (time_m >= 10 ? "" + time_m : "0" + time_m)));
        }
        return time_array;
    }


}

