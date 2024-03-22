import { EdgeList, NodeList, TxHash } from "./response-model";

export interface TableDataType {
    key: React.Key;
    address: string;
    count: number;
    cost: string;
}

// 交易图谱接收或发送地址表格数据类型
export interface Trades {
    // select: boolean
    id: string
    address: string;
    txn: number;
    target: string | undefined;
    tx_hash_list?: TxHash[]
    value?: string;
}

export interface SaveGraph {
    track_graph_id?: string | undefined
    address_first_tx_datetime: string;
    address_latest_tx_datetime: string;
    graph_dic: GraphInfo;
}
export interface GraphInfo {
    node_list: GraphNode[];
    edge_list: GraphEdge[];
    tx_count: number;
    first_tx_datetime: string;
    latest_tx_datetime: string;
    address_first_tx_datetime: string;
    address_latest_tx_datetime: string;
}
export interface GraphNode {
    id: string;
    exg: number;
    title: string;
    address: string;
    label: string;
    shape: string;
    layer: number;
    image: string;
    expanded: boolean;
    malicious: number;
}

export interface GraphEdge {
    from: string;
    to: string;
    tx_hash_list: GraphTxHash[];
}

export interface GraphTxHash {
    time_stamp?: number;
    value?: string;
    hash?: string;
}
// 交易列表字段
export interface GraphTransition {
    address: string
    nodeId: string
    seed: EdgeList[]
    receive: EdgeList[]
}


// 获取保存的交易图谱数据时返回的结构体
export interface GraphSaveData {
    track_graph_id: string
    monitoring_id:string
    address: string
    graph_dic: GraphDic
    address_first_tx_datetime: string
    address_latest_tx_datetime: string
}

export interface GraphDic {
    node_list: NodeList[]
    edge_list: EdgeList[]
    first_tx_datetime: string
    latest_tx_datetime: string
    address_first_tx_datetime: string
    address_latest_tx_datetime: string
    count: number

}