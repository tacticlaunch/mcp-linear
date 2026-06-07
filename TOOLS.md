# MCP Linear Tools

This document provides an overview of all implemented MCP Linear tools, plus the additional MCP-native resources and prompts exposed by the server.

## Implemented Tools

The following tools are currently implemented and available in the MCP Linear:

### MCP Resources

These are read-only MCP resources exposed by the server for higher-value Linear context retrieval.

| Resource URI Pattern                  | Description                                            | Status         |
| ------------------------------------- | ------------------------------------------------------ | -------------- |
| `linear://viewer`                     | Authenticated viewer profile                           | ✅ Implemented |
| `linear://organization`               | Current Linear organization                            | ✅ Implemented |
| `linear://teams`                      | Team list                                              | ✅ Implemented |
| `linear://projects`                   | Project list                                           | ✅ Implemented |
| `linear://rate-limit`                 | Shared MCP-side rate-limit status snapshot             | ✅ Implemented |
| `linear://resource-guide`             | Dynamic resource URI guide                             | ✅ Implemented |
| `linear://project/{id}`               | Project details                                        | ✅ Implemented |
| `linear://project/{id}/issues?...`    | Filtered project issue summaries                       | ✅ Implemented |
| `linear://project/{id}/documents?...` | Filtered project documents                             | ✅ Implemented |
| `linear://issue/{id}`                 | Issue details                                          | ✅ Implemented |
| `linear://document/{id}`              | Document details                                       | ✅ Implemented |
| `linear://roadmap/{id}`               | Roadmap details                                        | ✅ Implemented |
| `linear://milestone/{id}`             | Milestone details                                      | ✅ Implemented |

### MCP Prompts

These are reusable MCP prompt templates exposed by the server for PM-oriented Linear workflows.

| Prompt Name                   | Description                                                     | Status         |
| ---------------------------- | --------------------------------------------------------------- | -------------- |
| `summarize-project-status`   | Summarize project health using project, issue, and document context | ✅ Implemented |
| `draft-project-update`       | Draft a project update from current project state               | ✅ Implemented |
| `triage-issue`               | Triage an issue using canonical issue context                   | ✅ Implemented |
| `summarize-document`         | Summarize a document and relate it to surrounding project context | ✅ Implemented |

### User & Organization Tools

| Tool Name                | Description                                            | Status         |
| ------------------------ | ------------------------------------------------------ | -------------- |
| `linear_getViewer`       | Get information about the currently authenticated user | ✅ Implemented |
| `linear_getOrganization` | Get information about the current Linear organization  | ✅ Implemented |
| `linear_getUsers`        | Get a list of users in the Linear organization         | ✅ Implemented |
| `linear_getLabels`       | Get a list of issue labels from Linear                 | ✅ Implemented |

### Team Tools

| Tool Name                     | Description                     | Status         |
| ----------------------------- | ------------------------------- | -------------- |
| `linear_getTeams`             | Get a list of teams from Linear | ✅ Implemented |
| `linear_updateTeam`           | Update team settings            | ✅ Implemented |
| `linear_getTeamMemberships`   | Get team memberships            | ✅ Implemented |
| `linear_createTeam`           | Create a new team               | ✅ Implemented |
| `linear_archiveTeam`          | Archive a team                  | ✅ Implemented |
| `linear_addUserToTeam`        | Add a user to a team            | ✅ Implemented |
| `linear_removeUserFromTeam`   | Remove a user from a team       | ✅ Implemented |
| `linear_updateTeamMembership` | Update a user's role in a team  | ✅ Implemented |
| `linear_getTeamLabels`        | Get labels for a specific team  | ✅ Implemented |
| `linear_createTeamLabel`      | Create a new label for a team   | ✅ Implemented |

### Workflow Tools

| Tool Name                    | Description                             | Status         |
| ---------------------------- | --------------------------------------- | -------------- |
| `linear_getWorkflowStates`   | Get all workflow states for a team      | ✅ Implemented |
| `linear_createWorkflowState` | Create a new workflow state             | ✅ Implemented |
| `linear_updateWorkflowState` | Update a workflow state                 | ✅ Implemented |

### Project Tools

