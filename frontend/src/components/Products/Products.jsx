import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/UseAuthContext";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products?email=${user.email}`, {
        withCredentials: true,
      })
      .then((res) => setProducts(res.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto my-20">
      {products &&
        products.map((product) => (
          <div key={product._id} className="card w-64 bg-base-100 shadow-xl">
            <figure>
              <img
                className="w-full h-48 object-cover"
                src={product.url}
                alt={product.name}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>
              <p>{product.description}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary uppercase">Buy Now</button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Products;
