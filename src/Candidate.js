import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Candidate = () => {
  const location = useLocation();
  const candidateData = location.state;

  if(candidateData.length === 0){
    return (
    <div>
      No candidate has applied yet.
      <Link to={'/'}>Go back</Link>
    </div>
    )
  } 

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
            {candidateData.map((item, index) => (
                <tr>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>{item.email}</td>
                </tr>
            ))}
        </tbody>
      </table>
      <Link to={'/'}>Go back</Link>
    </div>
  );
};

export default Candidate;
