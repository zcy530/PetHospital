import React, {useState} from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cat from "../../Assets/image/cat.svg";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {Form, Button} from 'react-bootstrap';
import { loginInfo } from "../login/loginType";

function Register() {

    const initailLoginInfo : loginInfo= {
        email:'',
        password:'',
        rememberMe:false,
    }

    const [userLoginInfo, setUserLoginInfo] = useState<loginInfo>(initailLoginInfo);
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const [classmate, setClassmate] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);

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
                <Form.Group className="mb-3" controlId="useremail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="userpassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password"
                      placeholder="Input your password" 
                      value={password} 
                      onChange={(e)=>setPassword(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="userclass">
                    <Form.Label>Classmate</Form.Label>
                    <Form.Control 
                      type="input"
                      placeholder="Input your class number" 
                      value={classmate} 
                      onChange={(e)=>setClassmate(e.target.value)}/>
                </Form.Group>
                <Form.Label>Choose Role</Form.Label>
                <Form.Select aria-label="Default select example">
                    <option value="1">User</option>
                    <option value="2">Administer</option>
                </Form.Select>
                <Button type="submit" variant="primary">REGISTER</Button>
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

export default Register;
