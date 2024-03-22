import Echart from "../Echart";
import React from "react";
import "../public.less"
import {useTranslation} from "react-i18next";

export const EchartRadar = () => {
    const {t} = useTranslation()
    const optionRadar = {
        title: {
            text: ''
        },
        legend: {
            data: ['Allocated Budget', 'Actual Spending']
        },
        radar: {
            // shape: 'circle',
            indicator: [
                {name: 'Sales', max: 6500},
                {name: 'Administration', max: 16000},
                {name: 'Information Technology', max: 30000},

            ]
        },
        series: [
            {
                name: 'Budget vs spending',
                type: 'radar',
                data: [
                    {
                        value: [4200, 3000, 20000, 35000, 50000, 18000],
                        name: 'Allocated Budget'
                    },
                    {
                        value: [5000, 14000, 28000, 26000, 42000, 21000],
                        name: 'Actual Spending'
                    }
                ]
            }
        ]
    }

    return (
        <div style={{width: "50%"}}>
            <h2><strong>{t("track_jobs.risk_score")}</strong></h2>
            <div style={{width: "100%"}}>
                <Echart title={'s'} className={'echart_react'} propsOption={optionRadar}/>
            </div>
        </div>
    )
}