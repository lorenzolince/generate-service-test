"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { getAllApi, getApi, saveApi, deleteApi, updateApi, saveMultipleApi, getApiByName } from './actions/generateService';
import DataGrid from './components/DataGrid';
//import { Client } from '@stomp/stompjs';
import swal from 'sweetalert2/dist/sweetalert2.min.js';
import ModalForm from './components/ModalForm';

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
            const response = await getApi(data.id);
            console.log("result: ", response)
            setValue("name", response.name);
            setValue("email", response.email);
            setValue("cellPhone", response.cellPhone);
            setValue("address", response.address);
        }
        catch (error) {
        }
    }
    const getApiServiceByName = async (data) => {
        try {
            setServiceData([]);
            const response = await getApiByName(data.name);
            console.log("----------------------------")
            console.log("result: ", response)
            response.forEach(function (item) {
                item.Update = <ModalForm item={item} reloadData={reloadData} updateApi={updateApi}></ModalForm>
                item.Delete = <Button onClick={(e) => deleteItem(e, item.id)} variant="danger" size="sm" >{t('common:btnDelete')}</Button>
            });
            setServiceData(response)
        }
        catch (error) {
        }
    }
    const getAllApiService = async () => {
        try {
            const response = await getAllApi();
            return response
        }
        catch (error) {
        }
    }
    const deleteItem = async (e, id) => {
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
                    await deleteApi(id);
                    reloadData();
                }
            });

        }
        catch (error) {
        }
    }
    const importData = async (data) => {
        try {
            swal.fire({
                title: t('common:alertImportDataConfirmTitle'),
                text: t('common:alertImportDataConfirmText'),
                icon: "warning",
                buttons:
                {
                    cancel: { text: `${t('common:btnCancel')}`, visible: true },
                    confirm: { text: `${t('common:btnOk')}`, visible: true }
                }
            }).then(async (confirm) => {
                if (confirm.isConfirmed) {
                    console.log("fileContent: ", data)
                    const response = await saveMultipleApi(data);
                    console.log("response: ", response)
                    if (response === 200) {
                        swal.fire({
                            title: t('index:alerTitleSuccess'),
                            text: t('index:alerTextSuccess'),
                            icon: "success"
                        });
                    } else {
                        swal.fire({
                            title: t('common:alertErrorTitle'),
                            text: t('common:alertErrorText'),
                            icon: "error"
                        });
                    }
                    reloadData();
                }
            });

        }
        catch (error) {
        }
    }

    const onSubmit = async (data) => {
        console.log("data: ", data)
        const response = await saveApi(data);
        console.log("response: ", response)
        if (response === 200) {
            swal.fire({
                title: t('index:alerTitleSuccess'),
                text: t('index:alerTextSuccess'),
                icon: "success"
            });
        } else {
            swal.fire({
                title: t('common:alertErrorTitle'),
                text: t('common:alertErrorText'),
                icon: "error"
            });
        }
        await reloadData()
    }

    const reloadData = async () => {
        let result = await getAllApiService()
        console.log("----------------------------")
        console.log("result: ", result)
        result.forEach(function (item) {
            item.Update = <ModalForm item={item} reloadData={reloadData} updateApi={updateApi}></ModalForm>
            item.Delete = <Button onClick={(e) => deleteItem(e, item.id)} variant="danger" size="sm" >{t('common:btnDelete')}</Button>
        });

        setServiceData(result)
    }
    const hiddenFileInput = useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const extension = file.name.split('.').pop().toLowerCase();
            if ((extension.toLowerCase() === "json")) {
                const reader = new FileReader();
                reader.onload = async function (e) {
                    const fileContent = e.target.result;
                    await importData(fileContent);
                };

                reader.onerror = function (error) {
                    console.error('Error al leer el archivo:', error);
                };
                reader.readAsText(file); // Lee el archivo como texto
            } else {
                swal.fire({
                    title: t('common:alertSourceJsonTitle'),
                    text: t('common:alertSourceJsonTxt'),
                    icon: "warning",
                    dangerMode: true,
                    timer: 3500

                })
                console.log('El Archivo debe ser un JSON');
                event.target.value = '';
            }
        } else {
            console.log('No se seleccionó ningún archivo');
        }
        event.target.value = '';
    };
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
                                <Form.Label htmlFor="id">Id</Form.Label>
                                <Form.Control
                                    name="id"
                                    {...register("id")}
                                    type="text"
                                    placeholder="Ingrese el id"
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="Search">Search</Form.Label>
                                <br />
                                <Button className="common-button-color" type="submit" disabled={formState.isSubmitting} onClick={handleSubmit(getApiService)}>
                                    Search by id
                                </Button>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="Search">Search</Form.Label>
                                <br />
                                <Button className="common-button-color" type="submit" disabled={formState.isSubmitting} onClick={handleSubmit(getApiServiceByName)}>
                                    Search by name
                                </Button>
                            </Form.Group>
                        </Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col>  
                         <Form.Group>
                            <hr style={{ borderColor: "black", width: "75%" }} ></hr>
                            <hr style={{ borderColor: "black" , width: "75%"}} ></hr>
                        </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="name">{t('index:name')}</Form.Label>
                                <Form.Control
                                    name="name"
                                    {...register("name")}
                                    type="text"
                                    placeholder="Ingrese el nombre"
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="email">{t('index:email')}</Form.Label>
                                <Form.Control
                                    name="email"
                                    {...register("email")}
                                    type="email"
                                    placeholder="Ingrese el correo"
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="inport" >Import Data</Form.Label>
                                <br />
                                <Button
                                    variant="secondary"
                                    onClick={handleClick}
                                >
                                    Upload file
                                </Button>
                                <Form.Control
                                    type="file"
                                    accept="application/json"
                                    onChange={handleChange}
                                    ref={hiddenFileInput}
                                    className="common-file"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="cellPhone">{t('index:cellPhone')}</Form.Label>
                                <Form.Control
                                    name="cellPhone"
                                    {...register("cellPhone")}
                                    type="text"
                                    placeholder="Ingrese el teléfono"
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="address">{t('index:address')}</Form.Label>
                                <Form.Control
                                    name="address"
                                    {...register("address")}
                                    type="text"
                                    placeholder="Ingrese la dirección"
                                />
                            </Form.Group>
                        </Col>
                        <Col></Col>
                    </Row>

                    <br></br>
                    <Row>
                        <Col>
                            <Button className="common-button-color" type="submit" disabled={formState.isSubmitting} onClick={handleSubmit(onSubmit)}>
                                {t('index:send')}
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
