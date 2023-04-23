import React, {useEffect, useState} from "react";
import { Container, Row, Col } from "react-bootstrap";
import Cat from "../../Assets/image/cat.svg";
import { Form, Button } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Alert,Snackbar } from '@mui/material';
import axios from "axios";

const Forget = () => {
    const [emailcode, setemailcode] = useState<string>('');
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const [emailError, setemailError] = useState<boolean>(false);
    const [emailcodeError, setemailcodeError] = useState<boolean>(false);

    const navigate = useNavigate()

    const userLogin = useSelector((state:any) => state.userLogin)
    const { error, userInfo } = userLogin

    const handleClose1 = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setemailcodeError(false);
    };    
    
    const handleClose2 = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setemailError(false);
    };

    const sendEmail = () => {
        axios({
            url: 'https://47.120.14.174:443/petHospital/user/code?email=' + email,
            method: "post",
          }).then(res => {
            console.log(res);
          }).catch(err => {
            setemailError(true);
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
            setemailcodeError(true);
          })
    }
    return (
        <section>
            <Container className="login-content">
            <Row>
              {
                emailError && 
                <Snackbar open={emailError} autoHideDuration={800} onClose={handleClose2}>
                  <Alert onClose={handleClose2} severity="warning" sx={{ width: '50%' }}>
                    该邮箱不存在！
                  </Alert>
                </Snackbar>
              }
              {
                emailcodeError && 
                <Snackbar open={emailcodeError} autoHideDuration={800} onClose={handleClose1}>
                  <Alert onClose={handleClose1} severity="warning" sx={{ width: '50%' }}>
                    邮箱或验证码错误！
                  </Alert>
                </Snackbar>
              }
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