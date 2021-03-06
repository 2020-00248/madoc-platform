import { InternationalString, MetadataItem } from '@hyperion-framework/types';
import { Pagination } from './_pagination';

export type ManifestFull = {
  manifest: {
    id: number;
    thumbnail: null | string;
    label: InternationalString;
    metadata?: Array<MetadataItem>;
    requiredStatement?: MetadataItem;
    summary?: InternationalString;
    items: Array<{
      id: number;
      label: InternationalString;
      thumbnail: null | string;
    }>;
  };
  pagination: Pagination;
};
