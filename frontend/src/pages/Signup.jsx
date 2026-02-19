import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { ImUserTie } from "react-icons/im";
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import AuthImagePattern from "../components/AuthImagePattern";
import { toast } from "react-hot-toast";

const Signup = () => {
  const { signup, isSigningUp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [initialValues, setInitialValues] = useState({
    email: "",
    username: "",
    password: "",
  });

  const validateForm = () => {
    if (!initialValues.username.trim())
      return toast.error("Username is required");
    if (!initialValues.email.trim()) return toast.error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(initialValues.email.trim()))
      return toast.error("Email is invalid");
    if (!initialValues.password.trim())
      return toast.error("Password is required");
    if (initialValues.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = validateForm();
    if (!valid) return;
    signup(initialValues);
  };
  return (
    <div className="min-h-screen container mx-auto grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full flex flex-col gap-4 max-w-md">
          <ImUserTie className="text-6xl text-gray-700 mx-auto" />
          <h1 className="text-2xl text-center">Create Account</h1>
          <p className="text-xl text-gray-500 text-center">
            Get started with your account
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 mt-6"
        >
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-xl">Fullname</legend>
            <input
              type="text"
              value={initialValues.username}
              onChange={(e) =>
                setInitialValues({ ...initialValues, username: e.target.value })
              }
              className="input text-xl w-full"
              placeholder="Jhon Doe"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-xl">Email</legend>
            <input
              type="email"
              value={initialValues.email}
              onChange={(e) =>
                setInitialValues({ ...initialValues, email: e.target.value })
              }
              className="input text-xl w-full"
              placeholder="jhondoe@gmail.com"
            />
          </fieldset>
          <div className="flex gap-4 justify-center items-center w-full">
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend text-xl">Password</legend>
              <input
                type={showPassword ? "text" : "password"}
                value={initialValues.password}
                onChange={(e) =>
                  setInitialValues({
                    ...initialValues,
                    password: e.target.value,
                  })
                }
                className="input text-xl w-full"
                placeholder="secret"
              />
            </fieldset>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="btn btn-soft self-end my-1"
            >
              {showPassword ? <GoEyeClosed /> : <GoEye />}
            </button>
          </div>
          <button disabled={isSigningUp} className="btn btn-soft">
            {isSigningUp ? "Signing up ..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Log in
          </Link>
        </p>
      </div>
      {/* right side */}
      <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
        <AuthImagePattern
          title="Welcome to our platform"
          subtitle="Please sign up to continue"
        />
      </div>
    </div>
  );
};
export default Signup;
