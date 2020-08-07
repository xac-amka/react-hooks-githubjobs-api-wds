import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import useFetchJobs from './useFetchJobs';
import Job from './Job';
import JobsPagination from './JobsPagination';
import SearchForm from './SearchForm';

function App() {
  const [params, setParams] = useState({description: '', location: '', full_time: false});
  const [page, setPage] = useState(1);
  const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page);

  function handleParamsChange(e) {
    const param = e.target.name;
    const value = e.target.value;
    setPage(1);
    setParams(prevParams => {
      return { ...prevParams, [param]: value }
    });
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">GitHub Jobs</h1>
      <SearchForm params={params} onParamsChange={handleParamsChange} />
      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
        {loading && <h1>Loading...</h1>}
        {error && <h1>Error occured. Try refresh this page [F5]</h1>}
        {jobs.map(job => {
          return <Job key={job.id} job={job} />
        })}
      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
    </Container>
  );
}

export default App;
