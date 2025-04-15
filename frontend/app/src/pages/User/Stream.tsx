import { Box, Container, LinearProgress, styled, Typography, linearProgressClasses, Breadcrumbs, Link, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const getInterpolatedColor = (value: number) => {
  const percent = value / 100;
  if (percent < 0.33) {
    const ratio = percent / 0.33;
    return blendColors("#4caf50", "#ffeb3b", ratio);
  } else if (percent < 0.66) {
    const ratio = (percent - 0.33) / 0.33;
    return blendColors("#ffeb3b", "#ff9800", ratio);
  } else {
    const ratio = (percent - 0.66) / 0.34;
    return blendColors("#ff9800", "#f44336", ratio);
  }
};

const blendColors = (color1: string, color2: string, ratio: number) => {
  const hexToRgb = (hex: string) => {
    const [r, g, b] = hex.match(/\w\w/g)!.map((x: string) => parseInt(x, 16));
    return { r, g, b };
  };

  const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) => `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;

  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const blended = {
    r: Math.round(c1.r + (c2.r - c1.r) * ratio),
    g: Math.round(c1.g + (c2.g - c1.g) * ratio),
    b: Math.round(c1.b + (c2.b - c1.b) * ratio),
  };

  return rgbToHex(blended);
};

const ColoredLinearProgress = styled(LinearProgress)(({ value }) => {
  const color = getInterpolatedColor(value ?? 0);

  return {
    height: 14,
    borderRadius: 7,
    [`& .${linearProgressClasses.bar}`]: {
      backgroundColor: color,
      borderRadius: 7,
      transition: "background-color 0.3s ease",
    },
  };
});

const UserStream = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { device } = useParams();
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const interval = setInterval(() => {
    setCodeLines((prev) => {
      const newLines = [...prev, `> Line ${prev.length + 1} of output code`];
      return newLines.slice(-100);
    });
  }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [codeLines]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => (oldProgress >= 100 ? 0 : oldProgress + 1));
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Container sx={{ padding: "0px", margin: "0px", marginTop: "20px", marginBottom: "20px" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" onClick={() => navigate("/user/home")}>
          Home
        </Link>
        <Typography color="text.primary">Stream</Typography>
      </Breadcrumbs>
      <h1>Stream</h1>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4, width: "96vw", marginTop: 2 }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 640,
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
          }}>
          <Box sx={{ width: "100%", height: 360, backgroundColor: "#000" }}>
            <video autoPlay muted style={{ width: "100%", height: "100%", objectFit: "cover" }} src="https://www.w3schools.com/html/mov_bbb.mp4" />
          </Box>

          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="body2" gutterBottom>
              Processing: {progress}%
            </Typography>
            <ColoredLinearProgress variant="determinate" value={progress} />
          </Box>
        </Box>
        <Paper
          elevation={3}
          sx={{
            height: "435px",
            width: 600,
            overflowY: "auto",
            backgroundColor: "#0d1117",
            color: "#d1d5da",
            padding: 2,
            fontFamily: "monospace",
          }}
          ref={containerRef}>
          {codeLines.map((line, index) => (
            <Typography key={index} variant="body2">
              {line}
            </Typography>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default UserStream;
