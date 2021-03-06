import { Injectable } from '@angular/core';

import { Subscription, timer } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShadeService {

    // 快速渲染计时器观察者
    private fast_shade: Subscription;

    // 慢速渲染计时器观察者
    private slow_shade: Subscription;

    private fast_timer = timer(0, 1);

    private slow_timer = timer(0, 1000);

    constructor() { }

    /**
     * 
     * @param x 表示黑白滤镜的右上角的横坐标
     * @param y 表示黑白滤镜的右上角的纵坐标
     * @param width 表示黑白滤镜的长
     * @param height 表示黑白滤镜的高
     * @param canvas 表示要添加黑白滤镜的画布
     * 
     * @description 该方法用来给canvas元素的指定区域添加黑白滤镜效果
     */
    private canvasBlackAndWhiteFilters(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number): void {

        var ctx = canvas.getContext("2d");
        // 获取当前需要加滤镜的画布区域
        var imageData = ctx.getImageData(x, y, width, height);

        // 循环遍历像素点并将相应的rgba的值设为这四种rgba平均值
        for (var i = 0; i < imageData.data.length - 4; i = i + 4) {
            let average = (imageData.data[i] + (imageData.data[i + 1] << 1) + imageData.data[i + 2]) >> 2;
            imageData.data[i] = average;
            imageData.data[i + 1] = average;
            imageData.data[i + 2] = average;
            imageData.data[i + 3] = imageData.data[i + 3];
        }

        // 将改变完的画布放回原处
        ctx.putImageData(imageData, x, y)

    }


    /**
     * 
     * @param canvas 画布的dom元素
     * @param eject_direction 弹出方向值 top left right bottom
     * @param start_time 开始时间的时间戳
     * @param endend_time 结束时间的时间戳
     * @description 根据当前时间增加百分比黑白滤镜
     */
    current_time_shade_canvas(canvas: HTMLCanvasElement, eject_direction: string, start_time: number, end_time: number) {

        let that = this;

        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;

        let date = new Date();
        // 获取当前时间
        let milliseconds = date.getTime();
        let percentage = (milliseconds - start_time) / (end_time - start_time);

        // 宽度增加1px的时间
        let width_time = (end_time - start_time) / (width);
        // 高度增加1px的时间
        let height_time = (end_time - start_time) / (height);
        if (this.fast_shade) {
            this.fast_shade.unsubscribe();
        }
        if (this.slow_shade) {
            this.slow_shade.unsubscribe();
        }
        switch (eject_direction) {
            case "top":
                this.fast_shade = this.fast_timer.subscribe(n => {
                    that.canvasBlackAndWhiteFilters(canvas, 0, n, width, 1);
                    if (n > height * percentage) {
                        that.fast_shade.unsubscribe();
                        that.slow_timer = timer(0, height_time);
                        that.slow_shade = that.slow_timer.subscribe(n => {
                            that.canvasBlackAndWhiteFilters(canvas, 0, n + height * percentage, width, 1);
                            if (n > height - height * percentage) {
                                that.slow_shade.unsubscribe();
                            }
                        });
                    }
                });
                break;
            case "bottom":

                this.fast_shade = this.fast_timer.subscribe(n => {
                    that.canvasBlackAndWhiteFilters(canvas, 0, height - n, width, 1);
                    if (n > height * percentage) {
                        that.fast_shade.unsubscribe();
                        that.slow_timer = timer(0, height_time);
                        that.slow_shade = that.slow_timer.subscribe(n => {
                            that.canvasBlackAndWhiteFilters(canvas, 0, height - height * percentage - n, width, 1);
                            if (n > height - height * percentage) {
                                that.slow_shade.unsubscribe();
                            }
                        });
                    }
                });
                break;
            case "right":

                this.fast_shade = this.fast_timer.subscribe(n => {
                    that.canvasBlackAndWhiteFilters(canvas, width - n, 0, 1, height);
                    if (n > width * percentage) {
                        that.fast_shade.unsubscribe();
                        that.slow_timer = timer(0, width_time);
                        that.slow_shade = that.slow_timer.subscribe(n => {
                            that.canvasBlackAndWhiteFilters(canvas, width - width * percentage - n, 0, 1, height);
                            if (n > width - width * percentage) {
                                that.slow_shade.unsubscribe();
                            }
                        });
                    }
                });
                break;
            case "left":
                this.fast_shade = this.fast_timer.subscribe(n => {
                    that.canvasBlackAndWhiteFilters(canvas, n, 0, 1, height);
                    if (n > width * percentage) {
                        that.fast_shade.unsubscribe();
                        that.slow_timer = timer(0, width_time)
                        that.slow_shade = that.slow_timer.subscribe(n => {
                            that.canvasBlackAndWhiteFilters(canvas, n + width * percentage, 0, 1, height);
                            if (n > width - width * percentage) {
                                that.slow_shade.unsubscribe();
                            }
                        });
                    }
                });
                break;

            default:
                break;
        }
    }
}