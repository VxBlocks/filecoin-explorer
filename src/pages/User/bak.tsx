import { LockOutlined, MobileOutlined, UserOutlined, } from '@ant-design/icons';
import { LoginFormPage, ProFormCaptcha, ProFormCheckbox, ProFormText, } from '@ant-design/pro-form';
import { Button, Form, message, Row, Tabs, Typography } from 'antd';
import { useState } from 'react';
import "./index.less"
type LoginType = 'phone' | 'account';

export const Login = () => {
    const [loginType, setLoginType] = useState<LoginType>('phone');
    return (
        <div style={{ backgroundColor: 'white', height: 'calc(100vh - 48px)', margin: -24 }}>
            <LoginFormPage
                backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
                title="SwiftOS链分析平台"
                subTitle=" "
                // activityConfig={{
                //     style: {
                //         boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
                //         color: '#fff',
                //         borderRadius: 8,
                //         backgroundColor: '#1677FF',
                //     },
                //     title: '活动标题，可配置图片',
                //     subTitle: '活动介绍说明文字',
                //     action: (
                //         <Button
                //             size="large"
                //             style={{
                //                 borderRadius: 20,
                //                 background: '#fff',
                //                 color: '#1677FF',
                //                 width: 120,
                //             }}
                //         >
                //             去看看
                //         </Button>
                //     ),
                // }}
                actions={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >

                    </div>
                }
            >
                <Tabs
                    centered
                    activeKey={loginType}
                    onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                >
                    <Tabs.TabPane key={'account'} tab={'Log In'} />
                    <Tabs.TabPane key={'phone'} tab={'Sign Up'} />
                </Tabs>
                {/* {loginType === 'account' && (
                    <>
                        <ProFormText
                            name="username"
                            fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined className={'prefixIcon'} />,
                            }}
                            placeholder={'用户名: admin or user'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'} />,
                            }}
                            placeholder={'密码: ant.design'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                        />
                    </>
                )}
                {loginType === 'phone' && (
                    <>
                        <ProFormText
                            fieldProps={{
                                size: 'large',
                                prefix: <MobileOutlined className={'prefixIcon'} />,
                            }}
                            name="mobile"
                            placeholder={'手机号'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入手机号！',
                                },
                                {
                                    pattern: /^1\d{10}$/,
                                    message: '手机号格式错误！',
                                },
                            ]}
                        />
                        <ProFormCaptcha
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'} />,
                            }}
                            captchaProps={{
                                size: 'large',
                            }}
                            placeholder={'请输入验证码'}
                            captchaTextRender={(timing, count) => {
                                if (timing) {
                                    return `${count} ${'获取验证码'}`;
                                }
                                return '获取验证码';
                            }}
                            name="captcha"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入验证码！',
                                },
                            ]}
                            onGetCaptcha={async () => {
                                message.success('获取验证码成功！验证码为：1234');
                            }}
                        />
                    </>
                )} */}
                <div
                    style={{
                        marginBlockEnd: 24,
                    }}
                >
                    {/* <ProFormCheckbox noStyle name="autoLogin">
                        自动登录
                    </ProFormCheckbox>
                    <Typography.Link
                        style={{
                            float: 'right',
                        }}
                    >
                        忘记密码
                    </Typography.Link> */}

                    <Button className='loginb'>
                        Sign with GitHub
                    </Button>

                </div>
                <Form.Item name="login" >
                    <Button type="primary" >
                        登录
                    </Button>
                </Form.Item>
            </LoginFormPage>
        </div>
    );
};