import * as React from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Container,
} from "reactstrap";

import { observer } from "mobx-react";
import { Store } from "./store";
import { observable } from "mobx";
import { LangButton } from "./langButton";

@observer
export class AppNavbar extends React.Component<{
  store: Store;
}> {
  // For mobile view
  @observable
  navbarIsOpen = false;

  render() {
    const { l } = this.props.store;
    const tab0 = this.props.store.path.tab0;
    return (
      <>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="#/">{l.hi}</NavbarBrand>
          <NavbarToggler
            aria-label={l.menu}
            onClick={() => {
              this.navbarIsOpen = !this.navbarIsOpen;
            }}
          />
          <Collapse isOpen={this.navbarIsOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink active={tab0 === "quests"} href="#/quests">
                  <i className="fa fa-fw fa-list" /> {l.quests}
                </NavLink>
              </NavItem>

              <NavItem>
                <LangButton store={this.props.store}></LangButton>
              </NavItem>

              <NavItem>
                <NavLink href="#/editor" active={false}>
                  <i className="fa fa-fw fa-edit" /> {l.editor}
                </NavLink>
              </NavItem>

              {/* <NavItem>
                <NavLink href="#/about" active={tab0 === "about"}>
                  <i className="fa fa-fw fa-info-circle" /> {l.about}
                </NavLink>
              </NavItem> */}
            </Nav>
          </Collapse>
        </Navbar>

        <Container className="mt-3">{this.props.children}</Container>
      </>
    );
  }
}
