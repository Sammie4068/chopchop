import OrderListItem from "@/components/OrderList";
import { useGetOrders } from "@/providers/ordersProviders";
import { Text, FlatList, ActivityIndicator } from "react-native";

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useGetOrders({ archived: true });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Failed to fetch</Text>;
  return (
    <FlatList
      data={orders}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      renderItem={({ item }) => <OrderListItem order={item} />}
    />
  );
}
