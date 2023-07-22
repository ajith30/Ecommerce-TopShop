
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../slices/orderApiSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { clearCartItems } from "../slices/cartSlice";
import Loader from "../components/Loader";


const PlaceOrderScreen = () => {
  const {shippingAddress, paymentMethod, cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice} = useSelector((state) => state.cart);
  
  const [createOrderApiCall, {isLoading, error}] = useCreateOrderMutation();
  //console.log(error);
  //Note: error is an object while rendering we have to specify the exact property that has error message. Like: error.data.message

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //If shippingAddress and PaymentMethod not filled redirecting to the respective page to fill
  useEffect(() => {
    if(!shippingAddress.address) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment")
    }
  }, [navigate, shippingAddress.address, paymentMethod]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrderApiCall({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  }
  
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address} {" "} 
                {shippingAddress.city} {" "} 
                {shippingAddress.postalCode}, {" "} 
                {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Methods:</h2>
              <strong>Method: </strong>
              {paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
            <h2>Order items</h2>
            {(cartItems.length === 0) ? (<Message>Your cart is empty.</Message>): (
              <ListGroup variant="flush">
                {cartItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} x ${item.price} = ${item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
            </ListGroup.Item>
          
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              
              {error && (
                <ListGroup.Item>
                  <Message varient="danger">{error.data.message}</Message>
                </ListGroup.Item>
              )}

              {/* <ListGroup.Item>
                {error && <Message varient="danger">{error.data.message}</Message>}
              </ListGroup.Item> */}
                  
              <ListGroup.Item>
                <Button type="button" className="btn-block" disabled={cartItems.length === 0} onClick={placeOrderHandler}>
                  Place Order
                </Button>
                { isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen;
