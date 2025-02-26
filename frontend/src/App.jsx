import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/trends');
      setTrends(response.data.trends);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching trends:', err);
      setError('Failed to fetch trends. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();

    // Refresh every 5 minutes
    const intervalId = setInterval(fetchTrends, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white text-orange-600 shadow-lg header-font">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold title">
              Reddit Trends Dashboard
            </h1>
            <button
              className={`px-4 py-2 rounded-3xl font-medium text-white ${
                loading
                  ? 'bg-orange-800 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 transform hover:scale-105 transition-all'
              }`}
              onClick={fetchTrends}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          {lastUpdated && (
            <p className="text-orange-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow body-font">
        {error ? (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            <p>{error}</p>
          </div>
        ) : loading && trends.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
            <p className="mt-4 text-gray-600">Loading trends...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trends.map((trend) => (
                <div
                  key={trend.id}
                  className="flex flex-col justify-between bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 line-clamp-5 mb-2">
                      <a
                        className="hover:text-orange-800"
                        href={trend.url}
                        target="_blank"
                      >
                        {trend.title}
                      </a>
                    </h2>
                    <p className="text-sm text-gray-600 font-medium">
                      r/{trend.subreddit}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <span className="flex items-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 text-orange-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {trend.score.toLocaleString()}
                    </span>
                    <span className="flex items-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 text-orange-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-0.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {trend.comments.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {trends.length === 0 && (
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mt-6">
                No trends found.
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Reddit Trends Dashboard</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
