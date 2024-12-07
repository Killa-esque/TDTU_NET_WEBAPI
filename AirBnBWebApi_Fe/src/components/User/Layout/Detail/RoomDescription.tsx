import { MdOutlineKingBed, MdOutlinePersonPin, MdOutlineShower } from 'react-icons/md'
import DOMPurify from 'dompurify';

type Props = {
  guests: number
  beds: number
  bathrooms: number
  propertyDescription: string
}

const RoomDescription = ({ guests, beds, bathrooms, propertyDescription }: Props) => {
  const sanitizedDescription = DOMPurify.sanitize(propertyDescription);

  return (
    <div className="pb-6 border-b">
      <h2
        className="text-2xl font-semibold text-gray-800 mb-4"
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <span className="font-semibold text-gray-600 mr-2">Sức chứa:</span>
          <span className="flex space-x-1">
            {[...Array(guests)].map((_, index) => (
              <MdOutlinePersonPin key={index} className="text-gray-500" />
            ))}
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-gray-600 mr-2">Giường:</span>
          <span className="flex space-x-1">
            {[...Array(beds)].map((_, index) => (
              <MdOutlineKingBed key={index} className="text-gray-500" />
            ))}
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold text-gray-600 mr-2">Phòng tắm:</span>
          <span className="flex space-x-1">
            {[...Array(bathrooms)].map((_, index) => (
              <MdOutlineShower key={index} className="text-gray-500" />
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}

export default RoomDescription
