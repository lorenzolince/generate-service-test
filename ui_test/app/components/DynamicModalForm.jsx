"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Check2, XLg } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import DynamicForm from "./DynamicForm";

const DynamicModalForm = ({ show, title, value, fields, onHide, onSave, saving = false, saveLabel, namespace = "oracle" }) => {
  const { t } = useTranslation();
  const [formValue, setFormValue] = useState(value || {});

  useEffect(() => {
    if (show) {
      setFormValue(value || {});
    }
  }, [show, value]);

  const handleSave = async () => {
    await onSave?.(formValue);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DynamicForm value={formValue} fields={fields} onChange={setFormValue} hideSubmit disabled={saving} namespace={namespace} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={saving} title={t("common:btnCancel")}>
          <XLg aria-hidden="true" /> {t("common:btnCancel")}
        </Button>
        <Button className="common-button-color" onClick={handleSave} disabled={saving} title={saveLabel || t("common:btnSave")}>
          <Check2 aria-hidden="true" /> {saveLabel || t("common:btnSave")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DynamicModalForm;
