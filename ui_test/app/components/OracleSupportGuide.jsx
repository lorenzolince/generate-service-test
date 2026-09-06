"use client";

import React from "react";
import { Alert, Badge } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  ORACLE_MODEL_EXAMPLES,
  ORACLE_NUMBER_PRECISION_MAPPINGS,
  ORACLE_RULE_GROUPS,
  ORACLE_SUPPORT_CAPABILITIES,
  ORACLE_TYPE_MAPPINGS
} from "../catalog/oracleSupportDocs";

const OracleSupportGuide = () => {
  const { t } = useTranslation();

  return (
    <div className="oracle-support-guide">
      <section className="support-hero-panel">
        <span className="support-kicker">{t("oracle:support.kicker")}</span>
        <h2>{t("oracle:support.title")}</h2>
        <p>{t("oracle:support.subtitle")}</p>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("oracle:support.capabilitiesTitle")}</h3>
          <p>{t("oracle:support.capabilitiesSubtitle")}</p>
        </div>
        <div className="support-capability-grid">
          {ORACLE_SUPPORT_CAPABILITIES.map((capability) => (
            <article className="support-capability-item" key={capability.key}>
              <div className="support-capability-header">
                <h4>{t(`oracle:support.capabilities.${capability.key}.title`)}</h4>
                <div className="capability-list">
                  {capability.tags.map((tag) => <Badge bg="light" text="dark" key={tag}>{tag}</Badge>)}
                </div>
              </div>
              <p>{t(`oracle:support.capabilities.${capability.key}.description`)}</p>
              <pre className="source-preview support-source-preview">{capability.example}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("oracle:support.typeMappingTitle")}</h3>
          <p>{t("oracle:support.typeMappingSubtitle")}</p>
        </div>
        <div className="support-table" role="table" aria-label={t("oracle:support.typeMappingTitle")}>
          <div className="support-table-row support-table-head" role="row">
            <div role="columnheader">{t("oracle:support.oracleType")}</div>
            <div role="columnheader">{t("oracle:support.contractType")}</div>
            <div role="columnheader">{t("oracle:support.simpleListType")}</div>
            <div role="columnheader">{t("oracle:support.restShape")}</div>
          </div>
          {ORACLE_TYPE_MAPPINGS.map((mapping) => (
            <div className="support-table-row" role="row" key={mapping.oracleType}>
              <div role="cell"><code>{mapping.oracleType}</code></div>
              <div role="cell"><code>{mapping.contractType}</code></div>
              <div role="cell"><code>{mapping.listType}</code></div>
              <div role="cell">{mapping.restShape}</div>
            </div>
          ))}
        </div>
        <Alert className="support-note" variant="secondary">{t("oracle:support.typeMappingNote")}</Alert>
        <Alert className="support-note" variant="secondary">{t("oracle:support.primitiveNote")}</Alert>
        <Alert className="support-note" variant="secondary">{t("oracle:support.listWrapperNote")}</Alert>
        <div className="support-section-heading support-nested-heading">
          <h3>{t("oracle:support.numberPrecisionTitle")}</h3>
          <p>{t("oracle:support.numberPrecisionSubtitle")}</p>
        </div>
        <div className="support-table" role="table" aria-label={t("oracle:support.numberPrecisionTitle")}>
          <div className="support-table-row support-table-head" role="row">
            <div role="columnheader">{t("oracle:support.numberCondition")}</div>
            <div role="columnheader">{t("oracle:support.logicalType")}</div>
            <div role="columnheader">{t("oracle:support.javaType")}</div>
            <div role="columnheader">{t("oracle:support.simpleListType")}</div>
          </div>
          {ORACLE_NUMBER_PRECISION_MAPPINGS.map((mapping) => (
            <div className="support-table-row" role="row" key={mapping.condition}>
              <div role="cell"><code>{mapping.condition}</code></div>
              <div role="cell"><code>{mapping.logicalType}</code></div>
              <div role="cell"><code>{mapping.javaType}</code></div>
              <div role="cell"><code>{mapping.listType}</code></div>
            </div>
          ))}
        </div>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("oracle:support.modelingTitle")}</h3>
          <p>{t("oracle:support.modelingSubtitle")}</p>
        </div>
        <div className="support-example-grid">
          {ORACLE_MODEL_EXAMPLES.map((example) => (
            <article className="support-example-item" key={example.key}>
              <h4>{t(`oracle:support.modelExamples.${example.key}.title`)}</h4>
              <p>{t(`oracle:support.modelExamples.${example.key}.description`)}</p>
              <div className="support-example-columns">
                <div>
                  <span>{t("oracle:support.oracleSource")}</span>
                  <pre className="source-preview support-source-preview">{example.source}</pre>
                </div>
                <div>
                  <span>{t("oracle:support.javaShape")}</span>
                  <pre className="source-preview support-source-preview">{example.java}</pre>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="support-section">
        <div className="support-section-heading">
          <h3>{t("oracle:support.rulesTitle")}</h3>
          <p>{t("oracle:support.rulesSubtitle")}</p>
        </div>
        <div className="support-rule-grid">
          {ORACLE_RULE_GROUPS.map((group) => (
            <article className="support-rule-group" key={group.key}>
              <h4>{t(`oracle:support.ruleGroups.${group.key}.title`)}</h4>
              <ul>
                {group.rules.map((rule) => <li key={rule}>{t(`oracle:support.ruleGroups.${group.key}.rules.${rule}`)}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OracleSupportGuide;