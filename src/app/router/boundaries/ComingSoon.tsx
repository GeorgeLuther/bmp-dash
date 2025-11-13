// src/app/router/boundaries/ComingSoon.tsx

// TODO: integrate markdown injector for  documentation and/or something like a progress bar/checklist

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

export interface ComingSoonProps {
  /** Optional title shown as the main heading */
  title?: string;
  /** Optional description shown under the heading */
  description?: string;
  /** Optional list of “teaser” items for what this page will do */
  highlights?: string[];
  /** Optional image/illustration preview */
  imageSrc?: string;
  imageAlt?: string;
  /** Optional link to documentation / spec / process map */
  docsLinkHref?: string;
  docsLinkLabel?: string;
}

/**
 * Generic “Coming soon” teaser card for unfinished modules/routes.
 * - Shows a main heading + description
 * - Can optionally show:
 *   - a preview image
 *   - bullet list of planned features
 *   - a button linking to related documentation
 */
export default function ComingSoon({
  title = "Coming soon",
  description = "We’re still building this part of the app. In the meantime, here’s what you can expect.",
  highlights,
  imageSrc,
  imageAlt,
  docsLinkHref,
  docsLinkLabel = "View related documentation",
}: ComingSoonProps) {
  const hasHighlights = Array.isArray(highlights) && highlights.length > 0;

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 720,
          textAlign: "center",
        }}
        elevation={3}
      >
        <CardContent>
          <Stack spacing={2} alignItems="center">
            {imageSrc && (
              <Box
                component="img"
                src={imageSrc}
                alt={imageAlt || title}
                sx={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            )}

            <ConstructionIcon sx={{ fontSize: 56 }} color="warning" />

            <Typography variant="h4" component="h1">
              {title}
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 520 }}
            >
              {description}
            </Typography>

            {hasHighlights && (
              <Box sx={{ textAlign: "left", width: "100%", maxWidth: 520 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Planned highlights:
                </Typography>
                <List dense disablePadding>
                  {highlights!.map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{ py: 0.25, "&:before": { display: "none" } }}
                    >
                      <ListItemText
                        primaryTypographyProps={{ variant: "body2" }}
                        primary={item}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {docsLinkHref && (
              <Button
                variant="outlined"
                href={docsLinkHref}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1 }}
              >
                {docsLinkLabel}
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
