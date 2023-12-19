import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/UseAuthContext";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { user, loading } = useAuthContext();

  const [totalItems, setTotalItems] = useState(0);
  // const [totalPage, setTotalPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPage = Math.ceil(totalItems / itemsPerPage);

  const pages = [...Array(totalPage).keys()];

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/products?email=${user.email}&page=${currentPage}&size=${itemsPerPage}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setProducts(res.data.products);
        setTotalItems(res.data.count);
      })
      .catch((error) => console.log(error));
  }, [currentPage, itemsPerPage]);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    console.log(currentPage, totalPage);
    if (currentPage < totalPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (products.length === 0) {
    return <p className="text-center">No Products Available!</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto my-20">
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
                <button className="btn btn-primary uppercase">
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
      </div>

      <div className="max-w-7xl mx-auto text-center my-10">
        <button onClick={handlePrevious} className="btn mr-1">
          Previous
        </button>
        {pages &&
          pages.map((page) => (
            <button
              onClick={() => handlePageClick(page)}
              className={`hover:bg-blue-400 text-white btn mr-1 ${
                currentPage === page && "bg-blue-400"
              }`}
              key={page}
            >
              {page}
            </button>
          ))}
        <button onClick={handleNext} className="btn mr-1">
          Next
        </button>
        <select
          onChange={handlePerPageChange}
          className="p-2 bg-transparent outline-none border border-white rounded-lg"
        >
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={30}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default Products;
