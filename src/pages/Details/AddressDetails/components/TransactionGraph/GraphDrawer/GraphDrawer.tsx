import {DownOutlined} from '@ant-design/icons';
import {Button, Card, Col, DatePicker, Drawer, Dropdown, Menu, MenuProps, Row, Skeleton} from 'antd';
import Table, {ColumnsType} from 'antd/lib/table';
import {TFunction} from 'i18next';
import moment, {Moment} from 'moment';
import copy from 'copy-to-clipboard';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Tabulation from '../../../../../../components/Tabulation';
import {GraphTransition, Trades} from '../../../../../../model/public-model';
import DateUtil from '../../../../../../utils/formatData';
import {DrawerSwitch} from './components/DrawerSwitch';
import '../../TransactionGraph/graph.less';
import EllipsisMiddle from '../../../../../../components/EllipsisMiddle';
import {ToolTip} from '../../../../../../components/ToolTips';
import {txnSelection} from './components/TxnRowSelecttion';
import TrackUpdate from '../../../../../../components/UpdataMonitor';
import {addMonitor} from '../../../../../../servers/api';
import {TableRowSelection} from 'antd/lib/table/interface';
import {useParams} from 'react-router';
import {TxDialog} from '../components/TxDialog';
import {EdgeList, NodeList} from '../../../../../../model/response-model';
import {GraphFactory, GraphTriggers} from '../../../../../../utils/graphDataFactor';
import dayjs from 'dayjs';
import type {RangePickerProps} from 'antd/es/date-picker/generatePicker';
import {getLinkAddress} from '../../../../../../utils/link-broswer';

const {RangePicker} = DatePicker;
const dateFormat = 'YYYY-MM-DD';

function tableConf(
    t: TFunction,
    coinType = '',
    isSend: boolean,
    handleAddMonitor: (addr: string) => void,
    handleOpenEdgeInfo: (edge: EdgeList) => void,
) {
    return [
        {
            title: isSend ? t('track_jobs.send_address') : t('track_jobs.receiving_address'),
            key: 'address',
            dataIndex: 'address',
            render: (address, record) => (
                <Row>
                    <div>
                        <a href={`/${coinType}/${address}`}>
                            <EllipsisMiddle suffixCount={7}>{address}</EllipsisMiddle>
                        </a>
                        <Row style={{alignItems: 'left', textAlign: 'left'}}>
                            <div style={{lineHeight: '16px', cursor: 'pointer'}}>
                                <img
                                    src={'/assets/icon_miaozhun.svg'}
                                    width={16}
                                    alt=""
                                    onClick={() => {
                                        handleAddMonitor(address);
                                    }}
                                />
                                <img
                                    src={'/assets/icon_copy.svg'}
                                    width={14}
                                    alt=""
                                    onClick={() => {
                                        copy(address);
                                        ToolTip.success(t('tools.copy_success'));
                                    }}
                                />
                                <a href={getLinkAddress(coinType) + address} target="_blank">
                                    <img src={'/assets/icon_share.svg'} width={14} alt="" />
                                </a>
                            </div>
                        </Row>
                    </div>
                </Row>
            ),
        },
        {
            title: t('track_jobs.number'),
            key: 'txn',
            dataIndex: 'txn',
            align: 'center',
            width: 68,
            render: (txn, record) => {
                return (
                    <span
                        className="drawer-transf-number"
                        onClick={() => {
                            handleOpenEdgeInfo(record);
                        }}>
                        {txn}
                    </span>
                );
            },
        },
        {
            title: t('track_jobs.amount') + `(${coinType})`,
            key: 'value',
            dataIndex: 'value',
            align: 'center',
            width: 168,
        },
    ] as ColumnsType<EdgeList>;
}

// 数据筛选---交易类型下拉菜单
const TransactionType = () => {
    const {t} = useTranslation();
    return [
        {
            label: t('select.all_txs'),
            key: 'trade',
        },
        {
            label: t('select.only_incoming'),
            key: 'income',
        },
        {
            label: t('select.only_outgoing'),
            key: 'expenditure',
        },
    ];
};

