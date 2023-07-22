import { Link, useParams } from "react-router-dom";
import { useGetOrderDetailsQuery, useGetPaypalClientIdQuery, usePayOrderMutation } from "../slices/orderApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify"

const OrderScreen = () => {
  const {id: orderId} = useParams();

  const {data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId);
  
  //Note: we are renaming propery names if they already exists in other hooks while destructuring.
  const [payOrderApiCall, {isLoading: loadingPay, error: payOrderError}] = usePayOrderMutation(); 

  const [{isPending}, paypalDispatch] = usePayPalScriptReducer(); //This hook comes from "@paypal/react-paypal-js"
  
  const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPaypalClientIdQuery();

  const {userInfo} = useSelector((state) => state.auth);


  //This useEffect hook ensures that the PayPal script is loaded only when the PayPal client ID is available, 
  //and it also checks if the order is not yet paid to initiate the payment process.
  useEffect(() => {
    if(!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD"
          }
        });

        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending"
        })
      }

      if (order && !order.isPaid) {
        if(!window.paypal) {
          loadPaypalScript();
        }
      }

    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  //PAYPAL payment related handlers
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrderApiCall({orderId, details});
        refetch();
        toast.success("Payment successfull")
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    })
  }

  async function onApproveTest() {
    await payOrderApiCall({orderId, details: { payer: {} }});
    refetch();

    toast.success("Payment successfull");
  }
  console.log(payOrderError);

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {value: order.totalPrice},
        }
      ]
    }).then((orderID) => {
      return orderID;
    })
  }



  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message varient="danger">{error.data.message}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup.Item>
            <h2>Shipping</h2>
            <p>
              <strong>Name: </strong>{order.user.name}
            </p>
            <p>
              <strong>Email: </strong>{" "}
              <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
            </p>
            <p>
              <strong>Address: </strong>
              {order.shippingAddress.address}, {" "}
              {order.shippingAddress.city}, {" "}
              {order.shippingAddress.postalCode}, {" "}
              {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <Message varient="success">Delivered on {order.deliverAt}</Message>
            ) : (
              <Message varient="danger">Not Delivered</Message>
            )}
          </ListGroup.Item>

          <ListGroup.Item>
            <h2>Payment Method</h2>
            <p>
              <strong>method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <Message varient="success">Paid on {order.paidAt}</Message>
            ) : (
              <Message varient="danger">Not Paid</Message>
            )}
          </ListGroup.Item>

          <ListGroup.Item>
            <h2>Order Items</h2>
            {(order.orderItems.length === 0) ? (
              <Message>Order is empty</Message>
            ) : (
              <ListGroup variant="flush">
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>

                      <Col>
                        <Link to={`/product/${item.product}`}>
                          {item.name}
                        </Link>
                      </Col>

                      <Col md={4}>
                        {item.qty} x {item.price} = ${item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
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
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {(isPending) ? <Loader /> : (
                    <div>
                      <Button style={{marginBottom: "10px"}} onClick={onApproveTest}>
                        Test Pay Order
                      </Button>

                      <div>
                        <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}>
                        </PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {/* MARK AS DELIVERED PLACEHOLDER */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default OrderScreen;
