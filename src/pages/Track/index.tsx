/**
 * 监控动态
 * @宋恩 9/15
 * @周雨芹 11/01
 * */
import React, {FC, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './index.less';
import {Col, Row, Select, Input, Button, Form, Modal} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import MyTable from './Table';
import {deleteTrack, getTrack} from '../../servers/api';
import {useTranslation} from 'react-i18next';
import DateUtil from '../../utils/formatData';
import {COINTYPELIST} from '../../conf/conf';
import {TrackInfo, TrackTask} from '../../model/response-model';
import {ToolTip} from '../../components/ToolTips';
import {ExclamationCircleFilled} from '@ant-design/icons';

const {Option} = Select;
const {formatDate} = DateUtil;
const {confirm} = Modal;

interface Params {
    page: number;
    pageSize: number;
}
interface columnsProps {
    t: (a: string) => string;
    navigate: (arg1: string, arg2?: object) => any;
    handleClickRemoveButton: (id: string, tgId: string) => void;
}

// 列表title
const columnsConfig = (props: columnsProps) => {
    const {t, navigate, handleClickRemoveButton} = props;
    let time = '';
    const title: ColumnsType<TrackInfo> = [
        {
            title: t('track_jobs.coin'),
            key: 'coin',
            dataIndex: 'coin',
            render: text => {
                return <span>{text}</span>;
            },
        },
        {
            title: t('track_jobs.track_name'),
            key: 'name',
            dataIndex: 'name',
        },
        {
            title: t('track_jobs.wallet_address'),
            key: 'address',
            dataIndex: 'address',
            render: (text, record) => {
                return (
                    <span
                        className="address"
                        onClick={() => {
                            navigate(`/TrackDetail/${record.coin}/${record.address}`, {state: record});
                        }}>
                        {text}
                    </span>
                );
            },
        },
        {
            title: t('track_jobs.create_time'),
            key: 'creation_time',
            dataIndex: 'creation_time',
            render: text => {
                time = formatDate(text, 'yyyy-MM-dd HH:mm:ss');
                return <span>{time}</span>;
            },
        },
        {
            title: t('track_jobs.owner'),
            key: 'owner',
            dataIndex: 'owner',
        },
        {
            title: t('track_jobs.action'),
            key: 'action',
            // dataIndex: 'action',
            render: (text, record) => {
                return (
                    <>
                        <Button
                            onClick={() => {
                                navigate(`/TrackDetail/${record.coin}/${record.address}`, {state: record});
                            }}>
                            {t('track_jobs.view_details')}
                        </Button>
                        <Button
                            onClick={() => {
                                handleClickRemoveButton(record.id, record.track_graph_id);
                            }}>
                            {t('track_jobs.del')}
                        </Button>
                    </>
                );
            },
        },
    ];

    return title;
};

export default function Trac() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [data, setData] = useState({} as TrackTask);
    const [tablePage, setTablePage] = useState({page: 0, pageSize: 10});
    const [loading, setLoading] = useState(true);
    // 数据请求
    async function fetchTrack(params: Params) {
        const resp = await getTrack(params);
        // 数据请求到了,取消loading
        if (resp.ok) {
            setData(resp.data);
            if (!resp.data.count) {
              ToolTip.warn('暂无追踪任务,请添加追踪任务！');
            }
        } else {
            ToolTip.error('获取数据失败，请稍后重试');
            setData({} as TrackTask);
        }
        setLoading(false);
    }
    // 删除某个追踪任务
    async function removeTrackTask(params: {id: string; track_graph_id: string}) {
        const resp = await deleteTrack(params);
        console.log(resp);
        if (resp.ok) {
            fetchTrack(tablePage);
        }
    }
    // 查询
    function onfinish(value?: object) {
        fetchTrack({page: 0, pageSize: 10, ...value});
    }
    // 点击删除按钮后的事件
    const handleClickRemoveButton = (id: string, tgId: string) => {
        confirm({
            title: '您确定删除该追踪任务吗?',
            icon: <ExclamationCircleFilled />,
            content: '删除追踪任务后对应的交易图谱也将被删除,是否继续删除追踪任务?',
            okText: '确认',
            cancelText: '取消',

            onOk() {
                removeTrackTask({id: id, track_graph_id: tgId});
            },
            onCancel() {},
        });
    };
    useEffect(() => {
        fetchTrack(tablePage);
    }, [tablePage.page]);

    return (
        <div className="track-contianer">
            <Row>
                <Col span={24}>
                    <h2>{t('menubar.track_jobs')}</h2>
                </Col>
            </Row>
            {/* 搜索查询表单 */}
            <Row gutter={[16, {xs: 4, sm: 8, md: 8, lg: 24}]}>
                <Form layout="inline" form={form} onFinish={onfinish}>
                    <Form.Item initialValue="FIL" name="coin">
                        <Select style={{width: '100%'}}>
                            {COINTYPELIST.map(item => {
                                return (
                                    <Option value={item} key={item}>
                                        {item}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item name="address" preserve={false}>
                        <Input placeholder={t('track_jobs.input_address')} />
                    </Form.Item>
                    <Form.Item name="name" preserve={false}>
                        <Input placeholder={t('track_jobs.input_name')} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" color="#1754FF" htmlType="submit" style={{marginRight: '8px'}}>
                            {t('track_jobs.search')}
                        </Button>
                        <Button
                            onClick={() => {
                                form.resetFields();
                                onfinish();
                            }}
                            type="dashed"
                            color="#1747FF">
                            {t('track_jobs.reset')}
                        </Button>
                    </Form.Item>
                </Form>
            </Row>
            <div>
                {t('track_jobs.total')} <span style={{color: 'red'}}>{data.count}</span>{' '}
                {t('track_jobs.pieces') + t('track_jobs.record')}
            </div>
            <MyTable
                data={data.get_tracktask}
                columns={columnsConfig({t, navigate, handleClickRemoveButton})}
                pagination={{
                    defaultCurrent: 1,
                    total: data.count,
                    onChange: (page: number, pageSize: number) => {
                        setTablePage({page: page - 1, pageSize});
                    },
                }}
                loading={loading}
            />
        </div>
    );
}
