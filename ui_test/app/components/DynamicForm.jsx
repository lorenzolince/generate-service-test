"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { PlayFill, PlusLg, Trash } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import DataGrid from "./DataGrid";

const DynamicForm = ({
  value = {},
  fields,
  onChange,
  onSubmit,
  disabled = false,
  submitLabel,
  hideSubmit = false,
  namespace = "oracle"
}) => {
  const { t } = useTranslation();
  const [jsonDrafts, setJsonDrafts] = useState({});
  const [jsonErrors, setJsonErrors] = useState({});

  const visibleFields = useMemo(() => (fields || []).filter((field) => !field.hidden), [fields]);

  useEffect(() => {
    setJsonDrafts({});
    setJsonErrors({});
  }, [value]);

  const updateValue = (path, nextValue) => {
    onChange(setPathValue(value, path, nextValue));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!Object.values(jsonErrors).some(Boolean)) {
      onSubmit?.(value);
    }
  };

  const renderFieldList = () => {
    if (!visibleFields.length) {
      return renderObject(value, []);
    }

    return visibleFields.map((field) => renderInput(field, toPath(field.name), getPathValue(value, toPath(field.name))));
  };

  const renderObject = (objectValue, basePath) => {
    const entries = Object.entries(objectValue || {});

    if (!entries.length) {
      return <Alert variant="secondary">{t(`${namespace}:emptyRequest`)}</Alert>;
    }

    return entries.map(([key, fieldValue]) => {
      const path = [...basePath, key];
      const isNestedObject = isPlainObject(fieldValue);

      if (isNestedObject) {
        return (
          <div className="operation-field-group" key={path.join(".")}>
            <h3>{getLabel(t, namespace, key)}</h3>
            <Row>{renderObject(fieldValue, path)}</Row>
          </div>
        );
      }

      return renderInput({ name: path, type: getInputType(key, fieldValue) }, path, fieldValue);
    });
  };

  const renderInput = (field, path, fieldValue) => {
    const key = path.join(".");
    const type = field.type || getInputType(path[path.length - 1], fieldValue);
    const label = field.label || getLabel(t, namespace, path[path.length - 1]);
    const fieldDisabled = disabled || field.disabled;

    if (type === "json") {
      return (
        <Col md={12} key={key}>
          <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
              as="textarea"
              rows={7}
              value={jsonDrafts[key] ?? JSON.stringify(fieldValue ?? null, null, 2)}
              disabled={fieldDisabled}
              onChange={(event) => handleJsonChange(key, path, event.target.value)}
            />
            {jsonErrors[key] ? <Form.Text className="text-danger">{jsonErrors[key]}</Form.Text> : null}
          </Form.Group>
        </Col>
      );
    }

    if (type === "array") {
      return (
        <ArrayField
          key={key}
          label={label}
          value={fieldValue}
          path={path}
          disabled={fieldDisabled}
          namespace={namespace}
          updateValue={updateValue}
          t={t}
        />
      );
    }

    if (type === "checkbox") {
      return (
        <Col md={field.col || 4} key={key}>
          <Form.Group className="mb-3 dynamic-check-field">
            <Form.Check
              type="switch"
              id={key}
              label={label}
              checked={Boolean(fieldValue)}
              disabled={fieldDisabled}
              onChange={(event) => updateValue(path, event.target.checked)}
            />
          </Form.Group>
        </Col>
      );
    }

    return (
      <Col md={field.col || 4} key={key}>
        <Form.Group className="mb-3">
          <Form.Label>{label}</Form.Label>
          <Form.Control
            type={type}
            value={fieldValue ?? ""}
            disabled={fieldDisabled}
            placeholder={label}
            onChange={(event) => updateValue(path, castInputValue(type, event.target.value))}
          />
        </Form.Group>
      </Col>
    );
  };

  const handleJsonChange = (key, path, draftValue) => {
    setJsonDrafts((current) => ({ ...current, [key]: draftValue }));

    try {
      const nextValue = JSON.parse(draftValue);
      setJsonErrors((current) => ({ ...current, [key]: "" }));
      updateValue(path, nextValue);
    } catch (error) {
      setJsonErrors((current) => ({ ...current, [key]: t(`${namespace}:invalidJson`) }));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>{renderFieldList()}</Row>
      {!hideSubmit ? (
        <div className="form-actions">
          <Button className="common-button-color" type="submit" disabled={disabled || Object.values(jsonErrors).some(Boolean)} title={submitLabel || t("common:execute")}>
            <PlayFill aria-hidden="true" /> {submitLabel || t("common:execute")}
          </Button>
        </div>
      ) : null}
    </Form>
  );
};

