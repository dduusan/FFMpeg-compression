const actionDivKompresija = document.getElementById("actionDivKompresija");
const selektMera = document.getElementById("selektMera");
const okButton = document.getElementById("ok");
const inputVideo1 = document.getElementById("inputVideo1");
const inputVideo2 = document.getElementById("inputVideo2");
const stdoutTextarea = document.getElementById("stdout");
let video1Width, video1Height, video2Width, video2Height;

actionDivKompresija.onclick = () => {
  location.href = "kompresija.html";
};

inputVideo1.onchange = async (e) => {
  const uploadedVideo = Array.from(e.target.files)[0];
  if (uploadedVideo) {
    const objectUrl = URL.createObjectURL(uploadedVideo);
  }
};

inputVideo2.onchange = async (e) => {
  const uploadedVideo = Array.from(e.target.files)[0];

  if (uploadedVideo) {
    const objectUrl = URL.createObjectURL(uploadedVideo);
  }
};

okButton.onclick = async () => {
  // Provera da li su rezolucije videa jednake
  if (video1Width !== video2Width || video1Height !== video2Height) {
    alert("Rezolucije videa nisu jednake.");
    return;
  }
  const uploadedVideo1 = inputVideo1.files[0];
  const uploadedVideo2 = inputVideo2.files[0];

  const measure = selektMera.value;

  const res = await fetch("http://localhost:3005/poredjenje", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      video1: uploadedVideo1.name,
      video2: uploadedVideo2.name,
      measure,
    }),
  });

  const response = await res.json();
  const { stdout, stderr } = response;

  stdoutTextarea.value = stdout + stderr;
};
