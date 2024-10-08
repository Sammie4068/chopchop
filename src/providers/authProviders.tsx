import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useAuth = () => {
  const queryClient = useQueryClient();

  // This function will always return something, ensuring hooks are not conditionally rendered
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

    return { session: null, user: null, isAdmin: false }; // Ensure it always returns something
  };

  // useQuery is always called here, no conditional returns
  const query = useQuery({
    queryKey: ["authSession"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // Optional: prevent frequent refetching within 5 minutes
  });

  // Attach the onAuthStateChange listener within the query, re-fetching the session when the state changes
  supabase.auth.onAuthStateChange(() => {
    queryClient.invalidateQueries({ queryKey: ["authSession"] });
  });

  return query;
};