const ArrayField = ({ label, value, path, disabled, namespace, updateValue, t }) => {
  const rows = Array.isArray(value) ? value : [];
  const [objectTemplate, setObjectTemplate] = useState(() => getObjectArrayTemplate(rows));
  const objectKeys = Object.keys(objectTemplate);
  const isObjectArray = objectKeys.length > 0;
  const itemType = isObjectArray ? "text" : getArrayItemType(path[path.length - 1], rows);

  useEffect(() => {
    const nextTemplate = getObjectArrayTemplate(rows);
    if (Object.keys(nextTemplate).length && JSON.stringify(nextTemplate) !== JSON.stringify(objectTemplate)) {
      setObjectTemplate(nextTemplate);
    }
  }, [objectTemplate, rows]);

  const updateRow = (index, nextValue) => {
    const nextRows = [...rows];
    nextRows[index] = castInputValue(itemType, nextValue);
    updateValue(path, nextRows);
  };

  const updateObjectCell = (index, fieldName, nextValue) => {
    const currentRow = isPlainObject(rows[index]) ? rows[index] : objectTemplate;
    const inputType = getInputType(fieldName, currentRow[fieldName]);
    const nextRows = [...rows];

    nextRows[index] = {
      ...currentRow,
      [fieldName]: castInputValue(inputType, nextValue)
    };

    updateValue(path, nextRows);
  };

  const addRow = () => {
    updateValue(path, [...rows, isObjectArray ? { ...objectTemplate } : getDefaultArrayValue(itemType)]);
  };

  const removeRow = (index) => {
    updateValue(path, rows.filter((_, rowIndex) => rowIndex !== index));
  };

  const gridRows = isObjectArray ? rows.map((rowValue, index) => {
    const currentRow = isPlainObject(rowValue) ? rowValue : objectTemplate;
    const gridRow = objectKeys.reduce((current, fieldName) => ({
      ...current,
      [fieldName]: renderArrayCell({
        value: currentRow[fieldName],
        fieldName,
        index,
        path,
        label: getLabel(t, namespace, fieldName),
        disabled,
        onChange: (nextValue) => updateObjectCell(index, fieldName, nextValue)
      })
    }), { row: index + 1 });

    return {
      ...gridRow,
      actions: renderRemoveButton({ disabled, onClick: () => removeRow(index), t })
    };
  }) : rows.map((rowValue, index) => ({
    row: index + 1,
    value: renderArrayCell({
      value: rowValue,
      fieldName: path[path.length - 1],
      index,
      path,
      label,
      disabled,
      onChange: (nextValue) => updateRow(index, nextValue)
    }),
    actions: renderRemoveButton({ disabled, onClick: () => removeRow(index), t })
  }));

  return (
    <Col md={12} key={path.join(".")}>
      <Form.Group className="mb-3 array-field">
        <div className="array-field-header">
          <Form.Label>{label}</Form.Label>
          <Button variant="outline-primary" size="sm" disabled={disabled} onClick={addRow} title={t("common:btnAdd")}>
            <PlusLg aria-hidden="true" /> {t("common:btnAdd")}
          </Button>
        </div>
        {gridRows.length ? (
          <DataGrid data={gridRows} schemaColumns={namespace} hiddenColumns={[]} pagination={false} filtering={false} />
        ) : (
          <Alert variant="secondary">{t(`${namespace}:emptyResult`)}</Alert>
        )}
      </Form.Group>
    </Col>
  );
};

