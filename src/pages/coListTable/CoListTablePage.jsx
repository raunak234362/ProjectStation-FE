/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CoListTable from '../../components/changeOrder/details/CoListTable';

const CoListTablePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCO, setSelectedCO] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get data from location state (when opened via navigate)
    if (location.state?.selectedCO) {
      setSelectedCO(location.state.selectedCO);
      setLoading(false);
      return;
    }

    // Get data from URL search params (when opened in new tab)
    const urlParams = new URLSearchParams(location.search);
    const coDataParam = urlParams.get('coData');
    
    if (coDataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(coDataParam));
        setSelectedCO(parsedData);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing CO data from URL:', error);
        setLoading(false);
      }
    } else {
      // If no data is available, redirect or show error
      console.error('No CO data provided');
      setLoading(false);
    }
  }, [location]);

  const handleClose = () => {
    // Close the window if opened in new tab, otherwise navigate back
    if (window.opener) {
      window.close();
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Change Order details...</p>
        </div>
      </div>
    );
  }

  if (!selectedCO) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h1>
          <p className="text-gray-600 mb-4">No Change Order data was provided.</p>
          <button
            onClick={handleClose}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Change Order Table</h1>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Subject:</span> {selectedCO?.remarks || 'N/A'}
              </p>
              {selectedCO?.changeOrder && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">CO No:</span> {selectedCO.changeOrder}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>✕</span>
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <CoListTable 
              selectedCO={selectedCO}
              fetchCO={() => {
                // Since this is a standalone page, we might not need to fetch
                // Or we can implement a refresh mechanism if needed
                console.log('Refresh CO data in standalone page');
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Change Order Details • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoListTablePage;
