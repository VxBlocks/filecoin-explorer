import request from '../utils/request';
import { API } from './typing';
import {
    ACTION_ANALYSIS,
    ADDMONITOR,
    ATTENTION,
    ATTENTION_DELETE,
    DELETEMONTIOR,
    DISPLAY,
    ECHARTNORMAL,
    ECHARTPIE,
    EDITMONITOR,
    LOGIN_OUT,
    MONITOR,
    SAVEGRAPH,
    TRACK_GRAPH_TRANS,
    TRACKTASK,
    TRACKTASKDETAIL,
    TRANSEFRLIST,
    TRANSFER,
    USER_INFO,
    WALLET,
    READ,
    ADDRESS_TAG,
    ADD_LABEL,
    DEL_LABEL,
    OAUTH,
    INFO,
} from '../constant/Global';
import { SaveGraph } from '../model/public-model';

export async function getTrackGraph(params: Object): Promise<API.trackGraph> {
    // const data = JSON.stringify(params)
    return await request.get(TRACK_GRAPH_TRANS, { params });
}

/**
 * 查询地址交易行为分析
 */
export async function requestActionAnalysis(params: API.ActionAnalysisParams): Promise<API.ActionAnalysisResp> {
    return await request.get(ACTION_ANALYSIS, { params });
}

//首页关注地址
export async function getAttention(params: Object): Promise<any> {
    return await request.get(ATTENTION, { params });
}

//取消关注地址
export async function DeleteAttention(params: Object): Promise<any> {
    return await request({
        url: ATTENTION_DELETE,
        method: 'DELETE',
        data: { ...params },
    });
}

//监控地址
export async function getMonitor(options: Object): Promise<any> {
    const res = await request.get(MONITOR, { params: options });
    return res;
}

// 添加监控地址
export async function addMonitor(options: Object): Promise<API.ActionAddMonitor> {
    return await request.post(ADDMONITOR, options);
}

// 编辑监控地址
export async function editMonitor(options: Object): Promise<API.ActionAddMonitor> {
    return await request.put(EDITMONITOR, options);
}

// 删除监控地址
export async function delMonitor(options: Object): Promise<API.ActionAddMonitor> {
    return await request.delete(DELETEMONTIOR, { params: options });
}
//删除地址标签
export async function delAddressTag(options: Object): Promise<any> {
    return await request.delete(DEL_LABEL, { params: options });
}

// 追踪任务
export async function getTrack(options: Object): Promise<API.TrackResp> {
    return await request.get(TRACKTASK, { params: options });
}
// 获取单个追踪任务
export async function getSingleTrack(params: string): Promise<API.TrackResp> {
    return await request.get(TRACKTASK + "/" + params)
}
// 修改追踪任务
export async function putTrack(params: string): Promise<API.trackJobs> {
    // const data = JSON.stringify(params);
    return await request.put(TRACKTASK, params)
}
// 删除追踪任务
export async function deleteTrack(params: Object): Promise<API.trackJobs> {
    const data = JSON.stringify(params)
    return await request.delete(TRACKTASK, { data: data })
}

// 追踪任务详情
export async function getTrackDetail(options: Object) {
    return await request.get(TRACKTASKDETAIL, { params: options });
}

//监控动态
export async function getTransfer(params: Object) {
    return await request.get(TRANSFER, { params });
}

// 监控动态列表
export async function getTransferList(params: Object): Promise<any> {
    return await request.get(TRANSEFRLIST, { params });
}

// 地址概览
export async function getAddressDisplay(params: Object): Promise<API.AddressDetails> {
    return await request.get(DISPLAY, { params });
}

// 交易行为分析
export async function getEchartPieApi(params: Object): Promise<API.AddressDetails> {
    return await request.get(ECHARTPIE, { params });
}

//添加关注地址
export async function getWalletAddressTitleApi(params: Object): Promise<API.ActionAddMonitor> {
    return await request.post(WALLET, { ...params });
}

//交易时间分析
export async function getEchartNormalApi(params: API.EchartNormal): Promise<API.ActionAddMonitor> {
    return await request.get(ECHARTNORMAL, { params });
}

// 保存交易图谱
export async function putGraphData(data: SaveGraph): Promise<any> {
    const params = JSON.stringify(data);
    return await request.put(SAVEGRAPH, params);
}
// 获取保存的交易图谱数据
export async function getAtlasData(params: { track_graph_id: string }): Promise<API.AtlasGraph> {
    return await request.get(SAVEGRAPH, { params })
}
// 追踪任务
export async function postTrack(params: {
    track_graph_id: string;
    address: string;
    coin: string;
    name: string;
    note: string;
}): Promise<API.trackJobs> {
    const data = JSON.stringify(params);
    return await request.post(TRACKTASK, data);
}

// 获取用户信息
// export async function getUserInfo(): Promise<API.UserInfo> {
//     return await request.post(USER_INFO);
// }
export async function getUser():Promise<API.INFO> {
    return await request.get(INFO, {});
}
export async function gitHubOAutu(): Promise<API.INFO> {
    const gURL = `${OAUTH}/?client_id=770cb0760a84b48925ba&response_type=code&scope=read%3Auser+user%3Aemail&state=2bdcc87d-5c47-450b-949b-35c68109078d`
    return await request.get(gURL, { baseURL: "" })
}
// export async function user_info(): Promise<API.INFO> {
//     return await request.get(USER_INFO_URL)
// }
// export async function user_login(): Promise<API.INFO> {
//     return await request.post(USER_LOGIN)
// }
/**
 * 退出登录
 */
export async function loginOut(options?: { [key: string]: any }): Promise<{
    status: string;
    message?: string;
}> {
    return  await request.post(LOGIN_OUT);
}

// 地址标记
export async function getAddressTag(params: Object): Promise<API.DeleteAttention> {
    return await request.get(ADDRESS_TAG, { params });
}
// 地址标签添加接口
export async function addlabel(options: Object): Promise<any> {
    return await request.post(ADD_LABEL, options);
}
// 添加地址标记

// 已读

export async function read(options: Object) {
    return await request.put(READ, options);
}
