"use client";
import { Container, Nav, Navbar } from 'react-bootstrap';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();

  return (
    <Navbar fixed="top" collapseOnSelect expand="md" className="app-navbar" variant="dark">
      <Container fluid>
        <Navbar.Brand as={Link} href="/" className="app-brand">
          {t('common:appName')}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/oracle-personas">{t('common:navOraclePersonas')}</Nav.Link>
            <Nav.Link as={Link} href="/oracle">{t('common:navOracleExplorer')}</Nav.Link>
            <Nav.Link as={Link} href="/sqlserver-personas">{t('common:navSqlServerPersonas')}</Nav.Link>
            <Nav.Link as={Link} href="/sqlserver">{t('common:navSqlServerExplorer')}</Nav.Link>
            <Nav.Link as={Link} href="/postgres-personas">{t('common:navPostgresPersonas')}</Nav.Link>
            <Nav.Link as={Link} href="/postgres">{t('common:navPostgresExplorer')}</Nav.Link>
            <Nav.Link as={Link} href="/mysql-personas">{t('common:navMysqlPersonas')}</Nav.Link>
            <Nav.Link as={Link} href="/mysql">{t('common:navMysqlExplorer')}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;