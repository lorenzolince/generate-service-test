"use client";

import React from "react";
import { Alert, Button, Col, Row, Spinner } from "react-bootstrap";
import { Download } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import DataGrid from "./DataGrid";

const ResponseViewer = ({ operation, data, loading, error, namespace = "oracle" }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="response-state">
        <Spinner animation="border" size="sm" /> {t("common:isLoading")}
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (data === undefined) {
    return <Alert variant="secondary">{t(`${namespace}:executeToSeeResponse`)}</Alert>;
  }

  if (data === null || data === "") {
    return <Alert variant="info">{t(`${namespace}:emptyResponse`)}</Alert>;
  }

  return <div className="response-viewer">{renderValue(data, operation, t, namespace)}</div>;
};

const renderValue = (value, operation, t, namespace, fieldName = "response") => {
  const displayValue = parseJsonValue(value);

  if (Array.isArray(displayValue)) {
    return <ArrayValue rows={displayValue} t={t} namespace={namespace} />;
  }

  if (!isObject(displayValue)) {
    return <ScalarValue label={getLabel(t, fieldName, namespace)} value={displayValue} />;
  }

  const responseFields = operation?.responseFields || [];

  if (!responseFields.length) {
    return <pre className="json-preview">{JSON.stringify(displayValue, null, 2)}</pre>;
  }

  return (
    <Row className="response-fields">
      {responseFields.map((field) => (
        <Col md={getFieldColumnSize(displayValue?.[field.name], field)} key={field.name}>
          <section className="response-section">
            <h3>{getLabel(t, field.name, namespace)}</h3>
            {renderField(displayValue?.[field.name], field, t, namespace)}
          </section>
        </Col>
      ))}
    </Row>
  );
};

const renderField = (value, field, t, namespace) => {
  const displayValue = parseJsonValue(value);

  if (field.kind === "array") {
    const rows = Array.isArray(displayValue) ? displayValue : displayValue ? [displayValue] : [];
    return rows.length ? <ArrayValue rows={rows} t={t} namespace={namespace} /> : <Alert variant="secondary">{t(`${namespace}:emptyResult`)}</Alert>;
  }

  if (field.kind === "blob") {
    return <BlobValue label={getLabel(t, field.name, namespace)} value={value} t={t} namespace={namespace} />;
  }

  if (field.kind === "object") {
    if (Array.isArray(displayValue)) {
      return displayValue.length ? <ArrayValue rows={displayValue} t={t} namespace={namespace} /> : <Alert variant="secondary">{t(`${namespace}:emptyResult`)}</Alert>;
    }

    return displayValue ? <ObjectValue value={displayValue} t={t} namespace={namespace} /> : <Alert variant="secondary">{t(`${namespace}:emptyResult`)}</Alert>;
  }

  if (Array.isArray(displayValue)) {
    return displayValue.length ? <ArrayValue rows={displayValue} t={t} namespace={namespace} /> : <Alert variant="secondary">{t(`${namespace}:emptyResult`)}</Alert>;
  }

  if (isObject(displayValue)) {
    return <ObjectValue value={displayValue} t={t} namespace={namespace} />;
  }

  return <ScalarValue label={getLabel(t, field.name, namespace)} value={displayValue} />;
};

const getFieldColumnSize = (value, field) => {
  const displayValue = parseJsonValue(value);

  if (field.kind === "array" || field.kind === "object" || Array.isArray(displayValue) || isObject(displayValue)) {
    return 12;
  }

  return 4;
};

const ScalarValue = ({ label, value }) => (
  <div className="scalar-value">
    <span>{label}</span>
    <strong>{formatCellValue(value)}</strong>
  </div>
);

const ObjectValue = ({ value, t, namespace }) => {
  const displayValue = parseJsonValue(value);
  const entries = Object.entries(displayValue || {});

  if (!entries.length) {
    return <Alert variant="secondary">{t(`${namespace}:emptyResult`)}</Alert>;
  }

  const scalarEntries = entries.filter(([, fieldValue]) => isScalarDisplayValue(fieldValue));
  const nestedEntries = entries.filter(([, fieldValue]) => !isScalarDisplayValue(fieldValue));

  return (
    <>
      {scalarEntries.length ? (
        <Row className="response-fields">
          {scalarEntries.map(([key, fieldValue]) => (
            <Col md={4} key={key}>
              <ScalarValue label={getLabel(t, key, namespace)} value={parseJsonValue(fieldValue)} />
            </Col>
          ))}
        </Row>
      ) : null}
      <NestedFields entries={nestedEntries} t={t} namespace={namespace} />
    </>
  );
};

