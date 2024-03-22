/** @format */

import React, {useEffect, useState} from 'react';
import Hcard from '../../components/Hcard';
import {useTranslation} from 'react-i18next';
import {getMonitor} from '../../../../servers/api';
import {address_list, monitor} from '../../../../model/response-model';
import EllipsisMiddle from '../../../../components/EllipsisMiddle';
import {Link, useNavigate} from 'react-router-dom';

const HomeCard_2 = () => {
    const {t} = useTranslation();
    const [dataList, setDataList] = useState({
        message: [] as address_list[],
        count: 10,
        page: 0,
        pageSize: 5,
    });
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);
    useEffect(() => {
        getfunction(dataList);
    }, []);

    const getfunction = (dataList: any) => {
        setloading(true);
        const {page, pageSize} = dataList;
        getMonitor({page, pageSize}).then(res => {
            const mess = res.data as monitor;
            // console.log(mess, 'getMonitor');
            if (res.ok &&  mess.monitor_address_list) {
                setDataList({
                    ...dataList,
                    count: mess.total_count,
                    message: mess.monitor_address_list,
                });
                setloading(false);
            } else {
                setTimeout(() => {
                    setloading(false);
                }, 0);
            }
        }).catch(()=>{
            setTimeout(() => {
                setloading(false);
            }, 0);
        });;
    };
    // 追踪任务卡片假数据

    const columns = [
        {
            width: 80,
            ellipsis: true,
            textWrap: 'word-break',
            title: t('track_jobs.coin'),
            dataIndex: 'coin',
            key: 'coin',
            render:(text:any)=>(
                <div>{text.toUpperCase()}</div>
            )
        },
        {
            title: t('track_jobs.Monitoring_Name'),
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => (
                <span
                    // className="curso"
                    // onClick={function () {
                    //     navigate(`/TrackDetail/${record.coin}/${record.address}`, { state: record });
                    // }}
                    >
                    {text.length > 10 ? <EllipsisMiddle suffixCount={12}>{text}</EllipsisMiddle> : text}
                </span>
            ),
        },
        {
            title: t('track_jobs.wallet_address'),
            dataIndex: 'address',
            key: 'address',
            render: (text: any, record: any, index: any) => (
                <Link to={`/${record.coin}/${text}`}>
                    {text.length > 10 ? <EllipsisMiddle suffixCount={12}>{text}</EllipsisMiddle> : text}
                </Link>
            ),
        },
    ];

    return (
        <>
            <Hcard
                loading={loading}
                columns={columns}
                data={dataList.message}
                title={t('menubar.monitor_address')}
                site={'/address'}
            />
        </>
    );
};

export default HomeCard_2;
