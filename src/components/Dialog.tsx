import { Modal } from "antd"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next";
import './public.less';

interface DialogProps {
    children: ReactNode
    open: boolean
    className?: string
    confirmLoading?: boolean
    title?: ReactNode
    okText?: ReactNode
    onCancel: () => void
    onOk: () => void
}
export const Dialog = (props: DialogProps) => {
    const { children, open,className, confirmLoading, title, okText, onCancel, onOk } = props
    const {t} = useTranslation()
    return (
        <Modal
            className={'dialog '+ className}
            title={title}
            open={open}
            okText={okText}
            cancelText={t("dialog.cancel")}
            onCancel={onCancel}
            centered={true}
            confirmLoading={confirmLoading != undefined ? confirmLoading : false}
            onOk={onOk}
        >
            {children}
        </Modal>
    )
}