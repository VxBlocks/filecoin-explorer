import Echart from '../../../../../components/Echart';
import React from 'react';
import '../../index.less';
import {useTranslation} from 'react-i18next';

//三角图

export const EchartRadar = () => {
    const {t} = useTranslation();
    const optionRadar = {
        title: {
            text: '',
        },
        legend: {
            data: [t('adr_details.risk_assessment'), t('adr_details.Maximum_Rating')],
            //可设定图例在上、下、居中
            x: 'center',
            y: 'bottom',
            padding: [0, 0, 50, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        },
        radar: {
            // shape: 'circle',
            indicator: [
                {name: t('adr_details.risk_assessment'), max: 6500},
                {name: t('Follow_address.Suspicious_transactions'), max: 16000},
                {name: t('Follow_address.Hacking_Incidents'), max: 30000},
            ],
        },
        series: [
            {
                name: 'Budget vs spending',
                type: 'radar',
                data: [
                    {
                        value: [4200, 3000, 20000, 35000, 50000, 18000],
                        name: t('adr_details.risk_assessment'),
                    },
                    {
                        value: [5000, 14000, 28000, 26000, 42000, 21000],
                        name: t('adr_details.Maximum_Rating'),
                    },
                ],
            },
        ],
    };

    return (
        <div style={{width: '50%'}}>
            <h2>
                <strong>{t('adr_details.risk_assessment')}</strong>
            </h2>
            <div style={{width: '100%'}}>
                <Echart title={'s'} className={'echart_react'} propsOption={optionRadar} />
            </div>
        </div>
    );
};
