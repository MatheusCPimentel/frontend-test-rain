import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "../Navbar";

describe("Navbar Component", () => {
  it("should not render on /login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Navbar />} />
        </Routes>
      </MemoryRouter>
    );

    const logo = screen.queryByAltText("Logo");
    expect(logo).not.toBeInTheDocument();
  });

  it("should render on non-login paths", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>
    );

    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
  });

  it("should toggle menu visibility when menu button is clicked", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    const navItems = screen.getByText("Home");
    expect(navItems).toBeInTheDocument();
  });

  it("should remove token from localStorage on Logout click", () => {
    localStorage.setItem("token", "12345");

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>
    );

    const logoutLink = screen.getByText("Logout");
    fireEvent.click(logoutLink);

    expect(localStorage.getItem("token")).toBeNull();
  });
});