// 数据筛选---地址下拉菜单
const AddressType = () => {
    const {t} = useTranslation();
    return [
        {
            label: t('select.all_address'),
            key: 'allAddress',
        },
        {
            label: t('select.unknown_address'),
            key: 'normal',
        },
        {
            label: t('select.entity_address'),
            key: 'tag',
        },
    ];
};

/**
 * @interface
 * open: 打开抽屉开关
 * openDrawer： 抽屉开关方法
 * sendTable： 发送到监控地址的发送地址列表
 * recipientTable： 从监控地址转出去的地址列表
 * onFilter： 数据筛选过滤属性
 */
interface DrawerProps {
    open: boolean;
    openDrawer: () => void;
    onClickSearch: (currentAddr: string) => void;
    dateRange: {start: number; end: number};
    txDateRange?: {start: number; end: number};
    onChangeDateRanger: (dataStrings?: [string, string]) => void;
    onSelectTrade: (nodeId: string, selected: boolean, isSeed?: boolean) => void;
    factor: GraphFactory;
    txTrades: GraphTransition;
    onFilter: (transType: string, addressType: string) => void;
}
export const GraphDrawer = (props: DrawerProps) => {
    const {
        open,
        factor,
        dateRange,
        txDateRange,
        openDrawer,
        onChangeDateRanger,
        onClickSearch,
        onSelectTrade,
        txTrades,
        onFilter,
    } = props;
    const {t} = useTranslation();
    const {wallet, address} = useParams();
    // 抽屉交易类型和地址类型下拉菜单
    const transactionDropMenu = TransactionType();
    const addressDropMenu = AddressType();
    // 交易列表loading和对应数据hooks
    const [loadingTx, setLoadingTx] = useState(false);
    const [txList, setTxList] = useState({
        recipientTx: [] as TableRowSelection<EdgeList>,
        seedTx: [] as TableRowSelection<EdgeList>,
    });
    // 处理点击交易列表--交易数量时弹出框的hooks
    const [openEdgeDialog, setOpenEdgeDialog] = useState(false);
    const [oneEdge, setOneEdge] = useState({} as EdgeList);

    const [openAddMonitor, setOpenMonitor] = useState(false);
    // 添加监控时的地址
    const [monitorAddr, setMonitorAddr] = useState('');
    // TODO 邮箱方案未确定

    const [email, setEmail] = useState([localStorage.getItem('user_email') || '']);
    // 数据筛选
    const [dataFilter, setDataFilter] = useState({
        transactionType: transactionDropMenu[0],
        addressType: addressDropMenu[0],
    });
    // 添加监控请求
    const AddMonitor = async (props: object) => {
        const resp = await addMonitor(JSON.stringify(props));
        if (resp.ok) {
            ToolTip.success(t('tools.copy_success'));
            setOpenMonitor(false);
        } else {
            if (resp.msg == 'AddressInMonitoring') {
                ToolTip.error(t('monitoring.Monitored'));
            }
            if (resp.msg == 'InvalidAddress') {
                ToolTip.error(t('monitoring.addr_error'));
            }
        }
    };

    const handleAddMonitor = (props: {form?: object; close?: boolean}) => {
        const {form,close} = props;
        if (form) {
            AddMonitor(form);
        }
        if(close === false){
          setOpenMonitor(false);
        }

    };
    const handleOpenAddMonitor = (addr: string) => {
        setMonitorAddr(addr);
        setOpenMonitor(true);
    };

    const handleOpenEdgeInfo = (edge: EdgeList) => {
        setOpenEdgeDialog(true);
        const oneEdge = factor.getOneEdge(edge);
        setOneEdge(oneEdge);
    };
    // 处理切换地址类型或者交易类型的点击事件
    const handleMenuClick: MenuProps['onClick'] = e => {
        const res = {
            transType: dataFilter.transactionType.key,
            addressType: dataFilter.addressType.key,
        };
        transactionDropMenu.forEach(item => {
            if (item.key == e.key) {
                setDataFilter({...dataFilter, transactionType: item});
                res.transType = item.key;
            }
        });
        addressDropMenu.forEach(item => {
            if (item.key == e.key) {
                setDataFilter({...dataFilter, addressType: item});
                res.addressType = item.key;
            }
        });
        // 切换数据类型后外部拿到要筛选的数据类型
        onFilter(res.transType, res.addressType);
    };

    const handleCancel = () => {
        setOpenEdgeDialog(false);
    };
    // 交易类型下拉框菜单
    const transactionMenu = <Menu onClick={handleMenuClick} items={transactionDropMenu} />;
    // 地址类型下拉框菜单
    const addressMenu = <Menu onClick={handleMenuClick} items={addressDropMenu} />;
    // 只允许选择关注地址第一次发生交易日期和最后一次交易日期
    const disabledDate = (current: Moment) => {
        if (txDateRange) {
            const tooLate = moment(DateUtil.formatDate(txDateRange.start, 'yyyy-MM-dd'), dateFormat) > current;
            const tooEarly = moment(DateUtil.formatDate(txDateRange.end, 'yyyy-MM-dd'), dateFormat) < current;
            return tooEarly || tooLate;
        }
        return false;
    };
    useEffect(() => {
        // 双击节点时如果节点可向外扩展，那么对应更新抽屉的交易列表
        setLoadingTx(true);
        const currentNode = factor.data.source.node_list.find(n => n.id == txTrades.nodeId);
        if (currentNode) {
            const prev = GraphTriggers.getPreviousNode(currentNode, factor.data.source);
            if (prev) {
                const seedTx = txnSelection(t, txTrades.seed, onSelectTrade, prev.node?.address, true);
                const recipientTx = txnSelection(t, txTrades.receive, onSelectTrade, prev.node?.address, false);
                setTxList({
                    seedTx: seedTx,
                    recipientTx: recipientTx,
                });
            } else {
                setTxList({
                    seedTx: {},
                    recipientTx: {},
                });
            }
        }
        setTimeout(() => {
            setLoadingTx(false);
        }, 200);
    }, [txTrades]);
    useEffect(() => {
        factor.t = t;
        setDataFilter({
            transactionType: transactionDropMenu[0],
            addressType: addressDropMenu[0],
        });
        onFilter(transactionDropMenu[0].key, addressDropMenu[0].key);
    }, [t]);
    useEffect(() => {
        if (factor.data.source.edge_list) {
            setDataFilter({
                transactionType: transactionDropMenu[0],
                addressType: addressDropMenu[0],
            });
            onFilter(transactionDropMenu[0].key, addressDropMenu[0].key);
        }
    }, [factor.data.source]);
    return (
        <Drawer
            className="graph_drawer_expand"
            width={'435px'}
            // height={"600px"}
            placement="right"
            mask={false}
            closable={false}
            open={open}
            getContainer={false}
            style={{position: 'absolute'}}
            bodyStyle={{display: 'block', backgroundColor: '#f8f8f8', padding: '18px'}}
            headerStyle={{display: 'none'}}
            forceRender>
            {/* 抽屉开关 */}
            <DrawerSwitch open={open} openDrawer={openDrawer} />
            <Card style={{padding: 0, border: 'none'}} bodyStyle={{padding: '0', backgroundColor: '#f8f8f8'}}>
                <div className={'select-box'}>
                    <span>{t('track_jobs.time_screening')}</span>
                    <Row justify={'space-between'} style={{flexFlow: 'nowrap', marginBottom: '8px'}}>
                        <RangePicker
                            defaultValue={[
                                moment(DateUtil.formatDate(dateRange.start, 'yyyy-MM-dd'), dateFormat),
                                moment(DateUtil.formatDate(dateRange.end, 'yyyy-MM-dd'), dateFormat),
                            ]}
                            disabledDate={disabledDate}
                            format={dateFormat}
                            onChange={(datas, dataStrings) => {
                                onChangeDateRanger(dataStrings);
                            }}
                        />
                        <div className={'select-box'}>
                            <div />
                            <div>
                                <Button
                                    onClick={() => {
                                        onClickSearch(txTrades.address);
                                    }}
                                    className={'search_button'}>
                                    {t('track_jobs.search')}
                                </Button>
                            </div>
                        </div>
                    </Row>
                </div>

                <div className={'select-box'}>
                    <span>{t('track_jobs.data')}</span>
                    <Row justify={'space-between'} style={{flexFlow: 'nowrap'}}>
                        <Dropdown overlay={transactionMenu} className={'select-down'}>
                            <Button>
                                <span>
                                    {dataFilter.transactionType.label}
                                    <DownOutlined />
                                </span>
                            </Button>
                        </Dropdown>
                        <Dropdown overlay={addressMenu} className={'select-down-ml'}>
                            <Button>
                                <span>
                                    {dataFilter.addressType.label}
                                    <DownOutlined />
                                </span>
                            </Button>
                        </Dropdown>
                    </Row>
                </div>
            </Card>
            <Card
                className={'transaction'}
                style={{padding: 0, border: 'none'}}
                bodyStyle={{padding: '0', backgroundColor: '#f8f8f8'}}>
                <h2>{t('track_jobs.trading_analysis')}</h2>
                <Row className={'addr_monitor'}>
                    <Col span={17}>
                        <Skeleton
                            className="drawer-addr"
                            loading={txTrades.address === ''}
                            paragraph={false}
                            round={true}>
                            <span style={{maxWidth: '320px', wordWrap: 'break-word'}}>{txTrades.address}</span>
                        </Skeleton>
                    </Col>
                    <Col span={7} style={{textAlign: 'right'}}>
                        <Row justify="space-around">
                            <img
                                onClick={() => {
                                    copy(txTrades.address || '');
                                    ToolTip.success(t('tools.copy_success'));
                                }}
                                src={'/assets/icon_copy.svg'}
                                style={{margin: '0 2px', cursor: 'pointer'}}
                                width={20}
                                alt={'copy'}
                            />
                            <Button
                                className={'monitor_button'}
                                onClick={() => {
                                    handleOpenAddMonitor(txTrades.address || '');
                                }}>
                                {t('track_jobs.monitor')}
                            </Button>
                        </Row>
                    </Col>
                </Row>
                {/* 抽屉交易列表 */}
                <div>
                    {loadingTx ? (
                        <Table
                            className={'table'}
                            columns={tableConf(t, wallet, true, handleOpenAddMonitor, handleOpenEdgeInfo)}
                            loading={loadingTx}
                        />
                    ) : (
                        txTrades.seed.length > 0 && (
                            <Tabulation
                                loading={loadingTx}
                                rowSelection={txList.seedTx}
                                className={'table'}
                                rowKey={'address'}
                                isSmallPagination={true}
                                tableDataTypeConfig={tableConf(
                                    t,
                                    wallet,
                                    true,
                                    handleOpenAddMonitor,
                                    handleOpenEdgeInfo,
                                )}
                                dataSource={txTrades.seed}
                            />
                        )
                    )}
                </div>
                <div>
                    {txTrades.receive.length > 0 && loadingTx ? (
                        <Table
                            className={'table'}
                            columns={tableConf(t, wallet, true, handleOpenAddMonitor, handleOpenEdgeInfo)}
                            loading={loadingTx}
                        />
                    ) : (
                        txTrades.receive.length > 0 && (
                            <Tabulation
                                rowSelection={txList.recipientTx}
                                className={'table'}
                                rowKey={'address'}
                                isSmallPagination={true}
                                tableDataTypeConfig={tableConf(
                                    t,
                                    wallet,
                                    false,
                                    handleOpenAddMonitor,
                                    handleOpenEdgeInfo,
                                )}
                                dataSource={txTrades.receive}
                            />
                        )
                    )}
                </div>
            </Card>
            {/* 添加监控探出窗 */}
            <TrackUpdate
                title={t('dialog.add_monitor')}
                isRender={openAddMonitor}
                email={email}
                // TODO 还需要获取币种和邮箱
                formItem={{
                    coin: wallet,
                    address: monitorAddr,
                    recipient_email: email,
                    name: '',
                }}
                handleFunction={handleAddMonitor}
            />

            {/* 交易列表弹出框 */}
            <TxDialog isOpen={openEdgeDialog} handleCancel={handleCancel} edgeInfo={oneEdge} />
        </Drawer>
    );
};
