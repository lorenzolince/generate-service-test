"use client";

import React from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { MYSQL_CATEGORIES, MYSQL_OPERATIONS } from "../catalog/mysqlOperations";
import { MYSQL_SUPPORT_CATEGORY } from "../catalog/mysqlSupportDocs";
import MysqlSupportGuide from "../components/MysqlSupportGuide";
import OperationExplorer from "../components/OperationExplorer";

const MysqlPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <title>{t("mysql:explorerTitle")}</title>
      <Container fluid className="app-page">
        <div className="page-heading">
          <h1>{t("mysql:explorerTitle")}</h1>
          <p>{t("mysql:explorerSubtitle")}</p>
        </div>
        <OperationExplorer
          operations={MYSQL_OPERATIONS}
          categories={MYSQL_CATEGORIES}
          supportCategory={MYSQL_SUPPORT_CATEGORY}
          SupportGuide={MysqlSupportGuide}
          namespace="mysql"
        />
      </Container>
    </>
  );
};

export default MysqlPage;
