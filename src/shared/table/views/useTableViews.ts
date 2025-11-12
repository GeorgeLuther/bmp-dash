import { useEffect, useMemo, useState, useCallback } from 'react';
import type {
  TableView,
  CreateTableViewInput,
  UpdateTableViewInput,
} from './types';
import { listViews, createView, updateView, deleteView } from './api';

export default function useTableViews(tableId: string) {
  const [views, setViews] = useState<TableView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await listViews(tableId);
      setViews(rows);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [tableId]);

  useEffect(() => { void load(); }, [load]);

  const createFn = useCallback(async (input: CreateTableViewInput) => {
    try {
      const row = await createView(input);
      setViews((v) => [...v, row]);
      return row;
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const updateFn = useCallback(async (input: UpdateTableViewInput) => {
    try {
      const row = await updateView(input);
      setViews((v) => v.map((x) => (x.id === row.id ? row : x)));
      return row;
    } catch (err) {
      setError(err);
      return null;
    }
  }, []);

  const removeFn = useCallback(async (id: string) => {
    try {
      await deleteView(id);
      setViews((v) => v.filter((x) => x.id !== id));
      return true;
    } catch (err) {
      setError(err);
      return false;
    }
  }, []);

  return useMemo(
    () => ({
      views,
      loading,
      error,
      refresh: load,
      create: createFn,
      update: updateFn,
      remove: removeFn,
    }),
    [views, loading, error, load, createFn, updateFn, removeFn],
  );
}
