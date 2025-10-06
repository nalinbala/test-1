const frameCount = 8; // Match the number of images you actually have

const currentFrame = (index) =>
  `frames/frame_${index.toString().padStart(4, "0")}.jpg`;

const images = [];
const canvas = document.getElementById("seq-canvas");
const context = canvas.getContext("2d");
const weightText = document.getElementById("weight-text");

canvas.width = 1702;
canvas.height = 1550;

// 👇 Array of texts to show on the right side
const textArray = [
  "2010 228 deaths.",
  "2011 287 deaths.",
  "2012 249 deaths.",
  "2013 231 deaths.",
  "2014 259 deaths.",
  "2015 432 deaths.",
  "2019 656 deaths.",
  "2020 620 deaths.",
];

const preloadImages = () => {
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }
};

function render(index) {
  const img = images[index];
  if (!img || !img.complete) return;

  const canvasAspect = canvas.width / canvas.height;
  const imgAspect = img.width / img.height;

  let drawWidth, drawHeight;

  if (imgAspect > canvasAspect) {
    drawWidth = canvas.width;
    drawHeight = canvas.width / imgAspect;
  } else {
    drawHeight = canvas.height;
    drawWidth = canvas.height * imgAspect;
  }

  const x = (canvas.width - drawWidth) / 2;
  const y = (canvas.height - drawHeight) / 2;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, x, y, drawWidth, drawHeight);
}

window.addEventListener("load", () => {
  preloadImages();

  images[0].onload = () => render(0);

  const scrollObj = { frame: 0 };

  gsap.to(scrollObj, {
    frame: frameCount - 1,
    snap: { snapTo: 1, duration: 0.1 },
    ease: "none",
    scrollTrigger: {
      trigger: ".pin-sequence",
      start: "top top",
      end: "+=" + frameCount * 500, // gives smoother scroll length

      scrub: true,
      pin: true,
      anticipatePin: 1,
    },
    onUpdate: () => {
      const current = Math.round(scrollObj.frame);
      render(current); // 👇 Update and format text from array

      if (textArray[current]) {
        const fullText = textArray[current];
        // Regex to split the year (first 4 digits) from the rest of the text
        const match = fullText.match(/^(\d{4})\s*(.*)$/);

        if (match) {
          const year = match[1]; // e.g., "2019"
          const count = match[2]; // e.g., "656 deaths."

          // Construct the HTML with the required classes and structure
          weightText.innerHTML = `
                      <span class="data-year">${year}</span>
                      <span class="data-count">${count}</span>
                  `;
        } else {
          // Fallback if text doesn't match the expected format
          weightText.textContent = fullText;
        }
      }
    },
  });
});
