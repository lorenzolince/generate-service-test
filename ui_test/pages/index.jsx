import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import generateService from '../services/generateService';
import DataGrid from '../components/common/DataGrid';
import { Client } from '@stomp/stompjs';


const Index = () => {

    const { t, lang } = useTranslation();
    const dataSourcesSchema = Yup.object().shape({});
    const [apiServiceData, setServiceData] = useState([]);
    const [columnsHiden, setColumnsHiden] = useState(["principal"]);

    const { register, handleSubmit, reset, setValue, formState, formState: { errors } } = useForm({
        resolver: yupResolver(dataSourcesSchema)
    });
    const getApiService = async (data) => {
        try {
            const response = await generateService.getApiService(data);
            return response
        }
        catch (error) {
        }
    }
    const componentDidMount = async () => {
        const client = new Client();

        client.configure({
            brokerURL: `ws://192.168.0.38:8086/test_websocket`,
            onConnect: () => {
                console.log('onConnect');

                client.subscribe('/topic/getSaldos', (data) => {
                    console.log('Raw frame:', JSON.parse(data.body));
                    setServiceData(JSON.parse(data.body).presult);

                });
            },

            debug: (str) => {
                console.log(new Date(), str);
            }
        });

        client.activate();

    }

    const fetchServices = async (data) => {
        return Promise.all([
            getApiService(data),
        ]).then(([data]) => {
            return { data };
        });
    }
    const onSubmit = async (data) => {
        console.log("data: ",data)
        const response = await generateService.saveApiService(data);
        console.log("response: ",response)
    }
    const reloadData = async () => {
       // let data = await fetchServices({ "pvSecuencia": "123" })

       // console.log("----------------------------")
      // console.log("data: ", data.data)
        
        
       // setServiceData(datOut)
      //  await componentDidMount()
    }


    useEffect(() => {
        reloadData();

    }, []);

    return (
        <>
            <title>{t('index:title')}</title>
            <Container>
                <Form>
                    <Row>
                        <Col>
                            <h3>{t('index:title')}</h3>
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="descripcion">
                                 descripcion
                                </Form.Label>
                                <Form.Control name="descripcion"  {...register("descripcion")} type="text" >
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Button className="common-button-color" type="submit" disabled={formState.isSubmitting} onClick={handleSubmit(onSubmit)}>
                                send
                            </Button>
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        {
                            apiServiceData.length > 0 ?
                                <Col>
                                    <DataGrid data={apiServiceData} schemaColumns="index" hiddenColumns={columnsHiden} pagination={true} />
                                </Col>
                                : null

                        }
                    </Row>
                </Form>
                <br></br>
                <br></br>
            </Container>
        </>
    );

}

export default Index;
