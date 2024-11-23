import { useState } from "react";

export const usePagination = (initialPage: number) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const previousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return {
    currentPage,
    goToPage,
    nextPage,
    previousPage,
  };
};
