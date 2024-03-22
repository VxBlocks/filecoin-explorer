import { AddressDetails } from './../pages/Details/AddressDetails/index';
import { ActionAnalysis, TrackGraph, UserInfoData } from '../model/response-model';
import { GraphSaveData } from '../model/public-model'
declare namespace API {
    type trackGraph = {
        success: boolean;
        msg: string;
        // track_graph_id: string;
        data: TrackGraph;
    };
    type address = {
        id: string;
        address: string;
        coin: string;
        name: string;
        recipient_email: string;
        monitor_status: number;
    };
    type trackJobs = {
        ok: boolean;
        msg: string;
        // track_graph_id: string;
        data: string;
    };

    type UserInfo = {
        status: string;
        data?: {
            username: string
            nick_name: string;
            email: string
            method: Method2FA;
            has_webauthn: boolean;
            has_totp: boolean;
            has_duo: boolean;
        }
        message?: string

    }
    type INFO = {
        data: UserInfoData;
        msg: string;
        ok: boolean;
    }
    /**
     * 地址交易行为分析接口
     */
    type ActionAnalysisParams = {
        coin: string;
        address: string;
    };
    type ActionAnalysisResp = {
        ok: boolean;
        msg: string;
        data: ActionAnalysis;
    };
    type ActionAddMonitor = {
        ok: boolean;
        msg: string;
        data: string;
    };
    type AddressDetails = {
        ok: boolean;
        msg: string;
        data: object;
    };
    type DeleteAttention = {
        ok: boolean;
        msg: string;
        count: number;
        data?: any;
    };
    type EchartNormal = {
        address: any;
    };
    type AtlasGraph = {
        ok: boolean
        message: string
        data: GraphSaveData
    };
    type TrackResp = {
        ok: boolean
        msg: string
        data: TrackTask
    }
}
