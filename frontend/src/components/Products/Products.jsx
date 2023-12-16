import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/UseAuthContext";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    axios
      .get(
        `https://practice-eight-phi.vercel.app/products?email=${user.email}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => setProducts(res.data))
      .catch((error) => console.log(error));
  }, []);

  const handleAddToCart = () => {};

  if (products && products.length === 0) {
    return <p className="text-center">No Products Available!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto my-20">
      {products &&
        products.map((product) => (
          <div
            key={product._id}
            className="relative group w-64 shadow-xl overflow-hidden"
          >
            <figure>
              <img
                className="w-full h-48 object-cover transition-transform transform group-hover:scale-110"
                src={product.url}
                alt={product.name}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>
              <p>{product.description}</p>
              {/* <div className="card-actions justify-end">
                <button className="btn btn-primary uppercase">
                  Add To Cart
                </button>
              </div> */}
            </div>
            {/* Overlay */}
            <div className="overlay absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-90 group-hover:bg-black">
              <button className="btn btn-primary uppercase">Add To Cart</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Products;
