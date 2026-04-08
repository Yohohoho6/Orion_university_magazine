import { useState, useEffect, useMemo } from "react";

export const useContributionFilters = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStatusChange = (value) => { setStatusFilter(value); setPage(1); };
  const handleCategoryChange = (value) => { setCategoryFilter(value); setPage(1); };

  const activeFiltersCount = useMemo(() =>
    [statusFilter !== "all", categoryFilter !== "all", debouncedSearch !== ""].filter(Boolean).length,
    [statusFilter, categoryFilter, debouncedSearch]
  );

  return {
    page, setPage,
    statusFilter, setStatus: handleStatusChange,
    categoryFilter, setCategory: handleCategoryChange,
    searchQuery, setSearch: setSearchQuery,
    debouncedSearch,
    activeFiltersCount,
    // API-ready params
    statusParam: statusFilter === "all" ? null : statusFilter,
    categoryParam: categoryFilter === "all" ? null : categoryFilter,
    searchParam: debouncedSearch || null,
  };
};