| Tool Name              | Description                        | Status         |
| ---------------------- | ---------------------------------- | -------------- |
| `linear_getProjects`   | Get a list of projects from Linear | ✅ Implemented |
| `linear_getProjectById` | Get details of a specific project  | ✅ Implemented |
| `linear_createProject` | Create a new project in Linear     | ✅ Implemented |

### Milestone Tools

Linear exposes milestones as `ProjectMilestone` in the SDK/API. Archiving is implemented via the SDK's `deleteProjectMilestone` mutation.

| Tool Name                    | Description                                  | Status         |
| ---------------------------- | -------------------------------------------- | -------------- |
| `linear_getMilestones`       | Get a list of project milestones             | ✅ Implemented |
| `linear_getMilestoneById`    | Get details of a specific project milestone  | ✅ Implemented |
| `linear_createMilestone`     | Create a new project milestone               | ✅ Implemented |
| `linear_updateMilestone`     | Update an existing project milestone         | ✅ Implemented |
| `linear_archiveMilestone`    | Archive a project milestone                  | ✅ Implemented |

### Document Tools

Linear exposes workspace, project, initiative, team, issue, release, and cycle docs as `Document` in the API. Team home resource sections use a narrow GraphQL query so MCP responses include richer pinned document/link details than the generated SDK fragment.

| Tool Name                           | Description                                      | Status         |
| ----------------------------------- | ------------------------------------------------ | -------------- |
| `linear_getDocuments`               | Get workspace documents with optional filters    | ✅ Implemented |
| `linear_getDocumentById`            | Get details of a specific document               | ✅ Implemented |
| `linear_getProjectDocuments`        | Get documents for a specific project             | ✅ Implemented |
| `linear_getInitiativeDocuments`     | Get documents for a specific initiative          | ✅ Implemented |
| `linear_getTeamDocuments`           | Get documents associated with a specific team    | ✅ Implemented |
| `linear_getIssueDocuments`          | Get documents associated with a specific issue   | ✅ Implemented |
| `linear_getReleaseDocuments`        | Get documents associated with a specific release | ✅ Implemented |
| `linear_getCycleDocuments`          | Get documents associated with a specific cycle   | ✅ Implemented |
| `linear_getTeamResources`           | Get team home sections and pinned docs/links     | ✅ Implemented |
| `linear_searchDocuments`            | Search Linear documents by term                  | ✅ Implemented |
| `linear_getDocumentContentHistory`  | Get content history entries and metadata         | ✅ Implemented |
| `linear_createDocument`             | Create a new Linear document                     | ✅ Implemented |
| `linear_updateDocument`             | Update an existing Linear document               | ✅ Implemented |
| `linear_archiveDocument`            | Archive (trash) a document                       | ✅ Implemented |
| `linear_unarchiveDocument`          | Restore an archived document                     | ✅ Implemented |

### Server Tools

These are MCP-server observability helpers for tool-only clients.

| Tool Name                      | Description                                              | Status         |
| ------------------------------ | -------------------------------------------------------- | -------------- |
| `linear_getRateLimitStatus`    | Get the shared Linear rate-limit cooldown snapshot       | ✅ Implemented |
| `linear_getServerStatus`       | Get MCP Linear runtime status, counts, and rate-limit state | ✅ Implemented |

### Issue Tools

| Tool Name                 | Description                                              | Status         |
| ------------------------- | -------------------------------------------------------- | -------------- |
| `linear_getIssues`        | Get a list of recent issues from Linear                  | ✅ Implemented |
| `linear_getIssueById`     | Get a specific issue by ID or identifier (e.g., ABC-123) | ✅ Implemented |
| `linear_searchIssues`     | Search for issues with various filters                   | ✅ Implemented |
| `linear_createIssue`      | Create a new issue in Linear                             | ✅ Implemented |
| `linear_updateIssue`      | Update an existing issue in Linear                       | ✅ Implemented |
| `linear_createComment`    | Add a comment to an issue, project, initiative, update, document content, post, or thread | ✅ Implemented |
| `linear_updateComment`    | Update an existing comment in Linear                     | ✅ Implemented |
| `linear_deleteComment`    | Delete a comment in Linear                               | ✅ Implemented |
| `linear_addIssueLabel`    | Add a label to an issue                                  | ✅ Implemented |
| `linear_removeIssueLabel` | Remove a label from an issue                             | ✅ Implemented |

