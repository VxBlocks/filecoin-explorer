import Echart from "../Echart";
import React from "react";
import {Card} from "antd";
import '../public.less'
import {useTranslation} from "react-i18next";

export const EchartNormal = () => {
    const {t} = useTranslation()
    const option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [120, 200, 150, 80, 0, 110, 130, 120, 0, 150, 80, 70],
                type: 'bar'
            }
        ],
        grid: {
            x: 40,
            y: 25,
            x2: '10%',
            y2: 35
        },
    };

    return (
        <Card style={{boxShadow:"5px 5px 10px #ccc",borderRadius:"8px"}}>
            <h2>{t("track_jobs.transaction_actions")}</h2>
            <div>
                <Echart title={''} propsOption={option} className={'echart_react'}/>
            </div>
        </Card>
    )
}