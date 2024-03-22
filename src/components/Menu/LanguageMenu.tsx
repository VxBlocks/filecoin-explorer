import {Menu, MenuProps} from "antd";
import i18n from "i18next";
import * as React from "react";
import "../public.less"


export const LanguageMenu = () => {
  const handleOnClick : MenuProps['onClick'] = ({ key })  => {
    switch (key) {
      case "zh" :
        i18n.changeLanguage("zh");
        break;
      case "en":
        i18n.changeLanguage("en");
        break;
      default:
        i18n.changeLanguage("zh");
    }
  }

  return (
    <Menu className={'css-navbar-drop-down'} onClick={handleOnClick}  items={[
      {
        key: "zh",
        label: (
          <span className={'css-navbar-drop_down'} >中文</span>
        )
      },
      {
        type:'divider',
      },
      {
        key: "en",
        label: (
          <span className={'css-navbar-drop_down'} >English</span>
        )
      },
    ]}/>
  )
}

