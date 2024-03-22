import {MenuProps} from 'antd';
import React from 'react';
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";

type Item = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: Item[],
    type?: 'group',
): Item {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as Item;
}

export const MenuItem = () => {
    const {t} = useTranslation()
    return [
        getItem(t("menubar.workspace"), '/', <img src={'/assets/work_bench.svg'} width={24} alt={''} />),
        getItem(t("menubar.track_jobs"), 'track', <img src={'/assets/icon_track.svg'} width={24} alt={''} />),
        getItem(t("menubar.monitor_address"), 'address', <img src={'/assets/jiankong.svg'} width={24} alt={''} />),
        getItem(t("menubar.monitor_move"), 'trend', <img src={'/assets/luxiang.svg'} width={24} alt={''} />),
        getItem(t("menubar.favorite_address"), 'follow', <img src={'/assets/favorites.svg'} width={24} alt={''} />),
    ] as Item[];
};
