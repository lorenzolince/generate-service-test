"use client";

import React, { useEffect, useState,useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import swal from 'sweetalert2/dist/sweetalert2.min.js';

const modalSchema = Yup.object().shape({});


const ModalForm = ({ item, reloadData, updateApi }) => {
    const { t, lang } = useTranslation();
    const [error, setError] = useState(false);
    const buttonRef = useRef();
    const { register, handleSubmit, reset, setValue, formState, formState: { errors } } = useForm({
        resolver: yupResolver(modalSchema)
    });



    const setModalSchema = async (item) => {
        delete item.Update;
        delete item.Delete;
        console.log("---- item ----:", item);
        for (var field in item) {
            if (item.hasOwnProperty(field)) {
                setValue(field, item[field]);
            }
        }
    }
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
         buttonRef.current?.focus();

    }
    const openModal = (e) => {
        setShow(true);
    }
    const onSubmit = async (data) => {
        console.log(data)
        const response = await updateApi(data);
        console.log("--------------- response ----------------", response)
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
        handleClose()
        reloadData()

    }
    return (<div>
        <Container>
            <Row>
                <Col></Col>
                <Col md="auto">
                    <Button ref={buttonRef} onClick={(e) => openModal(e)} variant="success" size="sm" >{t('common:btnEdit')}</Button>
                </Col>
            </Row>
        </Container>
        <Modal show={show} onEnter={() => setModalSchema(item)} onHide={() => setShow(false)} dialogClassName="modal-90w" size="lg" aria-labelledby="example-custom-modal-styling-title" aria-labelledby="contained-modal-title-vcenter" centered enforceFocus={false}>
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    {t('datasourceOra:titleModal')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Control
                            type="hidden"
                            {...register("id")}
                        />
                    </Form.Group>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor="name">{t('index:name')}</Form.Label>
                                <Form.Control
                                    name="name"
                                    {...register("name")}
                                    type="text"
                                    placeholder="Ingrese el nombre"
                                    autoFocus
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
                                    autoFocus
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
                                    autoFocus
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
                                    autoFocus
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
                <Button ref={buttonRef}  variant="primary" type="submit" disabled={formState.isSubmitting} onClick={handleSubmit(onSubmit)}>
                    {t('common:btnUpdate')}
                </Button>
            </Modal.Footer>
        </Modal>
    </div>)
}

export default ModalForm;