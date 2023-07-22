import { Button, Col, Form, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../slices/userApiSlice";
import Loader from "../components/Loader";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";


const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, {isLoading}] = useLoginMutation();
  //console.log(useLoginMutation());
  //Note: This hook returns an array with two elements: a function can be named anything here mentioned as "login"
  //and an object containing mutation-related properties such as isLoading, data, error, etc. So we just destructured with neccessary

  const submitHandler = async (e) => {
    e.preventDefault();

    //Sending entered email password from form and making post request to /api/users/login with the help of login()
    //getting the response(user Info details) and send those details to dispatch to set the userInfo state.
    try {
      const res = await login({email, password}).unwrap();
      //console.log(res);
      dispatch(setCredentials({...res}));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  }

    //Below codes for if the user is logged in (userInfo exists) and redirects 
    //them to a specific path (redirect) if they are already authenticated.
    //Ex without login user can navigate until to add to cart page once the click the add to cart button they will redirect to sign up page.

    const { userInfo } = useSelector((state) => state.auth);

    // Accessing properties of the location object(search --> the query string parameters)
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";
  
    useEffect(() => {
      if(userInfo) {
        navigate(redirect);
      }
    }, [navigate, redirect, userInfo]);

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => { setEmail(e.target.value) }}>
          </Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => {setPassword(e.target.value)}}>
          </Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading} >
          Sign In
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          New Customer? {" "}
          <Link to={redirect ? `/register?redirect=${redirect}`: "/register" }>Register</Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong style={{color: "red"}}>Please login with below credentials for Demo!</strong></p>
        </Col>
      </Row>
      <Row>
        <Col>
          <strong>Email </strong>: demo123@mail.com
        </Col>
      </Row>
      <Row>
        <Col>
        <strong>Password </strong>: demo@user@123
        </Col>
      </Row>
    </FormContainer>
  )
}


export default LoginScreen;



/*
Notes:
------
unwrap();
----------
In Redux RTK Query, the unwrap() method is used to unwrap the data from a successful API response.

If the API response is successful (status 200-299), unwrap() returns the data directly. 
However, if the API response contains an error (status outside of 200-299), unwrap() will throw an error with the appropriate status 
and error message.

If we used try... catch() for error handeling for API call, 
The catch block in the code handles the errors thrown by unwrap() and displays appropriate error messages to the user.

*/
