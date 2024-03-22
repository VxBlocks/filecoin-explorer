import { TableRowSelection } from "antd/lib/table/interface"
import { TFunction } from "i18next"

import { Trades } from "../../../../../../../model/public-model"
import { EdgeList } from "../../../../../../../model/response-model"


export function txnSelection(t: TFunction, data: EdgeList[], handleSelectTrade: (nodeId: string, selected: boolean, isSeed?: boolean) => void, noCheckAddr?: string, isSeed?: boolean) {
    const getDefaultSelected = function () {
        const res: string[] = []
        data.forEach((item) => {
            res.push(item.address || "")
        })
        return res
    }
    return {
        columnTitle: t("track_jobs.choose"),
        columnWidth: '68px',
        preserveSelectedRowKeys: true,
        onChange: (selectedRowKeys: React.Key[], selectedRows: EdgeList[]) => {
        },
        onSelect: (record: any, selected: boolean) => {
            handleSelectTrade(record.id, selected, isSeed)
        },
        getCheckboxProps: (record: EdgeList) => ({
            disabled: record.address === noCheckAddr, // Column configuration not to be checked
            name: record.address,
        }),
        defaultSelectedRowKeys: getDefaultSelected(),
    }
}

