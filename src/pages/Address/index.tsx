/**
 * From zhou
 */
import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Row, Col, Select, Input, Button, Form, message, Modal} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import './index.less';
import MyTable from '../Track/Table';
import {getMonitor, addMonitor, editMonitor, delMonitor} from '../../servers/api';
import UpdateJK from '../../components/UpdataMonitor';
import {useTranslation} from 'react-i18next';
import {COINTYPELIST} from '../../conf/conf';
import {TrackInfo} from '../../model/response-model';
import {ToolTip} from '../../components/ToolTips';
import EllipsisMiddle from '../../components/EllipsisMiddle';

const {Option} = Select;

interface DataType {
    key?: string;
    address?: string;
    time?: string;
    track: string;
    coin: string;
    transfer_link: string;
    amount: number;
    messageId: string;
    id: string;
}

interface Params {
    page: number;
    pageSize: number;
    coin?: string;
    address?: string;
    note_content_keyword?: string;
    recipient_email?: string | string[] | null;
}

interface columnsProps {
    t: (a: string) => string;
    handleUpdate: (a: any) => void;
    navigate: (arg1: string, arg2?: object) => void;
    cancelMonitor: (arg1: string, arg2: number, arg3: string) => void;
    showDeleteConfirm: (arg1: string) => void;
}

