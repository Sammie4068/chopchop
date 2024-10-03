import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import Colors from "@/src/constants/Colors";
import products from "@/assets/data/products";
import ProductList from "@/src/components/ProductList";

export default function MenuScreen() {
  return (
    <View>
      <FlatList
        data={products}
        renderItem={(item) => <ProductList product={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
