import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./authProviders";

export const useGetOrders = ({ archived = false }) => {
  const statuses = archived ? ["Delivered"] : ["New", "Cooking", "Delivering"];

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .in("status", statuses);
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
      .eq("user_id", id);
    if (error) throw new Error(error.message);
    return data;
  };

  return useQuery({
    queryKey: ["orders", { userId: id }],
    queryFn: fetchOrdersById,
  });
};
