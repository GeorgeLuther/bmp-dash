import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { alpha } from "@mui/material/styles";

type ReadOrEditFieldProps = Omit<
  TextFieldProps,
  "onChange" | "value" | "name" | "sx"
> & {
  label: string;
  name: string;
  value: string;
  editable: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: TextFieldProps["sx"];
};

export default function ReadOrEditField({
  label,
  name,
  value,
  editable,
  onChange,
  sx: propSx,
  ...props
}: ReadOrEditFieldProps) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      fullWidth
      variant="outlined"
      {...props}
      InputProps={{ readOnly: !editable }}
      sx={[
        (theme) => {
          if (!editable) {
            // subtle outline for read-only view
            const staticBorderColor = alpha(theme.palette.text.primary, 0.12);

            return {
              // field is unresponsive to interaction, like normal text
              "& .MuiOutlinedInput-input": { cursor: "default" },
              "& .MuiInputLabel-root.Mui-focused": { color: "text.secondary" },
              "& .MuiOutlinedInput-root": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: staticBorderColor,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: `${staticBorderColor} !important`,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: `${staticBorderColor} !important`,
                  borderWidth: "1px !important",
                },
                "&.Mui-focused": {
                  boxShadow: "none !important",
                },
              },
            };
          }
          return {};
        },
        ...(Array.isArray(propSx) ? propSx : [propSx]),
      ]}
    />
  );
}
