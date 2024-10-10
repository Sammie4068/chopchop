import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./authProviders";
import { InsertTables, Tables, UpdateTables } from "@/types";

export const useGetOrders = ({ archived = false }) => {
  const statuses = archived ? ["Delivered"] : ["New", "Cooking", "Delivering"];

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .in("status", statuses)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  };

  return useQuery({
    queryKey: ["orders", { archived }],
    queryFn: fetchOrders,
  });
};
export const useGetOrdersById = () => {
  const { data: sessionData, isLoading } = useAuth();
  const id = sessionData?.session?.user.id;

  const fetchOrdersById = async () => {
    if (!id) return null;
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  };

  return useQuery({
    queryKey: ["orders", { userId: id }],
    queryFn: fetchOrdersById,
  });
};

export const useGetOrderDetails = (id: number) => {
  const fetchOrderDetails = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(*))")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  };

  return useQuery({
    queryKey: ["orders", id],
    queryFn: fetchOrderDetails,
  });
};

export const useCreateOrder = () => {
  const { data: sessionData } = useAuth();
  const user_id = sessionData?.session?.user.id;

  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data: InsertTables<"orders">) {
      const { data: newProduct, error } = await supabase
        .from("orders")
        .insert({ ...data, user_id })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      updatedField,
    }: {
      id: number;
      updatedField: UpdateTables<"orders">;
    }) {
      const { data: updatedOrder, error } = await supabase
        .from("orders")
        .update(updatedField)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return updatedOrder;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
  });
};
