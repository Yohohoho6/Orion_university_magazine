import { useState } from "react";
import { Spinner, Button, Chip, Select, SelectItem, Input, Pagination } from "@heroui/react";
import { LuFilter, LuRotateCcw, LuGraduationCap, LuBookOpen, LuFolder, LuSearch, LuX } from "react-icons/lu";
import { useGuestDashboard } from "../hooks/useGuestDashboard";
import { GuestContributionCard } from "./GuestContributionCard";
import { ContributionDetailDialog } from "@/features/student/contributions/components/ContributionDetailDialog";
import { WelcomeBanner } from "@/components/welcome-banner/WelcomeBanner";

const ErrorFallback = ({ error, onRetry }) => (
    <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
            <div className="mb-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-danger/10 flex items-center justify-center">
                    <LuBookOpen className="h-6 w-6 text-danger" />
                </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Failed to load contributions
            </h3>
            <p className="text-gray-500 text-sm mb-4">{error?.message || "An unexpected error occurred"}</p>
            <Button color="primary" onPress={onRetry}>
                Try Again
            </Button>
        </div>
    </div>
);

export function GuestDashboard() {
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
    const [search, setSearch] = useState("");
    const [detailModal, setDetailModal] = useState({ isOpen: false, contribution: null });

    const categoryId = selectedCategory ? Number(selectedCategory) : null;
    const academicYearId = selectedAcademicYear ? Number(selectedAcademicYear) : null;

    const { data, isLoading, error, refetch } = useGuestDashboard(page, categoryId, academicYearId, search);

    const categories = data?.categories || [];
    const academicYears = data?.academic_years || [];
    const academicYear = data?.academic_year;
    const user = data?.user;

    const contributions = data?.contributions?.data || [];
    const meta = data?.contributions || {};

    const handleCategoryChange = (keys) => {
        const value = Array.from(keys)[0];
        setSelectedCategory(value || null);
        setPage(1);
    };

    const handleAcademicYearChange = (keys) => {
        const value = Array.from(keys)[0];
        setSelectedAcademicYear(value || null);
        setPage(1);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleClearSearch = () => {
        setSearch("");
    };

    const handleResetFilter = () => {
        setSelectedCategory(null);
        setSelectedAcademicYear(null);
        setSearch("");
        setPage(1);
    };

    const handleDetailClick = (contribution) => {
        setDetailModal({ isOpen: true, contribution });
    };

    const handleCloseDetail = () => {
        setDetailModal({ isOpen: false, contribution: null });
    };

    const hasActiveFilters = selectedCategory || selectedAcademicYear || search;

    if (error) {
        return <ErrorFallback error={error} onRetry={refetch} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
            <div className="max-w-full space-y-6">
                <WelcomeBanner />


                {/* Filter Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-default-100">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <LuFilter className="w-5 h-5 text-default-500" />
                            <span className="font-medium text-default-700">Filters</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search Input */}
                            <Input
                                placeholder="Search by title or author..."
                                value={search}
                                onChange={handleSearchChange}
                                variant="bordered"
                                startContent={<LuSearch className="w-4 h-4 text-default-400" />}
                                endContent={
                                    search && (
                                        <button onClick={handleClearSearch} className="focus:outline-none">
                                            <LuX className="w-4 h-4 text-default-400 hover:text-default-600" />
                                        </button>
                                    )
                                }
                                classNames={{
                                    inputWrapper: "border-default-200 hover:border-default-400",
                                }}
                            />

                            {/* Academic Year Filter */}
                            <Select
                                placeholder="All Academic Years"
                                selectedKeys={selectedAcademicYear ? [selectedAcademicYear] : []}
                                onSelectionChange={handleAcademicYearChange}
                                variant="bordered"
                                aria-label="Select academic year"
                                startContent={<LuGraduationCap className="w-4 h-4 text-default-400" />}
                            >
                                {academicYears.map((year) => (
                                    <SelectItem key={year.id}>
                                        {year.name}
                                    </SelectItem>
                                ))}
                            </Select>

                            {/* Category Filter */}
                            <Select
                                placeholder="All Categories"
                                selectedKeys={selectedCategory ? [selectedCategory] : []}
                                onSelectionChange={handleCategoryChange}
                                variant="bordered"
                                aria-label="Select category"
                                startContent={<LuFolder className="w-4 h-4 text-default-400" />}
                            >
                                {categories.map((category) => (
                                    <SelectItem key={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </Select>

                            {/* Reset Button */}
                            <Button
                                variant="flat"
                                color="danger"
                                startContent={<LuRotateCcw className="w-4 h-4" />}
                                onPress={handleResetFilter}
                                isDisabled={!hasActiveFilters}
                                className="w-full"
                            >
                                Reset Filters
                            </Button>
                        </div>

                        {/* Active Filters Display */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-default-100">
                                <span className="text-sm text-default-500">Active filters:</span>
                                {search && (
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        onClose={handleClearSearch}
                                        className="bg-default-100"
                                    >
                                        Search: "{search}"
                                    </Chip>
                                )}
                                {selectedAcademicYear && (
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        onClose={() => setSelectedAcademicYear(null)}
                                        className="bg-primary/20"
                                    >
                                        {academicYears.find(y => String(y.id) === selectedAcademicYear)?.name}
                                    </Chip>
                                )}
                                {selectedCategory && (
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        onClose={() => setSelectedCategory(null)}
                                        className="bg-secondary/20"
                                    >
                                        {categories.find(c => String(c.id) === selectedCategory)?.name}
                                    </Chip>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Contributions Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Spinner size="lg" label="Loading contributions..." />
                    </div>
                ) : contributions.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm border border-default-100 text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-default-100 flex items-center justify-center mb-4">
                            <LuBookOpen className="w-8 h-8 text-default-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            No contributions found
                        </h3>
                        <p className="text-gray-500">
                            {hasActiveFilters
                                ? "Try adjusting your filters or search terms"
                                : "There are no selected contributions available yet."}
                        </p>
                        {hasActiveFilters && (
                            <Button
                                variant="flat"
                                color="primary"
                                className="mt-4"
                                onPress={handleResetFilter}
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {contributions.map((contribution) => (
                                <GuestContributionCard
                                    key={contribution.id}
                                    contribution={contribution}
                                    onDetailClick={handleDetailClick}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {meta.last_page > 1 && (
                            <div className="flex justify-center pt-4">
                                <Pagination
                                    total={meta.last_page}
                                    initialPage={page}
                                    onChange={setPage}
                                    showControls
                                    classNames={{
                                        wrapper: "gap-2",
                                        item: "w-10 h-10",
                                    }}
                                />
                            </div>
                        )}

                        <div className="text-center text-sm text-default-500">
                            Showing {meta.from || 0} to {meta.to || 0} of {meta.total || 0} contributions
                        </div>
                    </>
                )}
            </div>

            {/* Detail Modal */}
            <ContributionDetailDialog
                contribution={detailModal.contribution}
                isOpen={detailModal.isOpen}
                onOpenChange={handleCloseDetail}
            />
        </div>
    );
}
