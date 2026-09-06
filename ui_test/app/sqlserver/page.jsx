"use client";

import React from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { SQLSERVER_CATEGORIES, SQLSERVER_OPERATIONS } from "../catalog/sqlserverOperations";
import { SQLSERVER_SUPPORT_CATEGORY } from "../catalog/sqlserverSupportDocs";
import OperationExplorer from "../components/OperationExplorer";
import SqlServerSupportGuide from "../components/SqlServerSupportGuide";

const SqlServerPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <title>{t("sqlserver:explorerTitle")}</title>
      <Container fluid className="app-page">
        <div className="page-heading">
          <h1>{t("sqlserver:explorerTitle")}</h1>
          <p>{t("sqlserver:explorerSubtitle")}</p>
        </div>
        <OperationExplorer
          operations={SQLSERVER_OPERATIONS}
          categories={SQLSERVER_CATEGORIES}
          supportCategory={SQLSERVER_SUPPORT_CATEGORY}
          SupportGuide={SqlServerSupportGuide}
          namespace="sqlserver"
        />
      </Container>
    </>
  );
};

export default SqlServerPage;