const renderArrayCell = ({ value, fieldName, index, path, label, disabled, onChange }) => {
  const type = getInputType(fieldName, value);

  if (type === "checkbox") {
    return (
      <Form.Check
        type="switch"
        id={`${path.join(".")}.${index}.${fieldName}`}
        checked={Boolean(value)}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    );
  }

  return (
    <Form.Control
      size="sm"
      type={type === "number" || type === "date" ? type : "text"}
      value={value ?? ""}
      disabled={disabled}
      aria-label={`${label} ${index + 1}`}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

const renderRemoveButton = ({ disabled, onClick, t }) => (
  <Button variant="outline-danger" size="sm" disabled={disabled} onClick={onClick} title={t("common:btnDelete")}>
    <Trash aria-hidden="true" />
  </Button>
);

const getInputType = (name, value) => {
  if (Array.isArray(value)) return isEditableArray(value) ? "array" : "json";
  if (isPlainObject(value)) return "json";
  if (typeof value === "boolean") return "checkbox";
  if (typeof value === "number") return "number";
  if (/fechaNacimiento/i.test(name)) return "date";
  return "text";
};

const castInputValue = (type, value) => {
  if (type === "number") {
    return value === "" ? "" : Number(value);
  }

  return value;
};

const getArrayItemType = (name, rows) => {
  const firstValue = rows.find((row) => row !== null && row !== undefined && row !== "");

  if (typeof firstValue === "boolean") return "checkbox";
  if (typeof firstValue === "number" || /numero|numeros|entero|enteros|total|suma|id/i.test(name)) return "number";
  if (/fecha/i.test(name)) return "date";
  return "text";
};

const getDefaultArrayValue = (type) => {
  if (type === "number") return 0;
  if (type === "checkbox") return false;
  return "";
};

const getObjectArrayTemplate = (rows) => rows.reduce((template, row) => {
  if (!isPlainObject(row)) return template;

  return Object.entries(row).reduce((current, [key, value]) => {
    if (Array.isArray(value) || isPlainObject(value) || Object.prototype.hasOwnProperty.call(current, key)) {
      return current;
    }

    return {
      ...current,
      [key]: getDefaultObjectValue(key, value)
    };
  }, template);
}, {});

const getDefaultObjectValue = (name, value) => {
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  if (/fecha/i.test(name)) return "";
  return "";
};

const toPath = (path) => (Array.isArray(path) ? path : String(path).split("."));

const getPathValue = (source, path) => path.reduce((current, key) => current?.[key], source);

const setPathValue = (source, path, nextValue) => {
  const copy = cloneValue(source || {});
  let cursor = copy;

  path.forEach((key, index) => {
    if (index === path.length - 1) {
      cursor[key] = nextValue;
      return;
    }

    cursor[key] = cursor[key] ?? {};
    cursor = cursor[key];
  });

  return copy;
};

const cloneValue = (source) => JSON.parse(JSON.stringify(source));

const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isPrimitiveArray = (value) => value.every((item) => !isPlainObject(item) && !Array.isArray(item));

const isEditableObjectArray = (value) => value.length > 0 && value.every((item) => isPlainObject(item) && Object.values(item).every((fieldValue) => !isPlainObject(fieldValue) && !Array.isArray(fieldValue)));

const isEditableArray = (value) => isPrimitiveArray(value) || isEditableObjectArray(value);

const getLabel = (t, namespace, key) => t(`${namespace}:${key}`, { defaultValue: humanize(key) });

const humanize = (value) => String(value).replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());

export default DynamicForm;
