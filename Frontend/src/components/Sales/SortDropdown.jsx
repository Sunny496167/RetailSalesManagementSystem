// frontend/src/components/Sales/SortDropdown.jsx
import { useDispatch } from 'react-redux';
import { setSort } from '../../store/slices/filtersSlice';
import { SORT_OPTIONS } from '../../utils/constants';
import Select from '../Common/Select';

const SortDropdown = ({ sortBy, sortOrder }) => {
  const dispatch = useDispatch();
  
  const currentValue = `${sortBy}-${sortOrder}`;

  const handleChange = (e) => {
    const selectedOption = SORT_OPTIONS.find(opt => opt.value === e.target.value);
    if (selectedOption) {
      dispatch(setSort({
        sortBy: selectedOption.sortBy,
        sortOrder: selectedOption.sortOrder,
      }));
    }
  };

  return (
    <Select
      value={currentValue}
      onChange={handleChange}
      options={SORT_OPTIONS}
      placeholder="Sort by..."
      label="Sort By"
    />
  );
};

export default SortDropdown;