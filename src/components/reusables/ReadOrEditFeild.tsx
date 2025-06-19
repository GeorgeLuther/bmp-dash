import React from "react";
import { TextField, Theme, TextFieldProps } from "@mui/material";

/**
 * We can omit props that we are controlling directly to avoid conflicts
 * and allow the user to pass through any other valid TextFieldProps.
 */
type ReadOrEditFieldProps = {
  editable: boolean;
} & Omit<TextFieldProps, "variant" | "InputProps" | "sx">;

/**
 * A theme-aware TextField that switches between an editable state and a
 * read-only state that looks like static text but maintains the field's
 * structure and label.
 *
 * @param {ReadOrEditFieldProps} props - The component props.
 * @param {boolean} props.editable - Toggles the editable state of the field.
 */
const ReadOrEditField = ({ editable, ...props }: ReadOrEditFieldProps) => {
  return (
    <TextField
      variant="outlined"
      InputProps={{
        readOnly: !editable,
      }}
      sx={(theme: Theme) => {
        if (editable) {
          // Return default styles when editable
          return {};
        }

        // In read-only mode, define a subtle border and static styles.
        const readOnlyBorderColor = theme.palette.divider;

        return {
          // Group all states to ensure the border color never changes.
          "& .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: readOnlyBorderColor,
            },
          // Ensure the cursor doesn't change to a text input I-beam.
          "& .MuiInputBase-input": {
            cursor: "default",
          },
        };
      }}
      {...props} // Spread the rest of the props (label, value, onChange, etc.)
    />
  );
};

export default ReadOrEditField;