### Issue Management Tools

| Tool Name                      | Description                                                   | Status         |
| ------------------------------ | ------------------------------------------------------------- | -------------- |
| `linear_assignIssue`           | Assign an issue to a user                                     | ✅ Implemented |
| `linear_subscribeToIssue`      | Subscribe to issue updates                                    | ✅ Implemented |
| `linear_convertIssueToSubtask` | Convert an issue to a subtask                                 | ✅ Implemented |
| `linear_createIssueRelation`   | Create relations between issues (blocks, is blocked by, etc.) | ✅ Implemented |
| `linear_deleteIssueRelation`   | Delete an issue relation                                  | ✅ Implemented |
| `linear_archiveIssue`          | Archive an issue                                              | ✅ Implemented |
| `linear_setIssuePriority`      | Set the priority of an issue                                  | ✅ Implemented |
| `linear_transferIssue`         | Transfer an issue to another team                             | ✅ Implemented |
| `linear_duplicateIssue`        | Duplicate an issue                                            | ✅ Implemented |
| `linear_getIssueHistory`       | Get the history of changes made to an issue                   | ✅ Implemented |

### Custom Field Tools

| Tool Name                       | Description                                                                              | Status         |
| ------------------------------- | ---------------------------------------------------------------------------------------- | -------------- |
| `linear_getCustomFields`        | Get the custom field definitions exposed by the authenticated Linear schema              | ✅ Implemented |
| `linear_getIssueCustomFields`   | Get the custom field values currently set on an issue                                    | ✅ Implemented |
| `linear_updateIssueCustomField` | Update or clear a custom field value on an issue with JSON-compatible input and null clearing | ✅ Implemented |

### Comment Management Tools

| Tool Name            | Description                   | Status         |
| -------------------- | ----------------------------- | -------------- |
| `linear_getComments` | Get comments for an issue, project, initiative, update, document content, or post with pagination | ✅ Implemented |

### Project Management Tools

| Tool Name                       | Description                               | Status         |
| ------------------------------- | ----------------------------------------- | -------------- |
| `linear_updateProject`          | Update an existing project, including status, dates, members, lead, icon, and color | ✅ Implemented |
| `linear_createProjectUpdate`    | Create a new update for a project with diff controls and fields in the response | ✅ Implemented |
| `linear_updateProjectUpdate`    | Update an existing project update with diff controls and fields in the response | ✅ Implemented |
| `linear_getProjectUpdateById`   | Get a specific project update, including diff metadata | ✅ Implemented |
| `linear_getProjectUpdates`      | Get updates for a project, including Linear diff metadata | ✅ Implemented |
| `linear_archiveProjectUpdate`   | Archive a project update                  | ✅ Implemented |
| `linear_unarchiveProjectUpdate` | Restore an archived project update        | ✅ Implemented |
| `linear_deleteProjectUpdate`    | Delete a project update                   | ✅ Implemented |
| `linear_archiveProject`         | Archive a project                         | ✅ Implemented |
| `linear_addIssueToProject`      | Add an existing issue to a project        | ✅ Implemented |
| `linear_removeIssueFromProject` | Remove an existing issue from a project   | ✅ Implemented |
| `linear_getProjectIssues`       | Get project issues with PM filters | ✅ Implemented |
| `linear_getProjectMembers`      | Get members assigned to a project         | ✅ Implemented |
| `linear_addProjectMember`       | Add a member to a project                 | ✅ Implemented |
| `linear_removeProjectMember`    | Remove a member from a project            | ✅ Implemented |

### Release Management Tools

Release and release pipeline tools use focused GraphQL where this server needs custom response shaping for release notes, pipeline stages, and admin mutations. The package now targets the current `@linear/sdk` baseline.

