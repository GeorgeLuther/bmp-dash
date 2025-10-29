import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { usePersonnel } from "@/features/account/contexts/PersonnelContext";
import { ReleaseTableView } from "../types/releaseTableView.types";

type Props = {
  open: boolean;
  onClose: () => void;
  tableState: any;
  onSave: (view: Partial<ReleaseTableView>) => Promise<void>;
};

export default function ReleaseSaveViewDialog({
  open,
  onClose,
  tableState,
  onSave,
}: Props) {
  const { personnel } = usePersonnel();
  const userId: string = personnel?.id ?? "";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
    }
  }, [open]);

  const handleSave = async () => {
    if (!name.trim() || !userId || isSaving) return;

    setIsSaving(true); // Disable button
    try {
      await onSave({
        user_id: userId,
        name: name.trim(),
        description: description.trim(),
        view_state: tableState,
      });
      onClose(); // Close only on success
    } catch (error) {
      console.error("Failed to save view:", error);
      // 💡 Idea: show a notification to the user here
      // e.g., toast.error("Could not save view. Please try again.");
    } finally {
      setIsSaving(false); // Re-enable button
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
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!name.trim()}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
