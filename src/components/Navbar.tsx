import { Col, Dropdown, Layout, Menu, MenuProps, Row, Space } from 'antd';
import React, { useEffect } from 'react';
import './public.less';
import CheckImage from './CheckImage';
import { LanguageMenu } from './Menu/LanguageMenu';
import { useNavigate } from 'react-router';
import { useUserInfoState } from '../Hooks/UserInfo';
import { AccountMenu } from './Menu/AccountMenu';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const Navbar = () => {
    const [userInfo, userState] = useUserInfoState();

    const navigate = useNavigate()



    useEffect(() => {
        userState();
    }, []);

    useEffect(() => {
        if (userInfo && userInfo.data) {
            localStorage.setItem("user_email", userInfo.data.email)
        }
    }, [userInfo])

    return (
        <Header className="navbar">
            <div className="logo" style={{ cursor: "pointer" }} onClick={() => {
                navigate("/")
            }}>
                <img src={'/assets/s_imfil_icon.png'} width={92} height={32} alt={'StorSwift'} />
            </div>
            <Row>
                <Col style={{ marginRight: '32px' }}>
                    <Link to="/AddressTag">
                        <CheckImage
                            defImage={<img src={'/assets/shuqian.svg'} width={26} height={36} alt={''} />}
                            checkImage={<img src={'/assets/shuqian-h.svg'} width={26} height={36} alt={''} />}
                        />
                    </Link>
                </Col>
                <Col style={{ marginRight: '32px', cursor: 'pointer' }}>
                    <Dropdown overlay={<AccountMenu username={userInfo?.data.name}/>} arrow autoFocus={true}>
                        <Col>
                            <CheckImage
                                defImage={<img src={'/assets/yonghu.svg'} width={26} height={36} alt={''} />}
                                checkImage={<img src={'/assets/yonghu-h.svg'} width={26} height={36} alt={''} />}
                            />
                            <span
                                style={{
                                    color: '#fff',
                                    fontSize: '16px',
                                    paddingLeft: '8px',
                                }} >
                                {userInfo?.data.name}
                            </span>
                        </Col>
                    </Dropdown>
                </Col>
                <Col>
                    <Dropdown overlay={<LanguageMenu />} arrow autoFocus={true}>
                        <a onClick={e => e.preventDefault()}>
                            <Space>
                                <img src={'/assets/translation.jpg'} width={24} height={24} alt={'language'} />
                            </Space>
                        </a>
                    </Dropdown>
                </Col>
            </Row>
        </Header>
    );
};

export default Navbar;
