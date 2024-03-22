import { Button, Col, Row, Tabs, Typography } from 'antd';

import "./index.less";
import { OAUTH } from '../../constant/Global';
import { getUser } from '../../servers/api';

export const Login = () => {

    const handleLoginWithGithub = () => {
        window.open(OAUTH, '_self')
    }
    return (
        <div style={{
            display: 'flex',
            backgroundColor: 'white',
            height: 'calc(100vh - 48px)',
            margin: -24,
            justifyContent: "center",
            background: 'url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png") center center no-repeat'
        }}>
            <Col span={17} style={{

            }} />

            <Col span={7} style={{
                backgroundColor: "#FFF",
                padding: "32px 16px",

            }}>
                <Row style={{
                    margin: '30% 0',
                    padding: '56px',
                    width: "100%"
                }} justify="center">

                    <Typography.Title style={{ fontSize: '32px' }}>SwiftOS 链分析平台</Typography.Title>
                    <Tabs
                        style={{ width: '100%' }}
                        centered
                        // TODO: Tab change events
                        activeKey={""}
                        onChange={() => { }}
                    >
                        <Tabs.TabPane key={'account'} tab={'Log In'} />
                        <Tabs.TabPane key={'phone'} tab={'Sign Up'} />
                    </Tabs>
                    <Row justify="center" style={{ rowGap: '8px', flexDirection: 'column', width: '100%' }}>
                        <Button className='loginb' onClick={handleLoginWithGithub}>
                            <img width={18} src="/assets/github.svg" alt="" />
                            <span>Sign with GitHub</span>
                        </Button>
                        <Row justify="center" >Or</Row>
                        <Button type="primary" >
                            Sign up With Email
                        </Button>
                    </Row>
                </Row>
            </Col>
        </div>
    );
};