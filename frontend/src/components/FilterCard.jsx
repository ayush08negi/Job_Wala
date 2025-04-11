import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const filterData = [
  {
    filterType: 'Location',
    array: ['Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai']
  },
  {
    filterType: 'Industry',
    array: ['Software Engineering', 'Backend Developer', 'FullStack Developer']
  },
  {
    filterType: 'Salary',
    array: ['0-1LPA', '1-10LPA', '10-40LPA']
  }
];

const FilterCard = () => {
  const dispatch = useDispatch();

  const [selectedValues, setSelectedValues] = useState({
    Location: '',
    Industry: '',
    Salary: ''
  });

  const changeHandler = (value, type) => {
    const updatedValues = {
      ...selectedValues,
      [type]: selectedValues[type] === value ? '' : value 
    };
    setSelectedValues(updatedValues);
  };

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValues));
  }, [selectedValues]);

  return (
    <div className='w-full bg-white p-3 rounded-md'>
      <h1 className='font-bold text-lg'>Filter Jobs</h1>
      <hr className='mt-3' />
      {
        filterData.map((data) => (
          <div key={data.filterType}>
            <h1 className='font-bold text-lg mt-4'>{data.filterType}</h1>
            <div>
  {data.array.map((item) => {
    const isSelected = selectedValues[data.filterType] === item;
    const itemId = `${data.filterType}-${item}`;
    return (
      <div className='flex items-center space-x-2 my-2' key={itemId}>
        <input
          type="radio"
          id={itemId}
          name={data.filterType}
          value={item}
          checked={isSelected}
          onChange={() => changeHandler(item, data.filterType)}
          onClick={() => {
            
            if (isSelected) changeHandler('', data.filterType);
          }}
        />
        <Label htmlFor={itemId}>{item}</Label>
      </div>
    );
  })}
</div>

          </div>
        ))
      }
    </div>
  );
};

export default FilterCard;
