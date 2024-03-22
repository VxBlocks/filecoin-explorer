export interface TrackGraph {
    node_list: NodeList[];
    edge_list: EdgeList[];
}
export interface UserInfoData {
    avatar: string;
    banned_until: string;
    created_at: string;
    email: string;
    groups: string;
    id: string;
    name: string;
    origin: string;
}
/**
 * 节点数据类型
 */
export interface NodeList {
    id: string;
    bakId?: string;
    address?: string;
    title?: string;
    label?: string;
    shape: string | undefined;
    color?: string;
    layer?: number;
    level?: number;
    exg?: number;
    malicious?: number;
    image?: string;
    expanded?: boolean;
}
/**
 * 边数据类型
 */
export interface EdgeList {
    from: string;
    to: string;
    id?: string;
    label?: string;
    width?: number;
    address?: string;
    txn?: number;
    value?: string;
    tx_hash?: TxHash;
    tx_hash_list?: TxHash[];
    time_stamp?: number;
    smooth?: Smooth;
}

interface Smooth {
    enabled: boolean;
    type?: string;
    roundness?: number;
}
export interface TxHash {
    hash?: string;
    time_stamp?: number;
    value?: string;
}
export interface Attention {
    follow_address_list: follow_address_list[];
    current_page: number;
    page_count: number;
    total_count: number;
    total_page: number;
}

export interface follow_address_list {
    id: string;
    address: string;
    note_content: string;
    coin: string;
    _id: string;
    time: string;
}

export interface monitor {
    total_count: number;
    monitor_address_list: address_list;
}

export interface address_list {
    id: string;
    address: string;
    coin: string;
    name: string;
    recipient_email?: string | undefined;
    monitor_status: number;
}

export interface transfer {
    total_count: number;
    MonitorTransferList: transferList[];
}

export interface transferList {
    record_id: number;
    add_time: string;
    from_address: string;
    from_address_label: string;
    to_address: string;
    to_address_label: string;
    amount: number;
    tx_hash: string;
    monitor_address: string;
    note_content: string;
    coin: string;
    read_status: boolean;
}
export interface TrcktaskList {
    id: string;
    address: string;
    coin: string;
    name: string;
}

/**
 * 地址交易行为分析
 */
export interface ActionAnalysis {
    expenditure: number; // 支出
    income: number; // 收入
}

export interface AddressDetailsList {
    type: string;
    balance: string;
    tx_count: number;
    first_tx_time: number;
    last_tx_time: number;
    total_received: number;
    total_spent?: any;
    received_count: number;
    spent_count: number;
}
export interface AddressTagList {
    _id: string;
    userid: string;
    address: string;
    id: string;
    alias: string;
    coin: string;
    create_time: number;
    notes: string;
    monitor: number;
    type: string;
}


export interface TrackTask {
    count: number;
    get_tracktask: TrackInfo[]
}

export interface TrackInfo {
    id: string;
    track_graph_id: string;
    address: string;
    coin: string;
    owner: string;
    name: string;
    note: string;
    share_status: false;
    creation_time: string;
}