import { Button, message, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getAttention } from '../../../servers/api';
import { Attention, follow_address_list } from '../../../model/response-model';
import DateUtil from '../../../utils/formatData';

/**
 * @wancheng 9/15
 * Table 假数据
 * */

const TagList = (props: any) => {
    const { data, checkTheDetails, deleteFun, getfunction, loading } = props;
    const { t } = useTranslation();
    const confirm = (record: any) => {
        deleteFun(record._id);
    };
    const columns: ColumnsType<follow_address_list> = [
        {
            title: t('trend.coin_type'),
            dataIndex: 'coin',
            key: 'coin',
        },

        {
            title: t('track_jobs.Wallet_ddress'),
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: t('address_Tag.Wallet_alias'),
            dataIndex: 'alias',
            key: 'alias',
        },
        {
            title: t('address_Tag.Wallet_Type'),
            dataIndex: 'type',
            key: 'type',
        },

        {
            title: t('address_Tag.Wallet_Remarks'),
            dataIndex: 'notes',
            key: 'notes',
        },
        // {
        //     title: t('track_jobs.monitor'),
        //     dataIndex: 'monitor',
        //     key: 'monitor',
        //     render: text => <div>{text == 1 ? t('monitoring.monitoring') : t('address_Tag.Not_monitored')}</div>,
        // },
        {
            title: t('track_jobs.create_time'),
            dataIndex: 'create_time',
            key: 'create_time',
            render: (text: any) => <div>{DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm:ss')}</div>,
        },
        {
            title: t('track_jobs.action'),
            dataIndex: 'messageId',
            key: 'messageId',
            // render: (text, record, index) => (
            //     <div>
            //         <Button
            //             onClick={() => {
            //                 deleteFun(record._id);
            //             }}>
            //             {t('track_jobs.delete')}
            //         </Button>
            //     </div>
            // ),
            render: (text, record, index) => (
                <div>
                    <Popconfirm title="Are you sure？" okText="Yes" onConfirm={() => confirm(record)} cancelText="No">
                        <Button
                        >
                            {t('track_jobs.delete')}
                        </Button>
                    </Popconfirm>

                </div>
            )
        },
    ];

    const navigate = useNavigate();

    return (
        <>
            <Table
                columns={columns}
                loading={loading}
                dataSource={data.message}
                rowKey={(datas: { id: string }) => datas.id}
                pagination={{
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: (page, pageSize) => {
                        getfunction({ page: page - 1, pageSize });
                    },
                    total: data.count,
                    pageSize: data.pageSize,
                    showTotal: (count = data.count) => {
                        return t('trend.total') + data.count + t('trend.pieces') + t('trend.dynamic');
                    },
                    defaultCurrent: 1,
                    pageSizeOptions: ['10', '20'],
                }}
            />
        </>
    );
};

export default TagList;
