import { Row, Space, Table } from "antd"
import { ColumnsType } from "antd/lib/table"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import EllipsisMiddle from "../../../../../../components/EllipsisMiddle"
import { EdgeList } from "../../../../../../model/response-model"
import { transFil } from "../../../../../../utils/convert-coin-unit"
import DateUtil from "../../../../../../utils/formatData"
import copy from 'copy-to-clipboard';
import { ToolTip } from "../../../../../../components/ToolTips"
import { useParams } from "react-router"
import { getLinkAddress } from "../../../../../../utils/link-broswer"
import { Link } from "react-router-dom"

interface CsProps {
    copyStr: string
    addrType?: string
}
const CopyOrShare = (props: CsProps) => {
    const { copyStr, addrType } = props
    const { t } = useTranslation()
    const { _, wallet } = useParams()
    return (
        <Row style={{ marginLeft: '6px' }}>
            <Space size={2}>
                <img src="/assets/icon_copy.svg" width={18} onClick={() => {
                    copy(copyStr)
                    ToolTip.success(t("tools.copy_success"))
                }} />
                <a href={getLinkAddress(wallet || "") + copyStr} target={"_blank"}>
                    <img src="/assets/icon_share.svg" width={16} />
                </a>
            </Space>
        </Row>
    )
}

interface DataType {
    timestamp: number
    fromAddr: string
    toAddr: string
    amount: number
    hash: string
}
const ColumnsConf = () => {
    const { t } = useTranslation()
    const { wallet, _ } = useParams()
    return [
        {
            title: t("Alerts.Trading_Hours"),
            dataIndex: "timestamp",
            key: "timestamp",
            width: 178,
            render: timestamp => <div>{DateUtil.formatDate(timestamp, "yyyy-MM-dd HH:mm:ss")}</div>
        },
        {
            title: t("track_jobs.send_address"),
            dataIndex: "fromAddr",
            key: "fromAddr",
            width: 230,
            render: fromAddr =>
                <a href={`/${wallet}/${fromAddr}`}>
                    <EllipsisMiddle suffixCount={8}>{fromAddr}</EllipsisMiddle>
                </a>

        },
        {
            title: t("track_jobs.receiving_address"),
            dataIndex: "toAddr",
            key: "toAddr",
            width: 230,
            render: toAddr =>
                <a href={`/${wallet}/${toAddr}`} target={"_self"}>
                    <EllipsisMiddle suffixCount={8}>{toAddr}</EllipsisMiddle>
                </a>

        },
        {
            title: t("track_jobs.amount") + `(${wallet})`,
            dataIndex: "amount",
            key: "amount",
            width: 168,
            render: amount => <div>{transFil(amount).toFixed(2)}</div>
        },
        {
            title: t("track_jobs.transactions_hash"),
            dataIndex: "hash",
            key: "hash",
            width: 230,
            render: hash => <Row>
                <EllipsisMiddle suffixCount={8}>{hash}</EllipsisMiddle>
                <CopyOrShare copyStr={hash} />
            </Row>
        }
    ] as ColumnsType<DataType>
}

interface TransProps {
    data: EdgeList
}
export const TransferDialog = (props: TransProps) => {
    const { data } = props
    const [dataSource, setData] = useState([] as DataType[])
    useEffect(() => {
        const netData: DataType[] = []

        if (data.tx_hash_list) {
            data.tx_hash_list.sort((a, b) => (b.time_stamp || 0) - (a.time_stamp || 0))
            data.tx_hash_list.forEach((tx) => {
                netData.push({
                    timestamp: tx.time_stamp || 0,
                    fromAddr: data.from,
                    toAddr: data.to,
                    amount: Number(tx.value) || 0,
                    hash: tx.hash || ""
                })
            })
        }
        setData(netData)
    }, [data])
    return (
        <>
            <Table
                rowKey={"timestamp"}
                columns={ColumnsConf()}
                dataSource={dataSource}
                pagination={{ position: ["bottomLeft"], pageSize: 8, total: dataSource.length }} />
        </>
    )
}