import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

function NavBar() {

  return (
    <Navbar>
      <Container>
        <Navbar.Collapse>
          <Nav defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link as={Link} to="/">Home</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/learn">Learn</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/guide"> Guide </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/exam"> Exam </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
