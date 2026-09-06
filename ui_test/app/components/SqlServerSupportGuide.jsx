"use client";

import React from "react";
import { Alert, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  SQLSERVER_JSON_WORKFLOW,
  SQLSERVER_RULE_GROUPS,
  SQLSERVER_SUPPORT_CAPABILITIES,
  SQLSERVER_TYPE_MAPPINGS
} from "../catalog/sqlserverSupportDocs";

const SqlServerSupportGuide = () => {
  const { t } = useTranslation();

  return (
    <div className="sqlserver-support-guide">
      <section className="support-hero-panel">
        <span className="support-kicker">{t("sqlserver:support.kicker")}</span>
        <h2>{t("sqlserver:support.title")}</h2>
        <p>{t("sqlserver:support.subtitle")}</p>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("sqlserver:support.jsonTitle")}</h3>
          <p>{t("sqlserver:support.jsonSubtitle")}</p>
        </div>
        <div className="support-example-grid">
          {SQLSERVER_JSON_WORKFLOW.map((step) => (
            <article className="support-example-item" key={step.key}>
              <div className="support-capability-header">
                <h4>{t(`sqlserver:support.jsonWorkflow.${step.key}.title`)}</h4>
                <div className="capability-list">
                  {step.tags.map((tag, index) => <Badge bg="light" text="dark" key={`${step.key}-${tag}-${index}`}>{tag}</Badge>)}
                </div>
              </div>
              <p>{t(`sqlserver:support.jsonWorkflow.${step.key}.description`)}</p>
              <pre className="source-preview support-source-preview">{step.example}</pre>
            </article>
          ))}
        </div>
        <Alert className="support-note" variant="secondary">{t("sqlserver:support.jsonRawNote")}</Alert>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("sqlserver:support.capabilitiesTitle")}</h3>
          <p>{t("sqlserver:support.capabilitiesSubtitle")}</p>
        </div>
        <div className="support-capability-grid">
          {SQLSERVER_SUPPORT_CAPABILITIES.map((capability) => (
            <article className="support-capability-item" key={capability.key}>
              <div className="support-capability-header">
                <h4>{t(`sqlserver:support.capabilities.${capability.key}.title`)}</h4>
                <div className="capability-list">
                  {capability.tags.map((tag, index) => <Badge bg="light" text="dark" key={`${capability.key}-${tag}-${index}`}>{tag}</Badge>)}
                </div>
              </div>
              <p>{t(`sqlserver:support.capabilities.${capability.key}.description`)}</p>
              <pre className="source-preview support-source-preview">{capability.example}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("sqlserver:support.typeMappingTitle")}</h3>
          <p>{t("sqlserver:support.typeMappingSubtitle")}</p>
        </div>
        <div className="support-table" role="table" aria-label={t("sqlserver:support.typeMappingTitle")}>
          <div className="support-table-row support-table-head" role="row">
            <div role="columnheader">{t("sqlserver:support.sqlType")}</div>
            <div role="columnheader">{t("sqlserver:support.contractType")}</div>
            <div role="columnheader">{t("sqlserver:support.simpleListType")}</div>
            <div role="columnheader">{t("sqlserver:support.restShape")}</div>
          </div>
          {SQLSERVER_TYPE_MAPPINGS.map((mapping) => (
            <div className="support-table-row" role="row" key={mapping.sqlType}>
              <div role="cell"><code>{mapping.sqlType}</code></div>
              <div role="cell"><code>{mapping.contractType}</code></div>
              <div role="cell"><code>{mapping.listType}</code></div>
              <div role="cell">{mapping.restShape}</div>
            </div>
          ))}
        </div>
        <Alert className="support-note" variant="secondary">{t("sqlserver:support.typeMappingNote")}</Alert>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("sqlserver:support.rulesTitle")}</h3>
          <p>{t("sqlserver:support.rulesSubtitle")}</p>
        </div>
        <div className="support-rule-grid">
          {SQLSERVER_RULE_GROUPS.map((group) => (
            <article className="support-rule-group" key={group.key}>
              <h4>{t(`sqlserver:support.ruleGroups.${group.key}.title`)}</h4>
              <ul>
                {group.rules.map((rule) => <li key={rule}>{t(`sqlserver:support.ruleGroups.${group.key}.rules.${rule}`)}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SqlServerSupportGuide;