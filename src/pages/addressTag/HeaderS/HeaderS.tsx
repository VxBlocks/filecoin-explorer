import { Button, DatePicker, Input, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { px } from '../../../shared/px';
import { useTranslation } from 'react-i18next';
/**
 *
 * */

export const HeaderS = (props: any) => {
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
        type: '',
        monitor: t('address_Tag.Please_type'),
    });


    const resumeFun = () => { // 重置
        setKeywords({ coin: "FIL", type: "", monitor: t('address_Tag.Please_type') })
    };


    return (
        <div>
            <Select
                style={{ width: '9.125rem' }}
                defaultValue={keywords.coin}
                value={keywords.coin}
                className="select-before"
                onChange={(e: any) => setKeywords({ ...keywords, coin: e })}>
                <Option value="FIL">FIL</Option>
            </Select>
            <Input
                value={keywords.type}
                onInput={(e: any) => setKeywords({ ...keywords, type: e.currentTarget.value })}
                style={{ maxWidth: px(416), margin: '0 4px' }}
                placeholder={t('address_Tag.Wallet_Type')}
            />
            {/* <Select
                placeholder={t('address_Tag.Global_Monitoring')}
                style={{ width: '11rem' }}
                className="select-before"
                value={keywords.monitor}
                onChange={(e: any) => setKeywords({ ...keywords, monitor: e })}>
                <Option value="0">{t('address_Tag.Not_monitored')}</Option>
                <Option value="1">{t('address_Tag.Under_surveillance')}</Option>
            </Select> */}

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
