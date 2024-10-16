import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
OrderItemListItem;
OrderListItem;
import OrderItemListItem from "@/components/OrderItem";
import OrderListItem from "@/components/OrderList";
import { OrderStatusList } from "@/types";
import Colors from "@/constants/Colors";
import {
  useGetOrderDetails,
  useUpdateOrder,
} from "@/providers/ordersProviders";
import { notifyUser } from "@/lib/notifications";

const OrderDetailScreen = () => {
  const { id: idStr } = useLocalSearchParams();

  const id = parseFloat(typeof idStr === "string" ? idStr : idStr[0]);

  const { mutate: updateOrder } = useUpdateOrder();

  const { data: order, isLoading, error } = useGetOrderDetails(id);

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Failed to fetch {idStr}</Text>;
  if (!order) return;

  const updateStatus = async (status: string) => {
    updateOrder({ id, updatedField: { status } });
    if (order) await notifyUser({ ...order, status });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />

      <OrderListItem order={order} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListFooterComponent={() => (
          <>
            <Text style={{ fontWeight: "bold" }}>Status</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => updateStatus(status)}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      order.status === status
                        ? Colors.light.tint
                        : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        order.status === status ? "white" : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
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
