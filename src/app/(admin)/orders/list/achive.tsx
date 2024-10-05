import OrderListItem from "@/components/OrderList";
import orders from "@assets/data/orders";
import { Text, FlatList } from "react-native";

export default function OrdersScreen() {
  return (
    <FlatList
      data={orders}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      renderItem={({ item }) => <OrderListItem order={item} />}
    />
  );
}
