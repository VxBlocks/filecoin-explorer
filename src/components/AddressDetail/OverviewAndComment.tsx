import {Card, Col, Row} from "antd";
import {EchartRadar} from "./EchartRadar";
import React from "react";
import {useTranslation} from "react-i18next";

export const OverviewAndComment=()=>{
    const {t} = useTranslation()
    return(
        <Card style={{boxShadow:"5px 5px 10px #ccc",borderRadius:"8px"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
                <div style={{width:"50%"}}>
                    <h2><strong>{t("track_jobs.overview")}</strong></h2>
                    <Row>
                        <Col push={4}>
                            {[1,2,3,4].map(t=><div key={t}>
                                <p style={{margin:0}}>余额</p>
                                <p>544,284.142 DAI</p>
                            </div>)}
                        </Col>
                        <Col push={8}>
                            {[1,2,3,4].map(t=><div key={t}>
                                <p style={{margin:0}}>余额</p>
                                <p>544,284.142s DAI</p>
                            </div>)}
                        </Col>
                    </Row>
                </div>
                <EchartRadar/>
            </div>
        </Card>
    )
}