import { Button, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";


const ShippingScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  //Once these shipping address details set to state and local storag, initializing the below states to values from state if exists
  //So, that once we sumbmit the adderss even if we navigate different pages come to shipping page form still filled with entered data. 
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({address, city, postalCode, country}));
    navigate("/payment");
  }

  return (
    <div>
      <FormContainer>
        <CheckoutSteps step1 step2 />

        <h1>Shipping</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="my-2" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" placeholder="Enter address" value={address} required onChange={(e) => {setAddress(e.target.value)}}>
            </Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" placeholder="Enter city" value={city} required onChange={(e) => {setCity(e.target.value)}}>
            </Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control type="text" placeholder="Enter postal code" value={postalCode} required onChange={(e) => {setPostalCode(e.target.value)}}>
            </Form.Control>
          </Form.Group>

          <Form.Group className="my-2" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control type="text" placeholder="Enter country" value={country} required onChange={(e) => {setCountry(e.target.value)}}>
            </Form.Control>
          </Form.Group>

          <Button type="submit" varient="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </div>
  )
}

export default ShippingScreen;
