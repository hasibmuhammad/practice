import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/UseAuthContext";
import axios from "axios";

const Register = () => {
  const { createAcc, update } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    const accInfo = { name, email, password };

    // Create account with firebase - email and password
    createAcc(email, password)
      .then((res) => {
        if (res.user) {
          update({ displayName: name })
            .then(() => {
              console.log("updated");
              // Generate access token
              axios
                .post(
                  "http://localhost:5000/jwt",
                  { email: res.user.email },
                  { withCredentials: true }
                )
                .then((response) => {
                  if (response.data.success) {
                    navigate("/");
                  }
                })
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log("Update failed!", error));
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="hero min-h-screen">
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="name"
              className="input input-bordered"
              required
            />
          </div>
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
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
        </form>
        <div className="text-center mb-4">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
