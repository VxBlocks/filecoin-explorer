
import base64 from "base-64";
import { TFunction } from "react-i18next";
import { DataSet, Edge } from "vis-network/standalone";
import { ToolTip } from "../components/ToolTips";
import { EdgeList, NodeList, TrackGraph, TxHash } from "../model/response-model";
import { MAXNODE } from "../pages/Details/AddressDetails/components/TransactionGraph/GraphCanvas/conf/graph-config";
import { isHasFixed, transFil } from "./convert-coin-unit";
/**
 * @description: 图谱数据工厂，根据需求将数据进行各种转换
 * @return {*}
 */
export class GraphFactory {
    data: { source: TrackGraph, view: TrackGraph };
    findNodeId: string[]
    findEdgeId: string[]
    cancelViewSet: Map<string, { node: NodeList[], edge: EdgeList[] }>
    tradeAddress: string;
    t: TFunction;
    coinType?: string
    constructor(data: { source: TrackGraph, view: TrackGraph }, tradeAddress: string, coinType: string | undefined, t: TFunction) {
        this.data = data
        this.tradeAddress = tradeAddress
        this.cancelViewSet = new Map()
        this.findNodeId = []
        this.findEdgeId = []
        this.t = t
        this.coinType = coinType
    }
    /**
     * @description: 获取发送方地址列表和接收方地址列表的逻辑代码
     * @param {TrackGraph} data 进行交易分析的地址，通过该地址查出与该地址关联的发送方地址和接收方地址
     * @param {string | undefined} currentID 当前在抽屉的交易分析中的节点id
     * @return {*}  发送方地址列表， 接收方地址列表
     */
    static getTransactionList(data: TrackGraph, currentID: string | undefined) {
        const seed = [] as EdgeList[]
        const receive = [] as EdgeList[]
        if (currentID) {
            data.edge_list.forEach((item) => {
                // 发送方逻辑  
                if (item.to == currentID && !seed.find((e) => e.id == item.from)) {
                    const value = transFil(this.prototype._getTransferAmount(item.tx_hash_list))
                    const seedAddr = data.node_list.find((node) => node.id == item.from)
                    seed.push({
                        id: item.from,
                        address: seedAddr?.address || item.from,
                        txn: (item.tx_hash_list as TxHash[]).length,
                        tx_hash_list: item.tx_hash_list,
                        value: value.toFixed(isHasFixed(value) ? 2 : 0),
                        from: item.from,
                        to: item.to
                    })
                } else if (item.from == currentID) {
                    const value = transFil(this.prototype._getTransferAmount(item.tx_hash_list))
                    const receiveAddr = data.node_list.find((node) => node.id == item.to)
                    receive.push({
                        id: item.to,
                        address: receiveAddr?.address || item.to,
                        txn: (item.tx_hash_list as TxHash[]).length,
                        tx_hash_list: item.tx_hash_list,
                        value: value.toFixed(isHasFixed(value) ? 2 : 0),
                        from: item.from,
                        to: item.to
                    })
                }
            })
        }
        return { seedList: seed, receiveList: receive }
    }

