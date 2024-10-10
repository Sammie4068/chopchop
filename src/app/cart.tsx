import Button from "@/components/Button";
import CartListItem from "@/components/cartListItem";
import { useCart } from "@/providers/cartProvider";
import { StatusBar } from "expo-status-bar";

import { FlatList, Platform, Text, View } from "react-native";

export default function CartScreen() {
  const { items, total, checkout } = useCart();

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ padding: 10, gap: 10 }}
      />

      <Text style={{ marginTop: "auto", fontSize: 20, fontWeight: "500" }}>
        Total: NGN{total}
      </Text>
      <Button text="Checkout" onPress={checkout} />

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
