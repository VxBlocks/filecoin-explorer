import {Card, Col, Row, Skeleton} from 'antd';
import {EchartRadar} from './EchartRadar';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import DateUtil from '../../../../../utils/formatData';

// 三角图左侧

function fil(a: any, b: any = 18) {
    let aa = Number(a);
    let bb = Number(b);
    let c = 10;
    let cc = aa / c ** bb;
    return cc;
}
function convert(text: any, Type = ' FIL') {
    let tex = Number(text);
    return (tex / 10 ** 18).toLocaleString() + Type;
}
export const OverviewAndComment = (props: any) => {
    const {infData, wallet, isData} = props;
    const {balance, first_tx_time, received_count, total_received, tx_count, last_tx_time, total_spent, spent_count} =
        infData;
    const {t} = useTranslation();

    const details1 = [
        {name: t('adr_details.balance'), Contents: fil(balance) + ' ' + wallet},
        {
            name: t('Follow_address.First_transaction_time'),
            Contents: DateUtil.formatDate(first_tx_time, 'yyyy-MM-dd HH:mm:ss')
                ? DateUtil.formatDate(first_tx_time, 'yyyy-MM-dd HH:mm:ss')
                : t('tools.No'),
        },
        {name: t('Follow_address.Total_revenue'), Contents: convert(total_received)},
        {name: t('Follow_address.Number_of_revenue'), Contents: received_count},
    ];
    const details2 = [
        {name: t('Follow_address.Total_number_of_transactions'), Contents: tx_count},
        {
            name: t('Follow_address.Latest_trading_time'),
            Contents: DateUtil.formatDate(last_tx_time, 'yyyy-MM-dd HH:mm:ss')
                ? DateUtil.formatDate(last_tx_time, 'yyyy-MM-dd HH:mm:ss')
                : t('tools.No'),
        },
        {name: t('Follow_address.Total_expenses'), Contents: total_spent == null ? 0 + ' FIL' : convert(total_spent)},
        {name: t('Follow_address.Number_expenses'), Contents: spent_count},
    ];
    return (
        <Card style={{boxShadow: '5px 5px 10px #ccc', borderRadius: '8px'}}>
            {isData ? (
                <Skeleton style={{height: '24.5rem'}} />
            ) : (
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{width: '50%'}}>
                        <h2>
                            <strong>{t('track_jobs.overview')}</strong>
                        </h2>
                        <Row>
                            <Col push={4}>
                                {details1.map(item => (
                                    <div key={item.name}>
                                        <p style={{margin: 0, fontWeight: '600'}}>{item.name}</p>
                                        <p>{item.Contents}</p>
                                    </div>
                                ))}
                            </Col>
                            <Col push={8}>
                                {details2.map(item => (
                                    <div key={item.name}>
                                        <p style={{margin: 0, fontWeight: '600'}}>{item.name}</p>
                                        <p>{item.Contents}</p>
                                    </div>
                                ))}
                            </Col>
                        </Row>
                    </div>
                    <EchartRadar />
                </div>
            )}
        </Card>
    );
};
