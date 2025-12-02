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
import swal from 'sweetalert2/dist/sweetalert2.min.js';
import ModalForm from '../components/common/ModalForm';

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
    const deleteItem = async (e, id, nombre) => {
        try {
            swal.fire({
                title: t('common:alertConfirmTitle'),
                text: t('common:alertConfirmText'),
                icon: "warning",
                buttons:
                {
                    cancel: { text: `${t('common:btnCancel')}`, visible: true },
                    confirm: { text: `${t('common:btnOk')}`, visible: true }
                }
            }).then(async (confirm) => {
                if (confirm.isConfirmed) {
                    console.log(nombre)
                    console.log(id)
                    await generateService.Delete({ "pId": id, "pActualizadoPor": nombre });
                    reloadData();
                }
            });

        }
        catch (error) {
        }
    }
    /* const componentDidMount = async () => {
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
 */
    const fetchServices = async (data) => {
        return Promise.all([
            getApiService(data),
        ]).then(([data]) => {
            return { data };
        });
    }

    const onSubmit = async (data) => {
        console.log("data: ", data)
        const response = await generateService.saveApiService(data);
        console.log("response: ", response)
        await reloadData()
    }

    const reloadData = async () => {
        let result = await fetchServices({})
        console.log("----------------------------")
        console.log("result: ", result)
        result.data.result1.forEach(function (item) {
            item.activo = item.activo ? "si" : "no"
            item.Update = <ModalForm item={item} reloadData={reloadData}></ModalForm>
            item.Delete = <Button onClick={(e) => deleteItem(e, item.id, item.nombre)} variant="danger" size="sm" >{t('common:btnDelete')}</Button>
        });
        setServiceData(result.data.result1)
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
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="pNombre">Nombre</Form.Label>
                                    <Form.Control
                                        name="pNombre"
                                        {...register("pNombre")}
                                        type="text"
                                        placeholder="Ingrese el nombre"
                                    />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="pEmail">Email</Form.Label>
                                    <Form.Control
                                        name="pEmail"
                                        {...register("pEmail")}
                                        type="email"
                                        placeholder="Ingrese el correo"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="pTelefono">Teléfono</Form.Label>
                                    <Form.Control
                                        name="pTelefono"
                                        {...register("pTelefono")}
                                        type="text"
                                        placeholder="Ingrese el teléfono"
                                    />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="pDireccion">Dirección</Form.Label>
                                    <Form.Control
                                        name="pDireccion"
                                        {...register("pDireccion")}
                                        type="text"
                                        placeholder="Ingrese la dirección"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label htmlFor="pCreadoPor">Creado por</Form.Label>
                                    <Form.Control
                                        name="pCreadoPor"
                                        {...register("pCreadoPor")}
                                        type="text"
                                        placeholder="Usuario creador"
                                    />
                                </Form.Group>
                            </Col>
                            <Col></Col>
                        </Row>
                    </Row>
                    <br></br>
                    <Row>
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
