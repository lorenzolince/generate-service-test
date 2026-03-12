"use client";

import { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";


const PrivateContent = ({ children }) => {

  const { t, lang } = useTranslation();

  const reloadData = async () => {
    console.log('--------------  SockJS ------------- ');

  }
  useEffect(() => {
    reloadData();

  }, []);
  return (
    <>  <div>
      {children}
    </div>
    </>
  );
};

export default PrivateContent;