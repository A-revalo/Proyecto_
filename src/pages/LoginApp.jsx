import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginApp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [user, setUser] = useState(null); // ✅ Guardar usuario logueado

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Z a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}$:;<>,.?~\\/-]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos vacíos primero
    if (!email.trim()) {
      setEmailError(true);
      setLoginMessage("Por favor completa el campo de correo electrónico");
      return;
    }

    if (!password.trim()) {
      setPasswordError(true);
      setLoginMessage("Por favor completa el campo de contraseña");
      return;
    }

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setEmailError(!isEmailValid);
    setPasswordError(!isPasswordValid);

    if (!isEmailValid || !isPasswordValid) {
      setLoginMessage("Por favor corrige los errores antes de continuar.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      if (res.data.success) {
        const loggedUser = res.data.user;
        setUser(loggedUser); // ✅ Guardar usuario logueado
        setLoginMessage("");

        // 🚀 Redirigir según el rol
        switch (loggedUser.rol) {
          case "ciudadano":
            navigate("/ciudadano");
            break;
          case "admin":
            navigate("/admin");
            break;
          case "conductor":
            navigate("/conductor");
            break;
          default:
            alert("✅ Login exitoso, pero no se reconoce el rol del usuario.");
        }
      } else {
        setLoginMessage("❌ Credenciales incorrectas");
      }
    } catch (error) {
      console.error(error);
      setLoginMessage("⚠️ Error conectando con el servidor.");
    }
  };

  return (
    <div id="loginForm" className="form-container p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg mt-10">
      <div className="form-header text-center mb-6">
        <h1 className="text-2xl font-bold">Bienvenido</h1>
        <p className="text-gray-600">Inicia sesión en tu cuenta</p>
      </div>

      {loginMessage && (
        <div id="loginMessage" className="mb-4 text-red-600 bg-red-50 p-3 rounded">
          {loginMessage}
        </div>
      )}

      {/* ✅ Si el usuario está logueado, mostrar sus datos */}
      {user ? (
        <div className="bg-green-50 border border-green-400 rounded p-4 text-green-800">
          <h2 className="text-xl font-semibold mb-2">Datos del usuario</h2>
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Correo:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.rol}</p>
        </div>
      ) : (
        <form id="loginFormElement" onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="loginEmail" className="block font-medium mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="loginEmail"
              name="email"
              required
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {emailError && (
              <small id="emailError" className="text-red-600 mt-1">
                {!email.trim() ? "Este campo es obligatorio" : "Ingresa un correo válido"}
              </small>
            )}
          </div>

          <div className="form-group mb-6">
            <label htmlFor="loginPassword" className="block font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="loginPassword"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
            />
            <small className="text-gray-600 text-sm mt-1 block">
              La contraseña debe tener mínimo 8 caracteres, incluir mayúscula,
              número y símbolo.
            </small>
            {passwordError && (
              <small id="passwordError" className="text-red-600 mt-1">
                {!password.trim() ? "Este campo es obligatorio" : "La contraseña no cumple con los requisitos"}
              </small>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
            id="loginBtn"
          >
            Iniciar Sesión
          </button>
        </form>
      )}

      {!user && (
        <div className="form-footer mt-4 text-center">
          <a href="/register" className="text-blue-600 hover:underline">
            ¿No tienes cuenta? Regístrate
          </a>
        </div>
      )}
    </div>
  );
}

export default LoginApp;
