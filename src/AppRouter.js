import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import JobPostingTable from './JobPostingTable';
import Candidate from './Candidate';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<JobPostingTable/>} />
        <Route exact path="/candidates" element={<Candidate/>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
