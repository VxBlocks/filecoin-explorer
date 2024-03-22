import Echart from '../../../../../components/Echart';
import React, {useEffect, useState, useTransition} from 'react';
import {Card, Skeleton} from 'antd';
import '../../index.less';
import {useTranslation} from 'react-i18next';
import {getEchartNormalApi} from '../../../../../servers/api';
import DateUtil from '../../../../../utils/formatData';
//交易时间分析
export const EchartNormal = (props: any) => {
    const {list, isEchartNormal} = props;
    let max = list.sort(function (a: any, b: any) {
        return b - a;
    })[0];

    const {t} = useTranslation();

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        dataZoom: [
            //滑动条
            {
                show: false, //是否显示滑动条
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                startValue: 0, // 从头开始。
                endValue: 12,
            },
        ],

        xAxis: {
            type: 'category',
            data: [
                '00:00-02:00',
                '02:00-04:00',
                '04:00-06:00',
                '06:00-08:00',
                '08:00-10:00',
                '10:00-12:00',
                '12:00-14:00',
                '14:00-16:00',
                '16:00-18:00',
                '18:00-20:00',
                '20:00-22:00',
                '22:00-24:00',
            ],
            axisTick: {
                alignWithLabel: true,
            },
        },
        yAxis: {
            min: 0,
            max: max,
        },
        series: [
            {
                name: 'Number of transactions',
                data: list,
                type: 'bar',
            },
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
    };

    return (
        <Card style={{boxShadow: '5px 5px 10px #ccc', borderRadius: '8px'}}>
            {isEchartNormal ? (
                <Skeleton style={{height: '24.5rem'}} />
            ) : (
                <>
                    {' '}
                    <h2>{t('adr_details.trading_time')}</h2>
                    <div>
                        <Echart title={''} propsOption={option} />
                    </div>
                </>
            )}
        </Card>
    );
};
