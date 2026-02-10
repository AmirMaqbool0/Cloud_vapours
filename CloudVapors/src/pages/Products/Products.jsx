import React, { useState } from "react";
import "./style.css";
import { ChevronRight } from "lucide-react";
import ProductCard from "../../component/ProductCard/ProductCard";

const TOTAL_PRODUCTS = 85;
const PRODUCTS_PER_PAGE = 8;
const TOTAL_PAGES = Math.ceil(TOTAL_PRODUCTS / PRODUCTS_PER_PAGE);

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= TOTAL_PAGES) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];

    // Always show first 3 pages, last page, and dots when needed
    if (TOTAL_PAGES <= 5) {
      for (let i = 1; i <= TOTAL_PAGES; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", TOTAL_PAGES);
      } else if (currentPage >= TOTAL_PAGES - 2) {
        pages.push(1, "...", TOTAL_PAGES - 2, TOTAL_PAGES - 1, TOTAL_PAGES);
      } else {
        pages.push(1, "...", currentPage, "...", TOTAL_PAGES);
      }
    }

    return (
      <div className="pagination-wrapper">
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="np-btn"
        >
          &lt;
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="pagination-dots">
              ...
            </span>
          ) : (
            <button
              key={index}
              className={`pagination-btn ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => handlePageClick(Number(page))}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === TOTAL_PAGES}
          className="np-btn"
        >
          &gt;
        </button>
      </div>
    );
  };

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = Array.from({
    length: Math.min(PRODUCTS_PER_PAGE, TOTAL_PRODUCTS - startIndex),
  });

  return (
    <div className="products-container">
      <div className="page-ref">
        <span>Home</span>
        <ChevronRight color="#A4A4A4" />
        <span>Flavors</span>
        <ChevronRight color="#A4A4A4" />
        <p>Icy</p>
      </div>

      <div className="products-fillters-top">
        <p>
          Selected Products: <span>{TOTAL_PRODUCTS}</span>
        </p>
        <select>
          <option value="">Ice</option>
          <option value="">Gold</option>
          <option value="">Silver</option>
        </select>
      </div>

      <div className="products-flavor">
        {currentProducts.map((_, i) => (
          <div className="products-product" key={i}>
            <ProductCard />
          </div>
        ))}
      </div>

      <div className="products-pagination">{renderPagination()}</div>
    </div>
  );
};

export default Products;
