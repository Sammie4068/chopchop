import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const orderSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const orderSub = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    return () => {
      orderSub.unsubscribe();
    };
  });
};

export const updateOrderSubscription = (id: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const updateOrderSub = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["orders", id] });
        }
      )
      .subscribe();

    return () => {
      updateOrderSub.unsubscribe();
    };
  }, []);
};
