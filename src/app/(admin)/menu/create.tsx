import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductList";
import Colors from "@/constants/Colors";
import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";

export default function CreateProductScreen() {
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
  });

  const [errors, setErrors] = useState("");
  const [image, setImage] = useState<string | null>(null);

  function resetField() {
    setNewItem({ name: "", price: "" });
  }

  function onCreate() {
    if (!validateInput()) return;

    console.warn("Created:", newItem);
    resetField();
  }

  function validateInput() {
    setErrors("");
    if (!newItem.name) {
      setErrors("Name is required");
      return false;
    }
    if (!newItem.price) {
      setErrors("Price is required");
      return false;
    }
    if (isNaN(parseFloat(newItem.price))) {
      setErrors("Price must be a number");
      return false;
    }
    return true;
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Create Dish" }} />
      <Image
        source={{ uri: image || defaultPizzaImage }}
        style={styles.image}
      />
      <Text style={styles.textButton} onPress={pickImage}>
        Select an Image
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={newItem.name}
        placeholder="Name"
        style={styles.input}
        onChangeText={(text) => setNewItem({ ...newItem, name: text })}
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        placeholder="1000"
        style={styles.input}
        keyboardType="numeric"
        value={newItem.price}
        onChangeText={(price) => setNewItem({ ...newItem, price })}
      />
      <Text style={{ color: "red" }}>{errors}</Text>
      <Button text="Create" onPress={onCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
});
