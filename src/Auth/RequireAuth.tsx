import React from "react";
import { fakeAuthProvider } from "./auth";
import AuthContext from "./authContext";

export function RequireAuth({ children }: { children: JSX.Element }) {
    return children;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    let signin = (newUser: string, callback: VoidFunction) => {
        return fakeAuthProvider.signin(() => {
            localStorage.setItem("token", newUser)
            localStorage.setItem("currentRefreshTime", "1m")
            callback();
        });
    };

    let signout = (callback: VoidFunction) => {
        return fakeAuthProvider.signout(() => {
            // TODO 退出登录清除 localStorage 的数据
            callback();
        });
    };

    let value = { signin, signout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}