import { getLinearPrompt, getLinearPromptDefinitions } from '../mcp-prompts.js';

describe('Linear MCP prompts', () => {
  it('lists PM-oriented prompts', () => {
    const prompts = getLinearPromptDefinitions();
    const promptNames = prompts.map((prompt) => prompt.name);

    expect(promptNames).toEqual(
      expect.arrayContaining([
        'summarize-project-status',
        'draft-project-update',
        'triage-issue',
        'summarize-document',
      ]),
    );
  });

  it('builds prompts that point clients at the right Linear resources', () => {
    const projectPrompt = getLinearPrompt('summarize-project-status', {
      projectId: 'project-1',
      focus: 'risks',
    });
    expect(projectPrompt.messages[0].content).toMatchObject({
      type: 'text',
      text: expect.stringContaining('linear://project/project-1'),
    });
    expect(projectPrompt.messages[0].content).toMatchObject({
      type: 'text',
      text: expect.stringContaining('Pay extra attention to risks'),
    });

    const issuePrompt = getLinearPrompt('triage-issue', { issueId: 'ISS-1' });
    expect(issuePrompt.messages[0].content).toMatchObject({
      type: 'text',
      text: expect.stringContaining('linear://issue/ISS-1'),
    });
  });
});
