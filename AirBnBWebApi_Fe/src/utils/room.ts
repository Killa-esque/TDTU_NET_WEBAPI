import { PropertyStatusEnum, Room } from "@/types";

export const filterRooms = (rooms: Room[], filters: Record<string, any>): Room[] => {
  return rooms.filter(room => {
    // Địa điểm
    if (filters.locationId && room.locationId !== filters.locationId) return false;

    // Loại phòng
    if (filters.propertyType && room.propertyType !== filters.propertyType) return false;

    // Số khách
    if (filters.guestCount && room.guests < filters.guestCount) return false;

    // Giá
    if (filters.minPrice && room.propertyPricePerNight < filters.minPrice) return false;
    if (filters.maxPrice && room.propertyPricePerNight > filters.maxPrice) return false;

    // Phòng ngủ
    if (filters.bedrooms && room.bedrooms < filters.bedrooms) return false;

    // Phòng tắm
    if (filters.bathrooms && room.bathrooms < filters.bathrooms) return false;

    // Tiện nghi
    if (filters.wifi && !room.wifi) return false;
    if (filters.airConditioning && !room.airConditioning) return false;
    if (filters.kitchen && !room.kitchen) return false;
    if (filters.parking && !room.parking) return false;
    if (filters.swimmingPool && !room.swimmingPool) return false;

    // Ngày
    if (
      filters.startDate &&
      filters.endDate &&
      room.propertyStatus !== PropertyStatusEnum.Available
    )
      return false;

    return true;
  });
};
