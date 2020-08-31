import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';

import { TimelineDataAndFunction, current_mode, task_info } from './timeline-daf';

import { DrawService } from '../../service/draw.service';
import { DatePipe } from '@angular/common';
import { ConstantPool } from '@angular/compiler';


@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
    providers: [DatePipe]
})
export class TimelineComponent implements OnInit {
    /**
     * 绘制canvas和相应绘制区域
     */
    timeline_canvas: HTMLCanvasElement;
    timeline_drawmap: CanvasRenderingContext2D;
    task_canvas: HTMLCanvasElement;
    task_drawmap: CanvasRenderingContext2D;

    /**
     * 增删改任务界面相应信息
     */
    @ViewChild('task_start_time') task_start_time: ElementRef;
    @ViewChild('task_end_time') task_end_time: ElementRef;
    @ViewChild('input_task') input_task: ElementRef;
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
    //当前左键或右键点击的任务
    operator_task: number;
    //当前进行的操作  0：添加任务  1：更新任务
    operator: number = 0;

    /**
     * 隐藏div显示信息
     */
    task_main_right_style: { style_display: number, style_top: number, style_left: number };
    task_right_style: { style_display: number, style_top: number, style_left: number };
    task_table_style: { style_display: number };

    /**
     * 首次打开时,读取数据库是否完毕,是否需要更新界面的flag
     */
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
        this.input_task.nativeElement.value = "";
        this.task_select_cycles = 0;
        this.operator = 0;
        this.task_table_style.style_display = 1;
    }
    /**
     * @description 修改任务信息的界面
     */
    changeTaskView() {
        let temp_task = this.tl_daf.getTask(this.operator_task);

        console.log(temp_task);
        this.task_right_style.style_display = 0;
        this.temp_task_starttime = this.datepipe.transform(temp_task.start_time, "yyyy-MM-ddTHH:mm:ss");
        this.temp_task_endtime = this.datepipe.transform(temp_task.end_time, "yyyy-MM-ddTHH:mm:ss");
        this.input_task.nativeElement.value = temp_task.task;
        this.task_select_cycles = temp_task.cycle;
        this.operator = 1;
        this.task_table_style.style_display = 1;
    }
    /**
     * @description 删除任务信息的界面
     */
    deleteTask() {
        this.tl_daf.deleteTask(this.operator_task);
        this.task_right_style.style_display = 0;
        this.update();
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

        let temp_task_info: task_info = {
            start_time: new Date(this.temp_task_starttime).getTime(),
            end_time: new Date(this.temp_task_endtime).getTime(),
            task: this.input_task.nativeElement.value,
            cycle: this.task_select_cycles,
            is_end: false
        };
        if (temp_task_info.task != "") {
            this.tl_daf.addTask(temp_task_info);
            this.update();
        }
        this.task_table_style.style_display = 0;
    }

    /**
     * @description 更新任务
     */
    updateTask() {
        if (this.input_task.nativeElement.value != "") {
            let temp_task = this.tl_daf.getTask(this.operator_task);
            temp_task.start_time = new Date(this.temp_task_starttime).getTime();
            temp_task.end_time = new Date(this.temp_task_endtime).getTime();
            temp_task.task = this.input_task.nativeElement.value;
            temp_task.cycle = this.task_select_cycles;
            temp_task.is_end = false;
            this.tl_daf.updateTask(this.operator_task);
            this.update();
        }
        this.task_table_style.style_display = 0;
    }

    /**
     * @description 隐藏任务表格
     */
    taskTableHide() {
        this.task_table_style.style_display = 0;
    }

    /**
     * @description 显示主页面的右键菜单
     */
    mainRightView(event) {
        this.task_right_style.style_display = 0;
        this.task_main_right_style.style_display = 1;
        this.task_main_right_style.style_top = event.clientY;
        this.task_main_right_style.style_left = event.clientX;
    }
    /**
     * @description 隐藏主页面的右键菜单
     */
    mainRightHide() {
        this.task_main_right_style.style_display = 0;
        this.task_right_style.style_display = 0;
    }

    /**
     * @description 任务的右键菜单
     */
    taskRightView(event) {
        this.operator_task = this.tl_daf.inBoxesInfo({ x: event.clientX, y: event.clientY });
        if (-1 == this.operator_task) {
            this.task_right_style.style_display = 0;
            this.task_main_right_style.style_display = 1;
            this.task_main_right_style.style_top = event.clientY;
            this.task_main_right_style.style_left = event.clientX;
        } else {
            this.task_main_right_style.style_display = 0;
            this.task_right_style.style_display = 1;
            this.task_right_style.style_top = event.clientY;
            this.task_right_style.style_left = event.clientX;
        }
    }
    /**
     * @description 隐藏任务的右键菜单
     */
    taskRightHide() {
        this.task_main_right_style.style_display = 0;
        this.task_right_style.style_display = 0;
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

        this.task_drawmap = this.tl_daf.taskSelfAdaption(this.task_canvas);
        this.draw.drawBox(this.task_drawmap, this.tl_daf.getViewTaskBox());
    }

    /**
     * @description 初始化，初始化相应数值，并关联相应canvas
     */
    private init() {
        this.task_main_right_style = { style_display: 0, style_top: 0, style_left: 0 };
        this.task_right_style = { style_display: 0, style_top: 0, style_left: 0 };
        this.task_table_style = { style_display: 0 };
        this.timeline_canvas = this.render.selectRootElement("#timeline_canvas");
        this.task_canvas = this.render.selectRootElement("#task_canvas");
    }
    ngOnInit(): void {
        this.flag = { update_flag: false };
        this.init();
        this.tl_daf.init(this.flag);
        this.update();
        let update_view = setInterval(() => { //设置定时器，没200毫秒检查数据是否读取完毕，若完毕则更新视图并清除该定时器
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
