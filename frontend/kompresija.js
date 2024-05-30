const actionDivMera = document.getElementById("actionDivMera");
const selektIzlaz = document.getElementById("selektIzlaz");
const selektRezolucija = document.getElementById("selektRezolucija");
const selektBitrate = document.getElementById("selektBitrate");
const selektFps = document.getElementById("selektFps");
const selektKoder = document.getElementById("selektKoder");
const okButton = document.getElementById("ok");
const inputVideo1 = document.getElementById("inputVideo1");
const videoPlayer1 = document.getElementById("videoPlayer1");
const stdoutTextarea = document.getElementById("stdout");

actionDivMera.onclick = () => {
  location.href = "mera.html";
};

inputVideo1.onchange = async (e) => {
  const uploadedVideo = Array.from(e.target.files)[0];

  if (uploadedVideo) {
    const objectUrl = URL.createObjectURL(uploadedVideo);
    videoPlayer1.src = objectUrl;

    let fileSizeInBytes = uploadedVideo.size;
    let fileSizeInKilobytes = fileSizeInBytes / 1024;
    let fileSizeInMegabytes = fileSizeInKilobytes / 1024;
    console.log("Veličina fajla: " + fileSizeInBytes + " bajtova");
    console.log(
      "Veličina fajla: " + fileSizeInKilobytes.toFixed(2) + " kilobajta"
    );
    console.log(
      "Veličina fajla: " + fileSizeInMegabytes.toFixed(2) + " megabajta"
    );
    document.getElementById("fileSize").value =
      fileSizeInKilobytes.toFixed(2) + " KB";
  }
};

selektIzlaz.onchange = () => {
  const izlaz = selektIzlaz.value;

  for (let i = 0; i < selektKoder.options.length; i++) {
    let option = selektKoder.options[i];

    if (izlaz === "avi") {
      option.disabled = option.value !== "rawvideo";
    } else if (izlaz === "mpg") {
      option.disabled = option.value !== "mpeg1video";
    }
  }
};

okButton.onclick = async (e) => {
  e.preventDefault();
  const uploadedVideo = inputVideo1.files[0];

  const { name } = uploadedVideo;
  const extension = selektIzlaz.value;
  const coder = selektKoder.value;
  const resolution = selektRezolucija.value;
  const bitrate = selektBitrate.value;
  const fps = selektFps.value;

  const res = await fetch("http://localhost:3005/kompresija", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      extension,
      coder,
      resolution,
      bitrate,
      fps,
    }),
  });

  const response = await res.json();
  const { stdout, stderr } = response;

  stdoutTextarea.value = stdout + stderr;
};
