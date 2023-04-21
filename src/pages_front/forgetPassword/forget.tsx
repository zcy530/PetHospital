import React, {useEffect, useState} from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import Cat from "../../Assets/image/cat.svg";
import { Form, Button } from 'react-bootstrap';
import { forgetInfo } from "./forgetType";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Forget = () => {
    // const initailForgetInfo : forgetInfo = {
    //     email:'',
    //     password:'',
    //     code:'',
    // }

    // const [userForgetInfo, setUserForgetInfo] = useState<forgetInfo>(initailForgetInfo);
    const [emailcode, setemailcode] = useState<string>('');
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');

    const navigate = useNavigate()

    const userLogin = useSelector((state:any) => state.userLogin)
    const { error, userInfo } = userLogin

    useEffect(() => {

    },[email])
    const sendEmail = () => {
        axios({
            url: 'https://47.120.14.174:443/petHospital/user/code?email=' + email,
            method: "post",
          }).then(res => {
            console.log(res);
          }).catch(err => {
            console.log(err);
          })
    }
    const resetPassword = (e) => {
        e.preventDefault();
        axios({
            url: 'https://47.120.14.174:443/petHospital/user/password/forget',
            method: "patch",
            data: {'email': email,
                    'password': password,
                    'code': emailcode },
          }).then(res => {
            navigate('/login',{replace: true})
          }).catch(err => {
            console.log(err);
          })
    }
    return (
        <section>
            <Container className="login-content">
            <Row>
                {!userInfo &&                 
                <Col className="login">
                    <Form onSubmit={resetPassword}>
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
                    <Form.Group className="mb-3" controlId="userCode">
                    <Form.Label>Input your code</Form.Label>
                    <Form.Control 
                      type="input"
                      placeholder="Input your email code" 
                      value={emailcode} 
                      onChange={(e)=>setemailcode(e.target.value)}/>
                    </Form.Group>
                    <Button type="button" variant="primary" onClick={sendEmail}>SEND EMAIL</Button>
                    <Button type="submit" variant="primary">
                            RESET PWD
                    </Button>
                    </Form>
                    <div className="login-option">
                        Have an Account? <Link to="/login">Login</Link>
                    </div>
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

export default Forget;