import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
OrderItemListItem;
OrderListItem;
import OrderItemListItem from "@/components/OrderItem";
import OrderListItem from "@/components/OrderList";
import { useGetOrderDetails } from "@/providers/ordersProviders";
import { updateOrderSubscription } from "@/providers/subscribers";

const OrderDetailScreen = () => {
  const { id: idStr } = useLocalSearchParams();

  const id = parseFloat(typeof idStr === "string" ? idStr : idStr[0]);

  const { data: order, isLoading, error } = useGetOrderDetails(id);
  updateOrderSubscription(id);

  if (!order) return <Text>{`Product ${idStr} not found`}</Text>;
  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Failed to fetch {`${idStr}`}</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />
      <OrderListItem order={order} />
      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    gap: 10,
  },
});

export default OrderDetailScreen;
