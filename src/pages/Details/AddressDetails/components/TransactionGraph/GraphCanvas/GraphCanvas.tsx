import React, { createRef, Dispatch, RefObject, useEffect, useRef, useState, useTransition } from 'react';
import copy from 'copy-to-clipboard';
import { EdgeList, NodeList, TrackGraph } from '../../../../../../model/response-model';
import { FullScreenHandle } from "react-full-screen";
import { DataSet, Edge, Network } from "vis-network/standalone";
import vis from 'vis-network/declarations/index-legacy-bundle';
import { graphConf, MAXNODE } from './conf/graph-config';
import { Button, Col, message, Modal, Row, Spin, } from 'antd';
import DateUtil from '../../../../../../utils/formatData';
import { GraphFactory, GraphTriggers } from '../../../../../../utils/graphDataFactor';
import { ToolTip } from '../../../../../../components/ToolTips';
import { useTranslation } from 'react-i18next';
import { TransferDialog } from '../components/TransferDialog';
import { getTrackGraph, putGraphData } from '../../../../../../servers/api';
import TrackUpdate from '../../../../../../components/UpdataMonitor';
import { GraphEdge, GraphInfo, GraphNode, GraphTransition, GraphTxHash, SaveGraph, Trades } from '../../../../../../model/public-model';
import { useParams } from 'react-router';
import { TxDialog } from '../components/TxDialog';
import { MutableRefObject } from 'react';



const TOOLBAR = [
  {
    title: "zoom",
    img: "fangda.svg"
  },
  {
    title: "reduce",
    img: "suoxiao.svg"
  },
  {
    title: "center",
    img: "juzhong.svg"
  },
  {
    title: "download",
    img: "xiazai.svg"
  },
  {
    title: "full",
    img: "quanping.svg"
  },
]

interface GraphProps {
  graphId: string | undefined
  setFull: Dispatch<boolean>
  handleFull: FullScreenHandle
  setGraphData: Dispatch<any>
  factor: GraphFactory
  dateRef: MutableRefObject<{ start: number, end: number }>
  setCanvasLoading: Dispatch<boolean>
  // showSave: boolean
  // dateRange: [start: string, end: string]
  onDoubleClickNode: (tx: GraphTransition) => void
}



/**
 * @description: 图谱画布组件
 * @param {GraphProps} props
 * @return {*}
 */
