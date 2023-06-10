import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const JobPostingTable = () => {
  
  const URL_TO_JOB_DATA = "https://raw.githubusercontent.com/tartane/cs2exam/main/jobs.json";

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterText, setFilterText] = useState('');
  const [deletedId, setDeletedId] = useState([]);
  const [maxId,  setMaxId] = useState(0);
  const rowRefs = useRef([]);

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * fecth data from url and store in state
   */
  const fetchData = async () => {
    try {
      const response = await fetch(URL_TO_JOB_DATA);
      const jsonData = await response.json();
      jsonData.forEach((item) => {
        setMaxId(Math.max(maxId, item.id));
      });
      setData(jsonData);
      setFilteredData(jsonData);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  /**
   *  sorting table
   * @param {*} columnName 
   */
  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortDirection('asc');
    }
  };

  /**
   * sort helper function
   */
  const sortedData = filteredData.sort((a, b) => {
    const columnA = a[sortColumn]?.toString().toLowerCase();
    const columnB = b[sortColumn]?.toString().toLowerCase();

    if (columnA < columnB) return sortDirection === 'asc' ? -1 : 1;
    if (columnA > columnB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });


  /**
   * filter table
   * @param {*} event 
   */
  const handleFilter = (event) => {
    const keyword = event.target.value.toLowerCase();
    setFilterText(keyword);
    const filteredResults = data.filter((item) => {
      return (
        item.job_title.toLowerCase().includes(keyword)
      );
    });
    setFilteredData(filteredResults);
  };

  /**
   * add new row to table
   */
  const addRow = () => {
    const newRow = { 
      id: maxId+1, 
      job_title: '',
      location: {
        city : '',
        province: ''
      },
      salary: null,
      description: '',
      candidates: []
    };
    setMaxId(maxId+1);
    filteredData.push(newRow);
    setFilteredData(filteredData);
    console.log(filteredData)
  };

  /**
   * update current data
   * @param {*} index index of current item
   * @param {*} key filed key of current data
   */
  const handleInputChange = (index, key) => {
    const rowRef = rowRefs.current[index+key];
    const value = rowRef.innerText;
    const updatedFilterData = filteredData.map((row, rowIndex) => {
      if (rowIndex === index) {
        row[key] = value;
      }
      return row;
    });
    const updatedData = data.map((row, rowIndex) => {
      if (rowIndex === index) {
        return { ...row, [key]: value };
      }
      return row;
    });
    setData(updatedData);
    setFilteredData( updatedFilterData);
  };

  /**
   * delete row from table
   * @param {*} id id of row to delete
   */
  const deleteRow = (id) => {
    deletedId.push(id);
    setDeletedId(deletedId);
    const updatedFilterData = filteredData.filter((item) => {
      return (
        ! deletedId.includes(item.id)
      );
    });
    const updatedData = data.map((item) => {
      return (
        ! deletedId.includes(item.id)
      );
    });
    setData(updatedData);
    setFilteredData(updatedData);
  };

  /**
   * remove extra wrod from description
   * @param {*} description 
   * @returns 
   */
  const getShortDescription = (description) => {
    let words = description.split(" ");
    if(words.length > 25){
      return words.slice(0, 25).join(" ") + "...";
    }
    return description;
  }

  return (
    <div>
      <input
        type="text"
        value={filterText}
        onChange={handleFilter}
        placeholder="Filter By JobTitle"
      />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('job_title')}>
              Job Title {sortColumn === 'job_title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>
              Location
            </th>
            <th >
              Salary
            </th>
            <th>
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index}>
              <td 
                contentEditable 
                ref={el => (rowRefs.current[index+'job_title'] = el)}
                onInput={e => handleInputChange(index, 'job_title')}>
                  <Link to={'/candidates'} state={item.candidates }>
                    {item.job_title}
                  </Link>
              </td>
              <td 
                contentEditable
                ref={el => (rowRefs.current[index+'location'] = el)}
                onInput={e => handleInputChange(index, 'location')}>{item.location.city}</td>
              <td 
                contentEditable 
                ref={el => (rowRefs.current[index+'salary'] = el)}
                onInput={e => handleInputChange(index, 'salary')}>
                {
                  item.salary !== null ? (
                    item.salary
                  ) : (
                    "To be discussed"
                  )
                }
              </td>
              <td 
                contentEditable
                ref={el => (rowRefs.current[index+'description'] = el)}
                onInput={e => handleInputChange(index, 'description')}>{getShortDescription(item.description)}</td>
              <td>
                <button onClick={() => deleteRow(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
    </div>
  );
};

export default JobPostingTable;
