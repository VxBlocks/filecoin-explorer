/**
 * 周雨芹
 * 2022/9/20
 */
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Row, Col, Input, Spin, Tooltip, InputRef, Skeleton } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import TransactionGraph from '../AddressDetails/components/TransactionGraph';
import DateUtil from '../../../utils/formatData';
import './index.less';
import { getSingleTrack, putTrack } from '../../../servers/api';
import copy from 'copy-to-clipboard';
import { ToolTip } from '../../../components/ToolTips';
import { useTranslation } from 'react-i18next';
import { getLinkAddress } from '../../../utils/link-broswer';
import { Dialog } from '../../../components/Dialog';
import { TrackInfo } from '../../../model/response-model';

const { formatDate } = DateUtil;
const { TextArea } = Input;

export default function TrackDetail() {
    const {
        state: { id },
    } = useLocation();
    const { t } = useTranslation()
    const [data, setData] = useState({} as TrackInfo)
    const [loading, setLoading] = useState(false);
    const [changeLoading, setChangeLoading] = useState(false)
    const [isRename, setRename] = useState({ status: false, value: "" })
    const [noteValue, setNoteValue] = useState("")
    const textAreaRef = useRef<InputRef>(null);
    const graphRef = useRef<any>();

    // 获取追踪任务
    const getTrack = () => {
        setLoading(true)
        getSingleTrack(id).then((resp) => {
            if (resp.ok) {
                setData(resp.data)
                setNoteValue(resp.data.note)
            }
            setLoading(false)
        })
    }
    // 更新追踪任务名称或追踪笔记
    const updateTrack = (content: string, isNote?: boolean) => {
        setChangeLoading(true)
        let d = '';
        if (isNote) {
            d = JSON.stringify({ id: id, note: content })
        } else {
            d = JSON.stringify({ id: id, name: content })
        }
        putTrack(d).then((resp) => {
            if (resp.ok) {
                setRename({ ...isRename, status: false })
                setChangeLoading(false)
                getTrack()
            }
        })
    }
    // 处理修改追踪名称
    const handleRenameChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setRename({ ...isRename, value: evt.target.value })
    }
    // 修改追踪笔记
    const handleReNoteChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
        setNoteValue(evt.target.value)
    }
    useEffect(() => {
        getTrack()
    }, [])

    useEffect(() => {
        if (graphRef.current) {
            graphRef.current.scrollTop = 20 + 'px';
        }
    }, [graphRef]);
    return (
        <div className="TrackDetail-container">
            {/* 标题 */}
            <Row className="bottomBorder" align="middle" style={{display:'flex',justifyContent:'space-between'}}>
                <Col>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>{t("track_detail.title")}</h2>
                </Col>
                <Col>
                    <span className="title">{t("menubar.slogan")}</span>
                </Col>
            </Row>
            <div className="TrackDetail-main">
                {/* 详细信息 */}
                <div className="detail">
                    {loading ?
                        <Skeleton avatar paragraph={{ rows: 3 }} /> :
                        <>
                            <Row align="middle">
                                <Col style={{ marginRight: '8px' }}>
                                    <img className="left-img" src={'/assets/filcoin.svg'} alt="" />
                                </Col>
                                <Col span={21}>
                                    <Row>
                                        <Col>
                                            {data.name}
                                        </Col>
                                        <Col onClick={() => { setRename({ ...isRename, status: true }) }}>
                                            <img src={"/assets/icon_change.svg"} style={{ width: '14px', marginLeft: '4px' }} />
                                        </Col>
                                    </Row>
                                    <Row style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <Col style={{ flex: '0 1' }}>{data.address}</Col>
                                        <Col style={{ flex: '1 1' }}>
                                            <Tooltip title="复制">
                                                <i className="iconfont icon-fuzhi" onClick={() => {
                                                    copy(data.address)
                                                    ToolTip.success(t("tools.copy_success"))
                                                }}></i>
                                            </Tooltip>
                                            <Tooltip title="打开区块链浏览器">
                                                <a href={getLinkAddress(data.coin) + data.address} target="_blank" style={{ color: "inherit" }}>
                                                    <i className="iconfont icon-zhuanfa"></i>
                                                </a>
                                            </Tooltip>
                                            {/* <i className="iconfont icon-wangluo"></i> */}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <span style={{ color: '#999' }}>
                                            {formatDate(data.creation_time, 'yyyy-MM-dd HH:mm:ss') + '(UTC+8)'}
                                        </span>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Link to={{ pathname: `/${data.coin}/${data.address}` }}>{t("track_detail.view_details")}</Link>
                                </Col>
                            </Row>
                        </>
                    }
                </div>
                {/* 追踪笔记 */}
                <div className="note">
                    {loading ?
                        <Skeleton active={loading} paragraph={{ rows: 4 }} /> :
                        <>
                            <Row>
                                <Col span={24} style={{ padding: '10px' }}>
                                    <span style={{ fontWeight: 500 }}>{t("track_detail.track_notes")}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <TextArea
                                        ref={textAreaRef}
                                        defaultValue={noteValue}
                                        placeholder="请输入..."
                                        rows={6}
                                        onChange={handleReNoteChange}
                                        maxLength={480}
                                        showCount
                                        value={noteValue}
                                        onBlur={() => {
                                            updateTrack(noteValue, true)
                                        }}
                                    />
                                </Col>
                            </Row>
                        </>
                    }
                </div>
                <Dialog
                    className=''
                    title='修改追踪名称'
                    open={isRename.status}
                    onOk={() => {
                        updateTrack(isRename.value)
                    }}
                    confirmLoading={changeLoading}
                    okText={"更新"}
                    onCancel={() => { setRename({ ...isRename, status: false }) }}
                >
                    <p>
                        <em>*</em>
                        追踪名称
                    </p>
                    <Input
                        allowClear
                        defaultValue={data.name}
                        value={isRename.value}
                        onChange={handleRenameChange}
                    />
                </Dialog>
                {/* 交易图谱 */}
                {data.track_graph_id &&
                    <div ref={graphRef}>
                        <TransactionGraph graphId={data.track_graph_id} longAddr={data.address} coinType={data.coin} />
                    </div>
                }

            </div>

        </div>
    );
}
