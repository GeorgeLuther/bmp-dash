import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Chip,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ReadOrEditField from "@/features/account/UserInfo/ReadOrEditField";
import { usePersonnel } from "@/features/account/contexts/PersonnelContext";
import { supabase } from "@/supabase/client";

type Props = {
  editable: boolean;
};

export default function ProfileDetails({ editable }: Props) {
  const {
    personnel,
    roles: userRoles,
    departments: userDepartments,
  } = usePersonnel();

  const [form, setForm] = useState({
    first_name: "",
    preferred_name: "",
    last_name: "",
  });
  const [emails, setEmails] = useState<string[]>([]);
  const skills = ["TIG Welding", "Brake Setup", "Quality Audit"]; // placeholder

  useEffect(() => {
    if (!personnel) return;

    setForm({
      first_name: personnel.first_name ?? "",
      preferred_name: personnel.preferred_name ?? "",
      last_name: personnel.last_name ?? "",
    });

    supabase
      .from("personnel_emails")
      .select("address")
      .eq("personnel_id", personnel.id)
      .then(({ data }) => {
        if (data) setEmails(data.map((e) => e.address));
      });
  }, [personnel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!personnel) return;
    const { error } = await supabase
      .from("personnel")
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        preferred_name: form.preferred_name,
      })
      .eq("id", personnel.id);

    if (error) {
      console.error("Failed to update:", error);
      alert("Save failed.");
    } else {
      alert("Saved.");
    }
  };

  return (
    <Box>
      <Stack spacing={2}>
        {/* Name Fields */}
        <Stack direction="row" spacing={2}>
          <ReadOrEditField
            label="First Name"
            name="first_name"
            value={form.first_name}
            editable={editable}
            onChange={handleChange}
          />
          <ReadOrEditField
            label="Preferred Name"
            name="preferred_name"
            value={form.preferred_name}
            editable={editable}
            onChange={handleChange}
          />
          <ReadOrEditField
            label="Last Name"
            name="last_name"
            value={form.last_name}
            editable={editable}
            onChange={handleChange}
          />
        </Stack>

        {/* Emails */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Email Addresses
          </Typography>
          <List dense disablePadding>
            {emails.map((email) => (
              <ListItem key={email} disablePadding>
                <ListItemText primary={email} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Roles */}
        <Box>
          <Typography variant="subtitle1">Roles</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" my={1}>
            {userRoles.map((r) => (
              <Chip
                key={r.role_id}
                label={r.role_label}
                variant={r.involvement_id === "primary" ? "filled" : "outlined"}
                size="small"
              />
            ))}
          </Stack>
        </Box>

        {/* Departments */}
        <Box>
          <Typography variant="subtitle1">Departments</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" my={1}>
            {userDepartments.map((d) => (
              <Chip key={d.department_id} label={d.department_label} />
            ))}
          </Stack>
        </Box>

        {/* Skills */}
        <Box>
          <Typography variant="subtitle1">Skills</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" my={1}>
            {skills.map((skill) => (
              <Chip key={skill} label={skill} variant="outlined" />
            ))}
          </Stack>
        </Box>

        {/* Save button */}
        {editable && (
          <Box textAlign="right" mt={2}>
            <Button variant="contained" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
