import { Injectable } from '@angular/core';
import { line_info, horizontal_vertical, follow_style, DrawService } from '../../service/draw.service';

export { TimelineDataAndFunction }

@Injectable({
    providedIn: 'root'
})

class TimelineDataAndFunction {
    /**
    * @description 常见比例及对应分割方法抽成数组,便于维护
    */
    private resolution_ratio_and_divide: { w: number, h: number, n: number }[] = [/* 注释用来对齐数据*/
        // { w: 800  /**/, h: 600  /**/, n: 5  /**/ },
        // { w: 1024 /**/, h: 768  /**/, n: 5  /**/ },
        // { w: 1280 /**/, h: 720  /**/, n: 5  /**/ },
        // { w: 1280 /**/, h: 800  /**/, n: 5  /**/ },
        { w: 1280 /**/, h: 960  /**/, n: 5  /**/ },
        // { w: 1366 /**/, h: 768  /**/, n: 7  /**/ },
        // { w: 1440 /**/, h: 900  /**/, n: 7  /**/ },
        // { w: 1600 /**/, h: 900  /**/, n: 7  /**/ },
        // { w: 1600 /**/, h: 1200 /**/, n: 5  /**/ },
        // { w: 1680 /**/, h: 1050 /**/, n: 7  /**/ },
        { w: 1792 /**/, h: 868  /**/, n: 7  /**/ },
        // { w: 1920 /**/, h: 1080 /**/, n: 13 /**/ },
        { w: 1920 /**/, h: 1200 /**/, n: 13 /**/ },
        { w: 1920 /**/, h: 1400 /**/, n: 9  /**/ },
        { w: 2048 /**/, h: 1152 /**/, n: 13 /**/ },
        { w: 2048 /**/, h: 1536 /**/, n: 9  /**/ },
        { w: 2560 /**/, h: 1080 /**/, n: 17 /**/ },
        // { w: 2560 /**/, h: 1440 /**/, n: 13 /**/ },
        { w: 2560 /**/, h: 1600 /**/, n: 13 /**/ },
        { w: 2800 /**/, h: 2100 /**/, n: 9  /**/ },//一下显示分辨率纯靠猜测,无实机测试
        { w: 3440 /**/, h: 1440 /**/, n: 17 /**/ },
        { w: 3840 /**/, h: 1080 /**/, n: 25 /**/ },
        // { w: 3840 /**/, h: 2160 /**/, n: 19 /**/ },
        { w: 3840 /**/, h: 2400 /**/, n: 19 /**/ },
        { w: 4096 /**/, h: 3072 /**/, n: 17 /**/ },
        // { w: 5120 /**/, h: 3200 /**/, n: 25 /**/ },
        // { w: 5120 /**/, h: 4096 /**/, n: 25 /**/ },
        { w: 6400 /**/, h: 4096 /**/, n: 25 /**/ },
        { w: 6400 /**/, h: 4800 /**/, n: 21 /**/ },
        // { w: 7680 /**/, h: 4320 /**/, n: 25 /**/ },
        { w: 7680 /**/, h: 4800 /**/, n: 25 /**/ }
    ];
    /**
    * @description 比例及对应分割表的数据个数
    */
    private resolution_ratio_and_divide_num = this.resolution_ratio_and_divide.length;
    /**
    * @description timeline界面背景层的画线的信息
    */
    private line_info: line_info = { start_point: { x: 0, y: 0 }, line_num: 3, length: 0, HorV: horizontal_vertical.v, follow_time: { is_draw_time: false, time_array: [], follow_style_h: follow_style.right, follow_style_v: follow_style.top } };
    /**
    * @description line_info.time_array的起始时间,单位为分,范围0~~1440;
    */
    private timeline_start_time = 90;

    constructor(private draw: DrawService) { }
    //所有线的长度都为0.95
    get_line_info(): line_info {
        return JSON.parse(JSON.stringify(this.line_info));
    }

    /**
     * @description 将传进的宽高修改为离它最近且大于它的常见显示器宽高，并判断是否需要重新绘制
     * @param area_info:允许绘制的区域
     * @param is_draw_time:改线条是否跟随时间
     */
    timelineSelfAdaption(area_info: { area_width: number; area_height: number }, is_draw_time: boolean): void {
        let area_info_w_ge_h = area_info.area_width >= area_info.area_height;
        let adaption_info = { width: (area_info_w_ge_h ? area_info.area_width : area_info.area_height), height: (!area_info_w_ge_h ? area_info.area_height : area_info.area_width) };
        for (let rrad_i = 0; rrad_i < this.resolution_ratio_and_divide_num; rrad_i++) {
            if (adaption_info.width <= this.resolution_ratio_and_divide[rrad_i].w && adaption_info.height <= this.resolution_ratio_and_divide[rrad_i].h) {

                this.line_info.line_num = this.resolution_ratio_and_divide[rrad_i].n;
                this.line_info.follow_time.is_draw_time = is_draw_time;
                if (is_draw_time) {
                    this.line_info.follow_time.time_array = this.draw.getTimeArrayOneDay(this.line_info.line_num - 1, this.timeline_start_time);
                }
                if (area_info_w_ge_h) {
                    this.line_info.HorV = horizontal_vertical.v;
                    this.line_info.start_point.x = (0.5 + area_info.area_width * 0.02) | 0;
                    this.line_info.start_point.y = 40;
                } else {
                    this.line_info.HorV = horizontal_vertical.h;
                    this.line_info.start_point.x = 60;
                    this.line_info.start_point.y = (0.5 + area_info.area_height * 0.02) | 0;
                }
                break;
            }
        }
        return;
    }
}

