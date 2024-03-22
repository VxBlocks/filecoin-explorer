import { message } from "antd"

message.config({
    duration: 1.5,
    maxCount: 1,
    // rtl: true,
})
export const ToolTip = {
    success(content?: string) {
        message.success({
            content: content,
            style:{
                marginTop: '15vh'
            }
        })
    },
    warn(content?:string) {
        message.warn({
            content: content,
            style:{
                marginTop: '15vh'
            }
        })
    },
    error(content?:string){
        message.error({
            content: content,
            style:{
                marginTop: '15vh'
            }
        })
    }
}