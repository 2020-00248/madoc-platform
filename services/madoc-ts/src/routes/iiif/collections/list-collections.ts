import { sql } from 'slonik';
import { userWithScope } from '../../../utility/user-with-scope';
import { CollectionListResponse } from '../../../types/schemas/collection-list';
import { RouteMiddleware } from '../../../types/route-middleware';
import {
  getCollectionList,
  getCollectionSnippets,
  mapCollectionSnippets,
} from '../../../database/queries/get-collection-snippets';
import { SQL_INT_ARRAY } from '../../../utility/postgres-tags';

export const listCollections: RouteMiddleware<{ page: number }> = async context => {
  const { siteId } = userWithScope(context, []);

  const collectionCount = 5;
  const page = Number(context.query.page) || 1;
  const { total = 0 } = await context.connection.one<{ total: number }>(sql`
      select count(*) as total
          from iiif_derived_resource
          where resource_type = 'collection' 
          and site_id = ${siteId}
  `);
  const totalPages = Math.ceil(total / collectionCount);

  const rows = await context.connection.any(
    getCollectionSnippets(
      getCollectionList({
        siteId,
        perPage: collectionCount,
        page,
      }),
      {
        siteId: Number(siteId),
        fields: ['label'],
        allCollectionFields: false,
      }
    )
  );

  const table = mapCollectionSnippets(rows);

  const collectionsIds = Object.keys(table.collections);

  // Not ideal being it's own query.
  const totals = await context.connection.any<{ resource_id: number; total: number }>(sql`
      select resource_id, item_total as total
        from iiif_derived_resource_item_counts
        where resource_id = ANY (${sql.array(collectionsIds, SQL_INT_ARRAY)}) 
    `);

  const totalsIdMap = totals.reduce((state, row) => {
    state[row.resource_id] = row.total;
    return state;
  }, {} as { [id: string]: number });

  const returnCollections = [];
  for (const collectionId of collectionsIds) {
    const collection = table.collections[collectionId];
    const manifestIds = table.collection_to_manifest[collectionId] || [];
    collection.itemCount = totalsIdMap[collectionId] || 0;
    collection.items = manifestIds.map((id: number) => table.manifests[id]);
    returnCollections.push(collection);
  }

  context.response.body = {
    collections: returnCollections,
    pagination: {
      page,
      totalResults: total,
      totalPages,
    },
  } as CollectionListResponse;
};