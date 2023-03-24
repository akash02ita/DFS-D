import React from 'react'
import { Navbar, Nav, Form, FormControl, Button, InputGroup } from 'react-bootstrap'
import { Search, Funnel } from 'react-bootstrap-icons'
function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">
        <h1>DFS-D</h1>
        <h3>Distributed File System - Drive</h3>
      </Navbar.Brand>
      <InputGroup>
      <InputGroup.Text><Search /></InputGroup.Text>
      <FormControl type="text" placeholder="Search" />
      <InputGroup.Text><Funnel /></InputGroup.Text>
      </InputGroup>
    </Navbar>
  )
}

export default Header