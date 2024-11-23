import { renderHook, act } from "@testing-library/react";
import { usePagination } from "../usePagination";

describe("usePagination", () => {
  it("should initialize with the given page", () => {
    const { result } = renderHook(() => usePagination(3));

    expect(result.current.currentPage).toBe(3);
  });

  it("should go to a specific page", () => {
    const { result } = renderHook(() => usePagination(1));

    act(() => {
      result.current.goToPage(5);
    });

    expect(result.current.currentPage).toBe(5);
  });

  it("should go to the next page", () => {
    const { result } = renderHook(() => usePagination(1));

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  it("should not go below page 1", () => {
    const { result } = renderHook(() => usePagination(1));

    act(() => {
      result.current.previousPage();
    });

    expect(result.current.currentPage).toBe(1);
  });
});
