"use client";

import React from 'react';
import Link from 'next/link';
import { Button, Col, Container, Row } from "react-bootstrap";
import { Database, ListTask } from "react-bootstrap-icons";
import { useTranslation } from 'react-i18next';

const Index = () => {
    const { t } = useTranslation();

    return (
        <>
            <title>{t('common:appName')}</title>
            <Container fluid className="app-page">
                <div className="page-heading">
                    <h1>{t('common:appName')}</h1>
                    <p>{t('index:title')}</p>
                </div>
                <Row className="home-actions">
                    <Col md={6} lg={4}>
                        <Button as={Link} href="/oracle-personas" className="home-action common-button-color">
                            <Database aria-hidden="true" /> {t('common:navOraclePersonas')}
                        </Button>
                    </Col>
                    <Col md={6} lg={4}>
                        <Button as={Link} href="/oracle" variant="outline-primary" className="home-action">
                            <ListTask aria-hidden="true" /> {t('common:navOracleExplorer')}
                        </Button>
                    </Col>
                    <Col md={6} lg={4}>
                        <Button as={Link} href="/sqlserver" variant="outline-primary" className="home-action">
                            <ListTask aria-hidden="true" /> {t('common:navSqlServerExplorer')}
                        </Button>
                    </Col>
                    <Col md={6} lg={4}>
                        <Button as={Link} href="/sqlserver-personas" className="home-action common-button-color">
                            <Database aria-hidden="true" /> {t('common:navSqlServerPersonas')}
                        </Button>
                    </Col>
                    <Col md={6} lg={4}>
                        <Button as={Link} href="/postgres" variant="outline-primary" className="home-action">
                            <ListTask aria-hidden="true" /> {t('common:navPostgresExplorer')}
                        </Button>
                    </Col>
                    <Col md={6} lg={4}>
                        <Button as={Link} href="/postgres-personas" className="home-action common-button-color">
                            <Database aria-hidden="true" /> {t('common:navPostgresPersonas')}
                        </Button>
                    </Col>
                    <Col md={6} lg={4}>
                        <Button as={Link} href="/mysql" variant="outline-primary" className="home-action">
                            <ListTask aria-hidden="true" /> {t('common:navMysqlExplorer')}
                        </Button>
                    </Col>
                    <Col md={6} lg={4}>
                        <Button as={Link} href="/mysql-personas" className="home-action common-button-color">
                            <Database aria-hidden="true" /> {t('common:navMysqlPersonas')}
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );

}

export default Index;
