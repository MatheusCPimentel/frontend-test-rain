import styles from "./styles.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handleGoToPrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleGoToNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className={styles.pagination}>
      <button onClick={handleGoToPrevPage} disabled={currentPage === 1}>
        Prev
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleGoToNextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
