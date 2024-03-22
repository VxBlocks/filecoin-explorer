import { Menu, MenuProps } from 'antd';

import '../public.less';
import Cookies from 'js-cookie';
import { LOGIN_IN_URL } from '../../constant/Global';
import { FC, useEffect } from 'react';
interface Account {
    username: string | undefined;
}
export const AccountMenu: FC<Account> = ({ username }) => {
    const handleOnClick: MenuProps['onClick'] = ({ key }) => {
        switch (key) {
            case 'logout':
                logout();
                break;
            case 'login':
                login();
                break;
        }
    };
    function login() {
        window.location.href = LOGIN_IN_URL;
    }
    function logout() {
        Cookies.remove('go_session_id');
        // TODO: 暂时去掉自动登录功能 —— 2023/07/25
        // window.location.href = LOGIN_IN_URL;
    }
    useEffect(() => { }, []);
    return (
        <Menu
            className={'css-navbar-drop-down'}
            onClick={handleOnClick}
            items={[
                username ? {
                    key: 'logout',
                    label: <span className={'css-navbar-drop_down'}>退出登录</span>,
                } : {
                    key: 'login',
                    label: <span className={'css-navbar-drop_down'}>登录</span>,
                },

                // {
                //     type: 'divider',
                // },
                // {
                //     key: "en",
                //     label: (
                //         <span className={'css-navbar-drop_down'}>English</span>
                //     )
                // },
            ]}
        />
    );
};
