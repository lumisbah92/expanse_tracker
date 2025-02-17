import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import React from 'react';
import svgIcons from '../../services/svgService';
import cn from '../../utils/cn';
import Button from '../buttons/ButtonRC';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    rowsPerPage: number;
    handlePageChange: (page: number) => void;
    handleRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    totalPages,
    currentPage,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
}) => {
    // Rows per page
    const pageSize = [2, 5, 10, 20, 50];

    const generatePageNumbers = (): (string | number)[] => {
        const pageNumbers: (string | number)[] = [];
        const maxVisiblePages = 2; // Number of pages to show around the current page
        const leftFlag = currentPage - maxVisiblePages;
        const rightFlag = currentPage + maxVisiblePages;
        const startPage = Math.max(2, leftFlag);
        const endPage = Math.min(totalPages - 1, rightFlag);

        pageNumbers.push(1);

        // Add '...' if there are pages before the visible range
        if (leftFlag > 2) pageNumbers.push('...');

        // Add pages around the current page
        for (let i: number = startPage; i <= endPage; i += 1) {
            pageNumbers.push(i);
        }

        // Add '...' if there are pages after the visible range
        if (rightFlag < totalPages - 1) pageNumbers.push('...');
        if (totalPages > 1) pageNumbers.push(totalPages);

        return pageNumbers;
    };

    const renderPageButton = (page: number | string) =>
        typeof page === 'string' ? (
            <span key={page} className="px-3 py-1 mx-1 text-gray-500">
                {page}
            </span>
        ) : (
            <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                    'px-3 py-1 border rounded-md mx-1',
                    currentPage === page ? 'bg-datahead-primary text-datahead-black-1' : 'hover:bg-gray-50'
                )}
            >
                {page}
            </button>
        );

    return (
        <div className="flex justify-between p-4">
            <div className="flex items-center">
                {/* Rows per page */}
                <span className="mr-2 text-datahead-black-2 text-sm">Rows per page:</span>
                <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="border border-datahead-black-3 text-datahead-black-1 rounded-md  py-1 w-12"
                >
                    {pageSize.map((rows) => (
                        <option key={rows} value={rows}>
                            {rows}
                        </option>
                    ))}
                </select>

                {/* Go to page */}
                <span className="ml-4 text-datahead-black-2 text-sm">Go to</span>
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    className="ml-2 text-datahead-black-1 border border-datahead-black-3 rounded-md w-12 px-2 py-1"
                />
            </div>

            <div className="flex items-center">
                {/* Pagination buttons */}

                <Button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="border mr-2 "
                    hoverColor="hover:bg-gray-50"
                    size="sm"
                >
                    {/* <Previous size="16" color="#566573" /> */}
                    <span dangerouslySetInnerHTML={{ __html: svgIcons.previousBtn }} />
                </Button>

                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border"
                    hoverColor="hover:bg-gray-50"
                    size="sm"
                >
                    <ArrowLeft2 size="16" color="#566573" />
                </Button>

                {generatePageNumbers().map(renderPageButton)}

                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    hoverColor="hover:bg-gray-50"
                    className="border"
                    size="sm"
                >
                    <ArrowRight2 size="16" color="#566573" />
                </Button>

                <Button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="border ml-2"
                    hoverColor="hover:bg-gray-50"
                    size="sm"
                >
                    {/* <Next size="16" color="#566573" /> */}
                    <span dangerouslySetInnerHTML={{ __html: svgIcons.forwardBtn }} />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
