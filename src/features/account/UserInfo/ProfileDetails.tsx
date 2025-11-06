import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ReadOrEditField from "@/features/account/UserInfo/ReadOrEditField";
import useUser from "@/features/auth/user/useUser";
import { supabase } from "@/supabase/client";

type Props = { editable: boolean };

export default function ProfileDetails({ editable }: Props) {
  const { user, status } = useUser();

  // derive arrays safely from user context
  const userEmails = useMemo(
    () => (user?.emails ?? []).map((e) => e.address),
    [user?.emails]
  );
  const userRoles = user?.roles ?? [];
  const userDepartments = user?.departments ?? [];

  const [form, setForm] = useState({
    first_name: "",
    preferred_name: "",
    last_name: "",
  });

  // prime form when user loads
  useEffect(() => {
    if (!user) return;
    setForm({
      first_name: user.first_name ?? "",
      preferred_name: user.preferred_name ?? "",
      last_name: user.last_name ?? "",
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.personnel_id) return;
    const { error } = await supabase
      .from("personnel")
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        preferred_name: form.preferred_name,
      })
      .eq("id", user.personnel_id);

    if (error) {
      console.error("Failed to update:", error);
      alert("Save failed.");
    } else {
      alert("Saved.");
    }
  };

  // simple gates
  if (status === "loading") {
    return <Typography variant="body2">Loading profile…</Typography>;
  }
  if (status === "forbidden") {
    return <Typography variant="body2">No profile available.</Typography>;
  }

  return (
    <Box>
      <Stack spacing={2}>
        {/* Name fields */}
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
            {userEmails.map((email) => (
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
              <Chip
                key={d.department_id}
                label={d.department_label}
                size="small"
              />
            ))}
          </Stack>
        </Box>

        {/* Skills placeholder */}
        <Box>
          <Typography variant="subtitle1">Skills</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" my={1}>
            {["TIG Welding", "Brake Setup", "Quality Audit"].map((s) => (
              <Chip key={s} label={s} variant="outlined" size="small" />
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
