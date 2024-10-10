import { defaultPizzaImage } from "@/components/ProductList";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { useGetProductById } from "@/providers/authProviders";
import { useCart } from "@/providers/cartProvider";
import { PizzaSize } from "@/types";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

export default function ProductDetailsScreen() {
  const { id: idStr } = useLocalSearchParams();
  const id = parseFloat(typeof idStr === "string" ? idStr : idStr?.[0]);

  const { data: product, error, isLoading } = useGetProductById(id);

  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

  const { addItem } = useCart();
  const router = useRouter();

  if (!product) return;
  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Failed to fetch {idStr}</Text>;

  function addToCart() {
    if (!product) return;
    addItem(product, selectedSize);
    router.push("/cart");
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />
      <Stack.Screen
        options={{
          title: "Menu",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <RemoteImage
        path={product?.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}> {product.name}</Text>
      <Text style={styles.price}>NGN {product.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  size: {
    backgroundColor: "gainsboro",
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "500",
  },
});