| Tool Name                        | Description                                                              | Status         |
| -------------------------------- | ------------------------------------------------------------------------ | -------------- |
| `linear_getReleasePipelines`     | Get release pipelines from Linear                                        | ✅ Implemented |
| `linear_getReleasePipelineById`  | Get details of a specific release pipeline                               | ✅ Implemented |
| `linear_createReleasePipeline`   | Create a new release pipeline                                            | ✅ Implemented |
| `linear_updateReleasePipeline`   | Update an existing release pipeline                                      | ✅ Implemented |
| `linear_archiveReleasePipeline`  | Archive a release pipeline                                               | ✅ Implemented |
| `linear_unarchiveReleasePipeline`| Unarchive a release pipeline                                             | ✅ Implemented |
| `linear_deleteReleasePipeline`   | Delete a release pipeline                                                | ✅ Implemented |
| `linear_getReleases`             | Get releases with optional pipeline and stage filters                    | ✅ Implemented |
| `linear_getReleaseById`          | Get details of a specific release                                        | ✅ Implemented |
| `linear_searchReleases`          | Search releases by term, version, or pipeline name                       | ✅ Implemented |
| `linear_getReleaseStages`        | Get release stages from Linear                                           | ✅ Implemented |
| `linear_createReleaseStage`      | Create a new release stage in a pipeline                                 | ✅ Implemented |
| `linear_updateReleaseStage`      | Update an existing release stage                                         | ✅ Implemented |
| `linear_archiveReleaseStage`     | Archive a release stage                                                  | ✅ Implemented |
| `linear_unarchiveReleaseStage`   | Unarchive a release stage                                                | ✅ Implemented |
| `linear_getReleaseNotes`         | Get release notes from Linear                                            | ✅ Implemented |
| `linear_getReleaseNoteById`      | Get details of a specific release note                                   | ✅ Implemented |
| `linear_createRelease`           | Create a new release in a release pipeline                               | ✅ Implemented |
| `linear_updateRelease`           | Update an existing release                                               | ✅ Implemented |
| `linear_completeRelease`         | Mark a release as completed within a pipeline                            | ✅ Implemented |

`linear_completeRelease` currently depends on the target pipeline already having a valid `completed` release stage in Linear. Fresh pipelines created through the public GraphQL release surface did not seed default stages in live validation, so completion can fail until that stage exists.
| `linear_archiveRelease`          | Archive a release                                                        | ✅ Implemented |
| `linear_unarchiveRelease`        | Unarchive a release                                                      | ✅ Implemented |
| `linear_addIssueToRelease`       | Add an issue to a release                                                | ✅ Implemented |
| `linear_removeIssueFromRelease`  | Remove an issue from a release                                           | ✅ Implemented |
| `linear_createReleaseNote`       | Create a release note from explicit release IDs or a release range       | ✅ Implemented |
| `linear_updateReleaseNote`       | Update a release note's content or covered releases                      | ✅ Implemented |
| `linear_deleteReleaseNote`       | Delete a release note                                                    | ✅ Implemented |

### Roadmap Tools

| Tool Name                | Description                                               | Status         |
| ------------------------ | --------------------------------------------------------- | -------------- |
| `linear_getRoadmaps`     | Get Linear roadmaps with optional archived filtering      | ✅ Implemented |
| `linear_getRoadmapById`  | Get details of a specific roadmap                         | ✅ Implemented |
| `linear_createRoadmap`   | Create a new roadmap                                      | ✅ Implemented |
| `linear_updateRoadmap`   | Update an existing roadmap                                | ✅ Implemented |
| `linear_archiveRoadmap`  | Archive a roadmap                                         | ✅ Implemented |

### Cycle Management Tools

| Tool Name                | Description                               | Status         |
| ------------------------ | ----------------------------------------- | -------------- |
| `linear_getCycles`       | Get a list of all cycles                  | ✅ Implemented |
| `linear_getCycleById`    | Get details of a specific cycle           | ✅ Implemented |
| `linear_createCycle`     | Create a new cycle                        | ✅ Implemented |
| `linear_updateCycle`     | Update an existing cycle                  | ✅ Implemented |
| `linear_completeCycle`   | Mark a cycle as complete                  | ✅ Implemented |
| `linear_getCycleStats`   | Get statistics for a cycle                | ✅ Implemented |
| `linear_getActiveCycle`  | Get the currently active cycle for a team | ✅ Implemented |
| `linear_getCycleIssues`  | Get cycle issues with PM filters          | ✅ Implemented |
| `linear_addIssueToCycle` | Add an issue to a cycle                   | ✅ Implemented |
| `linear_removeIssueFromCycle` | Remove an issue from a cycle          | ✅ Implemented |

### Initiative Management Tools

