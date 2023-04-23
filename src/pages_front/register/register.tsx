import React, {useState, useEffect} from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import Cat from "../../Assets/image/cat.svg";
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import {Form, Button} from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { registerInfo } from "./registerType";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../actions/userActions";

function Register() {

    const initailRegisterInfo : registerInfo = {
        email:'',
        password:'',
        role:'',
        user_class:''
    }

    const [myuUserRegisterInfo, setMyUserRegisterInfo] = useState<registerInfo>(initailRegisterInfo);
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const [role, setRole] = useState<string>('user');
    const [userClass, setUserClass] = useState<string>('');
    const [show, setShow] = useState<boolean>(true);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userRegister = useSelector((state:any) => state.userRegister)
    const { error, userRegisterInfo } = userRegister

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(register(email, password, role, userClass))
    };

    // 检测到注册成功就跳转到 login
    useEffect(() => {
        if(userRegisterInfo) {
            console.log(userRegisterInfo)
            navigate('/login',{replace: true})
        }
    },[userRegisterInfo])

    return (
        <section>
            <Container className="login-content">
            <Row>
                <Col className="login">
                { show && error &&
                    <Alert 
                        variant='danger' 
                        className="login-alert" 
                        onClose={() => setShow(false)}
                        dismissible>
                        Error: The email has been registered!
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
                <Form.Group className="mb-3" controlId="userclass">
                    <Form.Label>Input your class</Form.Label>
                    <Form.Control 
                      type="input"
                      placeholder="Input your class" 
                      value={userClass} 
                      onChange={(e)=>setUserClass(e.target.value)}/>
                </Form.Group>
                <Form.Label>Choose Role</Form.Label>
                <Form.Select 
                    onChange={(e)=>setRole(e.target.value)}
                    aria-label="Default select example"
                    value={role}>
                    <option value="user">User</option>
                    <option value="manager">Administer</option>
                </Form.Select>
                <Button type="submit" variant="primary">REGISTER</Button>
                </Form>
                <div className="login-option">
                  Have an Account? <Link to="/login">Login</Link>
                </div>
                </Col>

                <Col>
                  <img src={Cat} style={{ height: '300px' }} />
                </Col>
            </Row>
            </Container>
        </section>
    );
}

export default Register;
