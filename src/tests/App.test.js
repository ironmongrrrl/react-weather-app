import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../components/App";

test("renders the text weather app", () => {
  render(<App />);
  const linkElement = screen.getByText(/weather app/i);
  expect(linkElement).toBeInTheDocument();
});
