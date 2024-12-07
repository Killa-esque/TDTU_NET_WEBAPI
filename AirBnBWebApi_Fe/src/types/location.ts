export interface Location {
  id?: string;
  city: string;
  country: string;
  latitude?: string;
  longtitude?: string;
  googleMapUrl?: string;
  imageUrl: string;
}


export interface LocationCreatePayload extends Omit<Location, 'id' | 'imageUrl'> {

}
export interface LocationUpdatePayload extends Omit<Location, 'imageUrl'> {

}
