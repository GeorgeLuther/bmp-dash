// src/features/scheduling/releaseTable/components/ReleaseSaveViewDialog.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import useUser from "@/features/auth/user/useUser";
import type {
  ReleaseTableView,
  ViewState,
} from "../types/releaseTableView.types";
type Props = {
  open: boolean;
  onClose: () => void;
  tableState: ViewState; // <- accept the slim controlled slice
  onSave: (view: Partial<ReleaseTableView>) => Promise<void>;
};

export default function ReleaseSaveViewDialog({
  open,
  onClose,
  tableState,
  onSave,
}: Props) {
  const { user, status } = useUser();
  const userId = user?.personnel_id ?? "";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setIsSaving(false);
    }
  }, [open]);

  const canSave = !!name.trim() && !!userId && status === "ready" && !isSaving;

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      await onSave({
        user_id: userId,
        name: name.trim(),
        description: description.trim(),
        view_state: tableState, // already normalized
      });
      onClose();
    } catch (err) {
      console.error("Failed to save view:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Save Current View</DialogTitle>
      <DialogContent>
        <TextField
          label="View Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          minRows={2}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={!canSave}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
