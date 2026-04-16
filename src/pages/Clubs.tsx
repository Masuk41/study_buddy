import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '../lib/api';
import { Club, Department } from '../types';
import ClubCard from '../components/ClubCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = ['academic', 'arts', 'sports', 'culture', 'technology', 'community', 'other'];

export default function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (selectedDept) params.department = selectedDept;
      if (selectedCat) params.category = selectedCat;
      const data = await api.clubs.list(params) as { clubs: Club[] };
      setClubs(data.clubs);
    } catch {
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.departments.list().then((d: unknown) => {
      const data = d as { departments: Department[] };
      setDepartments(data.departments);
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchClubs, 300);
    return () => clearTimeout(t);
  }, [search, selectedDept, selectedCat]);

  const clearFilters = () => {
    setSearch('');
    setSelectedDept('');
    setSelectedCat('');
  };

  const hasFilters = search || selectedDept || selectedCat;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Explore Clubs</h1>
          <p className="text-gray-500">Find the perfect club to match your passion and skills.</p>

          <div className="mt-6 flex gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clubs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                showFilters || hasFilters
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasFilters && <span className="bg-white text-blue-600 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">!</span>}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-40">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Departments</option>
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-40">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Category</label>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-2"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <LoadingSpinner message="Loading clubs..." />
        ) : clubs.length === 0 ? (
          <div className="text-center py-20">
            <Search size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No clubs found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search term.</p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 text-sm">
                Showing <span className="font-semibold text-gray-900">{clubs.length}</span> club{clubs.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club) => (
                <ClubCard key={club._id} club={club} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