    /**
     * @description: 将视图数据再次加工为绘制图谱时需要的数据
     * @param {TrackGraph} data
     * @return {*}
     */
    getVisNetWork() {
        const viewNodes = [] as NodeList[]
        const viewEdges = [] as EdgeList[]
        this.data.view.node_list.forEach((item) => {
            viewNodes.push({
                id: item.id,
                title: item.title,
                label: this._ellipsisMiddle(item.address) + (item.label && item.label != "" ? `\n< ${item.label} >` || "" : ""),
                // label: this._ellipsisMiddle(item.address) + (item.label && item.label != "" ? `\n< ${item.label} >` || "" : "") + `\n${item.id}`,
                shape: item.address == this.tradeAddress ? "star" : "dot",
                level: item.layer,
            })
        })

        // 循环所有边数据
        this.data.view.edge_list.forEach((item) => {
            const findEdge = this.data.view.edge_list.find((edge) => edge.from == item.to && edge.to == item.from)
            viewEdges.push({
                to: item.to,
                from: item.from,
                label: transFil(this._getTransferAmount(item.tx_hash_list)).toFixed(3) + this.coinType,
                width: (item.tx_hash_list || []).length > 1.5 ? 3 : 1,
                smooth: findEdge ? {
                    enabled: true,
                    type: "curvedCW",
                    roundness: 0.15,
                } : { enabled: false }
            })
        })
        const nodes = new DataSet(viewNodes)
        const edges = new DataSet(viewEdges as Edge[])
        return { data: { nodes: nodes, edges: edges }, edgeList: viewEdges }
    }
    /**
     * @description: 双击节点后发送请求返回了新的边数据，需要去重整合边数据
     * @param {EdgeList} sourceEdge
     * @return {*}
     */
    getExpEdgeList(sourceEdge: EdgeList[], previousEdge: EdgeList, update?: boolean) {
        const newEdge = [] as EdgeList[]
        const edgeList = this._getEdgeList(sourceEdge)
        // 将上一级边数据去除
        edgeList.forEach((item) => {
            // 找到结构相同的边时只保留一个边，去除图表已有的边数据
            const findRes = this.data.source.edge_list.find((edge) => JSON.stringify(item.tx_hash_list) == JSON.stringify(edge.tx_hash_list))
            if (JSON.stringify(item.tx_hash_list) != JSON.stringify(previousEdge.tx_hash_list) && !findRes || update) {
                newEdge.push(item)
            }
        })
        return newEdge
    }
    /**
     * @description: 获取单个边的交易记录
     * @param {EdgeList} edge
     * @return {*}
     */
    getOneEdge(edge: EdgeList) {
        let res = {} as EdgeList
        const fromNode = this.data.source.node_list.find((node) => node.id == edge.from)
        const toNode = this.data.source.node_list.find((node) => node.id == edge.to)
        if (fromNode && toNode) {
            const edgeData = this.data.source.edge_list.find((edge) => edge.from == fromNode.id && edge.to == toNode.id)
            if (edgeData) {
                res = {
                    from: fromNode.address || "",
                    to: toNode.address || "",
                    tx_hash_list: edgeData.tx_hash_list
                }
            }
        }
        return res
    }
    /**
     * @description: 计算新增节点在图谱层次中的级别并且将扩展节点的已经出现过切无意义的节点移除
     * @param {number} level  双击节点时对应节点的level
     * @param {NodeList} sourceNode 请求数据后的node列表
     * @return {*}
     */
    getExpNodeLayer(currentNode: NodeList, previousNode: NodeList | undefined, expNode: NodeList[], expEdge: EdgeList[], update?: boolean) {
        const currentLayer = currentNode.layer || 0
        const newNodeList: NodeList[] = []
        if (currentLayer == 0 && !update) {
            return newNodeList
        }
        expNode.forEach((item) => {
            // 因为上级节点和当前节点的层级已经确认， 这里把他们去除
            // 如果是通过时间筛选旁边的查询按钮获取的扩展节点时除外
            if ((currentNode.address == item.address || previousNode?.address == item.address) && !update) {
                return
            }
            // 扩展节点的id可以在from和to中找到时才添加节点，否则视为重复节点
            const findRes = expEdge.find((edge) => edge.to == item.id || edge.from == item.id)
            if (findRes) {
                if (update) {
                    const nodeLayer = this._updateLayer(currentNode, item, findRes)
                    const node = this.data.source.node_list.find((n) => n.address == item.address && n.layer == nodeLayer)
                    newNodeList.push({
                        ...item,
                        layer: nodeLayer,
                        id: node ? node.id : item.id,
                        bakId: item.id,
                    })
                } else {
                    newNodeList.push({
                        ...item,
                        layer: currentLayer > 0 ? currentLayer + 1 : currentLayer - 1,
                    })
                }
            }
        })
        return newNodeList
    }
    /**
     * @description: 将原始数据转换为视图数据
     * @return {*}
     */
    getGraphData() {
        const edgeList = this._getEdgeList(this.data.source.edge_list)
        const nodeList = this._getDefaultNodeList(this.data.source.node_list, edgeList)
        return {
            nodeList: nodeList,
            edgeList: edgeList
        }
    }
    /**
     * @description: 数据筛选，分别可筛选交易类型和地址类型，两种类型同时可交替组合筛选，共九种组合情景
     * @param {string} transType 交易类型：
     * trade(全部)、          
     * income(仅看收入)     
     * expenditure(仅看支出)   
     * @param {string} addressType
     * allAddress(全部地址)
     * normal(普通地址)
     * tag(标签地址)
     * @return {*}
     */
    dataFilter(transType: string, addressType: string, nodeId: string) {
        const { seedList, receiveList } = GraphFactory.getTransactionList(this.data.source, nodeId)
        if (transType == "trade" && addressType == "allAddress") {
            /**
            * 全部交易 + 全部地址
            * 返回所以交易图谱信息
            */
            return {
                viewGraphData: this.data.source,
                filterSeedList: seedList,
                filterReceiveList: receiveList
            }
        } else if (transType == "income" && addressType == "allAddress") {
            /**
             * 只看收入 + 全部地址
             * 返回跟当前选中节点关联的发送方图谱信息和发送方列表
             */
            return this._returnGraphData(nodeId, true, undefined)
        } else if (transType == "expenditure" && addressType == "allAddress") {
            /**
            * 只看支出 + 全部地址
            * 返回从当前选中节点发送出去的交易图谱信息和接收方列表
            */
            // 存储接收方地址
            return this._returnGraphData(nodeId, false, undefined)
        } else if (transType == "trade" && addressType == "normal") {
            /**
            * 全部交易 + 普通地址
            * 返回普通地址的交易信息
            */
            return this._returnGraphData(nodeId, undefined, true)
        } else if (transType == "income" && addressType == "normal") {
            /**
            * 只看收入 + 普通地址
            * 返回发送到当前选中节点交易图谱信息和接收方列表
            */
            return this._returnGraphData(nodeId, true, true)
        } else if (transType == "expenditure" && addressType == "normal") {
            /**
            * 只看支出 + 普通地址
            * 返回从当前选中节点发送出去的普通地址交易图谱信息和接收方列表
            */
            return this._returnGraphData(nodeId, false, true)
        } else if (transType == "trade" && addressType == "tag") {
            // 全部交易 + 只看标签
            return this._returnGraphData(nodeId, undefined, false)
        } else if (transType == "income" && addressType == "tag") {
            return this._returnGraphData(nodeId, true, false)
        } else {
            return this._returnGraphData(nodeId, false, false)
        }

    }
    /**
     * @description   用与处理抽屉交易列表选择框的事件的函数，控制图谱应该显示那几个节点和变的逻辑代码。改函数会移除或添加与传入的节点ID下的子节点和边数据
     * @param nodeId 选中或取消对应行的id
     * @param selected 是否选中
     * @param isSeed    当前处理的逻辑是否是发生地址列表
     * @returns 返回新的节点和边信息
     */
    selectedTradeList(nodeId: string, selected: boolean, txNodeAddr: string | undefined, isSeed?: boolean) {
        let newEdgeList = [] as EdgeList[];
        let newNodeList = [] as NodeList[];
        // 找到进行交易分析的节点
        const txNode = this.data.view.node_list.find((node) => node.address == txNodeAddr)
        // 处理选中交易项
        if (selected && txNode) {
            // 选择框勾选时代表数据先前数据已经从视图数据中丢弃
            // 需要从源数据中找到被丢弃的数据再添加到视图数据中
            newEdgeList.push(...this.data.view.edge_list)
            newNodeList.push(...this.data.view.node_list)
            // 获取之前移除的关联数据信息
            const res = this.cancelViewSet.get(nodeId)
            // 从源数据中获取勾选节点的下标
            const index = this.data.source.node_list.findIndex((n) => n.id == nodeId)
            if (res && index != -1) {
                // 获取勾选节点的父级节点————如果当前节点层级大于0那么父节点的层级比勾选节点层级小，反之比勾选节点层级大
                const fatherNode = GraphTriggers.getPreviousNode(this.data.source.node_list[index], this.data.source)
                // 获取父节点在返回值数据中的下标
                const preNodeIndex = newNodeList.findIndex((n) => n.id == fatherNode.node?.id)
                // 过滤查找出包含相互转账的边，此逻辑只会出现在与勾选节点和父节点之间存在相互转账的情况
                const mutualEdge = res.edge.filter((e) => (e.from == txNode.id && e.to == nodeId) || (e.from == nodeId && e.to == txNode.id))
                if (preNodeIndex != -1) {
                    // 过滤的数据长度为2时说明当前发送方和接收方相同地址只有一个被勾选
                    if (mutualEdge != undefined && mutualEdge.length == 2 && isSeed != undefined) {
                        mutualEdge.forEach((item) => {
                            const index = res.edge.findIndex((e) => e.from == item.from && e.to == item.to)
                            if (index != -1) {
                                // 移除符合勾选节点的边，另外一个边代表还未被勾选那么再次存放到移除关联数据中，等待下次勾选使用
                                if (isSeed && item.from == txNode.id) {
                                    res.edge.splice(index, 1)
                                    this.cancelViewSet.set(nodeId, { node: [], edge: res.edge })
                                    newEdgeList.push(item)
                                    newNodeList.splice(preNodeIndex, 0, ...res.node)
                                } else if (!isSeed && item.from == nodeId) {
                                    res.edge.splice(index, 1)
                                    this.cancelViewSet.set(nodeId, { node: [], edge: res.edge })
                                    newEdgeList.push(item)
                                    newNodeList.splice(preNodeIndex, 0, ...res.node)
                                }
                            }
                        })
                    } else {
                        // 勾选后保存的关联数据就不需要，那么将该关联数据从对象中删除
                        this.cancelViewSet.delete(nodeId)
                        newNodeList.splice(preNodeIndex, 0, ...res.node)
                        newEdgeList.push(...res.edge)
                    }
                } 
            }
        } else {
            // 找到取消勾选的节点
            const cancelNode = this.data.view.node_list.find((node) => node.id == nodeId)
            // 判断layer小于0的交易分析，如果交易分析节点的layer大于取消的节点layer
            // 则把取消的节点相关联的节点和边数据全部移除
            if (txNode && cancelNode) {
                // 使用递归函数找出所有与取消勾选节点相关联的数据，但是不包含勾选节点，下面需要手动push到要移除的数节点数组中
                let res = this._rmTxData(cancelNode)
                // 处理取消勾选节点和其父节点中间存在相互转账的情况
                const mutualEdge = res.rmEdge.filter((e) => (e.from == txNode.id && e.to == cancelNode.id) || (e.from == cancelNode.id && e.to == txNode.id))
                if (mutualEdge != undefined && mutualEdge.length == 2 && isSeed != undefined) {
                    res = this._rmTxData(cancelNode)
                    mutualEdge.forEach((item) => {
                        // 只移除符合的边
                        const index = res.rmEdge.findIndex((e) => e.from == item.from && e.to == item.to)
                        if (isSeed && item.from == txNode.id && index != -1) {
                            res.rmEdge.splice(index, 1)
                        } else if (!isSeed && item.from == cancelNode.id && index != -1) {
                            res.rmEdge.splice(index, 1)
                        }
                    })
                } else {
                    // 只有不存在相互转账的情况下才彻底删除取消勾线节点
                    res.rmNode.push(cancelNode)
                }
                // 下方代码只适用用处理相互转账的情况
                const viewSet = this.cancelViewSet.get(nodeId)
                if (viewSet) {
                    // 当接收方和发送方相同地址都被取消勾选时执行，将与之关联的所有边放到取消关联节点中
                    const edges = viewSet.edge
                    edges?.push(...res.rmEdge)
                    this.cancelViewSet.set(nodeId, { node: res.rmNode, edge: edges })
                } else {
                    this.cancelViewSet.set(nodeId, { node: res.rmNode, edge: res.rmEdge })
                }
                // ——————————————————————————————

                this.data.view.node_list.forEach((item) => {
                    // 执行移除节点逻辑
                    const isInRm = res.rmNode.find((n) => n.id == item.id)
                    if (!isInRm) {
                        newNodeList.push(item)
                    }
                })
                this.data.view.edge_list.forEach((item) => {
                    // 执行移除边逻辑
                    const isInRm = res.rmEdge.find((n) => JSON.stringify(n.tx_hash_list) == JSON.stringify(item.tx_hash_list))
                    if (!isInRm) {
                        newEdgeList.push(item)
                    }
                })

            } else {
                return { edgeList: this.data.view.edge_list, nodeList: this.data.view.node_list }
            }
            
        }
        
        
        this.data.view = { node_list: newNodeList, edge_list: newEdgeList }
        return { edgeList: newEdgeList, nodeList: newNodeList }
    }
    getExpData(currentNode: NodeList, nodes: NodeList[], edges: EdgeList[], update?: boolean) {
        let newData: TrackGraph = {
            edge_list: [] as EdgeList[],
            node_list: [] as NodeList[],
        }
        // this.currentNode = currentNode
        // 找到当前节点的上级节点和边
        const previous = GraphTriggers.getPreviousNode(currentNode, this.data.view)
        // 加工返回去重后的边数据
        const expEdge = this.getExpEdgeList(edges, previous.edge, update)


        // 判断新节点的层级关系
        const expNode = this.getExpNodeLayer(currentNode, previous.node, nodes, expEdge, update)
        if (update) {
            newData = this._replaceOldData(currentNode, expEdge, expNode)
        } else {
            newData.edge_list.push(...this.data.source.edge_list)
            newData.node_list.push(...this.data.source.node_list)
            const index = newData.node_list.findIndex((n) => n.id == currentNode.id)
            // 找到父级节点，吧新数据插入到父级节点后，确保边不会交叉
            newData.node_list.splice(index, 0, ...expNode)
            // 修改新请求的Edge from和to地址，使其能够关联现有节点
            const newEdge = this._setExpEdgeDirect(newData, expEdge, currentNode.id, previous.node)
            newData.edge_list = newEdge
        }

        if (newData.node_list.length > MAXNODE) {
            ToolTip.error(this.t("graph_tip.max_show_nodes"))
            return this.data.source
        }
        if (expNode.length == 0 && expNode.length == 0) {
            ToolTip.warn(this.t("graph_tip.not_found_addr"))
            return newData
        }
        return newData
    }
    /**
     * @description: 由于每次请求的新的边数据中from和to都不包含上一级节点，这里需要重新计算边的上一级指向
     * @param {TrackGraph} data 源数据
     * @param {string} currentId    交易分析节点id
     * @param {NodeList} previousNode   上一级节点
     * @return {*} 返回计算完成后的边数据
     */
    private _setExpEdgeDirect(data: TrackGraph, expEdges: EdgeList[], currentId: string, previousNode: NodeList | undefined) {
        const newEdge = [] as EdgeList[]
        newEdge.push(...data.edge_list)
        expEdges.forEach((item) => {
            let fromId = item.from
            let toId = item.to
            const findFromNode = data.node_list.find((node) => node.id == item.from)
            const findToNode = data.node_list.find((node) => node.id == item.to)
            // 未找到时fromId使用当前点击的节点id
            if (!findFromNode) {
                fromId = currentId
            }
            // 未找到时toId使用当前点击的节点id
            if (!findToNode) {
                toId = currentId
                if (fromId == toId) {
                    fromId = previousNode?.id || toId
                }
            }
            const index = newEdge.findIndex((e) => e.from == fromId && e.to == toId)
            const findSameTx = newEdge.find((e) => JSON.stringify(e.tx_hash_list) == JSON.stringify(item.tx_hash_list))
            if (index == -1 && !findSameTx) {
                newEdge.push({
                    ...item,
                    from: fromId,
                    to: toId
                })
            } else {
                newEdge[index].tx_hash_list = item.tx_hash_list
            }
        })
        return newEdge
    }
    /**
     * @description: 点击时间筛选后面的查询按钮时调用，将新的边的from和to指向修改为旧的边指向
     * @param {NodeList} currentNode   
     * @param {EdgeList} expEdges
     * @param {NodeList} expNodes
     * @return {*}
     */
    private _replaceOldData(currentNode: NodeList, expEdges: EdgeList[], expNodes: NodeList[]) {
        let nodeRes = [] as NodeList[]
        let edgeRes = [] as EdgeList[]
        nodeRes.push(...this.data.source.node_list)
        edgeRes.push(...this.data.source.edge_list)
        // 获取与当前节点关联的节点数据和边数据
        const relation = this._getRelation(currentNode)
        expNodes.forEach((item) => {
            if (item.id == item.bakId) {
                // 代表新增节点
                const index = nodeRes.findIndex((n) => n.address == currentNode.address && n.layer == currentNode.layer)
                // 插入到关联节点后面，确保图谱的边不会交叉
                if (index != -1) {
                    nodeRes.splice(index, 0, item)
                }
            }
            // TODO 
            // else {
            //     const index = nodeRes.findIndex((n) => n.address == item.address && n.layer == item.layer)
            //     if (index != -1) {
            //         nodeRes.splice(index, 1, item)
            //     }
            // }
            const index = relation.nodes.findIndex((n) => n.address == item.address)
            // 如果能够找到下标， 那么代表改节点还存在，反之，节点将被后续逻辑代码移除
            if (index != -1) {
                relation.nodes.splice(index, 1)
            }
        })

        // 修改边的from和to
        expEdges.forEach((edge) => {
            // 如果任何一个节点未找到，那么代表这个边是新增数据
            const fromNode = expNodes.find((n) => n.bakId == edge.from && n.bakId != n.id)
            const toNode = expNodes.find((n) => n.bakId == edge.to && n.bakId != n.id)
            // 都能找到则代表这个边原先存在，那么把新的交易数据替换到原来的边上，并且修改边的from和to，使其能够指向原先节点
            if (fromNode && toNode) {
                edge.from = fromNode.id
                edge.to = toNode.id
                // 找出老的边的下标
                const index = edgeRes.findIndex((e) => e.from == edge.from && e.to == edge.to)
                // 找出老的边在关联边列表中的下标
                const indexRelEdge = relation.edges.findIndex((e) => e.from == edge.from && e.to == edge.to)
                // 在源数据中查找当前边
                const findSourceEdge = this.data.source.edge_list.find((e) => e.from == edge.from && e.to == edge.to)
                if (index != -1 && findSourceEdge) {
                    edgeRes.splice(index, 1, edge)
                    // 替换新的交易信息到边数据中
                    findSourceEdge.tx_hash_list = edge.tx_hash_list
                    // 能够在边关联列表中找到下标那么说明扩展的边原先存在，那么后续不做移除操作
                    if (indexRelEdge != -1) {
                        relation.edges.splice(indexRelEdge, 1)
                    }
                } else {
                    //此逻辑只存在与相互转账的节点，原先只有一条边，查询到的新数据存与改节点关联的双向边
                    edgeRes.push(edge)
                }
            } else {
                // 有一头没找到则代表新增扩展节点关联的边
                // 修改from 和 to 的指向
                if (!toNode && fromNode) {
                    edge.from = currentNode.id
                } else if (toNode && !fromNode) {
                    edge.to = currentNode.id
                }
                edgeRes.push(edge)
            }
        })
        // 如果新增节点遍历完后，两边还存在关联的节点，那么需要吧关联节点从数据中移除
        if (relation.nodes.length > 0) {
            relation.nodes.forEach((item) => {
                // 移除所有关联节点下的节点和边
                const { edgeList, nodeList } = this.selectedTradeList(item.id, false, currentNode.address)
                const graphData = { node_list: nodeList, edge_list: edgeList } as TrackGraph
                this.data = { view: graphData, source: graphData }
                nodeRes = nodeList
                edgeRes = edgeList
            })
        }
        // 如果新增边遍历完后，两边还存在关联的边，那么需要吧关联边从数据中移除
        // 此逻辑只会在原先是双向边，查询后变为了单向时才会执行
        if (relation.edges.length > 0) {
            relation.edges.forEach((item) => {
                const index = edgeRes.findIndex((e) => e.from == item.from && e.to == item.to)
                if (index != -1) {
                    edgeRes.splice(index, 1)
                }
            })
        }
        return { node_list: nodeRes, edge_list: edgeRes }
    }
    /**
     * @description: 用于当重新选择筛选时间段后更新搜索的节点
     * @param {NodeList} currentNode
     * @param {NodeList} expNode
     * @return {*}
     */
    private _updateLayer(currentNode: NodeList, expNode: NodeList, expEdge: EdgeList) {
        if (expNode.address == currentNode.address) {
            return currentNode.layer
        }
        const relation = this._getRelation(currentNode)
        const findNode = relation.nodes.find((n) => n.address == expNode.address)
        if (findNode) {
            return findNode.layer
        } else {
            if (currentNode.layer != undefined) {
                if (currentNode.layer == 0) {
                    return expEdge.from == expNode.id ? currentNode.layer - 1 : currentNode.layer + 1
                } else if (currentNode.layer < 0) {
                    return currentNode.layer - 1
                } else {
                    return currentNode.layer + 1
                }
            }
        }

        // @ts-ignore
        return currentNode.layer + 1
    }
    private _getRelation(currentNode: NodeList | undefined) {
        const res = { nodes: [] as NodeList[], edges: [] as EdgeList[] }
        if (currentNode) {
            this.data.source.edge_list.forEach((item) => {
                if (item.from == currentNode.id || item.to == currentNode.id) {
                    const fromNode = this.data.source.node_list.find((n) => n.id == item.from)
                    const toNode = this.data.source.node_list.find((n) => n.id == item.to)
                    if (fromNode && toNode) {
                        const index = res.nodes.findIndex((n) => n.id == (fromNode.id == currentNode.id ? toNode.id : fromNode.id))
                        if (index == -1) {
                            res.nodes.push(fromNode.id == currentNode.id ? toNode : fromNode)
                        }
                        // res.nodes.push(fromNode.id == currentNode.id ? toNode : fromNode)
                        res.edges.push(item)
                    }
                }
            })
        }
        return res
    }
    /**
     * @description: 当取消选择抽屉的交易列表某一个节点时，执行相应逻辑，把不需要的节点和边数据从视图数据中移除
     * @param {NodeList} rmNode 要移除的节点
     * @return {*}  要移除的所有节点和边的数据列表
     */
    private _rmTxData(rmNode: NodeList) {
        const nodeRes: NodeList[] = []
        const edgeRes: EdgeList[] = []
        // 根据要移除的节点找到跟被移除节点相关联的边数据
        const rmEdgeList = this.data.view.edge_list.filter((edge) => edge.from == rmNode.id || edge.to == rmNode.id)
        rmEdgeList.forEach((item) => {
            // 遍历要移除的边数据，获取边的from和to节点数据
            const fromNode = this.data.view.node_list.find((n) => n.id == item.from)
            const toNode = this.data.view.node_list.find((n) => n.id == item.to)
            // 此处只是单纯验证数据类型不是undefined，不能吧undefined省略，如果节点层级为0的话，0值布尔运算为false
            if (fromNode && toNode && fromNode.layer != undefined && toNode.layer != undefined && rmNode.layer != undefined) {
                // 如果边数据已经存在于要返回的边列表里则不再添加进去
                if (!edgeRes.find((e) => JSON.stringify(e.tx_hash_list) == JSON.stringify(item.tx_hash_list))) {
                    edgeRes.push(item)
                }
                if (rmNode.layer <= 0) {
                    // 移除层级小于或者等于0的节点时执行的逻辑
                    if (fromNode.layer < rmNode.layer || toNode.layer < rmNode.layer) {
                        if (!nodeRes.find((n) => n.id == toNode.id || n.id == fromNode.id)) {
                            nodeRes.push(fromNode.id == rmNode.id ? toNode : fromNode)
                        }
                    }
                } else {
                    // 移除层级大于0的节点时执行的逻辑
                    if (fromNode.layer > rmNode.layer || toNode.layer > rmNode.layer) {
                        if (!nodeRes.find((n) => n.id == toNode.id || n.id == fromNode.id)) {
                            nodeRes.push(fromNode.id == rmNode.id ? toNode : fromNode)
                        }
                    }
                }

            }
        })
        nodeRes.forEach((item) => {
            const { rmNode, rmEdge } = this._rmTxData(item)
            nodeRes.push(...rmNode)
            rmEdge.forEach((item) => {
                if (!edgeRes.find((e) => JSON.stringify(e.tx_hash_list) == JSON.stringify(item.tx_hash_list))) {
                    edgeRes.push(item)
                }
            })
        })
        return { rmNode: nodeRes, rmEdge: edgeRes }
    }
    /**
     * @description: 由于接口中返回的边的from和to有重复，这里将实现去重以及整理为图谱需要的边数据
     * @param {EdgeList} edgeList
     * @return {*}
     */
    private _getEdgeList(edgeList: EdgeList[]) {
        const edgeSet = [] as { hash: string, edgeList: EdgeList[] }[]
        const newEdgeList = [] as EdgeList[]
        if (edgeList) {
            edgeList.forEach((item) => {
                // 过滤，将重复数据放在一起
                if (item.from == item.to) return
                const consEdge = edgeList.filter((edge) => {
                    return edge.from == item.from && edge.to == item.to
                })
                const hash = base64.encode(item.from + item.to)
                if (!edgeSet.find((item) => item.hash == hash)) {
                    edgeSet.push({
                        hash: hash,
                        edgeList: consEdge
                    })
                }
            })
            edgeSet.forEach((item) => {
                newEdgeList.push({
                    from: item.edgeList[0].from,
                    to: item.edgeList[0].to,
                    tx_hash_list: this._getTxHashList(item.edgeList),
                } as EdgeList)
            })
        }

        return newEdgeList
    }
    /**
     * @description: 将交易hash和时间戳整理为列表
     * @param {EdgeList} edgeList   
     * @return {*}
     */
    private _getTxHashList(edgeList: EdgeList[]) {
        const txHashList: TxHash[] = []
        edgeList.forEach((item) => {
            txHashList.push({
                time_stamp: item.time_stamp,
                value: item.value,
                hash: item.tx_hash?.hash,
            })
        })
        return txHashList
    }
    /**
     * @description: 
     * @param {NodeList} sourceNode
     * @param {EdgeList} organizedEdgeList
     * @return {*}
     */
    private _getDefaultNodeList(sourceNode: NodeList[], organizedEdgeList: EdgeList[]) {
        const newNodeList: NodeList[] = []
        if (sourceNode) {
            const zeroNode = sourceNode.find((item) => item.address == this.tradeAddress)
            if (zeroNode) {
                newNodeList.push({
                    layer: 0,
                    ...zeroNode,
                })
                organizedEdgeList.forEach((edge) => {
                    // TODO 添加了多余的条件，用于点击选择框数据测试
                    if (edge.to == zeroNode.id && !organizedEdgeList.find((e) => e.from == edge.to && e.to == edge.from)) {

                        sourceNode.find((item) => {
                            if (item.id == edge.from && !newNodeList.find((node) => node.id == item.id)) {
                                newNodeList.push({
                                    layer: -1,
                                    ...item,
                                })
                            }
                        })
                    } else if (edge.from == zeroNode.id) {
                        sourceNode.find((item) => {
                            if (item.id == edge.to && !newNodeList.find((node) => node.id == item.id)) {
                                newNodeList.push({
                                    layer: 1,
                                    ...item,
                                })
                            }
                        })
                    }
                })
            }
        }

        return newNodeList
    }
    /**
     * @description: 将图谱节点下方的label控制在可显示范围内，避免节点地址太长导致的问题
     * @param {string} s
     * @return {*}
     */
    private _ellipsisMiddle(s?: string) {
        if (s && s.length > 8) {
            return s.slice(0, 5).trim() + "..." + s.slice(-5).trim()
        }
        return s
    }
    /**
     * @description: 计算两个账户之间的总交易金额
     * @param {TxHash} tx
     * @return {*}
     */
    private _getTransferAmount(tx?: TxHash[]) {
        let count = 0
        if (tx) {
            tx.forEach((item) => {
                count += Number(item.value) || 0
            })
        }
        return count
    }
    /**
     * @description: 数据筛选处理，注意这是一个递归函数，
     * @param {string} nodeId  要处理的节点id
     * @param {boolean} isIncome 是否为收入类型
     * @param {boolean} isNormal 是否为普通地址类型
     * @return {*}
     */
    private _linkFinder(nodeId: string, isIncome: boolean | undefined, isNormal: boolean | undefined) {
        const nodeList = [] as NodeList[];
        const edgeList = [] as EdgeList[];

        const conformEdgeList = this.data.source.edge_list.filter((edge) => {
            // 处理只切换了交易类型的事件
            if (isIncome != undefined && isNormal == undefined) {
                return (isIncome ? edge.to : edge.from) == nodeId && !this.findNodeId.find((n) => n == (isIncome ? edge.from : edge.to))
            }
            if (isIncome == undefined && isNormal != undefined) {
                // 找到当前传入id关联边的另外一个节点
                const node = this.data.source.node_list.find(
                    (n) => edge.to == nodeId && edge.from == n.id || edge.from == nodeId && edge.to == n.id
                )
                if ((edge.to == node?.id || edge.from == node?.id)
                    && (isNormal ? node.label == "" : node.label != "")
                    && !this.findEdgeId.find((e) => e == base64.encode(edge.from + edge.to))
                ) {
                    this.findEdgeId.push(base64.encode(edge.from + edge.to))
                    return true
                }
            }
            if (isIncome != undefined && isNormal != undefined) {

                const node = this.data.source.node_list.find(
                    (n) => n.id == (isIncome ? edge.from : edge.to)
                        && (isNormal ? n.label == "" : n.label != "")
                )
                return (isIncome ? edge.to : edge.from) == nodeId
                    && node
                    && !this.findNodeId.find((n) => n == (isIncome ? edge.from : edge.to))
            }
        })
        this.findNodeId.push(nodeId)
        if (conformEdgeList.length > 0) {
            conformEdgeList.forEach((edge) => {
                this.data.source.node_list.find((node) => {
                    // 只看支出或只看收入的逻辑，并且交易类型和地址类型组合时的逻辑
                    if (isIncome != undefined && (isIncome ? edge.from : edge.to) == node.id) {
                        nodeList.push(node)
                    }
                    // 全部交易时执行下面逻辑
                    // 只看正常地址
                    if (isIncome == undefined && isNormal == true && (edge.from == node.id || edge.to == node.id)) {
                        if (!this.findNodeId.find((n) => n == node.id)) {
                            nodeList.push(node)
                        }
                    }
                    if (isIncome == undefined && isNormal == false && (edge.from == node.id || edge.to == node.id)) {
                        if (!this.findNodeId.find((n) => n == node.id)) {
                            nodeList.push(node)
                        }
                    }
                })
                // 根据过滤出来的边开始递归查找下一节点
                if ((isIncome != undefined && isNormal == undefined) || (isIncome != undefined && isNormal != undefined)) {
                    const { edge_list, node_list } = this._linkFinder((isIncome ? edge.from : edge.to), isIncome, isNormal)
                    edgeList.push(edge)
                    edgeList.push(...edge_list)
                    nodeList.push(...node_list)
                }
                if (isIncome == undefined && isNormal != undefined) {
                    const { edge_list, node_list } = this._linkFinder((this.findNodeId.find((n) => n == nodeId) && edge.from == nodeId) ? edge.to : edge.from, isIncome, isNormal)
                    edgeList.push(edge)
                    edgeList.push(...edge_list)
                    nodeList.push(...node_list)
                }
            })
        }
        return { edge_list: edgeList, node_list: nodeList }
    }
    /**
    * @description: 类私有方法，在数据筛选方法中调用
    * @param {string} nodeId    当前在抽屉交易分析中显示的节点
    * @param {boolean} isIncome 
    * @param {boolean} isNormal
    * @return {*} 返回经过筛选后的边数据已经节点数据
    */
    private _returnGraphData(nodeId: string, isIncome: boolean | undefined, isNormal: boolean | undefined) {
        const res = this._linkFinder(nodeId, isIncome, isNormal)
        const findNode = this.data.source.node_list.find((n) => n.id == nodeId)
        if (findNode) {
            res.node_list.push(findNode)
        }

        const { seedList, receiveList } = GraphFactory.getTransactionList(res, nodeId)
        return {
            viewGraphData: res,
            filterSeedList: seedList,
            filterReceiveList: receiveList
        }
    }
}

