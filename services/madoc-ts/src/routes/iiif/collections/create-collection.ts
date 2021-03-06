import { sql } from 'slonik';
import { userWithScope } from '../../../utility/user-with-scope';
import { CreateCollection } from '../../../types/schemas/create-collection';
import { RouteMiddleware } from '../../../types/route-middleware';

export const createCollection: RouteMiddleware<{}, CreateCollection> = async context => {
  const { siteId, userUrn } = userWithScope(context, ['site.admin']);

  const body = context.requestBody;
  const taskId = body.taskId || null;
  const json = JSON.stringify(body.collection);

  // collection json, sid integer, extra_context text, added_by text
  const { canonical_id, derived_id } = await context.connection.one<{ canonical_id: number; derived_id: number }>(
    sql`select * from create_collection(${json}, ${siteId}, ${userUrn}, ${taskId})`
  );

  if (body.flat) {
    await context.connection.query(sql`
      update iiif_derived_resource set flat = true where id = ${derived_id}
    `);
  }

  context.response.body = { id: canonical_id };
  context.response.status = 201;
};
