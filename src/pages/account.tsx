import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, IconButton, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ProfileTab from "@/components/UserInfo/ProfileTab"; // Adjust the import path as needed
const TABS = ["Profile", "Training", "Operations", "Employment", "Settings"];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box p={3}>
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 3 }}
      >
        {TABS.map((label) => (
          <Tab key={label} label={label} disabled={label !== "Profile"} />
        ))}
      </Tabs>

      {activeTab === 0 && <ProfileTab />}
    </Box>
  );
}
