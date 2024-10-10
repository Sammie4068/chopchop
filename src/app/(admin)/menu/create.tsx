import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductList";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import {
  useAddProduct,
  useDeleteProduct,
  useGetProductById,
  useUpdateProduct,
} from "@/providers/authProviders";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";
import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import RemoteImage from "@/components/remoteimage";

interface userProps {
  name: string | undefined;
  price: string | undefined;
}

export default function CreateProductScreen() {
  const { id: idStr } = useLocalSearchParams();
  const id = parseFloat(typeof idStr === "string" ? idStr : idStr?.[0]);
  const isUpdating = !!id;

  const [newItem, setNewItem] = useState<userProps>({
    name: "",
    price: "",
  });
  const [errors, setErrors] = useState("");
  const [image, setImage] = useState<string | null | undefined>(null);
  const { mutate: addProduct } = useAddProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { data: productData } = useGetProductById(id);

  const priceInNumber = newItem?.price ? parseFloat(newItem.price) : 0;

  useEffect(() => {
    setNewItem({
      name: productData?.name,
      price: productData?.price.toString(),
    });
    setImage(productData?.image);
  }, [productData]);

  const router = useRouter();

  function resetField() {
    setNewItem({ name: "", price: "" });
  }

  async function onCreate() {
    if (!validateInput()) return;

    const imgPath = await uploadImage();

    addProduct(
      { name: newItem.name, price: priceInNumber, image: imgPath },
      {
        onSuccess: () => {
          resetField();
          router.back();
        },
      }
    );
  }

  async function onUpdate() {
    if (!validateInput()) return;
    const imgPath = await uploadImage();
    updateProduct(
      {
        id,
        name: newItem.name,
        price: priceInNumber,
        image: imgPath,
      },
      {
        onSuccess() {
          resetField();
          router.back();
        },
      }
    );
    resetField();
  }

  function onSubmit() {
    if (isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  }

  function onDelete() {
    deleteProduct(id, {
      onSuccess: () => {
        resetField();
        router.replace("/(admin)");
      },
    });
  }

  function confirmDelete() {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: onDelete,
        },
      ],
      { cancelable: true }
    );
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

  const uploadImage = async () => {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: isUpdating ? "Update Product" : "Create Product",
          headerRight: () =>
            isUpdating ? (
              <Pressable onPress={confirmDelete}>
                {({ pressed }) => (
                  <FontAwesome
                    name="trash"
                    size={25}
                    color={"red"}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            ) : null,
        }}
      />
      <RemoteImage
        path={productData?.image}
        fallback={image ? image : defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
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
      <Button text={isUpdating ? "Update" : "Create"} onPress={onSubmit} />
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
