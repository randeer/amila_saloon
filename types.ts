export interface Service {
  serviceName: string;
  description: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}
