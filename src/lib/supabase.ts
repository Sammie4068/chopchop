import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("Error getting item from SecureStore:", error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("Error setting item in SecureStore:", error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error("Error removing item from SecureStore:", error);
    }
  },
};

const supabaseUrl = "https://dnurwgrsdllgixlvjmsj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRudXJ3Z3JzZGxsZ2l4bHZqbXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgxNDc3MjYsImV4cCI6MjA0MzcyMzcyNn0.ZBUCnntQv4l8goX2z4krqR8KP8Ed0eONT4ikm-gqP8I";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
