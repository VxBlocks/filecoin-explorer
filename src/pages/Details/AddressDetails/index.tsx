import { useNavigate, useParams } from 'react-router';

import { Layout, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { EchartPie } from './components/BehaviorAnalysis/EchartPie';
import { EchartNormal } from './components/BehaviorAnalysis/EchartNormal';
import { WalletAddressTitle } from './components/BehaviorAnalysis/WalletAddressTitle';
import { OverviewAndComment } from './components/BehaviorAnalysis/OverviewAndComment';
import TransactionGraph from './components/TransactionGraph';
import { getAddressDisplay, getEchartNormalApi } from '../../../servers/api';
import { AddressDetailsList } from '../../../model/response-model';
import { data } from 'vis-network';

export const AddressDetails = () => {
    // console.log(useParams(),'123');

    const { wallet, address } = useParams();
    const [infData, setInfData] = useState({} as AddressDetailsList);
    const [isData, setisData] = useState(false);
    const [img, setImg] = useState('');
    const [list, setlist] = useState([] as any);
    const [isEchartNormal, setEchartNormal] = useState(false);
    const navigate = useNavigate();
    const getApifunction = () => {
        setisData(true);
        setEchartNormal(true);
        getAddressDisplay({ coin: wallet, address: address })
            .then(res => {
                if (res.ok) {
                    setisData(false);
                    // console.log(res.data, 'AddressDetails');
                    const data = res.data as AddressDetailsList;
                    
                    setInfData(data);
                    getEchartNormalApi({ address })
                        .then(res => {
                            //交易时间分析
                            // console.log(res.data);
                            if (res.ok) {
                                setlist(res.data);
                                setEchartNormal(false);
                            } else {
                                setEchartNormal(false);
                            }
                        })
                        .catch(() => {
                            setEchartNormal(false);
                        });
                } else {
                    message.warning('该地址暂无数据,即将返回', 2);
                    setisData(true);
                    setTimeout(() => {
                        navigate('/');
                    }, 1000);
                }
            })
            .catch(() => {
                message.warning('该地址暂无数据,即将返回', 2);
                setisData(true);
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            });
    };
    useEffect(() => {
        getApifunction();
        if (wallet) {
            if (wallet.toUpperCase() == 'FIL') {
                setImg('/assets/filcoin.svg');
            } else if (wallet.toUpperCase() == 'ETH') {
                setImg('/assets/etc.png');
            }
        }
    }, [wallet]);

    return (
        <>
            <div className="textConter">
                <Layout>
                    {/*钱包地址 Title*/}
                    <WalletAddressTitle
                        wallet={wallet}
                        address={address}
                        type={infData.type}
                        img={img}
                        isData={isData}
                    />
                    <Layout>
                        <hr />
                        {/*地址概览、风评评分*/}
                        <OverviewAndComment isData={isData} infData={infData} wallet={wallet} />
                        <hr />
                        {/*交易行为分析*/}
                        <EchartPie wallet={wallet} address={address} isData={isData} />
                        <hr />
                        {/*交易时间分析*/}
                        <EchartNormal list={list} isEchartNormal={isEchartNormal} />
                    </Layout>
                </Layout>
                <br />
                {infData.first_tx_time ? <TransactionGraph longAddr={address || ""} coinType={wallet || ""} txDateRange={{ start: infData.first_tx_time, end: infData.last_tx_time }} /> : ""}
                {/* <TransactionGraph longAddr={address || ""} coinType={wallet || ""} txDateRange={{ start: 1662566400, end: 1675062035 }} /> */}
            </div>
        </>
    );
};