| Tool Name                            | Description                                                         | Status         |
| ------------------------------------ | ------------------------------------------------------------------- | -------------- |
| `linear_getInitiatives`              | Get a list of initiatives from Linear                               | ✅ Implemented |
| `linear_getInitiativeById`           | Get details of a specific initiative                                | ✅ Implemented |
| `linear_createInitiative`            | Create a new initiative                                             | ✅ Implemented |
| `linear_updateInitiative`            | Update an existing initiative                                       | ✅ Implemented |
| `linear_archiveInitiative`           | Archive an initiative                                               | ✅ Implemented |
| `linear_unarchiveInitiative`         | Unarchive an initiative                                             | ✅ Implemented |
| `linear_deleteInitiative`            | Delete an initiative (move to trash)                                | ✅ Implemented |
| `linear_getInitiativeProjects`       | Get all projects in an initiative                                   | ✅ Implemented |
| `linear_addProjectToInitiative`      | Add a project to an initiative                                      | ✅ Implemented |
| `linear_removeProjectFromInitiative` | Remove a project from an initiative                                 | ✅ Implemented |
| `linear_getInitiativeUpdateById`     | Get a specific initiative update, including diff metadata            | ✅ Implemented |
| `linear_getInitiativeUpdates`        | Get updates for an initiative, including Linear diff metadata        | ✅ Implemented |
| `linear_createInitiativeUpdate`      | Create a new initiative update                                      | ✅ Implemented |
| `linear_updateInitiativeUpdate`      | Update an existing initiative update                                | ✅ Implemented |
| `linear_archiveInitiativeUpdate`     | Archive an initiative update                                        | ✅ Implemented |
| `linear_unarchiveInitiativeUpdate`   | Restore an archived initiative update                               | ✅ Implemented |

### Customer Tools

Linear exposes customer data and customer requests/needs through the SDK. Customer needs can be linked to issues or projects.

| Tool Name                                      | Description                                      | Status         |
| ---------------------------------------------- | ------------------------------------------------ | -------------- |
| `linear_getCustomers`                          | Get customers with optional filters              | ✅ Implemented |
| `linear_getCustomerById`                       | Get details of a specific customer               | ✅ Implemented |
| `linear_createCustomer`                        | Create a customer                                | ✅ Implemented |
| `linear_updateCustomer`                        | Update a customer                                | ✅ Implemented |
| `linear_deleteCustomer`                        | Delete a customer                                | ✅ Implemented |
| `linear_getCustomerNeeds`                      | Get customer needs with optional filters         | ✅ Implemented |
| `linear_getCustomerNeedById`                   | Get details of a specific customer need          | ✅ Implemented |
| `linear_createCustomerNeed`                    | Create a customer need linked to an issue or project | ✅ Implemented |
| `linear_createCustomerNeedFromAttachment`      | Create a customer need from an attachment        | ✅ Implemented |
| `linear_updateCustomerNeed`                    | Update a customer need                           | ✅ Implemented |
| `linear_archiveCustomerNeed`                   | Archive a customer need                          | ✅ Implemented |
| `linear_unarchiveCustomerNeed`                 | Restore an archived customer need                | ✅ Implemented |
| `linear_deleteCustomerNeed`                    | Delete a customer need                           | ✅ Implemented |
| `linear_getCustomerStatuses`                   | Get customer statuses                            | ✅ Implemented |
| `linear_getCustomerTiers`                      | Get customer tiers                               | ✅ Implemented |

### Views and Filters

Linear calls these "saved views" in the product UI. The GraphQL API and SDK expose the same feature as `CustomView`.

| Tool Name                 | Description                                                                     | Status         |
| ------------------------- | ------------------------------------------------------------------------------- | -------------- |
| `linear_getSavedViews`    | Get Linear saved views (`CustomView` in the API/SDK)                            | ✅ Implemented |
| `linear_createSavedView`  | Create a new Linear saved view (`createCustomView` in the API/SDK)              | ✅ Implemented |
| `linear_updateSavedView`  | Update a Linear saved view (`updateCustomView` in the API/SDK)                  | ✅ Implemented |
| `linear_deleteSavedView`  | Delete a Linear saved view (`deleteCustomView` in the API/SDK)                  | ✅ Implemented |
| `linear_getFavoriteViews` | Get favorite views, including both saved/custom views and predefined Linear views | ✅ Implemented |
| `linear_addToFavorites`   | Add an entity to the current user's favorites using schema-driven GraphQL mutation discovery | ✅ Implemented |
| `linear_removeFromFavorites` | Remove a favorite entry or entity from the current user's favorites using schema-driven GraphQL mutation discovery | ✅ Implemented |

