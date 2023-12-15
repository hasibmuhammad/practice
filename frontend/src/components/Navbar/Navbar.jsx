import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="font-bold text-3xl uppercase tracking-widest">
        <Link to="/">Logo</Link>
      </div>
      <div className="flex items-center gap-8 text-lg">
        <NavLink
          className={({ isActive }) =>
            isActive && "text-orange-600 font-bold border-b-4 border-orange-600"
          }
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive && "text-orange-600 font-bold border-b-4 border-orange-600"
          }
          to="/products"
        >
          Products
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive && "text-orange-600 font-bold border-b-4 border-orange-600"
          }
          to="/add"
        >
          Add Product
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
