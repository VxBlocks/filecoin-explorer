/** @format */

import React, { useEffect, useState } from 'react';
import Hcard from '../../components/Hcard';
import { useTranslation } from 'react-i18next';
import { getAttention } from '../../../../servers/api';
import { Attention, follow_address_list } from '../../../../model/response-model';
import { message } from 'antd';
import EllipsisMiddle from '../../../../components/EllipsisMiddle';
import { Link, useNavigate } from 'react-router-dom';

const uppercase = (text: any) => {
    return text.toUpperCase();
};

const HomeCard_4 = () => {
    const { t } = useTranslation();
    const [dataList, setDataList] = useState({
        message: [] as follow_address_list[],
        count: 10,
        page: 0,
        pageSize: 5,
    });
    const [loading, setloading] = useState(false);
    useEffect(() => {
        getfunction(dataList);
    }, [message]);
    const navigate = useNavigate();
    const getfunction = (dataList: any) => {
        setloading(true);
        let { page, pageSize, coin = '', address = '', note_content = '', state = 1 } = dataList;
        coin = uppercase(coin);
        getAttention({ page, pageSize, coin, id: address, note_content, state })
            .then(res => {
                const mess = res.data as Attention;
                if (res.ok && mess.follow_address_list) {
                    setDataList({
                        ...dataList,
                        message: mess.follow_address_list,

                    });
                    setloading(false);
                } else {
                    setTimeout(() => {
                        setloading(false);
                    }, 0);
                }
            })
            .catch(() => {
                setTimeout(() => {
                    setloading(false);
                }, 0);
            });
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
            render: (text: any) => (
                <div>{text.toUpperCase()}</div>
            )
        },
        {
            textWrap: 'word-break',
            title: t('Follow_address.Address_Alias'),
            dataIndex: 'note_content',
            key: 'note_content',
            render: (text: any, record: any) => (
                <span
                // className="curso"
                // onClick={function () {
                //     navigate('/TrackDetail', {
                //         state: {name: text, time: record.creation_time, address: record.address},
                //     });
                // }}
                >
                    {text.length > 18 ? <EllipsisMiddle suffixCount={12}>{text}</EllipsisMiddle> : text}
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
                title={t('Follow_address.Follow_address')}
                site={'/follow'}
            />
        </>
    );
};

export default HomeCard_4;
