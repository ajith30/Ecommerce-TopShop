import { Button, Col, Form, Row } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useEffect, useState } from "react";
import { useRegisterMutation } from "../slices/userApiSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import Loader from "../components/Loader";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {userInfo} = useSelector((state) => state.auth);

  const [registerApiCall, {isLoading}] = useRegisterMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  //If user already logged in but trying to hit the register route then we want to redirect to home or whatever in the redirect params.
  useEffect(() => {
    if(userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if(password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await registerApiCall({name, email, password}).unwrap();
        //console.log(res);
        dispatch(setCredentials({...res}));
        //When use successfully registered imidiately redirecting to home("/") or respective redirect params
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  }

  return (
    <FormContainer>
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="name" placeholder="Enter name" value={name} onChange={(e) => {setName(e.target.value)}}>
          </Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => {setEmail(e.target.value)}}>
          </Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => {setPassword(e.target.value)}}>
          </Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm  Password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}}>
          </Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isLoading}>
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen;


