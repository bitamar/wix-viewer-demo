import React from "react";
import { render } from "@testing-library/react";
import Viewer from "../Viewer";

test("renders custom text element", () => {
  const { getByText } = render(<Viewer />);
  const textElement = getByText(/TEXT be here/i);
  expect(textElement).toBeInTheDocument();
});
