import { render, screen, fireEvent } from "@testing-library/react";
import { Toggle } from "./index";

describe("Toggle Component", () => {
  it("should render the toggle component with label", () => {
    render(
      <Toggle isChecked={false} setIsChecked={() => {}} label="Test Label" />
    );

    const labelElement = screen.getByText("Test Label");
    const inputElement = screen.getByRole("checkbox");

    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  it("should call setIsChecked with true when toggled on", () => {
    const setIsCheckedMock = jest.fn();

    render(
      <Toggle
        isChecked={false}
        setIsChecked={setIsCheckedMock}
        label="Test Label"
      />
    );

    const inputElement = screen.getByRole("checkbox");
    fireEvent.click(inputElement);

    expect(setIsCheckedMock).toHaveBeenCalledWith(true);
  });

  it("should call setIsChecked with false when toggled off", () => {
    const setIsCheckedMock = jest.fn();

    render(
      <Toggle
        isChecked={true}
        setIsChecked={setIsCheckedMock}
        label="Test Label"
      />
    );

    const inputElement = screen.getByRole("checkbox");
    fireEvent.click(inputElement);

    expect(setIsCheckedMock).toHaveBeenCalledWith(false);
  });

  it("should apply the provided className", () => {
    render(
      <Toggle
        isChecked={false}
        setIsChecked={() => {}}
        label="Test Label"
        className="custom-class"
      />
    );

    const wrapper = screen.getByText("Test Label").parentElement;
    expect(wrapper).toHaveClass("custom-class");
  });
});
