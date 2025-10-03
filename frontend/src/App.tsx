import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieList from './components/MovieList';
import FilterPanel from './components/FilterPanel';

const App = () => {
  const [filters, setFilters] = useState<any>({});

  return (
    <Router>
      <div className="max-w-7xl mx-auto p-4">
        <FilterPanel onFilterChange={setFilters} />
        <Routes>
          <Route path="/" element={<MovieList filters={filters} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
