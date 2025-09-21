import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import APIClient from "../services/api-client";
import * as nanocurrency from "nanocurrency";

interface Wallet {
  encryptedSeed: string;
  iv: string;
  salt: string;
  publicAddress: string;
}

interface ContextProps {
  wallet: Wallet | null;
  password: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  setPassword: (password: string) => void;
  clearPassword: () => void;
  decryptWallet: () => Promise<string | null>;
  createWallet: (seed: string) => Promise<Wallet | null>;
}

const WalletContext = createContext<ContextProps>({} as ContextProps);

export const useWallet = () => useContext(WalletContext);

const getWalletClient = new APIClient<Wallet>("/wallet", {
  withCredentials: true,
});

const postWalletClient = new APIClient<Wallet>("/wallet", {
  withCredentials: true,
});

interface Props {
  children: React.ReactNode;
}

const WalletProvider = ({ children }: Props) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(["walletPassword"]);

  let password = cookies.walletPassword || null;

  const setPassword = (newPassword: string) => {
    setCookie("walletPassword", newPassword, {
      path: "/",
      secure: true,
      sameSite: "strict",
      maxAge: 36000, // 1 hour
    });
    password = newPassword;
  };

  const clearPassword = () => {
    removeCookie("walletPassword", { path: "/" });
  };

  const decryptWallet = () => decryptWalletFunction(wallet, password);

  const createWallet = (seed: string) => createWalletFunction(seed, password);

  const fetchWallet = () =>
    fetchWalletFunction(setWallet, setIsLoading, setError);

  useEffect(() => {
    fetchWallet();
  }, []);

  const contextValue: ContextProps = {
    wallet,
    password,
    isLoading,
    error,
    refetch: fetchWallet,
    setPassword,
    clearPassword,
    decryptWallet,
    createWallet,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

// Separated wallet functions
const fetchWalletFunction = async (
  setWallet: (wallet: Wallet | null) => void,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) => {
  try {
    setIsLoading(true);
    setError(null);
    const response = await getWalletClient.get();
    setWallet(response);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to fetch wallet");
  } finally {
    setIsLoading(false);
  }
};

const createWalletFunction = async (
  seed: string,
  pwd: string
): Promise<Wallet | null> => {
  const keyPair = nanocurrency.deriveSecretKey(seed, 0);
  const publicKey = nanocurrency.derivePublicKey(keyPair);
  const address = nanocurrency.deriveAddress(publicKey);

  const enc = new TextEncoder();
  const seedBytes = enc.encode(seed);
  const pwdBytes = enc.encode(pwd);

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    pwdBytes,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const salt = crypto.getRandomValues(new Uint8Array(16));

  const key = await window.crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    seedBytes
  );

  const wallet: Wallet = {
    publicAddress: address,
    encryptedSeed: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt)),
  };

  await postWalletClient.post(wallet);

  return wallet;
};

const base64ToBuf = (s: string) =>
  Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

const decryptWalletFunction = async (
  wallet: Wallet | null,
  password: string | null
): Promise<string | null> => {
  if (!wallet || !password) {
    return null;
  }

  try {
    // Convert hex strings to Uint8Arrays
    const salt = base64ToBuf(wallet.salt);
    const iv = base64ToBuf(wallet.iv);
    const encryptedData = base64ToBuf(wallet.encryptedSeed);

    // Derive key from password and salt
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    // Decrypt the seed
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

export default WalletProvider;
