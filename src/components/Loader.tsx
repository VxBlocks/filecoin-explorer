/** @format */

import * as React from 'react';
import {Content} from 'antd/es/layout/layout';
import {Outlet} from 'react-router';

/**
 * @description
 * 页面主要内容显示区域
 * Layout布局风格组件
 * */
interface PropsData {
    element: any;
}

const Loader = (props: PropsData) => {
    return (
        <Content
            className="site-layout-background"
            style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
            }}
        >
            <div className="site-layout-background">{props.element}</div>
        </Content>
    );
};
export default Loader;