export const GraphCanvas = (props: GraphProps) => {
  const { setFull, factor, handleFull, graphId, dateRef, setCanvasLoading, setGraphData, onDoubleClickNode } = props
  const { t } = useTranslation()
  const { wallet, address } = useParams()
  const [network, setNetWork] = useState(null as unknown as Network)
  const [isFocus, setFocus] = useState(false)
  const [loadingSave, setLoading] = useState(false)
  // const [reqLoading, setReqLoading] = useState(false)
  // const respRef = useRef(reqLoading)
  // 边最初没有ID， 经过一系列计算后保存最终有ID的边数据，用于处理点击边时打开交易列表的事件
  const [graphEdge, setGraphEdge] = useState([] as EdgeList[])
  const [showSave, setShowSave] = useState(false)
  // 点击某条边后边的源数据
  const [oneEdge, setOneEdge] = useState({} as EdgeList)
  // 点击边后控制交易列表探出窗的开关
  const [openEdgeDialog, setEdgeDialog] = useState(false)

  // 处理点击下载事件
  const handleDownload = () => {
    let img = new Image()
    const url = document.getElementsByTagName("canvas")[0].toDataURL()
    img.src = url
    const d = new Date()
    // 获取当前本地时间，作为图片名称的一部分
    const time = `${d.getFullYear().toString() + d.getMonth().toString() + d.getDay().toString()}_${d.getHours().toString() + d.getMinutes()}`
    img.onload = () => {
      let href = url
      let a = document.createElement('a');     // 创建一个a节点插入的document
      a.download = `Swift_${time}.png`  // 设置a节点的download属性值，也就是下载后的文件名称
      a.href = href;         // 将图片的src赋值给a节点的href
      a.click()
    }
  }
  // 处理工具栏
  const handleClickToolbar = (action: string) => {
    switch (action) {
      case 'zoom':
        network.moveTo({
          scale: network.getScale() * 1.4,
          animation: true
        })
        break;
      case 'reduce':
        network.moveTo({
          scale: network.getScale() * 0.7,
          animation: true
        })
        break;
      case 'center':
        network.fit({
          animation: true
        })
        break;
      case 'download':
        handleDownload()
        break;
      case 'full':
        if (handleFull.active) {
          setFull(false)
          handleFull.exit()
        } else {
          setFull(true)
          handleFull.enter()
        }
        break;
    }
  }
  // 处理边的交易信息弹出框关闭事件
  const handleCancel = () => {
    setEdgeDialog(false)
  }
  const handleSaveGraph = () => {
    setLoading(true)
    const data: GraphInfo = {
      edge_list: [] as GraphEdge[],
      node_list: [] as GraphNode[],
      tx_count: 0,
      first_tx_datetime: 'first_tx_datetime',
      latest_tx_datetime: 'latest_tx_datetime',
      address_first_tx_datetime: 'address_first_tx_datetime',
      address_latest_tx_datetime: 'address_latest_tx_datetime'
    }
    factor.data.view.edge_list.forEach((item) => {
      const newTx = [] as GraphTxHash[]
      item.tx_hash_list?.forEach((tx) => {
        newTx.push({
          time_stamp: tx.time_stamp,
          value: tx.value,
          hash: tx.hash
        })
      })
      data.edge_list.push({
        from: item.from,
        to: item.to,
        tx_hash_list: newTx
      })
    })
    data.node_list = factor.data.view.node_list as unknown as GraphNode[]
    putGraphData({
      track_graph_id: graphId,
      address_first_tx_datetime: dateRef.current.start.toString(),
      address_latest_tx_datetime: dateRef.current.end.toString(),
      graph_dic: data
    }).then((resp) => {
      if (resp.ok) {
        ToolTip.success("图谱保存成功!")
      } else {
        ToolTip.error("保存失败，请检查网络或联系我们")
      }
      setLoading(false)
      setShowSave(false)
    })
  }

  let time: NodeJS.Timeout;
  useEffect(() => {
    if (network) {
      // 点击节点
      network.on('click', (properties) => {
        const nodeId = properties.nodes[0];
        clearTimeout(time)
        time = setTimeout(() => {
          // 点击节点复制节点地址
          if (nodeId) {
            factor.data.view.node_list.find((item) => {
              if (item.id == nodeId) {
                if (item.address) {
                  copy(item.address)
                  ToolTip.success(t("tools.copy_success"))
                } else {
                  ToolTip.error(t("tools.copy_failed"))
                }
              }
            })
          }
        }, 500)

      })
      // 聚焦相同地址节点
      network.on('click', (properties) => {
        const nodeId = properties.nodes[0];
        if (nodeId) {
          factor.data.view.node_list.find((item) => {
            if (item.id == nodeId) {
              const selectNodeId: vis.IdType[] = []
              const selectNode: NodeList[] = factor.data.view.node_list.filter((n) => n.address == item.address)
              if (selectNode) {
                selectNode.forEach((n) => {
                  selectNodeId.push(n.id)
                })
              }
              network.setSelection({ nodes: selectNodeId, }, { unselectAll: false })
            }
          })
        }
      })
      // 点击边展开交易列表弹出框
      network.on('click', (properties) => {
        const edgeId = properties.edges[0];
        // 取不到节点ID时代表点击的不是节点，避免点击节点时打开交易列表弹出窗
        const nodeId = properties.nodes[0];
        if (!nodeId && edgeId) {
          graphEdge.find((item) => {
            // 由于图谱边的数据和视图数据中的边结构已经不一致了，所以要找到对应的边
            if (item.id == edgeId) {
              const oneEdge = factor.getOneEdge(item)
              setOneEdge(oneEdge)
            }
            setEdgeDialog(true)
          })
        }
      })
      network.on('doubleClick', (properties) => {
        //获取点击时对应的节点ID
        clearTimeout(time)
        const nodeId = properties.nodes[0];
        if (nodeId) {
          factor.data.view.node_list.find((item) => {
            // 拿到对应节点的节点信息
            if (item.id == nodeId) {
              const res = GraphTriggers.isSearch(item, factor.data.view)
              if (!res) {
                const { seedList, receiveList } = GraphFactory.getTransactionList(factor.data.source, item.id)
                onDoubleClickNode({
                  address: item.address || "",
                  nodeId: item.id,
                  seed: seedList,
                  receive: receiveList
                })
                // 该节点已经扩展，如果未找到相关交易记录，请更改查询时间!
                ToolTip.warn(t("graph_tip.node_extended"))
                return
              }
              setCanvasLoading(true)
              setTimeout(() => {
                setCanvasLoading(false)
              }, 15000)
              getTrackGraph({
                coin: wallet,
                address: item.address,
                start: dateRef.current.start,
                end: dateRef.current.end,
              }).then((resp) => {
                if (resp) {
                  if (!resp.data.node_list) {
                    if (!resp.data.node_list) {
                      setCanvasLoading(false)
                      ToolTip.warn(t("graph_tip.not_found_addr"))
                      return
                    }
                  }
                  const data = factor.getExpData(item, resp.data.node_list, resp.data.edge_list)
                  if (data) {
                    setGraphData({
                      source: data,
                      view: data
                    })
                    // 获取双击节点的相关支出、收入列表
                    const { seedList, receiveList } = GraphFactory.getTransactionList(data, item.id)
                    onDoubleClickNode({
                      address: item.address || "",
                      nodeId: item.id,
                      seed: seedList,
                      receive: receiveList
                    })
                    setShowSave(true)
                  }
                } else {
                  ToolTip.error(t("graph_tip.query_failed"))
                }
                setCanvasLoading(false)
              })
            }
          })
        }
      })
    }
  }, [network])

  useEffect(() => {
    var container = document.getElementById("vis-network")
    if (factor.data.view.node_list) {
      if (container) {
        const { data, edgeList } = factor.getVisNetWork()

        setGraphEdge(edgeList)
        const network = new Network(container, data, graphConf)
        setNetWork(network)
      }
    } else if (container) {
      const network = new Network(container, {}, graphConf)
    }
  }, [factor.data.view])
  let visElement = document.getElementsByTagName("canvas")[0]
  return (
    <div style={{ position: 'relative' }}>
      <div id="vis-network">
      </div>
      <Col className='tool-bar'>
        {TOOLBAR.map((item) => {
          return (
            <div className='tool' key={item.title} onClick={() => { handleClickToolbar(item.title) }}>
              <img src={`/assets/${item.img}`} width={24} />
            </div>
          )
        })}
      </Col>
      <Col className='graph-tip'>
        <img src='/assets/light-tip.svg' width={14} alt='tip:' />
        <span>
          {t("graph_tip.warm_tips")}
        </span>
        {showSave && graphId ?
          <div className='save-div'>
            <Col>{t("graph_tip.save_tip")}</Col>
            <Button className='save-graph' onClick={handleSaveGraph} loading={loadingSave}>
              {t("graph_tip.save")}
            </Button>
          </div>
          : null
        }
      </Col>
      {/* 交易列表弹出框 */}
      <TxDialog isOpen={openEdgeDialog} handleCancel={handleCancel} edgeInfo={oneEdge} />
    </div>
  );
};

