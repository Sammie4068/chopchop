import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import Button from "../../components/Button";
import Colors from "../../constants/Colors";
import { Link, Redirect, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/authProviders";

const SignUpScreen = () => {
  const { data: sessionData } = useAuth();

  if (sessionData?.session) {
    return <Redirect href={"/"} />;
  }

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  async function signup() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
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
      <Stack.Screen options={{ title: "Sign up" }} />

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
        onPress={signup}
        disabled={loading}
        text={loading ? "Creating Account..." : "Create account"}
      />
      <Link href="/sign-in" style={styles.textButton}>
        Sign in
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

export default SignUpScreen;
