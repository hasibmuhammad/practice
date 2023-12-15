import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/UseAuthContext";
import axios from "axios";

const Login = () => {
  const { user, login, loading, loginWithGoogle } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    // login here
    login(email, password)
      .then((res) => {
        if (res.user) {
          // generate and set the cookie
          axios
            .post(
              "http://localhost:5000/jwt",
              {
                email: res.user.email,
              },
              { withCredentials: true }
            )
            .then((response) => {
              if (response.data.success) {
                navigate(location.state ? location.state : "/");
              }
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  };

  const handleLoginWithGoogle = () => {
    loginWithGoogle()
      .then((res) => {
        if (res.user) {
          navigate(location.state ? location.state : "/");
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="hero min-h-screen">
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleLogin}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              name="email"
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
              name="password"
              type="password"
              placeholder="password"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary">Login</button>
          </div>
          <div className="form-control">
            <button
              onClick={handleLoginWithGoogle}
              type="button"
              className="btn btn-primary btn-outline"
            >
              Login With Google
            </button>
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
