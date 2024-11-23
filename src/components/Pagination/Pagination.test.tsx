import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "../Pagination";

describe("Pagination Component", () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the correct current page and total pages", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("should disable the 'Prev' button on the first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByText("Prev");
    expect(prevButton).toBeDisabled();
  });

  it("should call 'onPageChange' with the previous page when 'Prev' is clicked", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByText("Prev");
    fireEvent.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("should disable the 'Next' button on the last page", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("should call 'onPageChange' with the next page when 'Next' is clicked", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });
});
