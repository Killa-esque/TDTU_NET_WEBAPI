import Room from '@/components/User/Data/Room';
import { useRoom } from '@/hooks';
import { Room as RoomType, SearchPayload } from '@/types';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';


const Search: React.FC = () => {
  const [params] = useSearchParams();
  const { searchRooms } = useRoom();
  const [filteredRooms, setFilteredRooms] = useState<RoomType[]>([]);

  // Tạo object query từ URL parameters
  const amenities = params.get('amenities')?.split(',');
  const searchParams: SearchPayload = {
    locationId: params.get('locationId') || "",
    guestCount: params.get('guestCount') ? Number(params.get('guestCount')) : null,
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : null,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : null,
    amenities: amenities || [],
    startDate: params.get('startDate') || null,
    endDate: params.get('endDate') || null,
    bathrooms: params.get('bathroomCount') ? Number(params.get('bathroomCount')) : null,
    bedrooms: params.get('roomCount') ? Number(params.get('roomCount')) : null,
  };

  const { mutate, status, isError } = searchRooms();

  useEffect(() => {
    mutate(searchParams, {
      onSuccess: (data) => {
        setFilteredRooms(data);
      },
      onError: (error) => {
        console.error('Search failed:', error);
        setFilteredRooms([]);
      },
    });
  }, [params]);

  if (status === "pending") return <div>Đang tải...</div>;
  if (isError) return <div>Đã xảy ra lỗi. Vui lòng thử lại sau!</div>;

  return (
    <div className='container mx-auto'>
      <h1 className="text-2xl font-bold mb-4">Kết quả tìm kiếm</h1>
      <div className='h-vh-80'>
        {filteredRooms.length > 0 ? (
          <Room rooms={filteredRooms || []} />
        ) : (
          <p>Không tìm thấy kết quả phù hợp.</p>
        )}
      </div>

    </div>
  );
}

export default Search
