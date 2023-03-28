import React, {useState} from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cat from "../../Assets/image/cat.svg";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {Form, Button} from 'react-bootstrap';
import { loginInfo } from "./loginType";

function Login() {

    const initailLoginInfo : loginInfo= {
        email:'',
        password:'',
        rememberMe:false,
    }

    const [userLoginInfo, setUserLoginInfo] = useState<loginInfo>(initailLoginInfo);

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
            console.log(e);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <section>
            <Container className="login-content">
            <Row>
                <Col className="login">
                <Form onSubmit={handleSubmit}>
                <Form.Group 
                  className="mb-3" 
                  controlId="exampleForm.ControlInput1"
                  onChange={(e) => console.log(e)}>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" />
                </Form.Group>
                <Form.Label>Choose Role</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option value="1">User</option>
                    <option value="2">Administer</option>
                </Form.Select>
                <Button variant="primary">LOG IN</Button>
                <Button variant="primary">REGISTER</Button>
                </Form>
                </Col>

                <Col>
                <img src={Cat} style={{ height: '500px' }} />
                </Col>
            </Row>
            </Container>
        </section>
    );
}

export default Login;