const columnsConfig = (props: columnsProps) => {
    const {t, handleUpdate, navigate, cancelMonitor, showDeleteConfirm} = props;
    const title: ColumnsType<TrackInfo> = [
        {
            title: t('track_jobs.coin'),
            key: 'coin',
            dataIndex: 'coin',
        },
        {
            title: t('update_Modal.monitor_content'),
            key: 'note_content',
            dataIndex: 'name',
        },
        {
            title: t('track_jobs.wallet_address'),
            key: 'address',
            dataIndex: 'address',
            render: (text, record) => {
                return (
                    <Link to={{pathname: `/${record.coin}/${text}`}} className="address">
                        {EllipsisMiddle({suffixCount:5,children:text})}
                    </Link>
                );
            },
        },
        {
            title: t('monitoring.recipient_email'),
            key: 'recipient_email_list',
            dataIndex: 'recipient_email',
            render: text => {
                return (
                    <>
                        {text
                            ? text.map((item: string, index: number) => {
                                  return <li key={index}>{item}</li>;
                              })
                            : null}
                    </>
                );
            },
        },
        {
            title: t('monitoring.status'),
            key: 'monitor_status',
            dataIndex: 'monitor_status',
            render: (text, record, index) => {
                return (
                    <div>
                        {text ? (
                            t('monitoring.monitoring')
                        ) : (
                            <span style={{color: 'red'}}>{t('monitoring.disabled')}</span>
                        )}
                    </div>
                );
            },
        },
        {
            title: t('track_jobs.action'),
            render: record => {
                const {monitor_status, address, id} = record;
                return (
                    <div>
                        {/* 编辑按钮 */}
                        <Button
                            onClick={() => {
                                handleUpdate({title: t('update_Modal.update_title'), isRender: true, record});
                            }}
                            shape="round">
                            {t('monitoring.edit')}
                        </Button>
                        {/* 动态 */}
                        <Button
                            onClick={() => {
                                navigate('/trend/' + record.address);
                            }}
                            shape="round">
                            {t('monitoring.dynamic')}
                        </Button>
                        {monitor_status ? (
                            // 取消监控
                            <Button
                                shape="round"
                                className="cacle"
                                onClick={() => {
                                    cancelMonitor(record.id, 2, t('monitoring.cancel_scs'));
                                }}>
                                {t('monitoring.cancel_monitor')}
                            </Button>
                        ) : (
                            <span>
                                {/* 开启 删除 */}
                                <Button
                                    onClick={() => {
                                        cancelMonitor(record.id, 1, t('monitoring.monitor_scs'));
                                    }}
                                    shape="round"
                                    className="cacle">
                                    {t('monitoring.start_monitor')}
                                </Button>
                                <Button
                                    onClick={() => {
                                        showDeleteConfirm(record.id);
                                    }}
                                    shape="round"
                                    className="del">
                                    {t('monitoring.remove')}
                                </Button>
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];

    return title;
};

export default function Address() {
    const {confirm} = Modal;
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [params, setParams] = useState<Params>({
        page: 0,
        pageSize: 10,
    });
    const [total, setTotal] = useState(0);
    const [isRender, setIsRender] = useState(false);
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState(['mawenjie@storswift.com']);
    const [record, setRecord] = useState<any>();
    const [loading, setLoading] = useState(true);

    // 请求数据
    async function fetchMonitor(params: Params) {
        const {data} = await getMonitor(params);
        if (data) {
            setData(data.monitor_address_list);
            setTotal(data.total_count);
        } else {
            setData([]);
            setTotal(0);
        }
        setLoading(false);
        // setEmail(data.monitor_address_list[0].recipient_email);
    }
    useEffect(() => {
        fetchMonitor(params);
    }, [params]);

    // 查询
    const onfinish = (value: any) => {
        if (value) {
            fetchMonitor({page: 0, pageSize: 10, ...value});
        } else {
            fetchMonitor(params);
        }
    };

    // 设置弹窗内容
    const handleUpdate = (props: {title: string; record?: object}) => {
        const {title, record} = props;
        setIsRender(true);
        setTitle(title);
        setRecord(record);   
    };
    const success = (props: string) => {
        message.success(props, 1);
    };
    const error = (props: string) => {
        message.error(props, 1);
    };
    const showDeleteConfirm = (id: string) => {
        confirm({
            title: t('monitoring.del_monitor'),
            content: t('monitoring.sure_del'),
            okText: t('dialog.confirm'),
            okType: 'danger',
            cancelText: t('dialog.cancel'),
            onOk() {
                DelMonitor(id);
            },
            onCancel() {},
        });
    };
    // 删除监控
    const DelMonitor = async (id: string) => {
        const res = await delMonitor({id});
        if (res.ok) {
            ToolTip.success(t('monitoring.del_scs'));
            fetchMonitor(params);
        }
    };
    // 取消监控
    const cancelMonitor = async (id: string, monitor_status: number, msg: string) => {
        const resp = await editMonitor(JSON.stringify({id, monitor_status}));
        if (resp.ok) {
            success(msg);
            fetchMonitor(params);
        }
    };
    // 添加监控
    const AddMonitor = async (props: object) => {
        const resp = await addMonitor(JSON.stringify(props));
        if (resp.ok) {
            setIsRender(false);
            success(t('monitoring.add_scs'));
            fetchMonitor(params);
        } else {
            if (resp.msg == 'AddressInMonitoring') {
                error(t('monitoring.Monitored'));
            }
            if (resp.msg == 'InvalidAddress') {
                error(t('monitoring.addr_error'));
            }
        }
    };
    // 更新监控
    const updateMonitor = async (props: object) => {
        const id = record.id;
        const resp = await editMonitor(JSON.stringify({id, ...props}));
        if (resp.ok) {
            setIsRender(false);
            success(t('monitoring.updt_scs'));
            fetchMonitor(params);
        } else {
            if (resp.msg == 'AddressInMonitoring') {
                error(t('monitoring.Monitored'));
            }
            if (resp.msg == 'InvalidAddress') {
                error(t('monitoring.addr_error'));
            }
        }
    };
    // 处理弹窗功能的函数
    const handleFunction = (props: {form?: object; close?: boolean}) => {
        
        const {form, close} = props;
        console.log(form,'123');
        if (form) {
            if (title == '添加监控' || title == 'Add Monitoring') {
                AddMonitor(form);
            } else {
                updateMonitor(form);
            }
        }
        if (close === false) {
            setIsRender(false);
        }
    };
    return (
        <div className="address-container">
            <Row style={{display: 'flex', justifyContent: 'flex-start'}}>
                <Col style={{marginRight: '20px', alignItems: 'center'}}>
                    <h2 style={{margin: '0'}}>{t('menubar.monitor_address')}</h2>
                </Col>
                <Col style={{alignSelf: 'center'}}>
                    <Button
                        type="primary"
                        size="small"
                        style={{fontSize: '12px'}}
                        onClick={() => {
                            handleUpdate({title: t("update_Modal.add_title")});
                        }}>
                        {' '}
                        {t('monitoring.add_monitor')}
                    </Button>
                </Col>
            </Row>
            <Row>
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
                        <Input placeholder={t('monitoring.note_content')} />
                    </Form.Item>
                    <Form.Item name="recipient_email" preserve={false}>
                        <Input placeholder={t('monitoring.input_email')} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" color="#1754FF" htmlType="submit" style={{marginRight: '8px'}}>
                            {t('track_jobs.search')}
                        </Button>
                        <Button
                            onClick={() => {
                                onfinish(null);
                                form.resetFields();
                            }}
                            type="dashed"
                            color="#1747FF">
                            {t('track_jobs.reset')}
                        </Button>
                    </Form.Item>
                </Form>
            </Row>
            <MyTable
                data={data}
                columns={columnsConfig({t, handleUpdate, navigate, cancelMonitor, showDeleteConfirm})}
                pagination={{
                    defaultCurrent: 1,
                    total: total,
                    onChange: (page: number, pageSize: number) => {
                        setParams({page: page - 1, pageSize});
                    },
                }}
                loading={loading}></MyTable>
            {/* 添加/更新 */}
            <UpdateJK
                title={title}
                isRender={isRender}
                handleFunction={handleFunction}
                email={email}
                formItem={record}></UpdateJK>
        </div>
    );
}
