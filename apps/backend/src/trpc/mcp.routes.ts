import { z } from 'zod';

import * as mcpConfigQueries from '../queries/project-mcp-config.queries';
import { mcpService } from '../services/mcp.service';
import { adminProtectedProcedure, projectProtectedProcedure, router } from './trpc';

const applyDisabledToolsUpdate = async (projectId: string, updater: (current: string[]) => string[]) => {
	await mcpConfigQueries.updateDisabledTools(projectId, updater);
	await mcpService.refreshToolAvailability(projectId);
	return mcpService.cachedMcpState;
};

export const mcpRoutes = router({
	getState: projectProtectedProcedure.query(async ({ ctx }) => {
		await mcpService.initializeMcpState(ctx.project.id);
		return mcpService.cachedMcpState;
	}),

	reconnect: adminProtectedProcedure.mutation(async ({ ctx }) => {
		await mcpService.initializeMcpState(ctx.project.id);
		await mcpService.loadMcpState();
		return mcpService.cachedMcpState;
	}),

	toggleTool: adminProtectedProcedure
		.input(z.object({ toolName: z.string(), disabled: z.boolean() }))
		.mutation(({ ctx, input }) =>
			applyDisabledToolsUpdate(ctx.project.id, (current) =>
				input.disabled ? [...current, input.toolName] : current.filter((t) => t !== input.toolName),
			),
		),

	setAllServerTools: adminProtectedProcedure
		.input(z.object({ serverName: z.string(), disabled: z.boolean() }))
		.mutation(({ ctx, input }) => {
			const serverTools = mcpService.cachedMcpState[input.serverName]?.tools.map((t) => t.name) ?? [];
			return applyDisabledToolsUpdate(ctx.project.id, (current) =>
				input.disabled ? [...current, ...serverTools] : current.filter((t) => !serverTools.includes(t)),
			);
		}),
});
