export type Room = {
  id?: string;
  slug?: string;
  propertyName: string;
  propertyDescription: string;
  propertyPricePerNight: number;
  propertyImageUrls?: string[];
  propertyStatus?: PropertyStatusEnum;
  propertyType: PropertyTypeEnum;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  address: string;
  locationId: string;
  hostId: string;
  isDraft?: boolean;
  isPublished?: boolean;
  metadata?: {
    createdAt: string;
    updatedAt: string;
    isDraft: boolean;
    isPulished: boolean;
  }
}

export type HostInfo = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar: string | null;
  gender: boolean;
  experience: number;
  responseRate: number;
  totalProperties: number;
  totalReviews: number;
  averageRating: number;
}

export interface Review {
  reviewId: string;
  propertyId: string;
  userId: string;
  avatar?: string;
  fullName?: string;
  comment: string;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewAnalytics {
  date: string;
  averageRating: number;
  reviewsCount: number;
}

export interface ReviewCreatePayload extends Omit<Review, "reviewId" | "createdAt" | "updatedAt"> {

}
export interface SearchPayload {
  locationId: string | null;
  startDate: string | null;
  endDate: string | null;
  guestCount: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  amenities: string[];
  bathrooms: number | null;
  bedrooms: number | null;
}

export type RoomType = {
  id: string;
  name: string;
};

export interface RoomAvailabilityPayload {
  propertyId: string;
  startDate: string;
  endDate: string;
  guests: number;
}

export interface RoomAvailabilityResponse {
  isAvailable: boolean;
  totalPrice: number;
  propertyId: string;
}

export enum PropertyStatusEnum {
  Available,
  Booked,
  Unavailable,
  Unknown
}




export enum PropertyTypeEnum {
  Apartment,           // Căn hộ
  House,               // Nhà riêng
  SecondaryUnit,       // Đơn vị thứ cấp (ví dụ: guesthouse)
  UniqueSpace,         // Không gian độc đáo (ví dụ: nhà trên cây, yurt)
  BedAndBreakfast,     // Loại hình B&B
  BoutiqueHotel,       // Khách sạn boutique
  EntirePlace,         // Thuê toàn bộ căn
  PrivateRoom,         // Phòng riêng
  HotelRoom,           // Phòng khách sạn
  SharedRoom           // Phòng chung
}

