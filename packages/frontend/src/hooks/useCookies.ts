export const useCookies = (cookieName: string): string => {
  // Get all cookies from document.cookie
  const cookies = document.cookie;

  // If no cookies exist, return empty string
  if (!cookies) {
    return "";
  }

  // Split cookies by semicolon and find the target cookie
  const targetCookie = cookies
    .split(";")
    .find((cookie) => cookie.trim().startsWith(`${cookieName}=`));

  // If cookie found, return its value, otherwise return empty string
  if (targetCookie) {
    const value = targetCookie.split("=").slice(1).join("=");
    return decodeURIComponent(value.trim());
  }

  return "";
};

export default useCookies;
