import { Text, FlatList, ActivityIndicator } from "react-native";
import ProductList from "@components/ProductList";
import { useGetProducts } from "@/providers/authProviders";

export default function MenuScreen() {
  const { data, error, isLoading } = useGetProducts();
  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Failed to fetch data</Text>;
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ProductList product={item} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}
