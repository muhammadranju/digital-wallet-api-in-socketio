import ApiError from '../errors/ApiError';

export const parseAmount = (raw: unknown): number => {
  const n = typeof raw === 'string' ? Number(raw) : Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    throw new ApiError(400, 'Amount must be a positive number');
  }
  // If you only allow whole units, also enforce integers:
  // if (!Number.isInteger(n)) throw new ApiError(400, 'Amount must be an integer');
  return n;
};
