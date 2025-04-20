import { Box, Container, LinearProgress, styled, Typography, linearProgressClasses, Breadcrumbs, Link, Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const getInterpolatedColor = (value: number) => {
  const percent = value / 100;
  if (percent < 0.33) {
    const ratio = percent / 0.33;
    return blendColors("#f44336", "#ff9800", ratio);
  } else if (percent < 0.66) {
    const ratio = (percent - 0.33) / 0.33;
    return blendColors("#ff9800", "#ffeb3b", ratio);
  } else {
    const ratio = (percent - 0.66) / 0.34;
    return blendColors("#ffeb3b", "#4caf50", ratio);
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
  const [sensorImage, setSensorImage] = useState<string>("");

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [codeLines]);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (device && token) {
      const ws = new WebSocket(`ws://localhost:8000/user/ws?token=${token}&device=${device}`);

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event);
      };

      ws.onmessage = (event) => {
        try {
          const data: any = JSON.parse(event.data);
            setCodeLines((prev) =>
            [
              ...prev,
              `Event: ${data.event_id}`,
              `Timestamp: ${data.timestamp}`,
              `Speed: ${data.speed} km/h`,
              `Status: ${data.status}`,
              `Type: ${data.event_type}`,
              `Confidence: ${(data.confidence * 100).toFixed(2)}%`,
              `----------------------------------------`,
            ].slice(-100)
            );
          if (data["image_base64"]) {
            const imageUrl = `data:image/png;base64,${data["image_base64"]}`;
            setSensorImage(imageUrl);
          }
          if (data.confidence !== undefined) {
            setProgress(Math.round(data.confidence * 100));
          }
        } catch (e) {
          setCodeLines((prev) => [...prev, event.data].slice(-100));
        }
      };

      return () => {
        if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    }
  }, [device]);

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
            {sensorImage ? (
              <img src={sensorImage} alt="Sensor" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#444",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Typography variant="h6" color="#fff">
                  Waiting for sensor image...
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="body2" gutterBottom>
              Confidence: {progress}%
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
