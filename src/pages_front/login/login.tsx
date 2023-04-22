import React, {useEffect, useState} from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import Cat from "../../Assets/image/cat.svg";
import { Form, Button } from 'react-bootstrap';
import { loginInfo } from "./loginType";
import { useDispatch, useSelector } from "react-redux";
import { login, registerout } from "../../actions/userActions";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

    const initailLoginInfo : loginInfo= {
        email:'',
        password:'',
        rememberMe:false,
    }

    const [userLoginInfo, setUserLoginInfo] = useState<loginInfo>(initailLoginInfo);
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(true);

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // 从 redux 拿到全局的 userInfo state
    const userLogin = useSelector((state:any) => state.userLogin)
    const { error, userInfo } = userLogin
    const userRegister = useSelector((state:any) => state.userRegister)
    const { userRegisterInfo } = userRegister

    // 检测到登录成功就跳转到 home
    useEffect(() => {
        if(userInfo) {
            console.log(userInfo)
            navigate('/',{replace: true})
        }
    },[userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        // 执行登录动作
        dispatch(login(email, password))
        dispatch(registerout())
    };

    return (
        <section>
            <Container className="login-content">
            <Row>
                {!userInfo &&                 
                <Col className="login">
                
                    { show && userRegisterInfo && 
                    <Alert 
                        variant='success' 
                        className="login-alert" 
                        onClose={() => {setShow(false)}}
                        dismissible>
                        Register successfully! You can login and visit the website now!
                    </Alert>
                    }

                    { show && error &&
                    <Alert 
                        variant='danger' 
                        className="login-alert" 
                        onClose={() => setShow(false)}
                        dismissible>
                        Error: Wrong password!
                    </Alert>
                    } 
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
                    <Button type="button" variant="primary">FORGET PWD</Button>
                    </Form>
                    <div className="login-option">
                    New user having no account? <Link to="/register">Register</Link>
                    </div>
                    </Col>
                }

                <Col>
                <img src={Cat} style={{ height: '380px' }} />
                </Col>
            </Row>
            </Container>
        </section>
    );
}

export default Login;