export const GraphTriggers = {
    /**
     * @description: 判断双击节点是节点是否已经扩展过了
     * @param {NodeList} currentNode
     * @param {TrackGraph} data
     * @return {*}
     */
    isSearch(currentNode: NodeList, data: TrackGraph) {
        const nodeLayer = currentNode.layer || 0
        let res = true
        if (currentNode.layer == 0) return false
        data.edge_list.forEach((edge) => {
            if (currentNode.id == edge.from || currentNode.id == edge.to) {
                const findNode = data.node_list.find((item) => (edge.from == item.id || edge.to == item.id) && item.id != currentNode.id)
                if (nodeLayer < 0) {
                    // 点击节点层级小于0时查该节点左侧是否有关联节点，查到返回false，节点不可扩展
                    // @ts-ignore
                    if (findNode && findNode.layer < nodeLayer) {
                        res = false
                    }
                } else {
                    // 点击节点层级小于0时查该节点右侧是否有关联节点，查到返回false，节点不可扩展
                    // @ts-ignore
                    if (findNode && findNode.layer > nodeLayer) {
                        res = false
                    }
                }
            }
        })
        return res
    },
    /**
     * @description: 获取当前双击时节点的上一级节点
     * @param {NodeList} currentNode
     * @param {TrackGraph} data
     * @return {*}
     */
    getPreviousNode(currentNode: NodeList, data: TrackGraph) {
        let findNode = {} as NodeList | undefined
        let findEdge = {} as EdgeList
        data.edge_list.forEach((edge) => {
            if (edge.from == currentNode.id || edge.to == currentNode.id) {
                data.node_list.find((node) => {
                    if ((node.id == edge.from || node.id == edge.to) && node.address != currentNode.address) {
                        if (currentNode.layer && node.layer != undefined) {
                            if (currentNode.layer > 0 && currentNode.layer - 1 == node.layer ) {
                                // 被操作节点层级大于0的情
                                findNode = node
                                findEdge = edge
                            } else if (currentNode.layer < 0 && currentNode.layer + 1 == node.layer) {
                                // 被操作节点层级小于0的情况
                                findNode = node
                                findEdge = edge
                            }
                        }
                    }
                })
            }
        })
        return { node: findNode, edge: findEdge }
    },
}


