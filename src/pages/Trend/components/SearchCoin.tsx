import { Button, DatePicker, Input, Select, Form } from 'antd';
import React, { useTransition, useState } from 'react';
import s from './SearchCoin.module.scss';
import { px } from '../../../shared/px';
import { useTranslation } from 'react-i18next';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import { COINTYPELIST } from '../../../conf/conf';

/**
 * @宋恩 9/15
 * 头部查询钱包地址
 * */

const { RangePicker } = DatePicker;
const { Option } = Select;

export const SearchCoin = (props: { handleFun: (arg: object) => void, total: number }) => {
    const { handleFun, total } = props;
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const params = useState({ page: 0, pageSize: 10 });
    const onfinish = (value: any) => {
        if (value.date) {
            let {
                coin,
                address,
                name,
                date: [start, end],
            } = value;
            // 将数据传递给父组件
            const TransactionStartDate = start.set({ hour: 0, minute: 0, second: 0 }).unix();
            const TransactionEndDate = end.set({ hour: 23, minute: 23, second: 59 }).unix();
            console.log(TransactionStartDate);
            const params = { coin, address, name, TransactionStartDate, TransactionEndDate };
            handleFun(params);
        } else {
            handleFun(value);
        }
    };
    return (
        <div className={s.search}>
            <Form layout="inline" form={form} onFinish={onfinish}>
                <Form.Item name="coin" initialValue="FIL">
                    <Select style={{ width: px(146) }} className="select-before">
                        {COINTYPELIST.map((item) => {
                            return (
                                <Option value={item} key={item}>{item}</Option>
                            )
                        })}
                    </Select>
                </Form.Item>
                <Form.Item name="address">
                    <Input style={{ maxWidth: px(416), margin: '0 4px' }} placeholder={t('track_jobs.input_address')} />
                </Form.Item>
                <Form.Item name="name">
                    <Input style={{ maxWidth: px(200), margin: '0 4px' }} placeholder={t('monitoring.note_content')} />
                </Form.Item>
                <Form.Item name="date">
                    <RangePicker
                        locale={locale}
                        format="YYYY/MM/DD"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ margin: '0 4px' }}>
                        {t('track_jobs.search')}
                    </Button>
                    <Button
                        onClick={() => {
                            onfinish(params);
                            form.resetFields();
                        }}
                        type="dashed"
                        style={{ marginLeft: '4px' }}>
                        {t('track_jobs.reset')}
                    </Button>
                </Form.Item>
            </Form>

            <br />
            <p style={{ margin: '12px' }}>
                {t('trend.total')} <strong>{total}</strong> {t('trend.pieces') + t('trend.dynamic')},{t('trend.unread')}{' '}
                <strong>{0}</strong> {t('trend.pieces')}
            </p>
        </div>
    );
};
