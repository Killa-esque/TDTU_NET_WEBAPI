import { CONFIG } from "@/config/appConfig";
import { useAmenity } from "@/hooks";
import { Amenity } from "@/types"; // Type cho Amenity

type Props = {
  selectedAmenities: string[];
  onChange: (updatedAmenities: string[]) => void;
};

function Amenities({ selectedAmenities, onChange }: Props) {
  const { getAmenities } = useAmenity();
  const { data: amenities = [] } = getAmenities();

  const handleToggle = (id: string) => {
    if (selectedAmenities.includes(id)) {
      onChange(selectedAmenities.filter((item) => item !== id)); // Bỏ chọn
    } else {
      onChange([...selectedAmenities, id]); // Thêm vào danh sách
    }
  };

  return (
    <div>
      <label
        htmlFor="amenities"
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        Amenities
      </label>
      <div className="grid grid-cols-2 gap-2">
        {amenities.map((amenity: Amenity) => (
          <div key={amenity.id} className="flex items-center">
            <input
              type="checkbox"
              id={amenity.id}
              value={amenity.id} // Sử dụng `id` làm giá trị
              checked={selectedAmenities.includes(amenity.id)} // Kiểm tra theo `id`
              onChange={() => handleToggle(amenity.id)} // Toggle theo `id`
              className="h-4 w-4 text-rose-500 border-gray-300 rounded focus:ring-rose-400"
            />
            <label htmlFor={amenity.id} className="ml-2 text-sm text-gray-700">
              <span className="mr-2">
                <i className={`fa-regular ${amenity.icon}`}></i>
              </span>
              <span>{amenity.name}</span>
            </label>
          </div>
        ))}
      </div>
    </div >
  );
}

export default Amenities;
