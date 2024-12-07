import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/assets/css/room.css';
import type { Room } from '@/types';
import { usePagination } from '@/hooks';
import RoomCard from './RoomCard';

interface Props {
  rooms: Room[];
};

const Room = ({ rooms }: Props) => {

  const roomsPerPage = 16;
  const { currentPage, totalPages, currentRooms, setCurrentPage } = usePagination(rooms, roomsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-10 h-50">
        {currentRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
      <div className="pagination-controls flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button mx-2"
        >
          <i className='fa-regular fa-arrow-left'></i>
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-button mx-2 ${index + 1 === currentPage ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button mx-2"
        >
          <i className='fa-regular fa-arrow-right'></i>
        </button>
      </div>
    </div>
  );
};

export default Room;



