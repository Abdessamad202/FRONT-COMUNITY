import { useState, useEffect } from "react";
import { Search, Loader2, User } from "lucide-react";
import { search } from "../api/apiCalls";
import { Link } from "react-router";

const ProfileSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Debounced Search
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      setIsOpen(true);

      try {
        const data = await search(query);
        setResults(data || []);
      } catch (error) {
        setError("Failed to fetch results. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce delay (300ms)

    return () => clearTimeout(delaySearch);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.search-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="w-full max-w-md mx-auto relative search-container">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          placeholder="Search profiles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader2 size={18} className="animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Dropdown Content */}
      {isOpen && query.trim() && (
        <div className="absolute mt-1 w-full border border-gray-200 rounded-lg overflow-hidden shadow-lg z-20 bg-white">
          {/* Loading State */}
          {loading && (
            <div className="p-4 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-indigo-600 mr-2" />
              <div className="text-gray-600">Searching...</div>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="p-4 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Results */}
          {!loading && !error && results.length > 0 && (
            <div className="max-h-60 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {results.map((el) => {
                  const { id, profile } = el;
                  return (
                    <li key={id} onClick={() => setIsOpen(false)}>
                      <Link
                        to={`/profile/${id}`}
                        className="block p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 overflow-hidden rounded-full">
                            {profile.picture ? (
                              <img
                                src={profile.picture}
                                alt={profile.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.parentNode.innerHTML = `<div class="bg-gray-100 rounded-full p-2 flex items-center justify-center w-full h-full"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><divath d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></divath><circle cx="12" cy="7" r="4"></circle></svg></div>`;
                                }}
                              />
                            ) : (
                              <div className="bg-gray-100 rounded-full p-2 flex items-center justify-center w-full h-full">
                                <User size={18} className="text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{profile.name}</div>
                            {profile.title && (
                              <div className="text-sm text-gray-500">{profile.title}</div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && results.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileSearch;
