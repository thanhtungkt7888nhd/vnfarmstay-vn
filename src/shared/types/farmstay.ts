export interface Farmstay {
  id: string;
  slug: string;
  name: string;
  location: string;
  province: string;
  region: "north" | "central" | "south";
  tags: string[];
  price: number;
  rating: number;
  reviewCount: number;
  badges: Array<"verified" | "new" | "featured">;
  emoji: string;
  lat: number;
  lng: number;
}

export interface MapLocation {
  lat: number;
  lng: number;
  name: string;
  price: string;
  rating: string;
}
