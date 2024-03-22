/**
 * 监控动态
 * @宋恩 9/15
 * @周雨芹 11/01
 * */

import {Space, Table, Tag, message} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import './TrendTable.less';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import DateUtil from '../../../utils/formatData';
import {transFil} from '../../../utils/convert-coin-unit';
import EllipsisMiddle from '../../../components/EllipsisMiddle';
import copy from 'copy-to-clipboard';
import { data } from 'vis-network';

const {formatDate} = DateUtil;

interface DataType {
    messageid: string;
    key?: string;
    address?: string;
    time?: string;
    track: string;
    coin: string;
    transfer_link: string;
    amount: number;
    _id: string;
    from: string;
    to: string;
    read: boolean;
}
interface Props {
    dataSource: DataType[];
    loading: boolean;
    address?: string;
    pagination: object;
    readS: (arg: any) => void;
}

const columns = (t: TFunction, handleCopy: (arg: string,num:number) => void) => {
    return [
        {
            title: t('trend.time'),
            dataIndex: 'time',
            key: 'time',
            render: (text, record) => {
                return <span className={record.read ? '' : 'noread'}>{formatDate(text, 'yyyy-MM-dd HH:mm:ss')}</span>;
            },
        },
        {
            title: t('update_Modal.monitor_content'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('trend.coin_type'),
            dataIndex: 'coin',
            key: 'coin',
            render: t => <img style={{width: '30px'}} src={'/assets/filcoin.svg'} alt="" />,
        },
        {
            title: t('track_jobs.wallet_address'),
            dataIndex: 'address',
            key: 'address',
            render: text => {
                return <span>{EllipsisMiddle({suffixCount: 5, children: text})}</span>;
            },
        },
        {
            title: t('trend.sender_recipient'),
            dataIndex: 'to',
            key: 'to',
            render: (text, record,dataIndex) => {
                return (
                    <div>
                        <p
                            className="copy"
                            onClick={() => {
                                handleCopy('.formzhuanzhang',dataIndex);
                            }}>
                            <span className="formzhuanzhang">{EllipsisMiddle({suffixCount: 5, children: record.from})}</span>
                            <i className="iconfont icon-fuzhi"></i>
                        </p>
                        <p  className='copy'
                            onClick={() => {
                                handleCopy('.tozhuanzhang',dataIndex);
                            }}>
                            <i className="iconfont icon-youjiantou"></i>
                            <span className="tozhuanzhang" style={{marginRight: '5px'}}>
                                {EllipsisMiddle({suffixCount: 5, children: text})}
                            </span>
                            <i className="iconfont icon-fuzhi"></i>
                        </p>
                    </div>
                );
            },
        },
        {
            title: t('trend.amount'),
            dataIndex: 'amount',
            key: 'amount',
            render: text => {
                return <>{transFil(text)}</>;
            },
        },
        {
            title: t('trend.message_id'),
            dataIndex: 'messageid',
            key: 'messageid',
            render: (text,record,dataIndex) => {
                return (
                    <div
                        className="copy"
                        onClick={() => {
                            handleCopy('.messageId',dataIndex);
                        }}>
                        <span className="messageId">{EllipsisMiddle({suffixCount: 7, children: text})}</span>
                        <i className="iconfont icon-fuzhi"></i>
                    </div>
                );
            },
        },
    ] as ColumnsType<DataType>;
};

const TrendTable = (props: Props) => {
    const {dataSource, loading, pagination,readS} = props;
    const {t} = useTranslation();

    // 复制
    const handleCopy = (str: any,num:number) => {
      console.log(str);
        const code = document.querySelectorAll(str)[num].innerText;
        if (code) {
            copy(code);
            message.success('复制成功', 1);
        }
    };
    return (
        <div className="trendTab-container">
            <Table
                rowKey={record => {
                    return record._id;
                }}
                columns={columns(t, handleCopy)}
                dataSource={dataSource}
                loading={loading}
                pagination={pagination}
                onRow={record => {
                    return {
                        onClick: e => {
                          readS({id: record._id, read: true});
                        },
                    };
                }}
            />
        </div>
    );
};

export default TrendTable;
