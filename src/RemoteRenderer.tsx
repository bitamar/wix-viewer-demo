import React from "react";
import { RemoteProps } from "./types";

export default function ({ data }: RemoteProps): JSX.Element {
  // import(data.src).then((w) => console.log(w));
  // const Component = React.lazy(() => import("./Artists"));
  // @ts-ignore
  if (!window[data.componentName]) return <>loading</>;
  // @ts-ignore
  const Component = window[data.componentName];
  return <Component />;
  // return <></>;
}
