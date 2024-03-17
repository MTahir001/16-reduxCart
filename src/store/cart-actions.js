import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchRequest = async () => {
      const response = await fetch(
        "https://reactredux-f7d77-default-rtdb.firebaseio.com/cart.json"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data!!!");
      }

      const data = await response.json();
      console.log(data);
      return data;
    };
    try {
      const cartData = await fetchRequest();
      dispatch(
        cartActions.replaceCart({
          items: cartData.items || [],
          totalQuantity: cartData.totalQuantity,
        })
      );
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        return dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error❌",
            message: "Failed to fetch data. Please check your URL.",
          })
        );
      }
    }
  };
};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "sending...",
        message: "Sending cart data...",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(
        "https://reactredux-f7d77-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send data!!!");
      }
    };
    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Cart data sent successfully!",
        })
      );
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        return dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error❌",
            message: "Failed to fetch data. Please check your URL.",
          })
        );
      }
    }
  };
};
