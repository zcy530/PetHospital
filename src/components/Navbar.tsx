import React, { useState } from "react";
import { Navbar, Nav,Container, NavDropdown, Form, Button} from "react-bootstrap";
import CatAndDog from '../Assets/image/catanddog.svg'
import { Link } from "react-router-dom";

function NavBar() {

  return (
    <Navbar variant="light" bg="transparent" expand="lg">
      <Container>
        
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
              <NavDropdown.Item href="/caselearn">病例学习</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">角色扮演</NavDropdown.Item>
            </NavDropdown>

            <Nav.Item>
              <Nav.Link as={Link} to="/guide"> Guide </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/exam"> Exam </Nav.Link>
            </Nav.Item>

            <NavDropdown title="User">
              <NavDropdown.Item href="/userinfo">修改个人信息</NavDropdown.Item>
              <NavDropdown.Item href="/">后台管理系统</NavDropdown.Item>
              <NavDropdown.Item href="/">退出登录</NavDropdown.Item>
            </NavDropdown>
          </Nav>
         </Navbar.Collapse>

         <Form className="d-flex" style={{marginRight:'2rem'}}>
          <Form.Control
            type="search"
            placeholder="Pealse input"
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
