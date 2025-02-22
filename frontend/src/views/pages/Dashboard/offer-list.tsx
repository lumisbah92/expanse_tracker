import React, { useEffect, useState } from 'react';
import svgIcons from '../../../services/svgService';

interface Offer {
  id: number;
  user_name: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  status: 'accepted' | 'rejected' | 'pending';
  type: string;
  price: number;
}

// Return inline styles for status badge colors
function getStatusColor(status: Offer['status']): React.CSSProperties {
  switch (status) {
    case 'accepted':
      return { backgroundColor: '#22C55E29', color: '#118D57' };
    case 'rejected':
      return { backgroundColor: '#FF563029', color: '#B71D18' };
    case 'pending':
      return { backgroundColor: '#FFAB0029', color: '#B76E00' };
    default:
      return { backgroundColor: '#d1d5db', color: '#374151' };
  }
}

const OfferListTable: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [totalOffers, setTotalOffers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const url = new URL('https://dummy-1.hiublue.com/api/offers');
        url.searchParams.append('page', (page + 1).toString());
        url.searchParams.append('per_page', rowsPerPage.toString());

        // Append filtering parameters
        if (tabValue === 1) url.searchParams.append('status', 'accepted');
        if (searchQuery) url.searchParams.append('search', searchQuery);
        if (selectedType) url.searchParams.append('type', selectedType);

        const response = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message);
          return;
        }
        const data = await response.json();
        setOffers(data.data);
        setTotalOffers(data.meta.total);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [page, rowsPerPage, tabValue, searchQuery, selectedType]);

  const rowsPerPageOptions = [5, 10, 25, 50, 100];
  const totalPages = Math.ceil(totalOffers / rowsPerPage);

  return (
    <div className="w-full rounded border border-gray-200">
      {/* Header */}
      <div className="px-2 lg:px-3 border-b border-gray-300">
        <h2 className="text-lg font-semibold text-gray-900">Offer List</h2>
      </div>

      <div className="p-0">
        {/* Tabs */}
        <div className="px-1 lg:px-3 border-b border-gray-300">
          <div className="flex space-x-4">
            <button
              onClick={() => setTabValue(0)}
              className={`py-2 text-sm ${tabValue === 0 ? 'border-b-2 border-gray-900 font-semibold' : 'text-gray-600'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setTabValue(1)}
              className={`py-2 text-sm ${tabValue === 1 ? 'border-b-2 border-gray-900 font-semibold' : 'text-gray-600'
                }`}
            >
              Accepted
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap items-center gap-2 px-1 lg:px-3 py-2">
          <div className="relative w-full lg:w-[505px]">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2" dangerouslySetInnerHTML={{ __html: svgIcons.search_icon }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-2 w-full border rounded"
            />
          </div>
          <div className="w-full lg:w-[200px]">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border rounded p-2 text-sm"
            >
              <option value="">All</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
              <option value="Pay As You Go">Pay As You Go</option>
            </select>
          </div>
        </div>

        {/* Loading, Error, or Table */}
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            Loading...
          </div>
        ) : error ? (
          <p className="text-red-600 text-center py-4">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-max">
                <thead>
                  <tr>
                    <th className="px-2 lg:px-4 py-2 text-left">Name</th>
                    <th className="hidden lg:table-cell px-2 lg:px-4 py-2 text-left">Phone number</th>
                    <th className="hidden lg:table-cell px-2 lg:px-4 py-2 text-left">Company</th>
                    <th className="hidden lg:table-cell px-2 lg:px-4 py-2 text-left">Job Title</th>
                    <th className="hidden sm:table-cell px-2 lg:px-4 py-2 text-left">Type</th>
                    <th className="px-2 lg:px-4 py-2 text-left">Status</th>
                    <th className="px-2 lg:px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.id} className="border-t border-gray-200">
                      <td className="px-2 lg:px-4 py-2">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">{offer.user_name}</span>
                          <span className="text-sm text-gray-500">{offer.email}</span>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-2 lg:px-4 py-2">
                        <span className="text-sm text-gray-900">{offer.phone}</span>
                      </td>
                      <td className="hidden lg:table-cell px-2 lg:px-4 py-2">
                        <span className="text-sm text-gray-900">{offer.company}</span>
                      </td>
                      <td className="hidden lg:table-cell px-2 lg:px-4 py-2">
                        <span className="text-sm text-gray-900">{offer.jobTitle}</span>
                      </td>
                      <td className="hidden sm:table-cell px-2 lg:px-4 py-2 w-[100px]">
                        <span className="text-sm text-gray-900 capitalize">{offer.type}</span>
                      </td>
                      <td className="px-2 lg:px-4 py-2 w-[100px]">
                        <div
                          style={getStatusColor(offer.status)}
                          className="inline-block px-1 py-0.5 rounded"
                        >
                          <span className="font-bold text-[12px] leading-5 capitalize">
                            {offer.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 lg:px-4 py-2 w-[50px] text-right">
                        <div className="flex items-end justify-end space-x-1">
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <div dangerouslySetInnerHTML={{ __html: svgIcons.edit_icon }} />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <div dangerouslySetInnerHTML={{ __html: svgIcons.more_icon }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {offers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-4">
                        No offers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-end items-center mr-4 mt-4 space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  className="border rounded p-1 text-sm"
                >
                  {rowsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                  className="p-2 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-700">
                  {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OfferListTable;
