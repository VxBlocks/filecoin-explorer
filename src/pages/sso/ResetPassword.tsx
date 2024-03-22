import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {Spin} from "antd";
import {extractIdentityToken} from "../../utils/IdentityToken";
import {useNavigate} from "react-router";
import {RESET_PASSWORD} from "../../constant/Global";

export default function ResetPassword() {
    let location = useLocation();
    const [isLoading, setLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        setLoading(true)
        if (location && location.search) {
            const processToken = extractIdentityToken(location.search);
            if (processToken) {
                window.location.replace(RESET_PASSWORD + `?token=${processToken}`)
            }
            setLoading(false)
        }

    }, [location])
    return (isLoading ? <div style={{textAlign: 'center', marginTop: '140px'}}><Spin size={'large'}/></div> : <></>)
}