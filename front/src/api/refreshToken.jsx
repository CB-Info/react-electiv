import jwtDecode from "jwt-decode"

export const isAccessTokenExpired = () => {
  try {
    const accessToken = localStorage.getItem("JWT");

    if (!accessToken) {
      return true;
    }
    const decodedToken = jwtDecode(accessToken);

    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= decodedToken.exp;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;
  }
};
