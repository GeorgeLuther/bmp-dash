// // ShapeLibraryDrawer.tsx
// import * as React from "react";
// import {
//   Box,
//   Paper,
//   Slide,
//   Stack,
//   Typography,
//   IconButton,
//   alpha,
// } from "@mui/material";
// import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
// import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// type Props = {
//   open: boolean;
//   onToggle: () => void; // click the peek to open/close
//   onClose: () => void; // close button in panel
//   height?: number; // panel height when open
// };

// export default function ShapeLibraryDrawer({
//   open,
//   onToggle,
//   onClose,
//   height = 260,
// }: Props) {
//   return (
//     // Inside page container -> auto-aligns with Toolpad content (mini/open sidebar)
//     <Box
//       sx={{
//         position: "absolute",
//         left: 0,
//         right: 0,
//         bottom: 0,
//         zIndex: (t) => t.zIndex.drawer - 1, // sidebar stays above
//         pointerEvents: "none", // only panel/peek capture events
//       }}
//     >
//       {/* Peek bar (visible when closed) */}
//       {!open && (
//         <Box sx={{ display: "flex", justifyContent: "center", mb: 0.75 }}>
//           <Paper
//             role="button"
//             onClick={onToggle}
//             elevation={3}
//             sx={{
//               pointerEvents: "auto",
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 1,
//               px: 1.25,
//               height: 28,
//               borderRadius: 14,
//               bgcolor: "background.paper",
//               border: (t) => `1px solid ${alpha(t.palette.divider, 0.8)}`,
//             }}
//           >
//             <Typography variant="caption" sx={{ lineHeight: 1 }}>
//               Shapes Library
//             </Typography>
//             <ExpandLessRoundedIcon fontSize="small" />
//           </Paper>
//         </Box>
//       )}

//       {/* Slide-up panel */}
//       <Slide in={open} direction="up" mountOnEnter unmountOnExit>
//         <Paper
//           elevation={6}
//           sx={{
//             pointerEvents: "auto",
//             height,
//             borderTopLeftRadius: 12,
//             borderTopRightRadius: 12,
//             borderTop: (t) => `1px solid ${alpha(t.palette.divider, 0.8)}`,
//             bgcolor: "background.paper",
//             overflow: "hidden",
//           }}
//         >
//           <Stack direction="row" alignItems="center" sx={{ px: 1, py: 0.5 }}>
//             <IconButton size="small" onClick={onToggle}>
//               <ExpandMoreRoundedIcon />
//             </IconButton>
//             <Typography variant="subtitle2" sx={{ ml: 0.5, flex: 1 }}>
//               Shapes Library
//             </Typography>
//             <IconButton size="small" onClick={onClose}>
//               <CloseRoundedIcon />
//             </IconButton>
//           </Stack>

//           {/* panel body stub */}
//           <Box sx={{ px: 2, py: 1, color: "text.secondary" }}>
//             <Typography variant="body2">Panel content stub…</Typography>
//           </Box>
//         </Paper>
//       </Slide>
//     </Box>
//   );
// }
