import { Button, message, Modal, Space, Table, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import s from './FollowTable.module.scss';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { follow_address_list } from '../../../model/response-model';
import DateUtil from '../../../utils/formatData';

/**
 * @wancheng 9/15
 * Table 假数据
 * */

const FollowTable = (props: any) => {
    const { data, checkTheDetails, deleteFun, getfunction, loading } = props;

    const confirm = (record: any) => {
        deleteFun(record.coin, record.id);
    };

    const { t } = useTranslation();
    const columns: ColumnsType<follow_address_list> = [
        {
            title: t('trend.coin_type'),
            dataIndex: 'coin',
            key: 'coin',
        },

        {
            title: t('track_jobs.wallet_address'),
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: t('favorites.Remarks'),
            dataIndex: 'note_content',
            key: 'note_content',
        },
        {
            title: t('favorites.favorites_time'),
            dataIndex: 'time',
            key: 'time',
            render: text => <div>{DateUtil.formatDate(text, 'yyyy-MM-dd HH:mm:ss')}</div>,
        },

        {
            title: t('track_jobs.action'),
            dataIndex: 'messageId',
            key: 'messageId',
            render: (text, record, index) => (
                <div>
                    <Button onClick={() => checkTheDetails(record.coin, record.address)} style={{ marginRight: '5px' }}>
                        {t('track_jobs.view_details')}
                    </Button>
                    <Popconfirm title="Are you sure？" okText="Yes" onConfirm={() => confirm(record)} cancelText="No">
                        <Button
                        >
                            {t('track_jobs.delete')}
                        </Button>
                    </Popconfirm>

                </div>
            ),
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
                        return t('trend.total') + ' ' + data.count + ' ' + t('trend.pieces') + t('trend.dynamic');
                    },
                    defaultCurrent: 1,
                    pageSizeOptions: ['10', '20'],
                }}
            />

        </>
    );
};

export default FollowTable;
