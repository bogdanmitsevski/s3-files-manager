import { Media } from 'entities/media.entity';

export interface FindAllMediaParams {
  page: number;
  limit: number;
}

export interface FindAllMediaResponse {
  data: Media[];
  total: number;
  page: number;
  limit: number;
}
