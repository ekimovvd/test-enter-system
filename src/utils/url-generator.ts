export enum API_ROUTE {
  login = "/login",
  loginByToken = "/loginByToken",
  list = "/subscription/logs/list",
}

interface UrlGenerator {
  login: () => string;
  loginByToken: () => string;
  list: () => string;
}

const BASE_URL = process.env.VUE_APP_BASE_URL;

export function urlGenerator(): UrlGenerator {
  const login = (): string => {
    return `${BASE_URL}${API_ROUTE.login}`;
  };

  const loginByToken = (): string => {
    return `${BASE_URL}${API_ROUTE.loginByToken}`;
  };

  const list = (): string => {
    return `${BASE_URL}${API_ROUTE.list}`;
  };

  return {
    login,
    loginByToken,
    list,
  };
}
