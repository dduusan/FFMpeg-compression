import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";
import { execa } from "execa";

const app = express();
app.use(cors());
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let ffmpegResult;

app.post("/poredjenje", async (req, res) => {
  ffmpegResult = null;

  const { video1, video2, measure } = req.body;
  const filePath = path.join(__dirname, "./videos", video1);
  const filePath2 = path.join(__dirname, "./videos", video2);

  let stdout, stderr;

  if (measure === "ssim" || measure === "psnr") {
    const result = await execa("ffmpeg", [
      "-i",
      filePath,
      "-i",
      filePath2,
      "-lavfi",
      measure,
      "-f",
      "null",
      "-",
    ]);
    stdout = result.stdout;
    stderr = result.stderr;
  }

  stdout = stdout.split("\n").slice(-3).join("\n");
  stderr = stderr.split("\n").slice(-3).join("\n");

  return res.json({
    stdout,
    stderr,
  });
});

let ffmpegResult1;
app.post("/kompresija", async (req, res) => {
  ffmpegResult1 = null;

  const { name, extension, coder, resolution, bitrate, fps } = req.body;
  const filePath = path.join(__dirname, "./videos", name);
  let fileNameWithoutExtension = filePath.split(".")[0];

  let stdout, stderr;
  let randomNumber = Math.floor(Math.random() * 10);

  const result = await execa("ffmpeg", [
    "-i",
    filePath,
    "-hide_banner",
    "-c:v",
    coder,
    "-s",
    resolution,
    "-b:v",
    bitrate,
    "-r",
    fps,
    fileNameWithoutExtension +
      `_${resolution}_${bitrate}_${fps}` +
      "." +
      extension,
  ]);
  stdout = result.stdout;
  stderr = result.stderr;

  return res.json({
    stdout,
    stderr,
  });
});

app.get("/provera", (req, res) => {
  if (ffmpegResult1 === null) {
    res.send("Backend jošnije završio.");
  } else {
    res.json(ffmpegResult1);
    console.log(ffmpegResult1);
  }
});

app.post("/ping", (req, res) => {
  res.send({ msg: "🏓 Pong!" });
});

app.listen(3005, () => {
  console.log(`Server is running!`);
});
