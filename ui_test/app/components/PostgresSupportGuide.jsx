"use client";

import React from "react";
import { Alert, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  POSTGRES_JSON_WORKFLOW,
  POSTGRES_RULE_GROUPS,
  POSTGRES_SUPPORT_CAPABILITIES,
  POSTGRES_TYPE_MAPPINGS
} from "../catalog/postgresSupportDocs";

const PostgresSupportGuide = () => {
  const { t } = useTranslation();

  return (
    <div className="postgres-support-guide">
      <section className="support-hero-panel">
        <span className="support-kicker">{t("postgres:support.kicker")}</span>
        <h2>{t("postgres:support.title")}</h2>
        <p>{t("postgres:support.subtitle")}</p>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("postgres:support.jsonTitle")}</h3>
          <p>{t("postgres:support.jsonSubtitle")}</p>
        </div>
        <div className="support-example-grid">
          {POSTGRES_JSON_WORKFLOW.map((step) => (
            <article className="support-example-item" key={step.key}>
              <div className="support-capability-header">
                <h4>{t(`postgres:support.jsonWorkflow.${step.key}.title`)}</h4>
                <div className="capability-list">
                  {step.tags.map((tag, index) => <Badge bg="light" text="dark" key={`${step.key}-${tag}-${index}`}>{tag}</Badge>)}
                </div>
              </div>
              <p>{t(`postgres:support.jsonWorkflow.${step.key}.description`)}</p>
              <pre className="source-preview support-source-preview">{step.example}</pre>
            </article>
          ))}
        </div>
        <Alert className="support-note" variant="secondary">{t("postgres:support.jsonRawNote")}</Alert>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("postgres:support.capabilitiesTitle")}</h3>
          <p>{t("postgres:support.capabilitiesSubtitle")}</p>
        </div>
        <div className="support-capability-grid">
          {POSTGRES_SUPPORT_CAPABILITIES.map((capability) => (
            <article className="support-capability-item" key={capability.key}>
              <div className="support-capability-header">
                <h4>{t(`postgres:support.capabilities.${capability.key}.title`)}</h4>
                <div className="capability-list">
                  {capability.tags.map((tag, index) => <Badge bg="light" text="dark" key={`${capability.key}-${tag}-${index}`}>{tag}</Badge>)}
                </div>
              </div>
              <p>{t(`postgres:support.capabilities.${capability.key}.description`)}</p>
              <pre className="source-preview support-source-preview">{capability.example}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("postgres:support.typeMappingTitle")}</h3>
          <p>{t("postgres:support.typeMappingSubtitle")}</p>
        </div>
        <div className="support-table" role="table" aria-label={t("postgres:support.typeMappingTitle")}>
          <div className="support-table-row support-table-head" role="row">
            <div role="columnheader">{t("postgres:support.sqlType")}</div>
            <div role="columnheader">{t("postgres:support.contractType")}</div>
            <div role="columnheader">{t("postgres:support.simpleListType")}</div>
            <div role="columnheader">{t("postgres:support.restShape")}</div>
          </div>
          {POSTGRES_TYPE_MAPPINGS.map((mapping) => (
            <div className="support-table-row" role="row" key={mapping.sqlType}>
              <div role="cell"><code>{mapping.sqlType}</code></div>
              <div role="cell"><code>{mapping.contractType}</code></div>
              <div role="cell"><code>{mapping.listType}</code></div>
              <div role="cell">{mapping.restShape}</div>
            </div>
          ))}
        </div>
        <Alert className="support-note" variant="secondary">{t("postgres:support.typeMappingNote")}</Alert>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("postgres:support.rulesTitle")}</h3>
          <p>{t("postgres:support.rulesSubtitle")}</p>
        </div>
        <div className="support-rule-grid">
          {POSTGRES_RULE_GROUPS.map((group) => (
            <article className="support-rule-group" key={group.key}>
              <h4>{t(`postgres:support.ruleGroups.${group.key}.title`)}</h4>
              <ul>
                {group.rules.map((rule) => <li key={rule}>{t(`postgres:support.ruleGroups.${group.key}.rules.${rule}`)}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostgresSupportGuide;