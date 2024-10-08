import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Button from "../components/Button";
import { Link, Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/authProviders";
import { supabase } from "@/lib/supabase";

const index = () => {
  const { data: sessionData, isLoading } = useAuth();
  if (isLoading) <ActivityIndicator />;

  if (!sessionData?.session) {
    return <Redirect href={"/sign-in"} />;
  }

  if (!sessionData?.isAdmin) {
    return <Redirect href={"/(user)"} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <Stack.Screen options={{ title: "Chop Chop" }} />
      <Link href={"/(user)"} asChild>
        <Button text="User" />
      </Link>
      <Link href={"/(admin)"} asChild>
        <Button text="Admin" />
      </Link>
      <Button
        text="Sign Out"
        onPress={async () => await supabase.auth.signOut()}
      />
    </View>
  );
};

export default index;
