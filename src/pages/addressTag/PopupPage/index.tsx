import { Button, Checkbox, Form, Input, message, Modal, Select, Space } from 'antd';
import { title } from 'process';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PopupPage = (props: any) => {
    const { isModalOpen, handleOk, handleCancel, isResetFields } = props;
    const { t } = useTranslation();
    const formRef = React.createRef<any>();
    const [emailOptions, setEmailOptions] = useState<string[]>([]);
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const [open, setOpen] = useState(false);
    const email = localStorage.getItem('user_email');
    const closeE = (bool: boolean) => {
        setOpen(bool);
        form2.resetFields();
    };
    const onchange = (list: any) => {
        setCheckedList(list);
    };

    useEffect(() => {
        if (isResetFields) {
            form1.resetFields();
            form2.resetFields();
        }
        if (email) {
            setEmailOptions([email]);
            setCheckedList([email]);
        }

    }, [])

    const onFinish = async (value: object) => {
        // 交给父组件处理
        console.log(value);

        handleOk({ ...value, mail: checkedList });

    };
    const onfinishE = (value: any) => {
        setEmailOptions([value.email, ...emailOptions]);
        closeE(false);
    };
    const { Option } = Select;

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };
    return (
        <div className="trackUpdate-container">
            <Modal
                title={t('address_Tag.Add_address_marker')}
                className="trackUpdate-container"
                width={780}
                footer={[<p key="tishi">  {''}</p>]}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}>
                <Form onFinish={onFinish} form={form1} ref={formRef} {...formItemLayout}>
                    <Form.Item
                        label={t('track_jobs.Wallet_ddress')}
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: t('address_Tag.Please_enter') + t('track_jobs.Wallet_ddress'),
                            },
                        ]}>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item
                        label={t('track_jobs.coin')}
                        name="coin"
                        rules={[
                            {
                                required: true,
                                message: t('address_Tag.Please_select') + t('address_Tag.Currency_Type'),
                            },
                        ]}>
                        <Select style={{ width: '200px' }} placeholder={t('address_Tag.Please_select') + t('track_jobs.coin')}>
                            <Option value="FIL">FIL</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label={t("address_Tag.Wallet_alias")} name="alias">
                        <Input></Input>
                    </Form.Item>

                    <Form.Item
                        label={t('address_Tag.Wallet_Type')}
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: t('address_Tag.Please_enter') + t('address_Tag.Wallet_Type'),
                            },
                        ]}>
                        <Select style={{ width: '200px' }} placeholder={t('address_Tag.Please_select') + t('address_Tag.Wallet_Type')}>
                            <Option value={'黑客钱包'}>{'黑客钱包'}</Option>
                            <Option value={'流转钱包'}>{'流转钱包'}</Option>
                            <Option value={'私有钱包'}>{"私有钱包"}</Option>

                        </Select>
                    </Form.Item>
                    <Form.Item label={t('address_Tag.Wallet_Remarks')} name="notes">
                        <Input></Input>
                    </Form.Item>
                    {/* <Form.Item
                        label={t('address_Tag.Global_Monitoring')}
                        name="monitor"
                        rules={[
                            {
                                required: true,
                                message: t('address_Tag.Please_type'),
                            },
                        ]}>
                        <Select style={{ width: '200px' }} placeholder={t('address_Tag.Global_Monitoring')}>
                            <Option value={0}>{t('address_Tag.Not_monitored')}</Option>
                            <Option value={1}>{t('address_Tag.Under_surveillance')}</Option>
                        </Select>
                    </Form.Item> */}
                    {/* <Form.Item
                        label={t('address_Tag.Monitor_email_address')}
                        name="mail"
                        rules={[
                            {
                                required: true,
                                message: t('address_Tag.Please_enter') + t('address_Tag.Monitor_email_address'),
                            },
                        ]}>
                        <Space>
                            <Checkbox.Group options={emailOptions} onChange={onchange} />
                            <Button
                                onClick={() => {
                                    closeE(true);
                                }}
                                type="link"
                                style={{ color: 'red' }}>
                                + {t('address_Tag.Add_Email')}
                            </Button>
                            <Modal
                                title={t('address_Tag.Add_Email')}
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
                                        {t('address_Tag.Submit')}
                                    </Button>
                                }>
                                <Form onFinish={onfinishE} form={form2}>
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: t('address_Tag.email_format'),
                                                pattern:
                                                    /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                                            },
                                        ]}>
                                        <Input />
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </Space>
                    </Form.Item> */}
                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Button key="back" onClick={handleCancel}>
                            {t('dialog.cancel')}
                        </Button>
                        <Button htmlType="submit" type="primary" key="enter">
                            {t('dialog.confirm')}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default PopupPage;
