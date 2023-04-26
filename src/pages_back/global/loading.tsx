import { Spin, Row, Col, Image } from "antd";
import React from "react";
import Cat from "../../Assets/image/cat2.png";

const Loading = () => {
    return (

        <section>

            <Row>

                {/* <Col >
                    <Image src={Cat} width={300} height={300} />
                </Col> */}

                <Col style={{ marginTop: 300, marginLeft: 150 }}>

                    <h1 style={{ paddingBottom: 15 }}>
                        疯狂加载中
                    </h1>
                    <h1 style={{ paddingBottom: 15 }}>
                        <strong> 不要走开喵……</strong>
                    </h1>

                </Col>
                <Col style={{ marginTop: 300 }}>
                    <Spin size="large" style={{ color: "black" }}>
                        <div className="content" />
                    </Spin>
                </Col>


            </Row>


        </section>




    );
}
export default Loading;