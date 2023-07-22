import { Container } from "react-bootstrap";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; //This css comming from toastify library we have include it.
import { logout } from "./slices/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();

  //logic to sync with token expiration
  useEffect(() => {
    const expirationTime = localStorage.getItem("expirationTime");

    if(expirationTime) {
      const currentTime = new Date().getTime();
      if(currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <>
    {/* we can place this <ToastContainer /> outside of the container since it's not part of layout */}
      <ToastContainer /> 
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  )
}

export default App;
