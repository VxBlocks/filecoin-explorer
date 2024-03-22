export const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;
export const WS_URL = `${process.env.REACT_APP_WS_URL}`;

/**
 * 接口后缀
 */

// 登录地址
export const LOGIN_IN_URL = "https://analyzer.imfil.io/api/v1/fil/user/login/casdoor"

export const AUTH_SSO = "https://analyzer.filcoin.xyz:8901/auth"

export const RESET_PASSWORD = AUTH_SSO + "/reset-password/step2"

// 交易图谱mock数据
export const TRACK_GRAPH = '/api/v1/address_graph_analysis';
// 交易图谱数据
export const TRACK_GRAPH_TRANS = '/api/v1/fil/transactiontable';
/**
 * 行为分析接口
 */
export const ACTION_ANALYSIS = '/api/v1/fil/action/analysis';

//首页关注地址
export const ATTENTION = '/api/v1/fil/follow/follow_address_list';
//取消关注接口
export const ATTENTION_DELETE = '/api/v1/fil/follow/follow_address_cancel';
//监控地址
export const MONITOR = '/api/v1/fil/monitor/address/list';
// 添加监控地址
export const ADDMONITOR = '/api/v1/fil/monitor/address';
// 编辑监控地址 
export const EDITMONITOR = '/api/v1/fil/monitor/address/detail';
// 删除监控地址
export const DELETEMONTIOR = '/api/v1/fil/monitor/address/delete';
//监控动态
export const TRANSFER = '/api/v1/fil/transfer/list';
// 监控动态列表
export const TRANSEFRLIST = '/api/v1/fil/transfer/monitor_transfer_list';
//追踪任务
export const TRACKTASK = '/api/v1/fil/tracktask';
export const TRACKTASKDETAIL = '/api/v1/track_task_detail';

//地址概览
export const DISPLAY = '/api/v1/fil/overview/address_overview'
// // 交易行为分析
export const ECHARTPIE = '/api/v1/fil/action/analysis'
//添加关注地址
export const WALLET = '/api/v1/fil/follow/follow_address'

export const ECHARTNORMAL = '/api/v1/fil/transaction'

// 保存交易图谱
export const SAVEGRAPH = '/api/v1/fil/atlas'


/**
 * 获取用户信息
 */
export const USER_INFO = "/sso/api/user/info"
export const OAUTH = "https://analyzer.imfil.io/api/v1/fil/user/login/github"
export const INFO = "/api/v1/fil/user/info"
/**
 * 退出登录
 */
export const LOGIN_OUT = "/sso/api/logout"

// 已读

export const READ = '/api/v1/fil/transfer/monitor_transfer_read';
export const ADD_LABEL = '/api/v1/fil/labels/add_label';

// 地址标签
export const ADDRESS_TAG = '/api/v1/fil/labels/labels'
export const DEL_LABEL = '/api/v1/fil/labels/del_label'


