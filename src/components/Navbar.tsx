import React, { useState } from "react";
import { Navbar, Nav,Container, NavDropdown, Form, Button} from "react-bootstrap";
import CatAndDog from '../Assets/image/catanddog.svg'
import { Link } from "react-router-dom";

function NavBar() {

  return (
    <Navbar variant="light" bg="transparent">
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
              <NavDropdown.Item href="/caselearn">Case Learning</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Duty Learning</NavDropdown.Item>
            </NavDropdown>

            <Nav.Item>
              <Nav.Link as={Link} to="/guide"> Guide </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/exam"> Exam </Nav.Link>
            </Nav.Item>

            <NavDropdown title="User">
              <NavDropdown.Item href="/userinfo">Information</NavDropdown.Item>
              <NavDropdown.Item href="/">Management System</NavDropdown.Item>
              <NavDropdown.Item href="/">Log Out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
         </Navbar.Collapse>

         <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Pealse input"
            className="me-2"
            aria-label="Search"
          />
          <Button variant="primary" style={{marginRight:'5rem'}}>Search</Button>
        </Form>
       </Container>
     </Navbar>
  );
}

export default NavBar;
