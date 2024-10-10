import OrderListItem from "@/components/OrderList";
import { useGetOrders } from "@/providers/ordersProviders";
import { orderSubscription } from "@/providers/subscribers";
import { ActivityIndicator } from "react-native";
import { Text, FlatList } from "react-native";

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useGetOrders({ archived: false });
  orderSubscription();
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
