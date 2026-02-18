import { eq } from 'drizzle-orm';

import s, { DBProjectMcpConfig } from '../db/abstractSchema';
import { db } from '../db/db';

export const getDisabledTools = async (projectId: string): Promise<string[]> => {
	const [config] = await db
		.select({ disabledTools: s.projectMcpConfig.disabledTools })
		.from(s.projectMcpConfig)
		.where(eq(s.projectMcpConfig.projectId, projectId))
		.execute();
	return config?.disabledTools ?? [];
};

export const updateDisabledTools = async (
	projectId: string,
	updater: (current: string[]) => string[],
): Promise<DBProjectMcpConfig> => {
	return db.transaction(async (tx) => {
		const [existing] = await tx
			.select()
			.from(s.projectMcpConfig)
			.where(eq(s.projectMcpConfig.projectId, projectId))
			.execute();

		const next = updater(existing?.disabledTools ?? []);

		const [result] = await tx
			.insert(s.projectMcpConfig)
			.values({ projectId, disabledTools: next })
			.onConflictDoUpdate({
				target: s.projectMcpConfig.projectId,
				set: { disabledTools: next },
			})
			.returning()
			.execute();

		return result;
	});
};
