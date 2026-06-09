export const getCookieOptions = () => {
  const isSecure = process.env.NODE_ENV === 'production' || process.env.FRONTEND_URL?.startsWith('https');

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
};