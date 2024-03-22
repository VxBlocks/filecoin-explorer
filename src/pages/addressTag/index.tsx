import { Button, message, } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AddressTagList } from '../../model/response-model';
import { addlabel, delAddressTag, getAddressTag } from '../../servers/api';
import { HeaderS } from './HeaderS/HeaderS';
import PopupPage from './PopupPage';
import TagList from './TagList';

const AddressTag = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isResetFields, setIsResetFields] = useState(false);
    const [dataList, setDataList] = useState({
        message: [] as AddressTagList[],
        count: 0, //总数
        page: 0, //当前页
        pageSize: 10, //条数
    });


    useEffect(() => {
        getfunction(dataList);
    }, []);

    const getfunction = (dataList: any) => {
        setloading(true);
        const { page = 0, pageSize = 10 } = dataList;
        getAddressTag({ page, pageSize }).then(res => {
            if (res.ok) {
                setDataList({ ...dataList, count: res.count, message: res.data, });
                setloading(false);
            } else { setTimeout(() => { setloading(false) }, 2000); }
        }).catch(() => { setloading(false) });
    };


    const InquireFun = (keywords: any) => { //点击查询按钮
        setloading(true);
        if (keywords.coin && keywords.monitor) {
            getAddressTag({ page: 0, pageSize: 10, ...keywords }).then(res => {
                if (res.ok) {
                    setDataList({ ...dataList, count: res.count, message: res.data, });
                    setloading(false);
                } else { setTimeout(() => { setloading(false) }, 2000) }
            }).catch(() => { setloading(false) });
        } else {
            setloading(false);
            message.open({ type: 'warning', content: t('address_Tag.Please_type') });
        }
    };


    const showModal = () => {
        setIsModalOpen(true);
        setIsResetFields(true)
    };


    const handleOk = async (props: any) => { // 添加发送
        const resp = await addlabel(props);
        // console.log(resp.ok);
        if (resp.ok) {
            getfunction(dataList);
            setIsModalOpen(false);
        } else {
            message.open({
                type: 'error',
                content: t('tools.Invalid_Address'),
            });
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsResetFields(false)
    };


    const deleteFun = (id: any) => { // 删除按钮
        delAddressTag({ id }).then(res => {
            // console.log(res);
            if (res.ok) {
                message.open({
                    type: 'success',
                    content: t('address_Tag.Removal_uccessful'),
                });
                getfunction(dataList);
            } else {
                message.open({
                    type: 'error',
                    content: res.msg,
                });
            }
        }).catch((error) => {
            message.open({
                type: 'error',
                content: error.msg,
            });
        })
    };


    return (
        <div>


            <h2 style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ alignItems: 'center' }}>{t('address_Tag.Address_Marker')}</div>{' '}
                <div style={{ marginLeft: '1.625rem', display: 'flex' }}>
                    <Button size={'small'} onClick={showModal} type="primary" icon={' + '}>
                        {t('address_Tag.Add_address_marker')}
                    </Button>
                </div>
            </h2>


            <HeaderS dataList={dataList} getfunction={getfunction} InquireFun={InquireFun} />


            <TagList deleteFun={deleteFun} loading={loading} getfunction={getfunction} data={dataList} />


            <PopupPage
                isModalOpen={isModalOpen}
                isResetFields={isResetFields}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />


        </div>
    );
};

export default AddressTag;
