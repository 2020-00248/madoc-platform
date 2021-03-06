import React from 'react';
import { useApi } from '../hooks/use-api';
import { useQuery } from 'react-query';
import { SnippetLarge } from '../atoms/SnippetLarge';
import { LocaleString } from './LocaleString';
import { HrefLink } from '../utility/href-link';

export const CollectionSnippet: React.FC<{ id: number }> = props => {
  const api = useApi();

  const { data, failureCount } = useQuery(
    ['collection', { id: props.id }],
    () => {
      return api.getCollectionById(props.id);
    },
    {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      retry: false,
    }
  );

  if (failureCount) {
    return null;
  }

  if (!data) {
    return (
      <SnippetLarge
        margin
        label={'...'}
        subtitle={`Collection`}
        summary={'...'}
        linkAs={HrefLink}
        buttonText="view collection"
        link={`/collections/${props.id}`}
      />
    );
  }

  const thumbnail = data.collection.thumbnail
    ? data.collection.thumbnail
    : data.collection.items[0] && data.collection.items[0].thumbnail
    ? data.collection.items[0].thumbnail
    : undefined;

  return (
    <SnippetLarge
      margin
      label={<LocaleString>{data.collection.label}</LocaleString>}
      subtitle={`Collection with ${data.pagination.totalResults} manifests`}
      summary={<LocaleString>{data.collection.summary}</LocaleString>}
      linkAs={HrefLink}
      thumbnail={thumbnail}
      buttonText="view collection"
      link={`/collections/${props.id}`}
    />
  );
};
