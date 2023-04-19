import React, { useState } from "react";
import { Navbar, Nav,Container, NavDropdown, Form, Button} from "react-bootstrap";
import CatAndDog from '../Assets/image/catanddog.svg'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import { Alert } from "react-bootstrap";

const NavBar = () => {

  const dispatch = useDispatch();
  const userLogin = useSelector((state:any) => state.userLogin)
  const { userInfo } = userLogin
  const [show, setShow] = useState<boolean>(true);

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <>
    <Navbar variant="light" bg="transparent">
      <Container className="mynavbar">
        
        <Navbar.Brand>
          <img src={CatAndDog} style={{height:'60px'}}>
          </img>
        </Navbar.Brand>

        <Navbar.Collapse>
          <Nav defaultActiveKey="home" className="justify-content-center" style={{ flex: 1}}>
            <Nav.Item>
              <Nav.Link 
                as={Link} 
                onClick={() => setShow(true)}
                to={userInfo? "/" : "/login"} >
                  Home
              </Nav.Link>
            </Nav.Item>

            <NavDropdown title="Learn">
              <NavDropdown.Item >
                <Nav.Link 
                  as={Link} 
                  onClick={() => setShow(true)}
                  to={ userInfo? "/caselearn" : "/login" }>
                   Case Learning
                </Nav.Link>
              </NavDropdown.Item>
              <NavDropdown.Item >
                <Nav.Link 
                  as={Link} 
                  onClick={() => setShow(true)}
                  to={ userInfo? "/dutyLearn" : "/login"} >
                   Duty Learning
                </Nav.Link>
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Item>
              <Nav.Link 
                as={Link} 
                onClick={() => setShow(true)}
                to={ userInfo? "/guide" : "/login" } > 
                 Guide 
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link 
                as={Link} 
                onClick={() => setShow(true)}
                to={ userInfo? "/exam" : "/login" }> 
                 Exam 
              </Nav.Link>
            </Nav.Item>

            <NavDropdown title="User">
              {userInfo ? (
                <NavDropdown.Item onClick={logoutHandler} >
                  <Nav.Link as={Link} to="/login">Log out</Nav.Link>
                </NavDropdown.Item>
              ) : (
                <NavDropdown.Item>
                  <Nav.Link as={Link} to="/login">Log in</Nav.Link>
                </NavDropdown.Item>
              )}

              <NavDropdown.Item>
                <Nav.Link 
                  as={Link} 
                  onClick={() => setShow(true)}
                  to={ userInfo? "/userinfo" : "/login" }>
                   Information
                </Nav.Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Nav.Link 
                  as={Link} 
                  onClick={() => setShow(true)}
                  to={ userInfo? "/systemManage" : "/login" }>
                    Management System
                </Nav.Link>
              </NavDropdown.Item>

            </NavDropdown>
          </Nav>
         </Navbar.Collapse>

         <Form className="d-flex">
          <Form.Control
            type="input"
            placeholder="Please input"
            className="me-2"
            aria-label="Search"
          />
          <Button variant="primary">Search</Button>
        </Form>
       </Container>
     </Navbar>
     { show && !userInfo &&
      <Alert 
        variant='warning' 
        className="navbar-alert" 
        onClose={() => setShow(false)}
        dismissible>
        Warning: You must login first, then you can visit this website!
      </Alert>
      }

    </>
  );
}

export default NavBar;
