export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch {
    return null;
  }
};

export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    name:
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      decoded.name ||
      "User",
    email:
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
      decoded.email ||
      "",
    id:
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      decoded.sub ||
      null,
  };
};

export const persistAuth = (token) => {
  localStorage.setItem("token", token);
  const user = getUserFromToken(token);
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  return user;
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(localStorage.getItem("token"));
