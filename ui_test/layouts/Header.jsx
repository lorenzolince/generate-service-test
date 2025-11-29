
import { Navbar, Nav } from 'react-bootstrap';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, lang } = useTranslation();
  const [exprireToken, setExprireToken] = useState("");
  const [nameUser, setNameUser] = useState("");
  
  const reloadData = async () => {
  
  }
  useEffect(() => {
    reloadData();
  }, []);
  return (
    <div className="header-Sidebar">
      <ul className="header-list">
        <li className="navbar-item">
          <Navbar className="header-Navbar" fixed="top" collapseOnSelect expand="md" bg="black" variant="dark">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <div className="nav-container">
                <Nav>
                  <Link href="/"><h1 className="nav-link header-nav-color" role="button">test</h1></Link>
                </Nav>
              </div>

            </Navbar.Collapse>
          </Navbar>
        </li>
      </ul>
    </div>
  );
}

export default Header;