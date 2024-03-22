import { Card, Col, Row, Skeleton, Tooltip } from 'antd';
import { px } from '../../../../../shared/px';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import {
    GlobalOutlined,
    LoadingOutlined,
    StarFilled,
    StarOutlined,
} from '@ant-design/icons';
import { DeleteAttention, getAttention, getWalletAddressTitleApi } from '../../../../../servers/api';
import TextArea from 'antd/lib/input/TextArea';
import copy from 'copy-to-clipboard';
import { ToolTip } from '../../../../../components/ToolTips';
import { FileBrowser } from '../../../../../conf/conf';
import { getLinkAddress } from '../../../../../utils/link-broswer';
///follow/eth/12
const uppercase = (text: any) => {
    return text.toUpperCase();
};

// 节流

// @ts-ignore

export const WalletAddressTitle = (props: any) => {
    let { wallet, address, type, img, isData } = props;
    wallet = uppercase(wallet);
    const { t } = useTranslation();
    const [isCollect, setIsCollect] = useState(true); //true 没收藏
    const [isLodding, setIsLodding] = useState(false);
    const [isLodding1, setIsLodding1] = useState(false);
    const [value, setValue] = useState('');

    useEffect(() => {
        getfunction({ coin: wallet, id: address });
    }, [isCollect]);

    const getfunction = (dataList: any) => {
        let { page = 0, pageSize = 1, coin = '', id = '', note_content = '' } = dataList;
        coin = uppercase(coin);
        getAttention({ page, pageSize, coin, id: address, note_content, state: 3 }).then(res => {
            // console.log(res, 'WalletAddressTitle');
            if (res.ok) {
                if (res.data.follow_address_list[0].state == 1) {
                    setIsCollect(false); // 收藏了
                    setValue(res.data.follow_address_list[0].note_content);
                } else {
                    setIsCollect(true); //   没收藏
                    setValue(res.data.follow_address_list[0].note_content);
                }
            }
        });
    };

    let timer = null as any;
    const collectfunction = () => {
        if (timer) {
            return;
        }
        //点击搜藏 如果是 isCollect = true 没搜藏 添加 搜藏了 删除
        timer = setTimeout(() => {
            if (isCollect) {
                setIsLodding(true);
                getWalletAddressTitleApi({ coin: wallet, id: address, note_content: value, state: 1 }).then(res => {
                    if (res.ok) {
                        setIsLodding(false);
                    }
                });
            } else {
                // 取消关注
                setIsLodding(true);
                getWalletAddressTitleApi({ coin: wallet, id: address, state: 0 }).then(res => {
                    if (res.ok) {
                        setIsLodding(false);
                    } else {
                        setTimeout(() => {
                            setIsLodding(false);
                        }, 1000);
                    }
                }).catch(() => {
                    setIsLodding(false);
                });
            }
            setIsCollect(!isCollect);
        }, 1000);
    };

    // let timer1 = null as any; // 定义一个全局的定时器对象变量
    function callback(e: any) {
        // clearTimeout(timer1); // 清除上一个定时器
        // timer1 = setTimeout(function () {
        let val = e.target.value;
        if (isCollect) {
            // 没收藏
            setIsLodding1(true);
            getWalletAddressTitleApi({ coin: wallet.toUpperCase(), id: address, note_content: val, state: 0 }).then(
                res => {
                    setIsLodding1(false);
                },
            );
        } else {
            setIsLodding1(true);
            // 收藏了
            getWalletAddressTitleApi({ coin: wallet.toUpperCase(), id: address, note_content: val, state: 1 }).then(
                res => {
                    setIsLodding1(false);
                },
            );
        }
        // }, 500);
    }

    return (
        <>
            <Card style={{ boxShadow: '5px 5px 10px #ccc', borderRadius: '8px' }}>
                {isData ? (
                    <Skeleton style={{ height: '10.5rem' }} />
                ) : (
                    <>
                        <div>{t('adr_details.address_detaile')}</div>
                        <div style={{ marginBottom: '2rem' }}></div>
                        <div style={{ width: '100%' }}>
                            <Row style={{
                                textAlign: 'center',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex' }}>
                                    <Col><img src={img} style={{ minWidth: px(60) }} /></Col>
                                    <Col style={{ paddingLeft: px(23) }}>
                                        <Row>{uppercase(wallet)}</Row>
                                        <Row>
                                            <span style={{ marginRight: '1rem', wordBreak: 'break-all' }}>{address}</span>
                                            <span > <Tooltip placement="top" title={t('tools.Copy_address')}>
                                                <a href="#"
                                                    style={{ color: '#000', marginRight: '.5rem' }}
                                                    onClick={() => { copy(address); ToolTip.success(t('Follow_address.Coloy')); }}>
                                                    <img src="/assets/icon_copy.svg" alt="" style={{ width: '1.125rem', marginBottom: '0.2rem' }} />
                                                </a>
                                            </Tooltip>
                                            </span>
                                            <span>
                                                <Tooltip placement="top" title={t('tools.Skip_to_block_browser')}>
                                                    <a href={`${getLinkAddress(wallet)}${address}`} target={'_blank'} style={{ color: '#000' }}>
                                                        <GlobalOutlined />
                                                    </a>
                                                </Tooltip>
                                            </span>
                                        </Row>
                                        <Row>
                                            {t('Follow_address.Switching')}:<img src={img} style={{ width: '1.5em' }} />
                                        </Row>
                                    </Col>
                                    <div>
                                        <Col push={4}>
                                            {t('adr_details.address_category')}:{t(`Follow_address.${type}`)}
                                        </Col>
                                    </div>
                                </div>

                                <div>
                                    <Col push={16}>
                                        <h3
                                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                            onClick={collectfunction}>
                                            {isCollect ? (
                                                <StarOutlined
                                                    style={{
                                                        color: '#1890ff',
                                                        width: '1em',
                                                        marginRight: '.3rem',
                                                        fontSize: '1.875rem',
                                                    }}
                                                />
                                            ) : (
                                                <StarFilled
                                                    style={{
                                                        color: '#1890ff',
                                                        width: '1em',
                                                        marginRight: '.3rem',
                                                        fontSize: '1.875rem',
                                                    }}
                                                />
                                            )}
                                            <span style={{ color: 'rgb(24, 144, 255)' }}>
                                                {t('menubar.favorite_address')}
                                            </span>
                                            <span style={{ marginLeft: '1rem' }}>
                                                {isLodding ? <LoadingOutlined /> : ''}
                                            </span>
                                        </h3>
                                        <div style={{ display: 'flex' }}>
                                            <TextArea
                                                disabled={isLodding1}
                                                rows={1}
                                                placeholder={value ? value : t('Follow_address.Please')}
                                                maxLength={20}
                                                onBlur={callback}
                                            />
                                            <span style={{ marginLeft: '1rem' }}>
                                                {isLodding1 ? <LoadingOutlined /> : ''}
                                            </span>
                                        </div>
                                    </Col>
                                </div>
                            </Row>
                        </div>
                    </>
                )}
            </Card>
        </>
    );
};
