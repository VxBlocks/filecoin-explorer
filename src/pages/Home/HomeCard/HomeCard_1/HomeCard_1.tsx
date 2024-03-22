/** @format */

import React, {useEffect, useState} from 'react';
import Hcard from '../../components/Hcard';
import {useTranslation} from 'react-i18next';
import {getTrack} from '../../../../servers/api';
import {Attention, follow_address_list, TrcktaskList} from '../../../../model/response-model';
import {message, Spin} from 'antd';
import EllipsisMiddle from '../../../../components/EllipsisMiddle';
import {Link, useNavigate} from 'react-router-dom';

const HomeCard_1 = () => {
    const {t} = useTranslation();
    const [loading, setloading] = useState(false);
    const [dataList, setDataList] = useState({
        message: [] as TrcktaskList[],
        count: 10,
        page: 0,
        pageSize: 5,
    });
    const navigate = useNavigate();
    useEffect(() => {
        getfunction(dataList);
    }, []);

    const getfunction = (dataList: any) => {
        setloading(true);
        const {page, pageSize} = dataList;
        getTrack({page, pageSize}).then(res => {
            // console.log(res, 'getTrack');
            if (res.ok && res.data) {
                setDataList({
                    ...dataList,
                    message: res.data.get_tracktask,
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

    // 追踪任务卡片
    const Columns = [
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
            textWrap: 'word-break',
            title: t('track_jobs.track_name'),
            dataIndex: 'name',
            key: 'name',
            render: (text: any, record: any) => (
                <span
                    // className="curso"
                    // onClick={function () {
                    //     navigate('/TrackDetail', {
                    //         state: {name: text, time: record.creation_time, address: record.address},
                    //     });
                    // }}
                    >
                    {text && text.length > 10 ? <EllipsisMiddle suffixCount={12}>{text}</EllipsisMiddle> : text}
                </span>
            ),
        },
        {
            textWrap: 'word-break',
            title: t('track_jobs.wallet_address'),
            dataIndex: 'address',
            key: 'address',
            render: (text: any, record: any, index: any) => (
                <Link to={`/${record.coin}/${text}`}>
                    {text && text.length > 10 ? <EllipsisMiddle suffixCount={12}>{text}</EllipsisMiddle> : text}
                </Link>
            ),
        },
    ];

    return (
        <>
            <Hcard
                loading={loading}
                columns={Columns}
                data={dataList.message}
                title={t('menubar.track_jobs')}
                site={'/track'}
            />
        </>
    );
};

export default HomeCard_1;
