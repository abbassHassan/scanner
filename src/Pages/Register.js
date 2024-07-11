// src/Pages/Signup.js
import React, { useRef, useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { register } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      await register(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      handleError(error);
    }
  };

  const handleError = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        setError("Email already in use.");
        break;
      case "auth/invalid-email":
        setError("Invalid email address.");
        break;
      case "auth/weak-password":
        setError("Password is too weak.");
        break;
      default:
        setError("Failed to create an account.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            ref={passwordRef}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
