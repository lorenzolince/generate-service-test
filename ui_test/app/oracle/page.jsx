"use client";

import React from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ORACLE_OPERATIONS } from "../catalog/oracleOperations";
import OperationExplorer from "../components/OperationExplorer";

const OraclePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <title>{t("oracle:explorerTitle")}</title>
      <Container fluid className="app-page">
        <div className="page-heading">
          <h1>{t("oracle:explorerTitle")}</h1>
          <p>{t("oracle:explorerSubtitle")}</p>
        </div>
        <OperationExplorer operations={ORACLE_OPERATIONS} />
      </Container>
    </>
  );
};

export default OraclePage;
