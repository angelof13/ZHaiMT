import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';

import { TimelineDataAndFunction, current_mode, task_info } from './timeline-daf';

import { DrawService } from '../../service/draw.service';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
    providers: [DatePipe]
})
export class TimelineComponent implements OnInit {

    timeline_canvas: HTMLCanvasElement;
    timeline_drawmap: CanvasRenderingContext2D;
    task_canvas: HTMLCanvasElement;
    task_drawmap: CanvasRenderingContext2D;
    @ViewChild('task_start_time') task_start_time: ElementRef;
    @ViewChild('task_end_time') task_end_time: ElementRef;
    @ViewChild('input_task') input_task: ElementRef;
    temp_task_info: task_info;
    temp_task_starttime: string;
    temp_task_endtime: string;
    task_cycles: { cycle: string; value: number; is_use: boolean }[] = [
        { cycle: '一次', value: 0, is_use: true },
        { cycle: '每天', value: 1, is_use: true },
        { cycle: '每周', value: 2, is_use: false },
        { cycle: '每月', value: 3, is_use: false },
        { cycle: '每年', value: 4, is_use: false },
    ];
    task_select_cycles: number = 0;

    task_main_right_style: { style_display: number, style_top: number, style_left: number }
    task_table_style: { style_display: number };

    flag: { update_flag: boolean };
    constructor(private draw: DrawService, private tl_daf: TimelineDataAndFunction, private render: Renderer2, private datepipe: DatePipe) { }

    /**
     * @description 添加任务信息的界面
     */
    addTaskView(e) {
        let temp = new Date();
        this.temp_task_starttime = this.datepipe.transform(temp, "yyyy-MM-ddTHH:mm:ss");
        this.temp_task_endtime = this.temp_task_starttime;
        this.task_main_right_style.style_display = 0;
        this.task_table_style.style_display = 1;
    }
    /**
     * @description 修改任务信息的界面
     */
    changeTaskView(e) {
    }
    /**
     * @description 删除任务信息的界面
     */
    deleteTaskView(e) {
    }
    /**
     * @description 设置循环周期
     */
    selectCycle(radio) {
        this.task_select_cycles = radio;
    }

    onDateChange(temp: number, value: string) {
        if (0 == temp) {
            this.temp_task_starttime = value;
        } else {
            this.temp_task_endtime = value;
        }
    }
    /**
     * @description 添加任务
     */
    addTask() {
        this.temp_task_info.start_time = new Date(this.temp_task_starttime).getTime();
        this.temp_task_info.end_time = new Date(this.temp_task_endtime).getTime();
        this.temp_task_info.cycle = this.task_select_cycles;
        this.temp_task_info.task = this.input_task.nativeElement.value;
        if (this.temp_task_info.task != "") {
            this.tl_daf.addTask(this.temp_task_info);
            console.log(this.temp_task_info);
            this.temp_task_info.task = "";
        }
        this.update();
        this.task_table_style.style_display = 0;
    }

    /**
     * @description 隐藏任务表格
     */
    task_table_hide() {
        this.task_table_style.style_display = 0;
    }

    /**
     * @description 显示主页面的右键菜单
     */
    main_right_view(event) {
        this.task_main_right_style.style_display = 1;
        this.task_main_right_style.style_top = event.clientY;
        this.task_main_right_style.style_left = event.clientX;
    }
    /**
     * @description 隐藏主页面的右键菜单
     */
    main_right_hide() {
        this.task_main_right_style.style_display = 0;
    }

    /**
     * @description timeline界面信息的设置界面
     */
    timelineSetView(e) {
        this.task_main_right_style.style_display = 0;
    }
    /**
     * @description 改变窗口大小时，更新值的方法
     */
    private update(): void {
        /**更新time_line Canvas画布,重新绘制背景 */
        this.timeline_drawmap = this.tl_daf.timelineSelfAdaption(this.timeline_canvas, current_mode.day);

        this.draw.drawLine(this.timeline_drawmap, [this.tl_daf.getLinesInfo()]);
        this.draw.drawText(this.timeline_drawmap, this.tl_daf.getTimeTextInfo());

        this.task_drawmap = this.tl_daf.taskSelfAdaption(this.task_canvas, current_mode.day);
        this.draw.drawBox(this.task_drawmap, this.tl_daf.getViewTaskBox());
    }

    private init() {
        this.task_main_right_style = { style_display: 0, style_top: 0, style_left: 0 };
        this.task_table_style = { style_display: 0 };
        this.temp_task_info = { task: "", start_time: 0, end_time: 0, cycle: 0, is_end: false };
        this.timeline_canvas = this.render.selectRootElement("#timeline_canvas");
        this.task_canvas = this.render.selectRootElement("#task_canvas");
    }
    ngOnInit(): void {
        this.flag = { update_flag: false };
        this.init();
        this.tl_daf.init(this.flag);
        this.update();
        let update_view = setInterval(() => {
            if (this.flag.update_flag == true) {
                this.update();
                clearInterval(update_view);
            }
        }, 200);
        fromEvent(window, 'resize').subscribe((event) => {
            //这里表示当窗口大小发生变化时所做的事，也就是说可以对多个图表进行大小调整
            this.update();
        })
    }
    ngAfterViewInit(): void {
    }

    ngAfterViewChecked() {
    }
}
