/** @format */

import React, {useState} from 'react';
import {Input, Select, Space, Button, message, notification} from 'antd';
import {LoadingOutlined, SearchOutlined, SmileOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {getAddressDisplay} from '../../../servers/api';
import {useNavigate} from 'react-router';
import {COINTYPELIST} from '../../../conf/conf';

function trim(str: any) {
    var str = str.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
}

const SearchHead = () => {
    const {t} = useTranslation();
    const [val, setval] = useState('');
    const [money, setmoney] = useState('FIL');
    const [loading, setLoading] = useState(false);
    const selects = (e: any) => {
        let selected = e.target.value;
        setval(selected);
    };
    const navigate = useNavigate();
    const searFun = (e: any) => {
        // console.log(money, val);
        setLoading(true);
        let str = trim(val)
        if (str) {
            getAddressDisplay({coin: money, address: str})
                .then(res => {
                    console.log(res);
                    if (res.ok) {
                        navigate(`/${money}/${str}`);
                    } else {
                        notification.open({
                            message: 'Error',
                            description: t('home.Check'),
                            icon: <SmileOutlined style={{color: '#ff4d4f'}} />,
                            style: {
                                backgroundColor: '#fff',
                            },
                        });
                    }
                    setLoading(false);
                })
                .catch(msg => {
                    notification.open({
                        message: 'Error',
                        description: '未匹配到相关地址',
                        icon: <SmileOutlined style={{color: '#ff4d4f'}} />,
                        style: {
                            backgroundColor: '#fff',
                        },
                    });
                    setLoading(false);
                });
        } else {
            notification.open({
                message: 'Error',
                description: t('Follow_address.Please_enter_the_address'),
                icon: <SmileOutlined style={{color: '#ff4d4f'}} />,
                style: {
                    backgroundColor: '#fff',
                },
            });
            setLoading(false);
        }

        // const ETH = /^(0x)?[0-9a-fA-F]{40}$/;
        // //搜索按钮
        // console.log(val);
        // if (val) {
        //     if (money) {
        //         if (!ETH.test(val)) {
        //             notification.open({
        //                 message: 'Error',
        //                 description: t('home.input_correct_address'),
        //                 icon: <SmileOutlined style={{color: '#108ee9'}} />,
        //                 style: {
        //                     backgroundColor: '#fff',
        //                 },
        //             });
        //         }
        //     } else {
        //         message.error({className: 'missage', content: t('home.choose_coin')});
        //     }
        // } else {
        //     message.error({className: 'missage', content: t('home.input_address')});
        // }
    };
    //下拉选项
    const funser = (value: any) => {
        setmoney(value);
        console.log(value);
    };

    const {Option} = Select;
    const selectBefore = (
        <Select defaultValue={'FIL'} className="select-before" onChange={funser} style={{color: '#000'}}>
            {COINTYPELIST.map(item => {
                return (
                    <Option value={item} key={item}>
                        {item}
                    </Option>
                );
            })}
        </Select>
    );
    return (
        <div className="search-container" style={{padding: '1.25rem'}}>
            <h2>{t('menubar.workspace')}</h2>
            <div style={{display: 'flex', justifyContent: 'center', padding: '1.25rem'}}>
                <Space direction="vertical" style={{width: '48.75rem'}}>
                    <Input.Group compact>
                        <Input
                            style={{
                                width: 'calc(100% - 12.5rem)',
                                marginRight: '1.6875rem',
                                height: '2.5rem',
                            }}
                            addonBefore={selectBefore}
                            placeholder={t('home.input_address')}
                            onChange={selects}
                        />
                        <Button
                            type="primary"
                            danger
                            icon={<SearchOutlined />}
                            style={{borderRadius: '.125rem', height: '2.5rem'}}
                            onClick={searFun}>
                            {t('home.search')}
                        </Button>
                        {loading ? (
                            <LoadingOutlined style={{fontSize: '1.5rem', marginLeft: '1rem', lineHeight: '2.5rem'}} />
                        ) : (
                            ''
                        )}
                    </Input.Group>
                </Space>
            </div>
        </div>
    );
};

export default SearchHead;
