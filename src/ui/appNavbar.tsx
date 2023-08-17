import * as React from "react";

import { Container } from "reactstrap";

import { observer } from "mobx-react";
import { Store } from "./store";
import { observable } from "mobx";
import { LangButton } from "./langButton";

@observer
export class AppNavbar extends React.Component<{
  store: Store;
}> {
  render() {
    return (
      <>
        <div className="lang-button-box">
          <LangButton store={this.props.store}></LangButton>
        </div>

        <Container className="mt-3">{this.props.children}</Container>
      </>
    );
  }
}
