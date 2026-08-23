import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/isp";

type AnyRow = Record<string, any>;

export const useRows = <T = AnyRow>(
  table: string,
  opts?: { select?: string; order?: { column: string; asc?: boolean }; limit?: number }
) =>
  useQuery({
    queryKey: [table, opts?.select, opts?.order?.column, opts?.order?.asc, opts?.limit],
    queryFn: async (): Promise<T[]> => {
      let q = (supabase.from(table as never) as any).select(opts?.select ?? "*");
      if (opts?.order) q = q.order(opts.order.column, { ascending: opts.order.asc ?? false });
      q = q.limit(opts?.limit ?? 1000);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });

export const useSaveRow = (table: string, label = "Record") => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (row: AnyRow) => {
      const { id, ...rest } = row;
      if (id) {
        const { error } = await (supabase.from(table as never) as any).update(rest).eq("id", id);
        if (error) throw error;
        await logActivity("updated", table, id, `${label} updated`);
        return id as string;
      }
      const { data, error } = await (supabase.from(table as never) as any).insert(rest).select("id").single();
      if (error) throw error;
      await logActivity("created", table, data?.id, `${label} created`);
      return data?.id as string;
    },
    onSuccess: () => {
      qc.invalidateQueries();
      toast({ title: `${label} saved` });
    },
    onError: (e: any) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });
};

export const useDeleteRow = (table: string, label = "Record") => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from(table as never) as any).delete().eq("id", id);
      if (error) throw error;
      await logActivity("deleted", table, id, `${label} deleted`);
    },
    onSuccess: () => {
      qc.invalidateQueries();
      toast({ title: `${label} deleted` });
    },
    onError: (e: any) => toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });
};
