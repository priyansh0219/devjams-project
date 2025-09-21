import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import AuthAPIClient from "../services/auth-api-client";
import { useCookies } from "react-cookie";

interface ContextProps {
  signIn: () => Promise<void>;
  signOut: () => void;
  session?: Session;
  loading: boolean;
  isAuthenticated: boolean;
}

const Auth = createContext<ContextProps>({} as ContextProps);

export const useAuth = () => useContext(Auth);

interface Session {
  user: {
    name: string;
    email: string;
    image: string;
    id: string;
    onboardingComplete: boolean;
  };
  expires: string;
}

interface Props {
  children: React.ReactNode;
}

interface CSRF {
  csrfToken: string;
}

const csrfClient = new AuthAPIClient<CSRF>("/csrf", { withCredentials: true });
const sessionClient = new AuthAPIClient<Session>("/session", {
  withCredentials: true,
});

const AuthProvider = ({ children }: Props) => {
  const [csrf, setCsrf] = useState<CSRF | undefined>(undefined);
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // TODO: make sure these two cookie names are correct.
  const [cookies, _setCookies, _removeCookies] = useCookies([
    "authjs.csrf-token",
    "authjs.session-token",
  ]);
  const { data: csrfData, isLoading: csrfLoading } = useQuery({
    queryKey: ["auth_csrfToken", cookies["authjs.csrf-token"]],
    queryFn: csrfClient.get,
    staleTime: ms("24h"),
  });

  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ["auth_session", cookies["authjs.session-token"]],
    queryFn: sessionClient.get,
  });

  useEffect(() => {
    setCsrf(csrfData);
  }, [csrfData]);

  useEffect(() => {
    setSession(sessionData);
  }, [sessionData]);

  useEffect(() => {
    setLoading(csrfLoading || sessionLoading);
  }, [csrfLoading, sessionLoading]);

  const csrfToken = csrf?.csrfToken || "";

  const signIn = async () => {
    let tokenToUse = csrfToken;

    // Check if CSRF token cookie exists, if not fetch it
    if (!cookies["authjs.csrf-token"]) {
      const csrfResponse = await csrfClient.get();
      tokenToUse = csrfResponse?.csrfToken || "";
    }

    execFormReq(tokenToUse, "/api/auth/signin/google", "/LoggedIn");
  };

  const signOut = () => {
    execFormReq(csrfToken, "/api/auth/signout", "/LoggedOut");
  };

  let isAuthenticated = false;
  if (session) isAuthenticated = true;

  const contextValue = {
    signIn: signIn,
    signOut: signOut,
    session: session,
    loading: loading,
    isAuthenticated: isAuthenticated,
  };

  return (
    <>
      <div id='loginFormContainer'></div>
      <Auth.Provider value={contextValue}>{children}</Auth.Provider>
    </>
  );
};

export default AuthProvider;

function execFormReq(
  csrfToken: string,
  endpoint: string,
  callbackEndpoint: string
) {
  const form = document.createElement("form");
  form.action = `${import.meta.env.VITE_BACKEND_URL}${endpoint}`;
  form.method = "POST";

  const csrfInput = document.createElement("input");
  csrfInput.name = "csrfToken";
  csrfInput.type = "hidden";
  csrfInput.value = csrfToken;
  form.append(csrfInput);

  const callbackUrl = document.createElement("input");
  callbackUrl.name = "callbackUrl";
  callbackUrl.type = "hidden";
  callbackUrl.value = `${window.location.protocol}//${window.location.host}${callbackEndpoint}`;
  form.append(callbackUrl);

  const formContainer = document.getElementById("loginFormContainer");
  formContainer?.append(form);

  form.submit();
}
