import React, { ReactNode, useEffect, useRef, useState } from 'react';
import './index.less';
import { Button, Modal, Input, Checkbox, Form, Space, Select, message } from 'antd';
import { COINTYPELIST } from '../../conf/conf';
import { useTranslation } from 'react-i18next';
const { TextArea } = Input;
const { Option } = Select;

interface Params {
    coin?: string;
    address: string;
    recipient_email: string[];
    name: string;
}

interface Props {
    title: string; // 弹窗标题
    isRender: boolean; // 显示或关闭弹框
    email: string[]; // 邮箱地址
    handleFunction: (props: { form?: object; close?: boolean }) => void; // 处理函数
    formItem: Params;
}

interface CheckboxPramas {
    label: string | ReactNode;
    value: string;
}

/**
 *
 * @param props ：Props
 * @returns
 */
const TrackUpdate = (props: Props) => {
    const { t } = useTranslation();
    const formRef = React.createRef<any>();
    const { isRender, handleFunction, title, formItem } = props;
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [emailOptions, setEmailOptions] = useState<string[]>([]);
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        getUserEmail()
    }, [formItem, isRender]);
    // 设置邮箱数据
    const setEmail = (email: string[]) => {
        setEmailOptions(email);
        setCheckedList(email);
    };

    const getUserEmail = () => {
        const email = localStorage.getItem('user_email') as string;
        // 关闭弹框

        if (!isRender) {
            form1.resetFields();
        } else {
            // 更新时需要先填充
            const form = formRef.current;
            if (form && formItem) {
                // 填充表单
                form.setFieldsValue({
                    address: formItem.address,
                    coin: formItem.coin,
                    name: formItem.name,
                    recipient_email: formItem.recipient_email,
                });
                setEmail(formItem.recipient_email);
            } else {
                // 添加逻辑
                form1.resetFields();

                if (email) {
                    setEmail([email]);
                }

            }
        }
    }

    console.log(emailOptions);

    // 重复添加邮箱提示
    const warn = (props: string) => {
        message.warn(props, 1);
    };
    // 取消更改
    const close = () => {
        form1.resetFields();
        handleFunction({ close: false });
    };

    const onFinish = async (value: Params) => {
        // 交给父组件处理
        if (checkedList.length == 0) {
            warn(t('update_Modal.warn_email'));
            return;
        }
        let name = value?.name.trim();
        value = {
            ...value,
            name: name,
        } as Params;
        handleFunction({ form: { ...value, recipient_email: checkedList } });
    };
    const onchange = (list: any) => {
        setCheckedList(list);
    };
    const closeE = (bool: boolean) => {
        setOpen(bool);
        form2.resetFields();
    };
    // 展示添加的多个邮箱
    const onfinishE = (value: any) => {

        if (emailOptions.indexOf(value.email) != -1) {
            warn(t('update_Modal.warn_email_add'));
            return;
        }
        // emailOptions?.forEach((obj,index)=>{
        //   if(obj.value === value){
        //     warn(t('update_Modal.warn_email_add'));
        //     return;
        //   }
        // })
        setEmailOptions([value?.email, ...emailOptions]);
        closeE(false);
    };



    return (
        <div className="trackUpdate-container">
            {/* <Button type='primary' onClick={showModal}>点我弹出</Button> */}
            <Modal
                forceRender={true}
                className="trackUpdate-container"
                title={title}
                open={isRender}
                width={780}
                onCancel={close}
                footer={[<p key="tishi">*{t('update_Modal.notice')}</p>]}>
                <Form
                    ref={formRef}
                    name="basic"
                    labelCol={{ span: 6 }}
                    // wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                    form={form1}>
                    <Form.Item
                        label={t('menubar.monitor_address')}
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: `${t('update_Modal.msg_monitor')}`,
                            },
                        ]}
                        normalize={value => {
                            // console.log(value.trim());
                            return value.trim();
                        }}>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        label={t('track_jobs.coin')}
                        name="coin"
                        rules={[
                            {
                                required: true,
                                message: `${t('update_Modal.msg_coin')}`,
                            },
                        ]}>
                        <Select style={{ width: '200px' }} placeholder={t('home.choose_coin')}>
                            {COINTYPELIST.map(item => {
                                return (
                                    <Option value={item} key={item}>
                                        {item}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={
                            <div>
                                <span style={{ color: 'red' }}>*</span>
                                <span>{t('update_Modal.email_address')}</span>
                            </div>
                        } name="recipient_email">
                        <Space>
                            {/* FIXME: 问题未排查处理 */}
                            <Checkbox.Group
                                defaultValue={[emailOptions.length > 1 ? emailOptions[0] : ""]}
                                options={emailOptions}
                                onChange={onchange}
                            />
                            <Button
                                onClick={() => {
                                    closeE(true);
                                }}
                                type="link"
                                style={{ color: 'red' }}>
                                +{t('update_Modal.add_email')}
                            </Button>
                            <Modal
                                title={t('update_Modal.add_email')}
                                open={open}
                                onCancel={() => {
                                    closeE(false);
                                }}
                                footer={
                                    <Button
                                        onClick={() => {
                                            form2.submit();
                                        }}
                                        style={{ margin: '0 auto', textAlign: 'center' }}>
                                        {t('update_Modal.submit')}
                                    </Button>
                                }>
                                <Form onFinish={onfinishE} form={form2}>
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: `${t('update_Modal.msg_email_reg')}`,
                                                pattern:
                                                    /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                                            },
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </Space>
                    </Form.Item>
                    <Form.Item
                        label={t('update_Modal.monitor_content')}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入备注',
                            },
                        ]}>
                        <TextArea maxLength={120} rows={4} showCount style={{ resize: 'none' }}></TextArea>
                    </Form.Item>
                    <Form.Item className="btn">
                        <Button key="back" onClick={close}>
                            {t('dialog.cancel')}
                        </Button>
                        <Button htmlType="submit" type="primary" key="enter">
                            {t('dialog.confirm')}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TrackUpdate;
