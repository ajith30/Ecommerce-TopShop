import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap"
import logo from "../assets/topshop.png";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../slices/userApiSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  //This hook returns 2 entity: 
  //one is async ananymous function which has the logic to make Post request so we can name anything (named as logoutApiCall) and 
  //an object containing mutation-related properties such as isLoading, data, error, etc. So we can desstructure what ever necessary part.

  const logoutHandler = async () => {
    //Since we are making API call there is a possibility of error occurs
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login")
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>
                <img style={{width: "35px", height: "35px"}} src={logo} alt="logo"/>
                TopShop
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle area-aria-controls="basic-navbar-nav"></Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <LinkContainer to="/cart">
                  <Nav.Link>
                    <FaShoppingCart /> Cart
                    {cartItems.length > 0 && (
                      <Badge pill bg="success" style={{marginLeft: "5px"}}>
                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                      </Badge>
                    )}
                  </Nav.Link>
                </LinkContainer>
                {userInfo ? (
                  <>
                    <NavDropdown title={userInfo.name} id="username">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                       
                      <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaUser /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                )}

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  )
}

export default Header;
