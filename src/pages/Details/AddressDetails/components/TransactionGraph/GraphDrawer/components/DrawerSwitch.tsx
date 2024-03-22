import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons"
import { Dispatch } from "react"


interface SwitchProps {
  open?: boolean
  openDrawer: () => void
}
export const DrawerSwitch = (props: SwitchProps) => {
  const {open, openDrawer} = props
  return (
    <>
    <div className={'graph_stow-switch'}>
            {
              open ?
                <DoubleRightOutlined onClick={openDrawer}/>
                :
                <DoubleLeftOutlined onClick={openDrawer} />
            }
          </div>
    </>
  )
}