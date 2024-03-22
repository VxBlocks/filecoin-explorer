import {useRemoteCall} from "./RemoteCall";
import {getUser} from "../servers/api";

/**
 * 获取用户信息hook
 */
export function useUserInfoState() {
    return useRemoteCall(userInfo, []);
}
 function userInfo() {
    return getUser();
}