import { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from "next/router";


const PrivateContent = ({ children }) => {

  const router = useRouter();
  const { t, lang } = useTranslation();
  const tokenApi = Yup.object().shape({});
  const { register, handleSubmit, reset, setValue, formState, formState: { errors } } = useForm({
    resolver: yupResolver(tokenApi)
  });


  const reloadData = async () => {
    console.log('--------------  SockJS ------------- ');

  }
  useEffect(() => {
    reloadData();

    setInterval(async () => {
      console.log('--------------  SockJS setInterval ------------- ');
    }, 60000);

    const handleRouteChange = url => {


    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    }
  }, []);
  return (
    <>  <div>
      {children}
    </div>
    </>
  );
};

export default PrivateContent;