import React, { useState } from "react";
import { Navbar, Nav,Container, NavDropdown, Form, Button} from "react-bootstrap";
import CatAndDog from '../Assets/image/catanddog.svg'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";

const NavBar = () => {

  const dispatch = useDispatch();

  const userLogin = useSelector((state:any) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <Navbar variant="light" bg="transparent">
      <Container className="mynavbar">
        
        <Navbar.Brand>
          <img src={CatAndDog} style={{height:'60px'}}>
          </img>
        </Navbar.Brand>

        <Navbar.Collapse>
          <Nav defaultActiveKey="#home" className="justify-content-center" style={{ flex: 1}}>
            <Nav.Item>
              <Nav.Link as={Link} to="/" >Home</Nav.Link>
            </Nav.Item>

            <NavDropdown title="Learn">
              <NavDropdown.Item >
                <Nav.Link as={Link} to="/caselearn">Case Learning</Nav.Link>
              </NavDropdown.Item>
              <NavDropdown.Item >
                <Nav.Link as={Link} to="/dutyLearn">Duty Learning</Nav.Link>
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Item>
              <Nav.Link as={Link} to="/guide"> Guide </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/exam"> Exam </Nav.Link>
            </Nav.Item>

            <NavDropdown title="User">
              <NavDropdown.Item>
                <Nav.Link as={Link} to="/login">Log in</Nav.Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Nav.Link as={Link} to="/userinfo">Information</Nav.Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Nav.Link as={Link} to="/systemManage">Management System</Nav.Link>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={logoutHandler} >
                <Nav.Link >Log out</Nav.Link>
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
  );
}

export default NavBar;
