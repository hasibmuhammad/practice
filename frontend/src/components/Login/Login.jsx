import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="hero min-h-screen">
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary">Login</button>
          </div>
        </form>
        <div className="text-center mb-4">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
