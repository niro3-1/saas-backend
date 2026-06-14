export const addTierToJwt = (payload: any, tier: string): any => {
  return { ...payload, tier };
};

// Example usage:
// const updatedPayload = addTierToJwt(originalPayload, 'premium');