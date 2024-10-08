import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetProducts = () => {
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) throw new Error(error.message);
    return data;
  };

  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  const fetchSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      return {
        session,
        user: data,
        isAdmin: data.group === "ADMIN",
      };
    }

    return { session: null, user: null, isAdmin: false };
  };

  const query = useQuery({
    queryKey: ["authSession"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000,
  });

  supabase.auth.onAuthStateChange(() => {
    queryClient.invalidateQueries({ queryKey: ["authSession"] });
  });

  return query;
};
