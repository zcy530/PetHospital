import React, {useEffect, useState} from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cat from "../../Assets/image/cat.svg";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {Form, Button} from 'react-bootstrap';
import { loginInfo } from "./loginType";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/userActions";
import { createHashHistory } from "@remix-run/router";

const customHash = createHashHistory();

const Login = ({location, history}) => {

    const initailLoginInfo : loginInfo= {
        email:'',
        password:'',
        rememberMe:false,
    }

    const [userLoginInfo, setUserLoginInfo] = useState<loginInfo>(initailLoginInfo);
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);

    const dispatch = useDispatch()

    const userLogin = useSelector((state:any) => state.userLogin)
    const { loading, error, userInfo } = userLogin

    // const redirect = location.search.split('=')[1]

    // useEffect(() => {
    //     if(userInfo) {
    //         console.log(userInfo)
    //         console.log(window.location.href)
    //         customHash.replace('/guide')
    //     }
    // },[history, userInfo])

    const submitHandler = (e) => {
        
        e.preventDefault()
        dispatch(login(email, password))
    };

    return (
        <section>
            <Container className="login-content">
            <Row>
                {!userInfo &&                 
                <Col className="login">
                <Form onSubmit={submitHandler}>
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
                <Button type="submit" variant="primary">LOG IN</Button>
                <Button type="submit" variant="primary">REGISTER</Button>
                </Form>
                </Col>
                }
                {userInfo &&
                <Col className="home-header">
                    <h1 style={{ paddingBottom: 15 }}>
                        Hi There!{" "} 
                        <span className="wave" role="img" aria-labelledby="wave">👋🏻</span>
                    </h1>
                    <h1 style={{ paddingBottom: 15 }}>
                        <strong> Weclome to virtual pet hospital</strong>
                    </h1>
                </Col>
                }


                <Col>
                <img src={Cat} style={{ height: '500px' }} />
                </Col>
            </Row>
            </Container>
        </section>
    );
}

export default Login;
