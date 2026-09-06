"use client";

import React from "react";
import { Badge, Button, Form, ListGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

const EndpointMenu = ({ operations, activeOperationId, onSelect, search, onSearch }) => {
  const { t } = useTranslation();

  return (
    <aside className="endpoint-menu">
      <Form.Group className="endpoint-search">
        <Form.Label><Search aria-hidden="true" /> {t("common:search")}</Form.Label>
        <Form.Control value={search} onChange={(event) => onSearch(event.target.value)} placeholder={t("oracle:searchEndpoint")} />
      </Form.Group>
      <ListGroup className="endpoint-list">
        {operations.map((operation) => (
          <ListGroup.Item
            action
            active={operation.id === activeOperationId}
            key={operation.id}
            onClick={() => onSelect(operation)}
            className="endpoint-item"
          >
            <div className="endpoint-copy">
              <div className="endpoint-name">{operation.label}</div>
              <div className="endpoint-source-name">{operation.documentation?.sourceName}</div>
            </div>
            <Badge bg="light" text="dark">{operation.method}</Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </aside>
  );
};

export default EndpointMenu;