const ArrayValue = ({ rows, t, namespace }) => {
  const displayRows = rows.map(parseJsonValue);
  const tableRows = normalizeRows(displayRows, false);
  const nestedRows = displayRows
    .map((row, index) => ({ row, index, entries: getNestedEntries(row) }))
    .filter((item) => item.entries.length);

  return (
    <>
      {tableRows.length ? <DataGrid data={tableRows} schemaColumns={namespace} hiddenColumns={[]} pagination filtering /> : null}
      {nestedRows.length ? (
        <div className="nested-response-list">
          {nestedRows.map(({ row, index, entries }) => (
            <section className="nested-response-item" key={index}>
              <h4>{getRowLabel(row, index, t, namespace)}</h4>
              <NestedFields entries={entries} t={t} namespace={namespace} />
            </section>
          ))}
        </div>
      ) : null}
    </>
  );
};

const NestedFields = ({ entries, t, namespace }) => {
  if (!entries.length) return null;

  return (
    <div className="nested-response-fields">
      {entries.map(([key, value]) => {
        const displayValue = parseJsonValue(value);

        return (
          <section className="nested-response-section" key={key}>
            <h4>{getLabel(t, key, namespace)}</h4>
            {Array.isArray(displayValue) ? <ArrayValue rows={displayValue} t={t} namespace={namespace} /> : <ObjectValue value={displayValue} t={t} namespace={namespace} />}
          </section>
        );
      })}
    </div>
  );
};

const BlobValue = ({ label, value, t, namespace }) => {
  if (!value) {
    return <Alert variant="secondary">{t(`${namespace}:emptyResult`)}</Alert>;
  }

  const href = `data:application/octet-stream;base64,${value}`;

  return (
    <div className="blob-value">
      <code>{String(value).slice(0, 80)}{String(value).length > 80 ? "..." : ""}</code>
      <Button as="a" href={href} download={`${label}.bin`} variant="outline-primary" size="sm" title={t(`${namespace}:downloadBlob`)}>
        <Download aria-hidden="true" /> {t(`${namespace}:downloadBlob`)}
      </Button>
    </div>
  );
};

const normalizeRows = (rows, includeNested = true) => rows.map((row) => {
  const displayRow = parseJsonValue(row);

  if (!isObject(displayRow)) {
    return { value: displayRow };
  }

  return Object.entries(displayRow).reduce((current, [key, value]) => {
    const displayValue = parseJsonValue(value);

    if (!includeNested && !isScalarDisplayValue(displayValue)) {
      return current;
    }

    return {
      ...current,
      [key]: formatCellValue(displayValue)
    };
  }, {});
}).filter((row) => Object.keys(row).length);

const getNestedEntries = (value) => {
  const displayValue = parseJsonValue(value);

  if (!isObject(displayValue)) return [];

  return Object.entries(displayValue).filter(([, fieldValue]) => !isScalarDisplayValue(fieldValue));
};

const isScalarDisplayValue = (value) => {
  const displayValue = parseJsonValue(value);
  return !Array.isArray(displayValue) && !isObject(displayValue);
};

const getRowLabel = (row, index, t, namespace) => {
  const displayRow = parseJsonValue(row);

  if (isObject(displayRow)) {
    const fullName = [displayRow.nombre, displayRow.apellido].filter(Boolean).join(" ").trim();
    if (fullName) return fullName;
    if (displayRow.idPersona !== undefined) return `${getLabel(t, "idPersona", namespace)} ${displayRow.idPersona}`;
  }

  return `#${index + 1}`;
};

const parseJsonValue = (value) => {
  if (typeof value !== "string") return value;

  const trimmedValue = value.trim();
  if (!trimmedValue || !["[", "{"].includes(trimmedValue[0])) return value;

  try {
    return JSON.parse(trimmedValue);
  } catch (error) {
    return value;
  }
};

const formatCellValue = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) return JSON.stringify(value);
  if (isObject(value)) return JSON.stringify(value);
  return String(value);
};

const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const getLabel = (t, key, namespace) => t(`${namespace}:${key}`, { defaultValue: humanize(key) });

const humanize = (value) => String(value).replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());

export default ResponseViewer;
