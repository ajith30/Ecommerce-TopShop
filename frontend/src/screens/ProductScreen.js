import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, Form} from "react-bootstrap";
import Rating from "../components/Rating";
import { useGetProductDetailsQuery } from "../slices/productSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

const ProductScreen = () => {
  const { id: productId } = useParams();
  
  //console.log(useGetProductDetailsQuery(productId));
  const { data: product, isLoading, error} = useGetProductDetailsQuery(productId);
  // Note: error will be added to useGetProductDetailsQuery(productId) value when request is failed. 
  // Example: error: {data: message, stack: "...", status: 404} this comes from backend error hadler reason is CastError due to wrong id passed or empty id passed.

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  //console.log([...Array(product.countInStock).keys()]);

  const addToCartHandler = () => {
    dispatch(addToCart({...product, qty}));
    navigate("/cart");
  }

  return (
    <>
      <Link to="/" className="btn btn-light my-3">Go Back</Link>
      
      {(isLoading)? (
        <Loader />
      ) : (error) ? (
        <Message varient="danger">{error?.data.message || error.error}</Message>
      ) : (
        <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid/>
        </Col>
          
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} /> 
            </ListGroup.Item>
            <ListGroup.Item>
              Price: {product.price}
            </ListGroup.Item>
            <ListGroup.Item>
              Description: {product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={3}>
          <Card>
            <ListGroup variant="flush" >
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col><strong>${product.price}</strong></Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>{(product.countInStock > 0) ? "In Stock" : "Out of Stock"}</Col>
                </Row>
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control as="select" value={qty} onChange={(e) => {setQty(+e.target.value)}}>
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button className="btn-block" type="button" disabled={product.countInStock === 0} 
                onClick={addToCartHandler}>Add To Cart</Button>
              </ListGroup.Item>

            </ListGroup>
          </Card>
        </Col>
      </Row>
      )}
    </>
  )
}

export default ProductScreen;
