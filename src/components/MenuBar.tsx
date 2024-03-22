import {Layout, Menu, MenuProps} from 'antd';
import React, {useState} from 'react';
import './public.less';
import {MenuItem} from './MenuBar/MenuItem';
import {useNavigate} from 'react-router';
import {useTranslation} from "react-i18next";

const {Sider} = Layout;

const MenuBar = () => {
    const {t} = useTranslation()
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    return (
        <Sider
            width={240}
            className="site-layout-background"
            theme='light'
            collapsible
            collapsed={collapsed}
            onCollapse={value => setCollapsed(value)}
        >
            <div className={'menubar_title'}>
                <span> {t("menubar.slogan")}</span>
            </div>
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{height: 'calc(100% - 96px)', borderRight: 0, flex: 'auto'}}
                items={MenuItem()}
                onClick={({key}) => {
                    navigate(key);
                }}
            />
        </Sider>
    );
};

export default MenuBar;
