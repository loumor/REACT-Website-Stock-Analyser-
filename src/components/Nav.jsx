import React from "react";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import { Button, Input, FormGroup, Badge } from "reactstrap"; 
import Modal from '@trendmicro/react-modal';
import { useState } from "react";
import { setlogInBool, setloginToken, setloginTokenType, setUsername } from "../variableSet.js";

// Response label for the register button 
function ResponseLabelRegister(props) {
  return (
    <p> <Badge color = "success">{ props.error }</Badge> { props.message }</p>
  );
}

// Response label for the login button 
function ResponseLabelLogin(props) {
  if (props.error) {
    localStorage.clear(); // Reset the stored data 
    setlogInBool(false);
    setTimeout(() => {  window.location.reload(false); }, 1000); // Give the system time to collect data from API
    return (
      <p> <Badge color = "success"></Badge>{ props.message }. Please try again.</p>
    );
  }

  if (!props.error) {
    setlogInBool(true); 
    setloginToken(props.token); 
    setloginTokenType(props.token_type);
    setUsername(props.username);  
    setTimeout(() => {  window.location.reload(false); }, 1000); // Give the system time to collect data from API
    return (
      <p> <Badge color = "success"></Badge>Logging in please wait...</p>
    );
  }

}


export default function Nav() {
  const [emailAddressReg, setEmailReg] = useState(""); // User registration email
  const [passwordUserReg, setPasswordReg] = useState(""); // User registration password 
  const [emailAddressLog, setEmailLog] = useState(""); // User login email
  const [passwordUserLog, setPasswordLog] = useState(""); // User login password 
  const [errorResponseReg, setErrorResponseReg] = useState(""); // Hold the return message from the server 
  const [responseLog, setResponseLog] = useState(""); // Hold the return message from the server 
  const [loginDone, setLoginDone] = useState(null); // Hold if login has been done or not 

  function registerUser() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: emailAddressReg,
        password: passwordUserReg
       })
    };
    fetch('http://131.181.190.87:3000/user/register', requestOptions)
      .then(response => response.json())
      .then(data => setErrorResponseReg(data));
  };

  function loginUser() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: emailAddressLog,
        password: passwordUserLog
      })
    };
    fetch('http://131.181.190.87:3000/user/login', requestOptions) 
      .then(response => response.json())
      .then(data => setResponseLog(data));
  };

  // Variables to pass to 'Banner' 
  let propsRegister = {
    error: errorResponseReg.error,
    message: errorResponseReg.message 
  }; 

  // Variables to pass to 'Banner' 
  let propsLogin = {
    token: responseLog.token, 
    token_type: responseLog.token_type, 
    expires: responseLog.expires,  
    error: responseLog.error,
    message: responseLog.message,
    username: emailAddressLog 
  }; 

  return (
    <nav>
      <ul>
        <li>
          <Link to ="/">Home</Link>
        </li>
        <li>
          <Link to ="/stocks">Stocks</Link>
        </li>
        <li>
          <Link to ="/quotes">Quotes</Link>
        </li>
        <li>
          <Link to ="/price_history">Price History</Link>
        </li>
        
        <li>
        
        <Popup modal trigger={ <Link>Register</Link> }> 
        { close => (
            <Modal 
            style={ { color: "black" } }
            showOverlay={ false }>
                <Modal.Header>
                    <Modal.Title>
                        Please Register Your Deatils!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <Input 
                            type="email"
                            placeholder="Email"
                            value = { emailAddressReg }
                            onChange={ event => {
                              const { value } = event.target;
                              setEmailReg(value); 
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            type="password"
                            placeholder="Password"
                            value = { passwordUserReg }
                            onChange={ event => {
                              const { value } = event.target;
                              setPasswordReg(value); 
                            }}
                        />
                    </FormGroup>
                </Modal.Body>
                <ResponseLabelRegister { ...propsRegister }/>
                <Modal.Footer>
                    <Button 
                    onClick={ close }
                    size = "sm">
                      Close </Button>
                    <Button
                    color = "info"
                    size = "sm" 
                    onClick = { event => {
                      registerUser();
                      setPasswordReg(""); // Clear the password from the screen
                      }}>
                    Register</Button>
                </Modal.Footer>
            </Modal>
            )}
          </Popup>
  
        </li>
        
        <li>

         <Popup modal trigger={ <Link>Login</Link> }>
         { close => (
            <Modal 
            style={ { color: "black" } }
            showOverlay={ false }>
                <Modal.Header>
                    <Modal.Title>
                        Please Enter Your Login Details!  
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <Input
                            type="email"
                            placeholder="Email"
                            value = { emailAddressLog }
                            onChange={ event => {
                              const { value } = event.target;
                              setEmailLog(value);
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Input
                            type="password"
                            placeholder="Password"
                            value = { passwordUserLog }
                            onChange={ event => {
                              const { value } = event.target;
                              setPasswordLog(value);
                            }}
                        />
                    </FormGroup>
                </Modal.Body>
                { loginDone != null ? <ResponseLabelLogin { ...propsLogin }/> : null }
                <Modal.Footer>
                    <Button 
                    onClick={ close }
                    size = "sm">
                      Close</Button>
                    <Button 
                    color = "info"
                    size = "sm"
                    onClick = { event => {
                      loginUser();
                      setPasswordLog(""); // Clear the password from the screen 
                      setLoginDone(true); // Login in attempt has been made 
                      }}>Log In</Button>
                </Modal.Footer>
            </Modal>
         )}
          </Popup>

        </li>
        <li className = "logoutButton">
          <Button 
          disabled = { !JSON.parse(localStorage.getItem('loginApproved')) }
          onClick={ event => {
          localStorage.clear(); // Clear all the stored data 
          window.location.reload(false);
        }}>Logout { localStorage.getItem('loginApproved') !== false ? localStorage.getItem('username') : false } </Button></li>
      </ul>
    </nav>
  );
}