### Template Tools

| Tool Name                        | Description                              | Status         |
| -------------------------------- | ---------------------------------------- | -------------- |
| `linear_getIssueTemplates`       | Get a list of issue templates            | ✅ Implemented |
| `linear_getIssueTemplateById`    | Get details of a specific issue template | ✅ Implemented |
| `linear_createIssueTemplate`     | Create a new issue template              | ✅ Implemented |
| `linear_updateIssueTemplate`     | Update an existing issue template        | ✅ Implemented |
| `linear_createIssueFromTemplate` | Create a new issue from a template       | ✅ Implemented |
| `linear_getTeamTemplates`        | Get templates for a specific team        | ✅ Implemented |
| `linear_archiveTemplate`         | Archive an issue template                | ✅ Implemented |

### Webhook and Attachment Tools

| Tool Name               | Description                             | Status         |
| ----------------------- | --------------------------------------- | -------------- |
| `linear_getWebhooks`    | Get a list of webhooks                  | ✅ Implemented |
| `linear_createWebhook`  | Create a webhook for integration events | ✅ Implemented |
| `linear_deleteWebhook`  | Delete a webhook                        | ✅ Implemented |
| `linear_getAttachments` | Get attachments for an issue            | ✅ Implemented |
| `linear_addAttachment`  | Add an attachment to an issue           | ✅ Implemented |

### Notification and Session Tools

| Tool Name                           | Description                             | Status         |
| ----------------------------------- | --------------------------------------- | -------------- |
| `linear_getNotifications`           | Get notifications for the current user  | ✅ Implemented |
| `linear_markNotificationAsRead`     | Mark a notification as read             | ✅ Implemented |
| `linear_getSubscriptions`           | Get subscriptions for the current user  | ✅ Implemented |
| `linear_markAllNotificationsAsRead` | Mark all notifications as read          | ✅ Implemented |
| `linear_getUnreadNotificationCount` | Get count of unread notifications       | ✅ Implemented |
| `linear_getAuthenticationSessions`  | Get active authentication sessions      | ✅ Implemented |
| `linear_logoutSession`              | Revoke a specific session               | ✅ Implemented |
| `linear_logoutOtherSessions`        | Revoke all other sessions               | ✅ Implemented |
| `linear_logoutAllSessions`          | Revoke all sessions                     | ✅ Implemented |

### Audit and Integration Tools

| Tool Name                           | Description                           | Status         |
| ----------------------------------- | ------------------------------------- | -------------- |
| `linear_getOrganizationAuditEvents` | Get audit events for the organization | ✅ Implemented |
| `linear_getUserAuditEvents`         | Get audit events for a specific user  | ✅ Implemented |
| `linear_getIntegrations`            | Get a list of active integrations     | ✅ Implemented |

## Recommended Future Tools

The following tools are recommended for future implementation based on the current Linear SDK shape and the patterns already used in this repository.

Items that looked conceptually mismatched with the current SDK or too speculative for this repo have been removed or moved to lower-priority sections.

### Recent Linear Surfaces Without Stable Tool Parity

These were reviewed against the current SDK/changelog but are intentionally not exposed as MCP tools yet because they do not have a stable SDK-backed request/response shape in this repo.

| Surface | Current Status |
| ------- | -------------- |
| Linear Diffs review operations | Product feature is available in Linear, but review/diff mutations are not exposed as stable SDK primitives for this MCP surface |
| Shared Linear Agent skills / `AgentSkill` migration | GraphQL types exist, but this repo does not yet expose an SDK-backed skills management surface |
| Team resource section/pin writes | Team resource reads are implemented; section/pin creation and reordering remain SDK/schema-gap candidates |
| GraphQL subscriptions and realtime updates | Supported by Linear's API, but not a good fit for this server's current stateless request/response tool model |

### Comment Management

Comment CRUD is now covered.

