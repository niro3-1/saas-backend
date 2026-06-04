describe('GET /accounts/{id} input validation', () => {
  it('should reject invalid UUIDs', async () => {
    const res = await request.get('/accounts/invalid-uuid');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid account ID');
  });

  it('should reject empty ID', async () => {
    const res = await request.get('/accounts/');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing account ID');
  });
});