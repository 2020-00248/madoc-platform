import { userWithScope } from '../../../utility/user-with-scope';
import { sql } from 'slonik';
import { RouteMiddleware } from '../../../types/route-middleware';

export const deleteCanvas: RouteMiddleware<{ id: number }> = async context => {
  const { siteId } = userWithScope(context, ['site.admin']);

  await context.query.any(
    sql`delete from iiif_derived_resource where resource_id = ${context.params.id} and resource_type = 'canvas' and site_id = ${siteId}`
  );

  context.response.status = 200;
};
