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

    task_main_right_style: { style_display: number, style_top: number, style_left: number }
    task_table_style: { style_display: number };

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
     * @description 设置循环模式
     */
    checkedCycle(e) {
        e.target.firstChild.checked = "checked";
    }
    /**
     * @description 添加任务
     */
    addTask() {
        let start_time = new Date(this.task_start_time.nativeElement.value).getTime(), end_time = new Date(this.task_end_time.nativeElement.value).getTime();
        
        console.log(start_time);
        console.log(end_time);
        if (start_time >= end_time) {
            return false;
        } else {
            this.temp_task_info.task = this.input_task.nativeElement.value;
            this.temp_task_info.start_time = start_time;
            this.temp_task_info.end_time = end_time;
        }
        console.log(this.temp_task_info);
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
        this.temp_task_info = { task: "", start_time: 0, end_time: 0, daily_repeat: false, is_end: false };
        this.timeline_canvas = this.render.selectRootElement("#timeline_canvas");
        this.task_canvas = this.render.selectRootElement("#task_canvas");
    }
    ngOnInit(): void {
        this.init();
        this.tl_daf.init();
        this.update();
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
