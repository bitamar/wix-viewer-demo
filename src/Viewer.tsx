import React from "react";
import { Structure, getComponent } from "./Structure";
import UserCode from "./UserCode";

type Props = { structure: Structure[]; root: HTMLElement };

export default function Viewer({ structure, root }: Props): JSX.Element {
  const elements = structure.map((item) => {
    const Component = getComponent(item.type);
    return Component ? <Component key={item.id} structure={item} /> : null;
  });

  return (
    <>
      {elements}
      <UserCode structure={structure} root={root} />
    </>
  );
}
