import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import Button from "../../components/Button";
import Colors from "../../constants/Colors";
import { Link, Redirect, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/authProviders";

const SignInScreen = () => {
  const { data: sessionData } = useAuth();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  if (sessionData?.session) {
    return <Redirect href={"/"} />;
  }

  async function signin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });
    if (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign in" }} />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={user.email}
        onChangeText={(email) => setUser({ ...user, email })}
        placeholder="jon@gmail.com"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={user.password}
        onChangeText={(password) => setUser({ ...user, password })}
        placeholder=""
        style={styles.input}
        secureTextEntry
      />

      <Button
        onPress={signin}
        disabled={loading}
        text={loading ? "Signing In..." : "Sign in"}
      />
      <Link href={"/sign-up"} style={styles.textButton}>
        Create an account
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },
  label: {
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default SignInScreen;
