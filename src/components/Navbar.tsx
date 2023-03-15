import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";

function NavBar() {

  return (
    <Navbar bg="transparent">
      <Container>
        <Navbar.Brand href="#home">宠物医院</Navbar.Brand>
        <Navbar.Collapse>

          <Nav defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link as={Link} to="/">首页</Nav.Link>
            </Nav.Item>

            <NavDropdown title="学习">
              <NavDropdown.Item href="#action/3.1">病例学习</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">角色扮演</NavDropdown.Item>
            </NavDropdown>

            <Nav.Item>
              <Nav.Link as={Link} to="/guide"> 医院导览 </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/exam"> 考试 </Nav.Link>
            </Nav.Item>
          </Nav>

         </Navbar.Collapse>
       </Container>
     </Navbar>
  );
}

export default NavBar;
