export interface Space {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export type GetAllSpacesResponse = Space[];
