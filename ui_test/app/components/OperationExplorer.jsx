"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, ButtonGroup, Col, Row, Tab, Tabs } from "react-bootstrap";
import { ArrowClockwise, PlayFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { executeOracleOperation } from "../actions/oracleService";
import { executeMysqlOperation } from "../actions/mysqlService";
import { executePostgresOperation } from "../actions/postgresService";
import { executeSqlServerOperation } from "../actions/sqlserverService";
import { ORACLE_CATEGORIES } from "../catalog/oracleOperations";
import { ORACLE_SUPPORT_CATEGORY } from "../catalog/oracleSupportDocs";
import DynamicForm from "./DynamicForm";
import EndpointMenu from "./EndpointMenu";
import OracleSupportGuide from "./OracleSupportGuide";
import ResponseViewer from "./ResponseViewer";

const OperationExplorer = ({
  operations,
  categories = ORACLE_CATEGORIES,
  supportCategory = ORACLE_SUPPORT_CATEGORY,
  SupportGuide = OracleSupportGuide,
  namespace = "oracle"
}) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState(categories[0]);
  const [search, setSearch] = useState("");
  const [activeOperation, setActiveOperation] = useState(null);
  const [requestBody, setRequestBody] = useState({});
  const [response, setResponse] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("execute");

  const filteredOperations = useMemo(() => {
    if (category === supportCategory) return [];

    const normalizedSearch = search.trim().toLowerCase();
    return operations
      .filter((operation) => operation.category === category)
      .filter((operation) => !normalizedSearch || operation.id.toLowerCase().includes(normalizedSearch) || operation.label.toLowerCase().includes(normalizedSearch));
  }, [category, operations, search, supportCategory]);

  useEffect(() => {
    if (category === supportCategory) {
      setActiveOperation(null);
      return;
    }

    const nextOperation = filteredOperations[0] || null;
    setActiveOperation(nextOperation);
  }, [category, filteredOperations, supportCategory]);

  const categoryTabs = useMemo(() => supportCategory ? [supportCategory, ...categories] : categories, [categories, supportCategory]);

  useEffect(() => {
    resetOperation(activeOperation);
    setActiveTab("execute");
  }, [activeOperation]);

  const resetOperation = (operation) => {
    setRequestBody(cloneValue(operation?.requestBody || {}));
    setResponse(undefined);
    setError("");
  };

  const runOperation = async () => {
    if (!activeOperation) return;

    setLoading(true);
    setError("");

    try {
      const result = await executeOperationByEngine(activeOperation, requestBody);
      setResponse(result);
    } catch (runError) {
      setError(runError.message || String(runError));
      setResponse(undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="operation-explorer">
      <div className="category-tabs" role="tablist" aria-label={t(`${namespace}:categoryTabs`)}>
        <ButtonGroup>
          {categoryTabs.map((item) => (
            <Button
              key={item}
              variant={item === category ? "primary" : "outline-primary"}
              onClick={() => setCategory(item)}
              title={t(`${namespace}:category.${item}`)}
            >
              {t(`${namespace}:category.${item}`)} {item !== supportCategory ? <Badge bg={item === category ? "light" : "secondary"} text={item === category ? "dark" : undefined}>{operations.filter((operation) => operation.category === item).length}</Badge> : null}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {category === supportCategory ? (
        <SupportGuide />
      ) : (
        <Row className="operation-layout">
          <Col lg={3}>
            <EndpointMenu operations={filteredOperations} activeOperationId={activeOperation?.id} onSelect={setActiveOperation} search={search} onSearch={setSearch} />
          </Col>
          <Col lg={9}>
          {activeOperation ? (
            <div className="operation-workspace">
              <header className="operation-header">
                <div>
                  <h2>{activeOperation.label}</h2>
                  <p><Badge bg="dark">{activeOperation.method}</Badge> {activeOperation.path}</p>
                </div>
                <Button variant="outline-secondary" onClick={() => resetOperation(activeOperation)} title={t("common:reset")}>
                  <ArrowClockwise aria-hidden="true" /> {t("common:reset")}
                </Button>
              </header>

              <section className="operation-panel operation-tabs-panel">
                <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key || "execute")} className="operation-tabs" id={`${namespace}-operation-tabs`}>
                  <Tab eventKey="execute" title={t(`${namespace}:tabs.execute`)}>
                    <div className="operation-tab-content">
                      <h3>{t(`${namespace}:request`)}</h3>
                      {activeOperation.hasRequestBody ? (
                        <DynamicForm value={requestBody} fields={activeOperation.formFields} namespace={namespace} onChange={setRequestBody} onSubmit={runOperation} disabled={loading} submitLabel={t("common:execute")} />
                      ) : (
                        <div className="no-request-panel">
                          <Alert variant="secondary">{t(`${namespace}:emptyRequest`)}</Alert>
                          <Button className="common-button-color" onClick={runOperation} disabled={loading} title={t("common:execute")}>
                            <PlayFill aria-hidden="true" /> {t("common:execute")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Tab>
                  <Tab eventKey="description" title={t(`${namespace}:tabs.description`)}>
                    <OperationDescription operation={activeOperation} t={t} namespace={namespace} />
                  </Tab>
                  <Tab eventKey="contract" title={t(`${namespace}:tabs.contract`)}>
                    <OperationContract operation={activeOperation} t={t} namespace={namespace} />
                  </Tab>
                  <Tab eventKey="source" title={t(`${namespace}:tabs.source`)}>
                    <OperationSource operation={activeOperation} t={t} namespace={namespace} />
                  </Tab>
                </Tabs>
              </section>

              <section className="operation-panel">
                <h3>{t(`${namespace}:response`)}</h3>
                <ResponseViewer operation={activeOperation} data={response} loading={loading} error={error} namespace={namespace} />
              </section>
            </div>
          ) : (
            <Alert variant="secondary">{t(`${namespace}:noEndpointSelected`)}</Alert>
          )}
          </Col>
        </Row>
      )}
    </div>
  );
};

const cloneValue = (source) => JSON.parse(JSON.stringify(source || {}));

const executeOperationByEngine = (operation, payload) => {
  const requestPayload = preparePayload(operation, payload);

  if (operation.engine === "sqlserver") {
    return executeSqlServerOperation(operation.id, requestPayload);
  }

  if (operation.engine === "postgres") {
    return executePostgresOperation(operation.id, requestPayload);
  }

  if (operation.engine === "mysql") {
    return executeMysqlOperation(operation.id, requestPayload);
  }

  return executeOracleOperation(operation.id, requestPayload);
};

const preparePayload = (operation, payload) => {
  if (operation.engine === "sqlserver" && operation.id === "gsSpInsertPersonaJson") {
    return {
      pPersona: {
        nombre: payload.pNombre || "",
        apellido: payload.pApellido || "",
        edad: Number(payload.pEdad || 0),
        email: payload.pEmail || "",
        fechaNacimiento: payload.pFechaNacimiento || null,
        activo: Boolean(payload.pActivo)
      }
    };
  }

  if (operation.engine === "mysql" && ["gsSpInsertPersonaJson", "gsSpInsertJsonResultset"].includes(operation.id)) {
    return {
      pPersona: {
        nombre: payload.pNombre || "",
        apellido: payload.pApellido || "",
        edad: Number(payload.pEdad || 0),
        email: payload.pEmail || "",
        fechaNacimiento: payload.pFechaNacimiento || null,
        activo: Boolean(payload.pActivo)
      }
    };
  }

  if (operation.engine === "mysql" && ["gsSpInsertPersonasJsonArray", "gsFnInsertPersonasJson"].includes(operation.id)) {
    return {
      pPersonas: Array.isArray(payload.pPersonas) ? payload.pPersonas : []
    };
  }

  if (operation.engine === "mysql" && operation.id === "gsSpUpdateMysqlTiposExtra") {
    return {
      pIdPersona: payload.pIdPersona,
      pSalario: payload.pSalario,
      pBio: payload.pBio || "",
      pUltimoAcceso: payload.pUltimoAcceso || null,
      pHoraContacto: payload.pHoraContacto || "",
      pFoto: payload.pFoto || "",
      pPerfilJson: {
        nivel: payload.pPerfilNivel || "",
        habilidades: Array.isArray(payload.pPerfilHabilidades) ? payload.pPerfilHabilidades : []
      }
    };
  }

  if (operation.engine === "mysql" && operation.id === "gsQUpdateMysqlTiposExtra") {
    return {
      salario: payload.salario,
      bio: payload.bio || "",
      ultimoAcceso: payload.ultimoAcceso || null,
      horaContacto: payload.horaContacto || "",
      foto: payload.foto || "",
      perfilJson: {
        nivel: payload.perfilNivel || "",
        habilidades: Array.isArray(payload.perfilHabilidades) ? payload.perfilHabilidades : []
      },
      idPersona: payload.idPersona
    };
  }

  if (operation.engine === "sqlserver" && ["gsSpInsertPersonasJson", "gsIfPersonasByJson"].includes(operation.id)) {
    return {
      pPersonas: Array.isArray(payload.pPersonas) ? payload.pPersonas : []
    };
  }

  if (operation.engine === "sqlserver" && operation.id === "gsQPersonasByJson") {
    return {
      personasJson: Array.isArray(payload.personasJson) ? payload.personasJson : []
    };
  }

  return payload;
};

const OperationDescription = ({ operation, t, namespace }) => {
  const documentation = operation.documentation || {};
  const description = t(`${namespace}:operationDescriptions.${documentation.descriptionKey || operation.id}`, {
    defaultValue: t(`${namespace}:operationDescriptions.default`)
  });

  return (
    <div className="operation-tab-content operation-guide">
      <h3>{t(`${namespace}:guideTitle`)}</h3>
      <p className="operation-guide-summary">{description}</p>
      <OperationMetadata operation={operation} t={t} namespace={namespace} />
      <CapabilityList capabilities={documentation.capabilities || []} t={t} namespace={namespace} />
    </div>
  );
};

const OperationContract = ({ operation, t, namespace }) => {
  const requestFields = operation.hasRequestBody ? getRequestFields(operation.requestBody, operation.requestFields) : [];
  const responseFields = operation.responseFields || [];

  return (
    <div className="operation-tab-content operation-guide">
      <h3>{t(`${namespace}:contractTitle`)}</h3>
      <OperationMetadata operation={operation} t={t} namespace={namespace} />
      <FieldList title={t(`${namespace}:requestFields`)} emptyLabel={t(`${namespace}:noRequestFields`)} fields={requestFields} t={t} namespace={namespace} />
      <FieldList title={t(`${namespace}:responseFields`)} emptyLabel={t(`${namespace}:noResponseFields`)} fields={responseFields.map((field) => ({ name: field.name, kind: field.kind, type: field.type, contractType: field.contractType }))} t={t} namespace={namespace} />
    </div>
  );
};

const OperationSource = ({ operation, t, namespace }) => {
  const documentation = operation.documentation || {};

  return (
    <div className="operation-tab-content operation-guide">
      <h3>{t(`${namespace}:sourceTitle`)}</h3>
      <OperationMetadata operation={operation} t={t} namespace={namespace} />
      <div>
        <h4 className="operation-section-title">{t(`${namespace}:sourceDefinition`)}</h4>
        {documentation.source ? <pre className="source-preview">{documentation.source}</pre> : <Alert variant="secondary">{t(`${namespace}:noSourceDefinition`)}</Alert>}
      </div>
    </div>
  );
};

const OperationMetadata = ({ operation, t, namespace }) => {
  const documentation = operation.documentation || {};

  return (
    <dl className="operation-meta-grid">
      <div>
        <dt>{t(`${namespace}:httpMethod`)}</dt>
        <dd><Badge bg="dark">{operation.method}</Badge></dd>
      </div>
      <div>
        <dt>{t(`${namespace}:restPath`)}</dt>
        <dd>{operation.path}</dd>
      </div>
      <div>
        <dt>{t(`${namespace}:sourceName`)}</dt>
        <dd>{documentation.sourceName || operation.id}</dd>
      </div>
      <div>
        <dt>{t(`${namespace}:sourceType`)}</dt>
        <dd>{getSourceTypeLabel(documentation.sourceType || operation.category, t, namespace)}</dd>
      </div>
      <div>
        <dt>{t(`${namespace}:responseKind`)}</dt>
        <dd>{getResponseKindLabel(operation.responseKind, t, namespace)}</dd>
      </div>
    </dl>
  );
};

const CapabilityList = ({ capabilities, t, namespace }) => (
  <div>
    <h4 className="operation-section-title">{t(`${namespace}:capabilitiesLabel`)}</h4>
    {capabilities.length ? (
      <div className="capability-list">
        {capabilities.map((capability) => <Badge bg="light" text="dark" key={capability}>{getCapabilityLabel(capability, t, namespace)}</Badge>)}
      </div>
    ) : (
      <Alert variant="secondary">{t(`${namespace}:emptyCapabilities`)}</Alert>
    )}
  </div>
);

const FieldList = ({ title, emptyLabel, fields, t, namespace }) => (
  <div>
    <h4 className="operation-section-title">{title}</h4>
    {fields.length ? (
      <div className="contract-field-list">
        {fields.map((field) => (
          <div className="contract-field-row" key={field.name}>
            <strong>{getLabel(t, field.name, namespace)}</strong>
            <span>{getFieldKindLabel(field.kind, t, namespace)}</span>
            <code>{field.contractType || field.type || t(`${namespace}:notApplicable`)}</code>
          </div>
        ))}
      </div>
    ) : (
      <Alert variant="secondary">{emptyLabel}</Alert>
    )}
  </div>
);

const getRequestFields = (requestBody, declaredFields) => {
  if (declaredFields?.length) return declaredFields;

  return Object.entries(requestBody || {}).map(([name, value]) => ({
    name,
    kind: inferFieldKind(value),
    type: inferFieldType(value)
  }));
};

const inferFieldKind = (value) => {
  if (Array.isArray(value)) return "array";
  if (value !== null && typeof value === "object") return "object";
  return "scalar";
};

const inferFieldType = (value) => {
  if (Array.isArray(value)) {
    const firstValue = value.find((item) => item !== null && item !== undefined);
    return firstValue === undefined ? "Array" : `Array<${inferFieldType(firstValue)}>`;
  }

  if (value === null) return "null";
  if (value instanceof Date) return "Date";
  if (typeof value === "object") return "Object";
  return typeof value;
};

const getLabel = (t, key, namespace) => t(`${namespace}:${key}`, { defaultValue: humanize(key) });

const getCapabilityLabel = (capability, t, namespace) => t(`${namespace}:capabilities.${capability}`, { defaultValue: humanize(capability) });

const getSourceTypeLabel = (sourceType, t, namespace) => t(`${namespace}:sourceTypes.${sourceType}`, { defaultValue: humanize(sourceType) });

const getFieldKindLabel = (kind, t, namespace) => t(`${namespace}:fieldKinds.${kind}`, { defaultValue: humanize(kind) });

const getResponseKindLabel = (kind = "object", t, namespace) => t(`${namespace}:responseKinds.${kind}`, { defaultValue: humanize(kind) });

const humanize = (value) => String(value || "").replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());

export default OperationExplorer;
