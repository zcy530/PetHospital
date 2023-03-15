import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";

function NavBar() {

  return (
    <Navbar bg="transparent" expand="lg">
      <Container>
        <Navbar.Brand href="#home">宠物医院</Navbar.Brand>
        <Navbar.Collapse>

          <Nav defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link as={Link} to="/">Home</Nav.Link>
            </Nav.Item>

            <NavDropdown title="Learn">
              <NavDropdown.Item href="#action/3.1">病例学习</NavDropdown.Item>
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
            </NavDropdown>
          </Nav>

         </Navbar.Collapse>
       </Container>
     </Navbar>
  );
}

export default NavBar;
