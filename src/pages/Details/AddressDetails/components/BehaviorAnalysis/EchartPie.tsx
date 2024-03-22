import {Card, Button, Result, Skeleton} from 'antd';
import Echart from '../../../../../components/Echart';
import React, {useEffect, useState} from 'react';
import {px} from '../../../../../shared/px';
import {useTranslation} from 'react-i18next';
import {getEchartPieApi, requestActionAnalysis} from '../../../../../servers/api';
import {ActionAnalysis} from '../../../../../model/response-model';
import {SmileOutlined} from '@ant-design/icons';
import {isDate} from 'util/types';
// 交易行为分析

export const EchartPie = (props: any) => {
    const {wallet, address,isData} = props;
    const {t} = useTranslation();
    const [isLoading, setLoading] = useState(false);
    const [pieData, setPieData] = useState({});
    const [isdata, setIsdata] = useState(false);
    useEffect(() => {
        fetchData();
    }, []);

    // async function fetchData() {
    //     // TODO 使用假数据
    //     let req = await requestActionAnalysis({
    //         coin: 'ETH',
    //         address: 'f3xadivtkepaty5c3aoeyrfwtydibxnmhw6seulzxve3a6ztufa2mbgeeyk6xc2qkl47sywrjcqkqkbwvirnxa',
    //     });
    //     setLoading(true);
    //     if (req.ok) {
    //         handleData(req.data);
    //     }
    //     setLoading(false);
    // }

    const fetchData = () => {
        setLoading(true);
        getEchartPieApi({coin: wallet, address}).then(req => {
            // console.log(req);
            if (req.ok) {
                handleData(req.data as ActionAnalysis);
            }
            setLoading(false);
        });
    };

    function handleData(data: ActionAnalysis) {
        let legendData = [] as any;
        let seriesData = [] as any;
        if (data.income && data.expenditure) {
            legendData = [t('adr_details.incoming'), t('adr_details.outgoing')];
            seriesData = [
                {value: (data.expenditure / 10 ** 18).toFixed(4), name: t('adr_details.outgoing')},
                {value: (data.income / 10 ** 18).toFixed(4), name: t('adr_details.incoming')},
            ];
        } else if (data.income) {
            legendData = [t('adr_details.incoming')];
            seriesData = [{value: (data.income / 10 ** 18).toFixed(3), name: t('adr_details.incoming')}];
        } else if (data.expenditure) {
            legendData = [t('adr_details.outgoing')];
            seriesData = [{value: (data.expenditure / 10 ** 18).toFixed(3), name: t('adr_details.outgoing')}];
        } else {
            setIsdata(true);
        }

        const optionPie = {
            title: {
                top: 10,
                text: t('adr_details.transaction_actions'),
                subtext: ' ',
                left: 'center',
            },
            tooltip: {
                formatter: '{b} : {c} ({d}%)',
            },
            legend: {
                bottom: 10,
                left: 'center',
                data: legendData,
            },
            series: [
                {
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    data: seriesData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        };
        setPieData(optionPie);
    }

    return (
        <Card style={{boxShadow: '5px 5px 10px #ccc', borderRadius: '8px'}} loading={isLoading}>
            {isData ? (
                <Skeleton style={{height:"24.5rem"}} />
            ) : (
                <>
                    {' '}
                    <h2>{t('track_jobs.transaction_actions')}</h2>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        {isdata ? (
                            <Result icon={<SmileOutlined />} title="There are currently no transactions" />
                        ) : (
                            <>
                                <div style={{width: '15%'}} />
                                <div style={{width: '45%'}}>
                                    <Echart
                                        className={'echart_react'}
                                        cavStyle={{flex: '1 1 50%', width: px(300)}}
                                        title={'s'}
                                        propsOption={pieData}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </Card>
    );
};
