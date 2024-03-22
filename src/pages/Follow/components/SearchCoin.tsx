import { Button, DatePicker, Input, Select, Space } from 'antd';
import React, { useState } from 'react';
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import s from './SearchCoin.module.scss';
import { px } from '../../../shared/px';
import { useTranslation } from 'react-i18next';
import { COINTYPELIST } from '../../../conf/conf';

/**
 * @宋恩 9/15
 * 头部查询钱包地址
 * */

export const SearchCoin = (props: any) => {
    const { dataList, getfunction, InquireFun } = props;
    const { t } = useTranslation();
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    const onChange = (
        value: DatePickerProps['value'] | RangePickerProps['value'],
        dateString: [string, string] | string,
    ) => {
        // console.log('Selected Time: ', value);
        // ['2022-09-13 22:52', '2022-09-17 16:46'] 👇
        // console.log('Formatted Selected Time: ', dateString);
    };

    const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
        // console.log('onOk: ', value);
    };

    const [keywords, setKeywords] = useState({
        coin: 'FIL',
        id: '',
        note_content: '',
    });

    const resumeFun = () => {
        // 重置
        getfunction(dataList);
    };

    return (
        <div className={s.search}>
            <Select
                style={{
                    width: '9.125rem',
                }}
                defaultValue={t('FIL')}
                className="select-before"
                onChange={(e: any) => setKeywords({ ...keywords, coin: e })}>
                {COINTYPELIST.map((item) => {
                    return (
                        <Option value={item} key={item}>{item}</Option>
                    )
                })}
            </Select>
            <Input
                onBlur={(e: any) => setKeywords({ ...keywords, id: e.currentTarget.value })}
                style={{ maxWidth: px(416), margin: '0 4px' }}
                placeholder={t('track_jobs.input_address')}
            />
            <Input
                onBlur={(e: any) => setKeywords({ ...keywords, note_content: e.currentTarget.value })}
                style={{ maxWidth: px(200), margin: '0 4px' }}
                placeholder={t('Follow_address.Note_Inquiry')}
            />

            <Button onClick={() => InquireFun(keywords)} style={{ margin: '0 4px' }}>
                {t('track_jobs.search')}
            </Button>
            <Button onClick={resumeFun} style={{ marginLeft: '4px' }}>
                {t('track_jobs.reset')}
            </Button>
            <br />
            <p style={{ margin: '12px' }}>
                {t('track_jobs.total')} <strong>{dataList.count}</strong> {t('trend.pieces') + t('trend.dynamic')}
            </p>
        </div>
    );
};
