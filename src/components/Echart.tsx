
import React, {CSSProperties} from 'react'
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import {TitleComponent} from "echarts/components";
import "./public.less"

/*
* 波形图组件
* */
interface EchartProps {
    xAxisData?: string[]        //x轴数据标识符列表
    series?: any                 //y轴数据值列表
    legend?: any
    propsOption?:any
    title?: string              //标题
    cavStyle?: CSSProperties    //画布样式
    className?: string | undefined
}

const Echarts = (props: EchartProps) => {
    const {xAxisData, title, series, legend, cavStyle, className, propsOption} = props
    echarts.use([TitleComponent])

    const option = {
        title: {
            text: title,
            textStyle: {
                fontSize: "18px",
            },

            top: '10px',
            left: 'center',
            // subtext:"Increment of the past hour: 100",
            subtextStyle: {
                textAlign: 'right',
                align: 'right'
            }
        },
        //画布的样式
        grid: {top: 60, right: 36, bottom: 24, left: 36},

        xAxis: [xAxisData ? {
            type: 'category',
            boundaryGap: false,
            data: xAxisData.map(function (item) {
                return item
            })
        } : {
            type: 'time',   // x轴为 时间轴
            axisLabel: {
                color: '#5A6872',
                fontSize: 11,
                formatter: '{MM}-{dd} {HH}:{mm}',
                wordBreak: 'keep-all'
            },
            axisTick: {show: false},
            boundaryGap: false,

        }],

        yAxis: [
            {
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dotted',
                        color: 'rgba(155, 155, 155, 0.5)'
                    }
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#5A6872',
                    fontSize: 11
                },
                axisTick: {show: false},
                type: 'value'
            }
        ],

        legend: legend,
        series: series,
        tooltip: {
            trigger: 'axis',
        },
    }

    return (
        <ReactEcharts
            // echarts={echarts}
            opts={{renderer: 'svg'}}
            option={propsOption??option} lazyUpdate={true}
            style={{width: '100%',  display: 'flex', position: 'relative', ...cavStyle}}
            className={className}/>
    )
}

export default Echarts