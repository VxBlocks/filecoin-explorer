import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import TrendTable from './components/TrendTable';
import {SearchCoin} from './components/SearchCoin';
import {useTranslation} from 'react-i18next';
import {getTransferList} from '../../servers/api';
import {read} from '../../servers/api';

/**
 * @宋恩 9/15
 * @zhouyuqin 11/01
 * */

const Trend = () => {
    const {t} = useTranslation();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const {address} = useParams();
    const [params, setParams] = useState({page: 0, pageSize: 10});

    // 数据请求
    const fetchTrend = async (params: object) => {
        const {data, count} = await getTransferList(params);
        if (data) {
            setData(data);
            setTotal(count);
            setLoading(false);
        } else {
            setData([]);
            setTotal(0);
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };
    useEffect(() => {
        // 路由参数
        if (address) {
            fetchTrend({...params, address});
        } else {
            fetchTrend(params);
        }
    }, [address, params]);
    // 查询
    const search = (params: object) => {
        fetchTrend({page: 0, pageSize: 10, ...params});
    };
    // 已读
    const readS = (props: object) => {
        (async () => {
            await read(JSON.stringify(props));
        })();
        fetchTrend(params);
    };
    return (
        <>
            <h2>{t('menubar.monitor_move')}</h2>
            {/*头部搜索*/}
            <SearchCoin handleFun={search} total={total} />
            {/*表*/}
            <TrendTable
                loading={loading}
                dataSource={data}
                pagination={{
                    defaultCurrent: 1,
                    total: total,
                    onChange: (page: number, pageSize: number) => {
                        setParams({page: page - 1, pageSize});
                    },
                }}
                readS={readS}
            />
        </>
    );
};

export default Trend;
