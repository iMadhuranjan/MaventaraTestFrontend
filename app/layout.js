'use client'
import { Provider } from "react-redux";
import "./globals.css";
import { store } from "./store/store";
import { ToastContainer } from "react-toastify";

 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
       >
        <Provider store={store}>
            <ToastContainer position="top-right" autoClose={3000} />
          {children}
        </Provider>
      </body>
    </html>
  );
}
