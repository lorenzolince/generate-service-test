import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import generateService from '../../services/generateService';
const modalSchema = Yup.object().shape({});

const ModalForm = ({ item, reloadData }) => {
    const { t, lang } = useTranslation();
    const [error, setError] = useState(false);

    const { register, handleSubmit, reset, setValue, formState, formState: { errors } } = useForm({
        resolver: yupResolver(modalSchema)
    });



    const setModalSchema = async (item) => {
        delete item.Update;
        delete item.Delete;
        console.log("---- item ----:", item);
        for (var field in item) {
            if (item.hasOwnProperty(field)) {
                if (field === "id") {
                    setValue("pId", item[field]);
                }
                if (field === "nombre") {
                    setValue("pNombre", item[field]);
                }
                if (field === "telefono") {
                    setValue("pTelefono", item[field]);
                }
                if (field === "direccion") {
                    setValue("pDireccion", item[field]);
                }
            }

        }
    }

    const saveModalForm = async (dataIn) => {
        try {
            const response = await generateService.Update(dataIn);
            return response
        }
        catch (error) {
        }
    }
    const fetchsaveModalForm = async (dataIn) => {
        return Promise.all([
            saveModalForm(dataIn)
        ]).then(([data]) => {
            return { data };
        });
    }
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    }
    const openModal = (e) => {
        setShow(true);
    }
    const onSubmit = async (data) => {
        console.log(data)
        const response = await fetchsaveModalForm(data);
        console.log("--------------- response ----------------", response)
        reloadData()
        handleClose()
    }
    return (<div>
        <Container>
            <Row>
                <Col></Col>
                <Col md="auto">
                    <Button onClick={(e) => openModal(e)} variant="success" size="sm" >{t('common:btnEdit')}</Button>
                </Col>
            </Row>
        </Container>
        <Modal show={show} onEnter={() => setModalSchema(item)} onHide={() => setShow(false)} dialogClassName="modal-90w" size="lg" aria-labelledby="example-custom-modal-styling-title" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    {t('datasourceOra:titleModal')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Control name="id" defaultValue={0} hidden {...register("id")} type="text">
                        </Form.Control>
                    </Form.Group>
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
                                <Form.Label htmlFor="pTelefono">Teléfono</Form.Label>
                                <Form.Control
                                    name="pTelefono"
                                    {...register("pTelefono")}
                                    type="text"
                                    placeholder="Ingrese el teléfono"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>

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
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="pActualizadoPor">Actualizado por</Form.Label>
                                <Form.Control
                                    name="pActualizadoPor"
                                    {...register("pActualizadoPor")}
                                    type="text"
                                    placeholder="Usuario actualizado"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    {t('common:btnCancel')}
                </Button>
                {/* onClick={handleClose} */}
                <Button variant="primary" type="submit" disabled={formState.isSubmitting} onClick={handleSubmit(onSubmit)}>
                    {t('common:btnUpdate')}
                </Button>
            </Modal.Footer>
        </Modal>
    </div>)
}

export default ModalForm;