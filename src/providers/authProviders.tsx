import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetProducts = () => {
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  };

  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};

export const useGetProductById = (id: number) => {
  const fetchProductById = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  };

  return useQuery({
    queryKey: ["products", id],
    queryFn: fetchProductById,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data: any) {
      const { name, image, price } = data;
      const { data: newProduct, error } = await supabase
        .from("products")
        .insert({
          name,
          image,
          price,
        })
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(data: any) {
      const { id, name, image, price } = data;
      const { data: updatedProduct, error } = await supabase
        .from("products")
        .update({
          name,
          image,
          price,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return updatedProduct;
    },
    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    async mutationFn(id: number) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    },
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
        isAdmin: data?.group === "ADMIN",
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
