"use client";

import React from "react";
import { Alert, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  MYSQL_JSON_WORKFLOW,
  MYSQL_RULE_GROUPS,
  MYSQL_SUPPORT_CAPABILITIES,
  MYSQL_TYPE_MAPPINGS
} from "../catalog/mysqlSupportDocs";

const MysqlSupportGuide = () => {
  const { t } = useTranslation();

  return (
    <div className="mysql-support-guide">
      <section className="support-hero-panel">
        <span className="support-kicker">{t("mysql:support.kicker")}</span>
        <h2>{t("mysql:support.title")}</h2>
        <p>{t("mysql:support.subtitle")}</p>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("mysql:support.jsonTitle")}</h3>
          <p>{t("mysql:support.jsonSubtitle")}</p>
        </div>
        <div className="support-example-grid">
          {MYSQL_JSON_WORKFLOW.map((step) => (
            <article className="support-example-item" key={step.key}>
              <div className="support-capability-header">
                <h4>{t(`mysql:support.jsonWorkflow.${step.key}.title`)}</h4>
                <div className="capability-list">
                  {step.tags.map((tag, index) => <Badge bg="light" text="dark" key={`${step.key}-${tag}-${index}`}>{tag}</Badge>)}
                </div>
              </div>
              <p>{t(`mysql:support.jsonWorkflow.${step.key}.description`)}</p>
              <pre className="source-preview support-source-preview">{step.example}</pre>
            </article>
          ))}
        </div>
        <Alert className="support-note" variant="secondary">{t("mysql:support.jsonRawNote")}</Alert>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("mysql:support.capabilitiesTitle")}</h3>
          <p>{t("mysql:support.capabilitiesSubtitle")}</p>
        </div>
        <div className="support-capability-grid">
          {MYSQL_SUPPORT_CAPABILITIES.map((capability) => (
            <article className="support-capability-item" key={capability.key}>
              <div className="support-capability-header">
                <h4>{t(`mysql:support.capabilities.${capability.key}.title`)}</h4>
                <div className="capability-list">
                  {capability.tags.map((tag, index) => <Badge bg="light" text="dark" key={`${capability.key}-${tag}-${index}`}>{tag}</Badge>)}
                </div>
              </div>
              <p>{t(`mysql:support.capabilities.${capability.key}.description`)}</p>
              <pre className="source-preview support-source-preview">{capability.example}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("mysql:support.typeMappingTitle")}</h3>
          <p>{t("mysql:support.typeMappingSubtitle")}</p>
        </div>
        <div className="support-table" role="table" aria-label={t("mysql:support.typeMappingTitle")}>
          <div className="support-table-row support-table-head" role="row">
            <div role="columnheader">{t("mysql:support.sqlType")}</div>
            <div role="columnheader">{t("mysql:support.contractType")}</div>
            <div role="columnheader">{t("mysql:support.simpleListType")}</div>
            <div role="columnheader">{t("mysql:support.restShape")}</div>
          </div>
          {MYSQL_TYPE_MAPPINGS.map((mapping) => (
            <div className="support-table-row" role="row" key={mapping.sqlType}>
              <div role="cell"><code>{mapping.sqlType}</code></div>
              <div role="cell"><code>{mapping.contractType}</code></div>
              <div role="cell"><code>{mapping.listType}</code></div>
              <div role="cell">{mapping.restShape}</div>
            </div>
          ))}
        </div>
        <Alert className="support-note" variant="secondary">{t("mysql:support.typeMappingNote")}</Alert>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("mysql:support.rulesTitle")}</h3>
          <p>{t("mysql:support.rulesSubtitle")}</p>
        </div>
        <div className="support-rule-grid">
          {MYSQL_RULE_GROUPS.map((group) => (
            <article className="support-rule-group" key={group.key}>
              <h4>{t(`mysql:support.ruleGroups.${group.key}.title`)}</h4>
              <ul>
                {group.rules.map((rule) => <li key={rule}>{t(`mysql:support.ruleGroups.${group.key}.rules.${rule}`)}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MysqlSupportGuide;
