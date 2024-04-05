import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import authApi from "../api/authApi";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../firebase/auth";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [usernameErrText, setUsernameErrText] = useState("");
  const [passwordErrText, setPasswordErrText] = useState("");
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameErrText("");
    setPasswordErrText("");
    setEmailError("");

    const data = new FormData(e.target);
    const username = data.get("username")?.trim();
    const password = data.get("password")?.trim();

    let err = false;

    if (username === "") {
      err = true;
      setUsernameErrText("Este campo está vacío");
    }

    if (password === "") {
      err = true;
      setPasswordErrText("Este campo está vacío");
    }

    if (err) return;

    setLoading(true);

    try {
      // Intenta iniciar sesión con la API interna
      const res = await authApi.login({ username, password });
      setLoading(false);
      localStorage.setItem("token", res.token);
      navigate("/");
    } catch (err) {
      const errors = err.data.errors;
      errors.forEach((e) => {
        if (e.param === "username") {
          setUsernameErrText(e.msg);
        }
        if (e.param === "password") {
          setPasswordErrText(e.msg);
        }
      });
      setLoading(false);
    }
  };

  const handleFirebaseLogin = async (e) => {
    e.preventDefault();
    setEmailError("");

    if (!email) {
      setEmailError("Por favor, ingresa tu correo electrónico.");
    }

    if (!password) {
      setEmailError("Por favor, ingresa tu contraseña.");
    }

    if (email && password) {
      setLoading(true);
      try {
        // Inicia sesión con Firebase
        const userCredential = await doSignInWithEmailAndPassword(
          email,
          password
        );

        // Envía los datos del usuario a la API del servidor
        const res = await axios.post("/api/v1/auth/firebase-signup", {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
        });

        // Almacena el token devuelto en el localStorage
        localStorage.setItem("token", res.data.token);

        navigate("/"); // Redirige al usuario a la página de inicio
      } catch (error) {
        setLoading(false);
        toast.error("Error al iniciar sesión:", error);
        if (error.code === "auth/user-not-found") {
          toast.error("Correo no registrado.");
          setEmailError("Correo electrónico no registrado.");
        } else if (error.code === "auth/wrong-password") {
          toast.error("Contraseña incorrecta.");
          setEmailError("Contraseña incorrecta.");
        } else {
          toast.error("Error al iniciar sesión. Inténtalo de nuevo más tarde.");
          setEmailError(
            "Error al iniciar sesión. Inténtalo de nuevo más tarde."
          );
        }
      }
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await doSignInWithGoogle();
      navigate("/"); // Redirigir a la página de inicio después del inicio de sesión exitoso
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  return (
    <>
    <ToastContainer/>
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Usuario"
          name="username"
          disabled={loading}
          error={usernameErrText !== ""}
          helperText={usernameErrText}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Contraseña"
          name="password"
          type="password"
          disabled={loading}
          error={passwordErrText !== ""}
          helperText={passwordErrText}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          Iniciar Sesión
        </LoadingButton>
      </Box>
      {/* <Box component="form" onSubmit={handleFirebaseLogin} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo electrónico"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          Iniciar sesión con Firebase
        </LoadingButton>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          Iniciar sesión con Google
        </Button>
      </Box> */}
      <Button component={Link} to="/signup" sx={{ textTransform: "none" }}>
        Regístrate
      </Button>
    </>
  );
};

export default Login;