### Project Management

Project membership is now covered.

### Cycle Management

Cycle CRUD and cycle statistics are now covered.

### Roadmap Project Association

Linear roadmaps appear to model project associations rather than a generic roadmap-item abstraction in the current SDK.

| Tool Name                      | Description                                  | Priority | Status     |
| ------------------------------ | -------------------------------------------- | -------- | ---------- |
| `linear_getRoadmapProjects`    | Get projects associated with a roadmap       | Medium   | 📝 Planned |
| `linear_addProjectToRoadmap`   | Add a project to a roadmap                   | Medium   | 📝 Planned |
| `linear_removeProjectFromRoadmap` | Remove a project from a roadmap           | Medium   | 📝 Planned |

### Milestone Management

Linear milestones currently appear to belong to a single project in the SDK. Reassignment may be feasible; true multi-project milestone membership does not appear to be.

| Tool Name                         | Description                                | Priority | Status                |
| --------------------------------- | ------------------------------------------ | -------- | --------------------- |
| `linear_reassignMilestoneProject` | Reassign a milestone to a different project | Medium   | ❓ Under Consideration |

### Workflow Management

| Tool Name                      | Description                             | Priority | Status     |
| ------------------------------ | --------------------------------------- | -------- | ---------- |
| `linear_reorderWorkflowStates` | Change the order of workflow states     | Low      | ❓ Under Consideration |

### Team Management

Team settings, memberships, and team label management are now covered.

### Customers and Customer Needs

Customer records, customer statuses/tiers, and customer needs linked to issues or projects are now covered.

### Custom Fields

The repo already supports custom field discovery and issue value reads/updates. Admin CRUD appears to require the same kind of schema-driven GraphQL work used by the existing custom field support.

| Tool Name                    | Description                           | Priority | Status                |
| ---------------------------- | ------------------------------------- | -------- | --------------------- |
| `linear_getTeamCustomFields` | Get custom fields for a specific team | Medium   | 📝 Planned            |
| `linear_createCustomField`   | Create a new custom field             | Low      | ❓ Under Consideration |
| `linear_updateCustomField`   | Update a custom field                 | Low      | ❓ Under Consideration |
| `linear_deleteCustomField`   | Delete a custom field                 | Low      | ❓ Under Consideration |

### Issue Templates

Issue template management is now covered.

### Import and Export

Bulk import/export is feasible, but it does not map cleanly to first-class SDK batch primitives. This likely belongs at a repo-orchestration layer rather than a thin Linear wrapper.

| Tool Name                 | Description                            | Priority | Status                |
| ------------------------- | -------------------------------------- | -------- | --------------------- |
| `linear_bulkCreateIssues` | Create multiple issues at once         | Medium   | 📝 Planned            |
| `linear_exportIssues`     | Export issues to a structured format   | Low      | 📝 Planned            |
| `linear_importIssues`     | Import issues from a structured format | Low      | 📝 Planned            |
| `linear_importCsvData`    | Import data from CSV                   | Low      | ❓ Under Consideration |

### Webhooks and Attachments

These are directly supported by the current SDK and fit the repo well.

Webhooks, attachment reads, and attachment creation are now covered.

### Integrations

Provider integrations mostly involve OAuth or provider-specific setup flows, so they are a weaker fit for this repo’s current MCP surface.

| Tool Name                  | Description                       | Priority | Status                |
| -------------------------- | --------------------------------- | -------- | --------------------- |
| `linear_getIntegrations`   | Get a list of active integrations | Low      | ✅ Implemented        |
| `linear_createIntegration` | Create a new integration          | Low      | ❓ Under Consideration |
| `linear_removeIntegration` | Remove an integration             | Low      | ❓ Under Consideration |

### Notifications and Subscriptions

| Tool Name                           | Description                             | Priority | Status     |
| ----------------------------------- | --------------------------------------- | -------- | ---------- |
| `linear_getNotifications`           | Get notifications for the current user  | Medium   | ✅ Implemented |
| `linear_markNotificationAsRead`     | Mark a notification as read             | Medium   | ✅ Implemented |
| `linear_getSubscriptions`           | Get subscriptions for the current user  | Low      | ✅ Implemented |
| `linear_manageSubscription`         | Subscribe or unsubscribe from an entity | Low      | ❓ Under Consideration |
| `linear_markAllNotificationsAsRead` | Mark all notifications as read          | Medium   | ✅ Implemented |
| `linear_getUnreadNotificationCount` | Get count of unread notifications       | Medium   | ✅ Implemented |

