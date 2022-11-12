import { Alert, Box, Button, Paper, TextField } from "@mui/material";
import type { GetServerSideProps, NextPage } from "next";
import React, { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { parseCookies } from "nookies";

const Login = () => {
  const { singIn } = useAuthContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await singIn({ username, password });
    } catch {
      setIsLogin(true);
    }
  };

  return (
    <Box
      component={"form"}
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ background: "linear-gradient(90deg,#28285f,#188d6d)" }}
      onSubmit={handleSubmit}
    >
      <Box
        component={Paper}
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="30%"
        height="auto"
        p={4}
        gap={3}
      >
        <Box component="img" src="arkema_logo2.png" width="20rem" />
        <TextField
          fullWidth
          required
          label="Usuário"
          variant="outlined"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          required
          label="Senha"
          variant="outlined"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" type="submit" fullWidth>
          Enviar
        </Button>
        {isLogin && (
          <Alert
            sx={{ width: "100%" }}
            severity="error"
            variant="filled"
            onClose={() => setIsLogin(false)}
          >
            Usuário e/ou senha incorreta
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { "token-arkema": token } = parseCookies(ctx);

  if (token) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }
  return {
    props: {},
  };
};
