/** @format */

import React, {useState} from 'react';
import {Avatar, Card, Table} from 'antd';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
/**
 *
 * @万诚
 * 9/15
 * columns = [{title: "币种",dataIndex: "name",key: "name",}] 数组对象结构
 *   几个对象 几个 title 代表列表头显示几个
 * data = [{key: "1",name: "1",age: "追踪1",address: "New York No. 1 Lake Park",}] 数组对象
 *      一个对象代表一列 与 columns 对应
 * title 卡片左上标题
 *
 * site 跳转地址 默认 #
 *
 */

const Hcard = (props: any) => {
    const {t} = useTranslation();
    const {columns, data, title, site = '#', loading} = props;
    return (
        <div>
            <Card loading={loading} title={title} extra={<Link to={site}>{`${t('home.see_more')} >`}</Link>}>
                <Table  columns={columns} dataSource={data} pagination={false} />
            </Card>
        </div>
    );
};

export default Hcard;
