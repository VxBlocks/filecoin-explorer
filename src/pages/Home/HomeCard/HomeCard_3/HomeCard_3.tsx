/** @format */

import React, { useEffect, useState } from 'react';
import Hcard from '../../components/Hcard';
import { useTranslation } from 'react-i18next';
import { getTransfer, getTransferList } from '../../../../servers/api';
import { transfer, transferList } from '../../../../model/response-model';
import { Link } from 'react-router-dom';
import { transFil } from '../../../../utils/convert-coin-unit';
import DateUtil from '../../../../utils/formatData';

const HomeCard_3 = () => {
    const { t } = useTranslation();
    const [loading, setloading] = useState(false);
    const [dataList, setDataList] = useState({
        message: [] as transferList[],
        count: 10,
        page: 0,
        pageSize: 5,
    });

    useEffect(() => {
        getfunction(dataList);
    }, []);

    const getfunction = (dataList: any) => {
        const { page, pageSize } = dataList;
        setloading(true);
        getTransferList({ page, pageSize }).then(res => {
            const mess = res.data;
            if (res.ok) {
                setDataList({
                    ...dataList,
                    count: mess.count,
                    message: mess,
                });
                setloading(false);
            } else {
                setTimeout(() => {
                    setloading(false);
                }, 0);
            }
        }).catch((err) => {
            console.log(err);

            setTimeout(() => {
                setloading(false);
            }, 0);
        });;
    };

    const columns = [
        {
            title: t('track_jobs.coin'),
            dataIndex: 'coin',
            key: 'coin',
            render: (text: any) => (
                <div>{text.toUpperCase()}</div>
            )
        },
        {
            title: t('track_jobs.Monitoring_Name'),
            dataIndex: 'name',
            key: 'name',
            render: (text: any) => <Link to={''}>{text}</Link>,
        },
        {
            title: t('Alerts.Transfer_Amount'),
            dataIndex: 'amount',
            key: 'amount',
            render: (text: any) => <div>{transFil(text)}</div>,
        },
        {
            title: t('Alerts.Trading_Hours'),
            dataIndex: 'time',
            key: 'time',
            render: (text: any) => <div>{DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm:ss')}</div>,
        },
    ];

    return (
        <>
            <Hcard
                loading={loading}
                columns={columns}
                data={dataList.message}
                title={t('menubar.monitor_move')}
                site={'/trend'}
            />
        </>
    );
};

export default HomeCard_3;
