"use client";

import React from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { POSTGRES_CATEGORIES, POSTGRES_OPERATIONS } from "../catalog/postgresOperations";
import { POSTGRES_SUPPORT_CATEGORY } from "../catalog/postgresSupportDocs";
import OperationExplorer from "../components/OperationExplorer";
import PostgresSupportGuide from "../components/PostgresSupportGuide";

const PostgresPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <title>{t("postgres:explorerTitle")}</title>
      <Container fluid className="app-page">
        <div className="page-heading">
          <h1>{t("postgres:explorerTitle")}</h1>
          <p>{t("postgres:explorerSubtitle")}</p>
        </div>
        <OperationExplorer
          operations={POSTGRES_OPERATIONS}
          categories={POSTGRES_CATEGORIES}
          supportCategory={POSTGRES_SUPPORT_CATEGORY}
          SupportGuide={PostgresSupportGuide}
          namespace="postgres"
        />
      </Container>
    </>
  );
};

export default PostgresPage;