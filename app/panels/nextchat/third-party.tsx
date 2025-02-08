import { Button, Col, Row } from "antd";
import DocsGPTIcon from "../../icons/cute_docsgpt.svg"
import { useNavigate } from "react-router-dom";

export function ThirdParty(){
    const navigate = useNavigate()
    return <Row gutter={8}>
        <Col span={12}>
            <Button style={{ width: "100%" }} icon={<DocsGPTIcon width={16} height={16} viewBox="2 2 14 14"/>} onClick={()=>{
                navigate("/docsgpt")
            }}>
                DocsGPT
            </Button>
        </Col>
        <Col span={12}></Col>
    </Row>
}