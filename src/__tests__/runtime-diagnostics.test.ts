describe('runtime diagnostics module', () => {
  it('can be imported without throwing', async () => {
    const module = await import('../runtime-diagnostics.js');

    expect(typeof module.installRuntimeDiagnostics).toBe('function');
  });
});
