"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import PrivateContent from './components/PrivateContent';
import AppContext from "./components/AppContext";
import './../styles/globals.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./../i18n";


export default function RootLayout({ children }) {

  const [state, setState] = useState({});

  useEffect(() => {
    // Detectar idioma del navegador
    const browserLang = navigator.language || navigator.userLanguage; // ej. "es-ES" o "en-US"
    const shortLang = browserLang.split("-")[0]; // "es" o "en"

    if (["es", "en"].includes(shortLang)) {
      i18n.changeLanguage(shortLang);
    } else {
      i18n.changeLanguage("en"); // fallback
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="layout-Container">
          <I18nextProvider i18n={i18n}>
            <AppContext.Provider value={{ state, setState }}>
              <Header />
              <PrivateContent>
                {children}
              </PrivateContent>
            </AppContext.Provider>
          </I18nextProvider>
        </div>
      </body>
    </html>
  );
}