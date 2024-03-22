import React, {useEffect, useState} from 'react';
import FollowTable from './components/FollowTable';
import {SearchCoin} from './components/SearchCoin';
import {useTranslation} from 'react-i18next';
import {DeleteAttention, getAttention} from '../../servers/api';
import {Attention, follow_address_list} from '../../model/response-model';
import {message, notification} from 'antd';
import {useNavigate} from 'react-router-dom';
/**
 * @wancheng 9/15
 * */

 const uppercase = (text: any) => {
    return text.toUpperCase();
};

const Follow: React.FC = () => {
    const {t} = useTranslation();
    const [isOk, setIsOk] = useState(true);
    const [loading, setloading] = useState(false);
    const [dataList, setDataList] = useState({
        message: [] as follow_address_list[],
        count: 0, //总数
        page: 0, //当前页
        pageSize: 10, //条数
        coin: '',
        address: '',
        note_content: '',
    });
    const key = 'updatable';
    const navigate = useNavigate();
    useEffect(() => {
        getfunction(dataList);
    }, [isOk]);

    const getfunction = (dataList: any) => {
        setloading(true);
        let {page = 0, pageSize = 10, coin = '', id = '', note_content = '', state = 1} = dataList;
        coin = uppercase(coin);
        getAttention({page, pageSize, coin, id, note_content, state}).then(res => {
            // console.log(res,res);

            const mess = res.data as Attention;
            if (res.ok && mess == null) {
                setDataList({
                    ...dataList,
                    message: mess,
                });
                notification.open({
                    message: t('Follow_address.Notification'),
                    description: t('Follow_address.No_address_to_follow'),
                });
                setloading(false);
            }
            if (res.ok) {
                setDataList({
                    ...dataList,
                    count: mess.total_count,
                    message: mess.follow_address_list,
                });
                setloading(false);
            } else {
                setTimeout(() => {
                    setloading(false);
                }, 0);
            }
        });
    };

    const InquireFun = (keywords: any) => {
        //点击查询按钮
        // console.log(keywords, 'keywords');

        if (keywords.coin || keywords.id || keywords.notecontent) {
            getfunction({...keywords});
        } else {
            alert(t('Follow_address.Please_select_the_content_of_the_query'));
        }
    };

    const checkTheDetails = (coin: number | string, id: string) => {
        // 查看详情
        // console.log(coin, id, '查看详情 ');
        navigate(`/${coin}/${id}`);
    };

    const deleteFun = (coin: number | string, id: string) => {
        // console.log(coin, id, '删除 ');
        setIsOk(true);
        message.loading({content: t('Follow_address.Being_cancelled') + ' ...', key});
        setTimeout(() => {
            message.success({content: t('Follow_address.Cancellation_success') + ' !', key, duration: 2});
            DeleteAttention({coin, id}).then(res => {
                // console.log(res);
                setIsOk(false);
            });
        }, 1000);
    };

    return (
        <>
            <h2>{t('menubar.favorite_address')}</h2>
            {/*头部搜索*/}
            <SearchCoin dataList={dataList} getfunction={getfunction} InquireFun={InquireFun} />
            {/*表*/}
            <FollowTable
                loading={loading}
                getfunction={getfunction}
                data={dataList}
                checkTheDetails={checkTheDetails}
                deleteFun={deleteFun}
            />
        </>
    );
};

export default Follow;
