"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, ButtonGroup, Col, Container, Row, Spinner } from "react-bootstrap";
import { PencilSquare, PlusLg, Trash } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import swal from "sweetalert2/dist/sweetalert2.min.js";
import { deleteOraclePersona, getOraclePersonas, insertOraclePersona, updateOraclePersona } from "../actions/oracleService";
import DataGrid from "../components/DataGrid";
import DynamicModalForm from "../components/DynamicModalForm";

const emptyPersona = {
  idPersona: 0,
  nombre: "",
  apellido: "",
  edad: 0,
  email: "",
  fechaNacimiento: "",
  activo: true
};

const OraclePersonasPage = () => {
  const { t } = useTranslation();
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState(emptyPersona);

  const fields = useMemo(() => getPersonaFields(t, modalMode), [t, modalMode]);

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getOraclePersonas();
      setPersonas(result || []);
    } catch (loadError) {
      setError(loadError.message || String(loadError));
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setSelectedPersona(emptyPersona);
    setModalMode("create");
  };

  const openUpdate = (persona) => {
    setSelectedPersona({ ...emptyPersona, ...persona });
    setModalMode("update");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedPersona(emptyPersona);
  };

  const savePersona = async (persona) => {
    setSaving(true);

    try {
      if (modalMode === "create") {
        await insertOraclePersona(persona);
        await showSuccess(t("common:msgInsertedTitle"), t("common:msgInsertedText"));
      } else {
        await updateOraclePersona(persona);
        await showSuccess(t("common:msgUpdatedTitle"), t("common:msgUpdatedText"));
      }

      closeModal();
      await reloadData();
    } catch (saveError) {
      await showError(t("common:alertErrorTitle"), saveError.message || String(saveError));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (persona) => {
    const confirm = await swal.fire({
      title: t("common:alertConfirmTitle"),
      text: t("common:alertConfirmText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("common:btnOk"),
      cancelButtonText: t("common:btnCancel")
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteOraclePersona(persona.idPersona);
      await showSuccess(t("common:msgDeletedTitle"), t("common:msgDeletedText"));
      await reloadData();
    } catch (deleteError) {
      await showError(t("common:alertErrorTitle"), deleteError.message || String(deleteError));
    }
  };

  const gridData = personas.map((persona) => ({
    ...persona,
    actions: (
      <ButtonGroup size="sm" aria-label={t("oracle:rowActions")}>
        <Button variant="outline-primary" onClick={() => openUpdate(persona)} title={t("common:btnUpdate")}>
          <PencilSquare aria-hidden="true" />
        </Button>
        <Button variant="outline-danger" onClick={() => confirmDelete(persona)} title={t("common:btnDelete")}>
          <Trash aria-hidden="true" />
        </Button>
      </ButtonGroup>
    )
  }));

  return (
    <>
      <title>{t("oracle:personasTitle")}</title>
      <Container fluid className="app-page">
        <div className="page-heading page-heading-actions">
          <div>
            <h1>{t("oracle:personasTitle")}</h1>
            <p>{t("oracle:personasSubtitle")}</p>
          </div>
          <Button className="common-button-color" onClick={openCreate} title={t("common:btnAdd")}>
            <PlusLg aria-hidden="true" /> {t("common:btnAdd")}
          </Button>
        </div>

        {error ? <Alert variant="danger">{error}</Alert> : null}

        <Row>
          <Col>
            {loading ? (
              <div className="response-state"><Spinner animation="border" size="sm" /> {t("common:isLoading")}</div>
            ) : gridData.length ? (
              <DataGrid data={gridData} schemaColumns="oracle" hiddenColumns={["fechaRegistro"]} pagination filtering />
            ) : (
              <Alert variant="secondary">{t("oracle:emptyResult")}</Alert>
            )}
          </Col>
        </Row>

        <DynamicModalForm
          show={Boolean(modalMode)}
          title={modalMode === "create" ? t("oracle:addPersona") : t("oracle:updatePersona")}
          value={selectedPersona}
          fields={fields}
          onHide={closeModal}
          onSave={savePersona}
          saving={saving}
          saveLabel={modalMode === "create" ? t("common:btnAdd") : t("common:btnUpdate")}
        />
      </Container>
    </>
  );
};

const getPersonaFields = (t, mode) => [
  { name: "idPersona", type: "number", label: t("oracle:idPersona"), hidden: mode === "create", disabled: true },
  { name: "nombre", type: "text", label: t("oracle:nombre") },
  { name: "apellido", type: "text", label: t("oracle:apellido") },
  { name: "edad", type: "number", label: t("oracle:edad") },
  { name: "email", type: "email", label: t("oracle:email") },
  { name: "fechaNacimiento", type: "date", label: t("oracle:fechaNacimiento") },
  { name: "activo", type: "checkbox", label: t("oracle:activo") }
];

const showSuccess = (title, text) => swal.fire({ title, text, icon: "success", timer: 1800, showConfirmButton: false });

const showError = (title, text) => swal.fire({ title, text, icon: "error" });

export default OraclePersonasPage;
