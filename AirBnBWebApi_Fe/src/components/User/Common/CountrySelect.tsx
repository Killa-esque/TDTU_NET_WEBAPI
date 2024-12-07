import { useLocation } from '@/hooks';
import { Location } from '@/types';
import { formatString } from '@/utils';
import { Select } from 'antd';

type Props = {
  locationId: string;
  onChange: (locationId: string) => void;
};

function CountrySelect({ locationId, onChange }: Props) {
  const { getLocations } = useLocation();
  const { data: locations = [] } = getLocations();

  const options: { label: string, value: string, key: string }[] = locations.map((location: Location) => ({
    label: `${location.city}, ${location.country}`,
    value: location.id || '',
    key: location.id || '',
  }));


  return (
    <div>
      <Select
        placeholder="Anywhere"
        value={locationId}
        onChange={(val) => {
          const selectedCountry = locations.find((location) => location.id === val);
          if (selectedCountry) {
            if (selectedCountry.id) {
              onChange(selectedCountry.id);
            }
          }
        }}
        style={{ width: '100%' }}
        showSearch
        options={options}
        optionFilterProp="label" // Dùng để tìm kiếm theo `label`
        filterOption={(input, option) => {
          if (option) {
            if (option.label) {
              if (option.label) {
                if (formatString(option.label).includes(formatString(input))) {
                  return true;
                }
              }
            }
          }
          return false;
        }}
      />
    </div>
  );
}

export default CountrySelect;
