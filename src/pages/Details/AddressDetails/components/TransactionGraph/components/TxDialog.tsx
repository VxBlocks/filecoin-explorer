import { Modal } from "antd"
import { useTranslation } from "react-i18next"
import { EdgeList } from "../../../../../../model/response-model"
import { TransferDialog } from "./TransferDialog"

interface TxDialogProps {
    isOpen: boolean
    handleCancel: () => void
    edgeInfo: EdgeList
}
export const TxDialog = (props: TxDialogProps) => {
    const {isOpen, handleCancel, edgeInfo} = props
    const {t} = useTranslation()
    return (
        <Modal
        className='transfer-dialog'
        title={t("adr_details.trans_list")}
        open={isOpen}
        onCancel={handleCancel}
        centered={true}
        destroyOnClose={true}
        footer={null}
      >
        <TransferDialog data={edgeInfo} />
      </Modal>
    )
}