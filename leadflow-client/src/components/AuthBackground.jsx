import { Box } from "@mui/material";

const AuthBackground = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: `
          radial-gradient(800px circle at 10% 10%, rgba(0, 120, 255, 0.15), transparent 40%),
          radial-gradient(600px circle at 90% 20%, rgba(0, 255, 200, 0.12), transparent 45%),
          radial-gradient(700px circle at 50% 90%, rgba(120, 0, 255, 0.15), transparent 45%),
          linear-gradient(135deg, #0b0f19, #0e1525, #0b0f19)
        `,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Glow shapes */}
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(0, 140, 255, 0.25)",
          filter: "blur(160px)",
          top: -120,
          left: -120,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "rgba(0, 255, 180, 0.22)",
          filter: "blur(160px)",
          top: "20%",
          right: -140,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(140, 0, 255, 0.22)",
          filter: "blur(180px)",
          bottom: -160,
          left: "30%",
        }}
      />

      {/* Content above background */}
      <Box sx={{ position: "relative", zIndex: 10 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AuthBackground;
