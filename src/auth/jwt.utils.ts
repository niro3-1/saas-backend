export const addTierToJwt = (payload: any, tier: string): any => {
  return { ...payload, tier };
};