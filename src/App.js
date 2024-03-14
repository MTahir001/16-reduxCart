import { Fragment, useEffect } from "react";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "./store/ui-slice";
import Notification from "./components/UI/Notification";

let isInitial = true;
function App() {
  const dispatch = useDispatch();
  const cartIsVisible = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "sending...",
          message: "Sending cart data...",
        })
      );
      const response = await fetch(
        "https://reactredux-f7d77-default-rtdb.firebaseio.com/car",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send data!!!");
      }

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Cart data sent successfully!",
        })
      );
    };

    if (isInitial) {
      // first time we don't want to send cart
      // cart is empty, overrides old data
      isInitial = false;
      return;
    }
    sendCartData().catch((error) => {
      if (error.message.includes("Failed to fetch")) {
        return dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error❌",
            message: "Failed to fetch data. Please check your URL.",
          })
        );
      }
    });
  }, [cart, dispatch]);
  return (
    <Fragment>
      {notification && <Notification {...notification} />}
      <Layout>
        {cartIsVisible && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