### Favorites and Pinning

The repo already supports favorite views plus favorite add/remove mutations. Generic pinning does not appear to map cleanly to the current SDK.

| Tool Name             | Description                         | Priority | Status                |
| --------------------- | ----------------------------------- | -------- | --------------------- |
| `linear_getFavorites` | Get a list of user's favorite items | Medium   | 📝 Planned            |
| `linear_pinIssue`     | Pin an issue to the top of a list   | Medium   | ❓ Under Consideration |
| `linear_unpinIssue`   | Unpin an issue                      | Medium   | ❓ Under Consideration |

### User Preferences

| Tool Name                      | Description                      | Priority | Status     |
| ------------------------------ | -------------------------------- | -------- | ---------- |
| `linear_getUserPreferences`    | Get user preferences             | Low      | 📝 Planned |
| `linear_updateUserPreferences` | Update user preferences          | Low      | 📝 Planned |
| `linear_getUserSettings`       | Get user application settings    | Low      | 📝 Planned |
| `linear_updateUserSettings`    | Update user application settings | Low      | 📝 Planned |

### Metrics and Reporting

Rich reporting support appears thin in the current SDK beyond export/report helper surfaces, so these remain speculative until we have specific use cases.

| Tool Name                           | Description                                 | Priority | Status                |
| ----------------------------------- | ------------------------------------------- | -------- | --------------------- |
| `linear_getTeamCycles`              | Get information about team cycles           | Medium   | 📝 Planned            |
| `linear_getTeamMetrics`             | Get performance metrics for a team          | Low      | ❓ Under Consideration |
| `linear_getIssueAnalytics`          | Get analytics for issues (cycle time, etc.) | Medium   | ❓ Under Consideration |
| `linear_generateReport`             | Generate a custom report                    | Low      | ❓ Under Consideration |
| `linear_getVelocityMetrics`         | Get team velocity metrics                   | Medium   | ❓ Under Consideration |
| `linear_getCompletionRateMetrics`   | Get completion rate metrics                 | Medium   | ❓ Under Consideration |
| `linear_getTimeToResolutionMetrics` | Get time-to-resolution metrics              | Medium   | ❓ Under Consideration |

### Audit and History

| Tool Name                           | Description                              | Priority | Status                |
| ----------------------------------- | ---------------------------------------- | -------- | --------------------- |
| `linear_getTeamAuditEvents`         | Get audit events for a specific team     | Medium   | ❓ Under Consideration |
| `linear_getEntityHistory`           | Get the history of changes for an entity | Medium   | 📝 Planned            |

### Sessions and Authentication

Session and audit reads are a better fit for this repo than broader API-key or OAuth-client admin flows.

| Tool Name                        | Description                              | Priority | Status     |
| -------------------------------- | ---------------------------------------- | -------- | ---------- |
| `linear_getAuthenticationSessions` | Get active authentication sessions     | Low      | ✅ Implemented |
| `linear_logoutSession`           | Revoke a specific session                | Low      | ✅ Implemented |
| `linear_logoutOtherSessions`     | Revoke all other sessions                | Low      | ✅ Implemented |
| `linear_logoutAllSessions`       | Revoke all sessions                      | Low      | ✅ Implemented |

## Implementation Guide

When implementing new tools, follow these steps:

1. Add a new tool definition in the appropriate file under `src/tools/definitions/`
2. Implement the handler function in `src/tools/handlers/`
3. Add any necessary type guards in `src/tools/type-guards.ts`
4. Add any required methods to the `LinearService` class in `src/services/linear-service.ts`
5. Register the tool in `src/tools/definitions/index.ts`
6. Register the handler in `src/tools/handlers/index.ts`
7. Update this document to mark the tool as implemented

## Status Legend

- ✅ Implemented: Tool is fully implemented and tested
- 🔄 In Progress: Tool is currently being implemented
- 📝 Planned: Tool is planned for future implementation
- ❓ Under Consideration: Tool is being considered, but not yet planned
