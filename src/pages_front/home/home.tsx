import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cat from "../../Assets/image/cat.svg";

function Home() {
  return (
    <section>
        <Container className="home-content">
          <Row>
            <Col className="home-header">
              <h1 style={{ paddingBottom: 15 }}>
                Hi There!{" "} 
                <span className="wave" role="img" aria-labelledby="wave">👋🏻</span>
              </h1>
              <h1 style={{ paddingBottom: 15 }}>
                <strong> Weclome to virtual pet hospital</strong>
              </h1>
            </Col>

            <Col>
              <img src={Cat} style={{ height: '500px' }} />
            </Col>
          </Row>
        </Container>
    </section>
  );
}

export default Home;
