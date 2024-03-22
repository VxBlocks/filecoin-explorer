import {Card} from "antd";
import Echart from "../Echart";
import React from "react";
import {px} from "../../shared/px";
import {useTranslation} from "react-i18next";


export const EchartPie=()=>{
    const {t} = useTranslation()
    const optionPie = {
        title: {
            text: 'Weather Statistics',
            subtext: 'Fake Data',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            bottom: 10,
            left: 'center',
            data: ['CityA', 'CityB', 'CityD', 'CityC']
        },
        series: [
            {
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                selectedMode: 'single',
                data: [


                    { value: 735, name: 'CityC' },
                    { value: 510, name: 'CityD' },
                    { value: 434, name: 'CityB' },
                    { value: 335, name: 'CityA' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    return(
        <Card style={{boxShadow:"5px 5px 10px #ccc",borderRadius:"8px"}}>
            <h2>{t("track_jobs.transaction_actions")}</h2>
            <div style={{display:'flex'}}>
                <div style={{width:"15%"}}/>
                <div style={{width:"45%"}}>
                <Echart className={'echart_react'} cavStyle={{flex:'1 1 50%',width:px(300)}} title={'s'} propsOption={optionPie}/>
                </div>
                <div>
                <Echart className={'echart_react_ml'} cavStyle={{flex:'1 1 50%',width:px(300)}} title={'s'} propsOption={optionPie}/>
                </div>
            </div>
        </Card>
    )
}