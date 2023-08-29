import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BiSearch } from 'react-icons/bi';
import { FiMoon } from 'react-icons/fi';
import { BsSun } from 'react-icons/bs';
import useLocalStorage from 'use-local-storage';
function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [regionQuery, setRegionQuery] = useState('');
  const [filteredResultsByRegion, setFilteredResultsByRegion] = useState([]);
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (query) => {
    const filtered = data.filter(
      (item) =>
        item.name.common.toLowerCase().includes(query.toLowerCase()) ||
        (item.capital &&
          item.capital[0].toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredResults(filtered);
  };

  const handleRegionSearch = (query) => {
    const filteredByRegion = data.filter((item) =>
      item.region.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResultsByRegion(filteredByRegion);
  };

  const handleMode = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  if (loading) {
    return (
      <section
        className={`flex justify-center items-center w-full h-screen  ${
          theme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'
        }`}
      >
        <div>
          <h1 className=' text-5xl text-center'>Loading.....</h1>
        </div>
      </section>
    );
  }

  return (
    <div
      className={`w-full h-screen ${theme} ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      }`}
    >
      <div
        className={`${
          theme === 'light' ? 'bg-white' : 'bg-gray-700'
        } w-full flex justify-between h-16 items-center md:px-20 shadow-xl px-10`}
      >
        <h1
          className={`text-xl font-bold ${
            theme === 'light' ? 'text-black' : 'text-white'
          }`}
        >
          Where in the World ?{' '}
        </h1>
        <div
          onClick={handleMode}
          className='flex justify-center items-center space-x-2 cursor-pointer'
        >
          {theme === 'light' ? (
            <BsSun
              size={20}
              className={`${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}
            />
          ) : (
            <FiMoon
              size={20}
              className={`${
                theme === 'light' ? 'text-gray-800' : 'text-white'
              }`}
            />
          )}
          <h1 className={theme === 'light' ? 'text-gray-800' : 'text-white'}>
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </h1>
        </div>
      </div>
      <div
        className={`px-20  ${
          theme === 'light' ? 'bg-slate-200' : 'bg-gray-800'
        }`}
      >
        <div className=' flex justify-between items-center md:flex-row flex-col gap-5  pt-10   '>
          <div className='flex items-center relative'>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              type='search'
              placeholder='Search for a county... '
              className={`py-3 rounded-md   m-0 pl-14 w-96 shadow-lg focus:outline-none ${
                theme === 'light'
                  ? 'bg-white text-black'
                  : 'bg-gray-700 text-white'
              }`}
            />
            <BiSearch
              size={20}
              className='absolute sm:bottom-4 sm:left-7 left-5 text-gray-500  '
            />
          </div>
          <select
            value={regionQuery}
            onChange={(e) => {
              setRegionQuery(e.target.value);
              handleRegionSearch(e.target.value);
            }}
            className={`px-5 rounded-md focus:outline-none py-4  ${
              theme === 'light'
                ? 'bg-white text-black'
                : 'bg-gray-700 text-white'
            }`}
            aria-label='Filter Countries By Region'
          >
            <option value='All'>Filter By Region</option>
            <option value='Africa'>Africa</option>
            <option value='Americas'>America</option>
            <option value='Asia'>Asia</option>
            <option value='Europe'>Europe</option>
            <option value='Oceania'>Oceania</option>
          </select>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-14 p-4'>
          {filteredResultsByRegion.map((country, index) => (
            <div
              className={` mb-8 w-full  rounded-lg shadow-xl ${
                theme === 'light'
                  ? 'bg-white text-black'
                  : 'bg-gray-700 text-white'
              }`}
              key={index}
            >
              <img
                className='w-full rounded-t-lg'
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
              />
              <div className='px-4 my-3'>
                <h1 className='text-xl font-bold mb-2'>
                  {country.name.common}
                </h1>
                <p>
                  <span>Population: </span>
                  {country.population}
                </p>
                <p>
                  <span>Region: </span>
                  {country.region}
                </p>
                <p>
                  <span>Capital: </span>
                  {country.capital}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4'>
          {filteredResults.map((country, index) => (
            <div
              className={` mb-8 w-full   rounded-lg shadow-xl ${
                theme === 'light'
                  ? 'bg-white text-black'
                  : 'bg-gray-700 text-white'
              }`}
              key={index}
            >
              <img
                className='w-full rounded-t-lg'
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
              />
              <div className='px-4 my-3'>
                <h1 className='text-xl font-bold mb-2'>
                  {country.name.common}
                </h1>
                <p>
                  <span>Population: </span>
                  {country.population}
                </p>
                <p>
                  <span>Region: </span>
                  {country.region}
                </p>
                <p>
                  <span>Capital: </span>
                  {country.capital}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {data.map((country, index) => (
            <div
              className={` mb-8 w-full  rounded-lg shadow-xl ${
                theme === 'light'
                  ? 'bg-white text-black'
                  : 'bg-gray-700 text-white'
              }`}
              key={index}
            >
              <img
                className='w-full rounded-t-lg'
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
              />
              <div className='px-4 my-3'>
                <h1 className='text-xl font-bold mb-2'>
                  {country.name.common}
                </h1>
                <p>
                  <span>Population: </span>
                  {country.population}
                </p>
                <p>
                  <span>Region: </span>
                  {country.region}
                </p>
                <p>
                  <span>Capital: </span>
                  {country.capital}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;
