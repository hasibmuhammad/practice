import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/UseAuthContext";
import axios from "axios";

const Cart = () => {
  const { user } = useAuthContext();
  const [savedCart, setSavedCart] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/cart?email=${user.email}`, {
        withCredentials: true,
      })
      .then((res) => setSavedCart(res.data))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div className="max-w-3xl mx-auto">
      <div className="overflow-x-auto">
        {savedCart.length === 0 && (
          <p className="text-center">Your Cart is empty!</p>
        )}
        {savedCart.length > 0 && (
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {savedCart.map((cart) => (
                <tr>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={cart.url} alt={cart.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{cart.name}</div>
                        <div className="text-sm opacity-50">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{cart.description}</td>
                  <td>{cart.quantity}</td>
                  <th>${cart.price}</th>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Cart;
