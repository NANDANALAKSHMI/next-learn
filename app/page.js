'use client'
import Login from "./login/component/Login";
import { SnackbarProvider } from "notistack";

export default function Home() {

  return (
    <SnackbarProvider maxSnack={3} >
        <Login />
      </SnackbarProvider>
  );
}
