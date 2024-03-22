import { Alert, Button, Card, Col, Input, Modal, Row, Spin } from "antd";

import { ChangeEvent, SetStateAction, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import "./graph.less";
import { EdgeList, NodeList, TrackGraph } from "../../../../../model/response-model";
import { GraphEdge, GraphInfo, GraphNode, GraphTransition, GraphTxHash, Trades } from "../../../../../model/public-model";
import { GraphDrawer } from "./GraphDrawer/GraphDrawer";
import { getAtlasData, getTrack, getTrackGraph, postTrack, putGraphData } from "../../../../../servers/api";
import { GraphFactory, GraphTriggers } from "../../../../../utils/graphDataFactor";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { GraphCanvas } from "./GraphCanvas/GraphCanvas";
import DateUtil from "../../../../../utils/formatData";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import { ToolTip } from "../../../../../components/ToolTips";
import { start } from "repl";
import { useParams } from "react-router";
import { use } from "echarts";
import { MAXNODE } from "./GraphCanvas/conf/graph-config";
import { Dialog } from "../../../../../components/Dialog";
import { useRef } from "react";


interface TgProps {
  graphId?: string
  longAddr: string
  txDateRange?: { start: number, end: number }
  coinType: string
}
const TransactionGraph = (props: TgProps) => {
  const { graphId, longAddr, txDateRange, coinType } = props
  const { t } = useTranslation();
  const { address } = useParams();
  // const [graphId, setGraphId] = useState("")
  const [graphData, setGraphData] = useState({
    source: {
      node_list: [],
      edge_list: []
    } as TrackGraph,
    view: {
      node_list: [],
      edge_list: []
    } as TrackGraph
  })
  const [loading, setLoading] = useState(false)
  const [full, setFull] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: txDateRange?.start || DateUtil.dateStringToTimesTamp(moment(new Date()).subtract(2, "weeks").format("yyyy/MM/DD")) / 1000,
    end: txDateRange?.end || (DateUtil.dateStringToTimesTamp(moment(new Date()).format("yyyy/MM/DD")) + 86400000) / 1000
  })
  const dateRef = useRef({
    start: txDateRange?.start || DateUtil.dateStringToTimesTamp(moment(new Date()).subtract(2, "weeks").format("yyyy/MM/DD")) / 1000,
    end: txDateRange?.end || (DateUtil.dateStringToTimesTamp(moment(new Date()).format("yyyy/MM/DD")) + 86400000) / 1000
  })
  // 处理创建追踪任务的相关hooks
  const [openCreateTrend, setOpenTrend] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [trackName, setTrackName] = useState("")
  const [trackNotes, setTrackNotes] = useState("")
  // 发送到选择的节点的交易记录---发送方地址列表
  // 选择的地址转账给其他地址交易记录---接收方地址列表
  const [txTrades, setTxTrades] = useState<GraphTransition>({
    address: address ?? '',
    nodeId: "",
    seed: [],
    receive: []
  })
  // 抽屉开关
  const [open, setOpen] = useState(true);
  // const [filterType, setFilterType] = useState({ enabled: false, txType: "trade", addrType: "allAddress" })
  const factor = new GraphFactory(graphData, longAddr, coinType, t)
  // 获取交易图谱数据
  const fetchTrackData = (dateStrings?: [string, string]) => {
    setLoading(true)

    // 还需调整
    // 默认查询事件以当前日期查询过去三个月的交易记录
    try {
      getTrackGraph({
        coin: coinType,
        // address: "f1d7mq36vf6osdhcd32i6k3wyb223mdjlxnafnala",
        address: longAddr,
        start: dateRange.start,
        end: dateRange.end,
      }).then((resp) => {
        if (resp.success) {
          factor.data = {
            source: resp.data,
            view: resp.data
          }
          if (resp.data.node_list && resp.data.node_list.length > MAXNODE) {
            ToolTip.warn("图谱最大可显示节点数为2000当前查询的交易地址数量大于2000，请尽量缩短查询时间段")
            setLoading(false)
            return
          }
          const { nodeList, edgeList } = factor.getGraphData()
          setGraphData({
            source: {
              node_list: nodeList,
              edge_list: edgeList
            },
            view: {
              node_list: nodeList,
              edge_list: edgeList
            }
          })
          handleFirstLoaded({
            node_list: nodeList,
            edge_list: edgeList
          }, longAddr)
        } else {
          ToolTip.error("数据加载失败，请稍后重试")
        }
        setLoading(false)
      })
    } catch (error) {

    }

  }
  // 获取已经保存的交易图谱数据
  const fetchAtlasData = () => {
    setLoading(true)
    getAtlasData({ track_graph_id: graphId || "" }).then((resp) => {
      if (resp.ok) {
        const nodes = [] as NodeList[]
        resp.data.graph_dic.node_list.forEach((item) => {
          item.layer = item.layer || 0
          nodes.push(item)
        })
        setGraphData({
          source: {
            node_list: nodes,
            edge_list: resp.data.graph_dic.edge_list
          },
          view: {
            node_list: nodes,
            edge_list: resp.data.graph_dic.edge_list
          }
        })
        handleFirstLoaded({
          node_list: nodes,
          edge_list: resp.data.graph_dic.edge_list
        }, resp.data.address)
      }
      setLoading(false)
    })
  }
  // 处理时间筛选后点击查询按钮的逻辑，查询地址为当前的交易分析地址
  const handleTimeRangeSearch = (currentAddr: string) => {
    setLoading(true)

    getTrackGraph({
      coin: coinType,
      address: currentAddr,
      start: dateRange.start,
      end: dateRange.end,
    }).then((resp) => {
      if (!resp.data.node_list) {
        ToolTip.warn(t("graph_tip.not_found_addr"))
        setLoading(false)
        return
      }
      const currentNode = graphData.source.node_list.find((n) => n.id === txTrades.nodeId)
      if (currentNode) {
        const data = factor.getExpData(currentNode, resp.data.node_list, resp.data.edge_list, true)
        if (data) {
          setGraphData({
            source: data,
            view: data
          })

          // 获取双击节点的相关支出、收入列表
          const { seedList, receiveList } = GraphFactory.getTransactionList(data, currentNode.id)
          setTxTrades({
            address: currentNode.address ?? address ?? "",
            nodeId: currentNode.id,
            seed: seedList,
            receive: receiveList
          })
        }
      } else {
        fetchTrackData()
      }
      setLoading(false)
    })
  }

  // 创建一个fullScreen的handle
  const handleFullScreen = useFullScreenHandle();


  // 处理创建追踪任务时用户输入追踪名称或者追踪笔记时事件
  const handleInputTrendName = (event: ChangeEvent<HTMLInputElement>) => {
    setTrackName(event.target.value)
  }
  const handleInputTrendNodes = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTrackNotes(event.target.value)
  }
  // 处理创建追踪任务提交创建信息的事件
  const handleSaveTrendInfo = (gid: string) => {
    if (trackName.length < 1) {
      ToolTip.error("请输入追踪名称!")
      return
    }
    setConfirmLoading(true);
    postTrack({
      track_graph_id: gid,
      address: longAddr,
      coin: coinType,
      name: trackName,
      note: trackNotes
    }).then((resp) => {
      if (resp.ok) {
        ToolTip.success("创建追踪任务成功!")
        setOpenTrend(false)
        setConfirmLoading(false)
        setTrackName("")
        setTrackNotes("")
      } else {
        ToolTip.error("追踪任务创建失败!")
      }
    })
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
          hash: tx.hash,
          value: tx.value,
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
      address_first_tx_datetime: dateRange.start.toString(),
      address_latest_tx_datetime: dateRange.end.toString(),
      graph_dic: data
    }).then((resp) => {
      if (resp.ok) {
        handleSaveTrendInfo(resp.data)
        ToolTip.success("图谱保存成功!")
      } else {
        ToolTip.error("保存失败，请检查网络或联系我们")
      }
      setLoading(false)
      setShowSave(false)
    })
  }

  // 处理抽屉开关的方法
  const handleOpenDrawer = () => {
    setOpen(prev => !prev)
  }
  // 获取首次加载页面时的默认交易列表
  const handleFirstLoaded = (data: TrackGraph, addr: string) => {
    const node = data.node_list.find((node) => node.address === longAddr)
    const { seedList, receiveList } = GraphFactory.getTransactionList({
      node_list: data.node_list,
      edge_list: data.edge_list
    }, node?.id || "")
    setTxTrades({
      address: longAddr ?? address,
      nodeId: node?.id || "",
      seed: seedList,
      receive: receiveList
    })

  }
  useEffect(() => {
    if (graphId) {
      fetchAtlasData()
    } else {
      fetchTrackData()
    }

  }, [])
  useEffect(() => {
    if (full) {
      setOpen(false)
    }
  }, [full])
  return (
    <Card style={{ width: '100%', borderRadius: '8px', boxShadow: "5px 5px 10px #ccc", }}
      bodyStyle={{ padding: '16px', }}>
      <Row style={{
        fontSize: '16px',
        paddingBottom: '8px',
        lineHeight: '32px'
      }} justify={"space-between"} align={"middle"}>
        <Col>
          {t("track_jobs.transaction_graph")}
        </Col>
        {!graphId &&
          <Col>
            <Button onClick={() => { setOpenTrend(true) }}>
              {t("track_jobs.new_investigation")}
            </Button>
          </Col>
        }
      </Row>
      <FullScreen handle={handleFullScreen} onChange={setFull}>
        <div className={'graph_out_div'} id="graph_out">
          <div style={{ width: open ? "calc(100% - 450px)" : 'calc(100% - 10px)', position: 'relative' }}>
            <Spin className="loading"
              spinning={loading}
              tip={t("graph_tip.date_loading")}
              size={"large"}
            >
              <GraphCanvas
                factor={factor}
                graphId={graphId}
                dateRef={dateRef}
                setCanvasLoading={setLoading}
                setFull={setFull}
                handleFull={handleFullScreen}
                setGraphData={setGraphData}
                onDoubleClickNode={(tx) => {
                  if (tx.seed && tx.receive) {
                    setTxTrades({
                      address: tx.address ?? address,
                      nodeId: tx.nodeId,
                      seed: tx.seed,
                      receive: tx.receive
                    })
                  }
                }}
              />
            </Spin>
          </div>
          <GraphDrawer
            open={open}
            factor={factor}
            openDrawer={handleOpenDrawer}
            txTrades={txTrades}
            onClickSearch={handleTimeRangeSearch}
            dateRange={dateRange}
            txDateRange={txDateRange}
            onChangeDateRanger={(dataStrings) => {
              if (dataStrings) {
                setDateRange({
                  start: DateUtil.dateStringToTimesTamp(dataStrings[0]) / 1000,
                  end: (DateUtil.dateStringToTimesTamp(dataStrings[1]) + 86400000) / 1000
                })
                dateRef.current = {
                  start: DateUtil.dateStringToTimesTamp(dataStrings[0]) / 1000,
                  end: (DateUtil.dateStringToTimesTamp(dataStrings[1]) + 86400000) / 1000
                }
              }
            }}
            onSelectTrade={(nodeId, selected, isSeed) => {
              const { nodeList, edgeList } = factor.selectedTradeList(nodeId, selected, txTrades.address, isSeed)
              setGraphData({
                ...graphData,
                view: {
                  node_list: nodeList,
                  edge_list: edgeList
                }
              })
            }}
            // 交易类型筛选————只看支出或只看收入，无论聚焦在哪个节点，统一以根节点作为支出，收入的筛选对象
            onFilter={(transType, addressType) => {
              const { viewGraphData, filterSeedList, filterReceiveList } = factor.dataFilter(transType, addressType, txTrades.nodeId)
              setGraphData({
                ...graphData,
                view: viewGraphData
              })
              setTxTrades({
                ...txTrades,
                seed: filterSeedList,
                receive: filterReceiveList
              })
            }}
          />
        </div>
        {/* 创建追踪任务探出窗 */}

        <Dialog
          open={openCreateTrend}
          title={t("track_jobs.new_investigation")}
          okText={t("dialog.confirm")}
          confirmLoading={confirmLoading}
          onCancel={() => setOpenTrend(false)}
          onOk={handleSaveGraph} >
          <p>
            <em>*</em>
            {t("menubar.track_jobs")}
          </p>
          <Input
            placeholder={t("track_jobs.please_input_name")}
            value={trackName}
            onChange={handleInputTrendName}
            maxLength={12}
          />
          <p>{t("track_jobs.track_note")}</p>
          <TextArea
            value={trackNotes}
            onChange={handleInputTrendNodes}
            autoSize={{ minRows: 3, maxRows: 6 }} />
        </Dialog>
      </FullScreen>
    </Card>
  )
}

export default TransactionGraph
function setShowSave(arg0: boolean) {
  throw new Error("Function not implemented.");
}

