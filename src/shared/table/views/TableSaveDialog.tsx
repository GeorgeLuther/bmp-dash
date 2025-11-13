// src/shared/table/views/TableSaveDialog.tsx

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import type { TableViewState, CreateTableViewInput } from "./types";

type Props = {
  open: boolean;
  onClose: () => void;
  tableId: string;
  createdBy: string;
  viewState: TableViewState; // already captured slice
  canManageSystemPresets?: boolean;
  onSave: (input: CreateTableViewInput) => Promise<void>;
};

export default function TableSaveDialog({
  open,
  onClose,
  tableId,
  createdBy,
  viewState,
  canManageSystemPresets = false,
  onSave,
}: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState<string>("");
  const [isGlobal, setIsGlobal] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName("");
    setDesc("");
    setIsGlobal(false);
    setSaving(false);
  }, [open]);

  const canSave = !!name.trim() && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave({
        table_id: tableId,
        created_by: createdBy,
        name: name.trim(),
        description: desc.trim() || null,
        view_state: viewState,
        is_global: isGlobal, // RLS will gate this to admins anyway
        is_locked: isLocked,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Save Current View</DialogTitle>
      <DialogContent>
        <TextField
          label="View name"
          fullWidth
          required
          autoFocus
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          minRows={2}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        {canManageSystemPresets && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isGlobal}
                  onChange={(e) => setIsGlobal(e.target.checked)}
                />
              }
              label="Global preset (visible to everyone)"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isLocked}
                  onChange={(e) => setIsLocked(e.target.checked)}
                />
              }
              label="Locked (only admins can modify)"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={!canSave}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
