// Define the stages of the boot process
const stages = [
  {
    id: "power",
    title: "Power On",
    description:
      "The system receives power. The CPU is reset and starts executing from a predefined reset vector in firmware (e.g., BIOS/UEFI).",
    memActive: [],
    diskActive: []
  },
  {
    id: "bios",
    title: "BIOS / UEFI",
    description:
      "The firmware (BIOS/UEFI) runs POST (Power-On Self Test), initializes basic hardware, and searches for a bootable device.",
    memActive: ["mem-bios"],
    diskActive: []
  },
  {
    id: "mbr",
    title: "MBR (Master Boot Record)",
    description:
      "The firmware loads the first 512 bytes of the bootable disk into memory. This sector is the MBR and contains bootloader code and partition table.",
    memActive: ["mem-bios"],
    diskActive: ["sector-mbr"]
  },
  {
    id: "bootloader",
    title: "Bootloader",
    description:
      "The bootloader code in the MBR loads a more complex bootloader or the OS kernel from disk into RAM, then passes control to it.",
    memActive: ["mem-bootloader"],
    diskActive: ["sector-mbr"]
  },
  {
    id: "kernel",
    title: "Kernel Initialization",
    description:
      "The kernel sets up memory management, interrupt descriptor tables, device drivers and may switch from real mode to protected/long mode.",
    memActive: ["mem-kernel"],
    diskActive: []
  },
  {
    id: "os",
    title: "OS Running",
    description:
      "User processes are created. System services start, and the system becomes ready for user interaction (login screen, shell, or desktop).",
    memActive: ["mem-kernel", "mem-os"],
    diskActive: []
  }
];

let currentIndex = -1;
let autoPlayId = null;

// Helper to select elements
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

// Get UI elements
const titleEl = $("#stage-title");
const descEl = $("#stage-description");

const btnStart = $("#btn-start");
const btnPrev = $("#btn-prev");
const btnNext = $("#btn-next");
const btnAuto = $("#btn-auto");

// Render a given stage
function renderStage(index) {
  if (index < 0 || index >= stages.length) return;

  currentIndex = index;
  const stage = stages[index];

  // Update title & description
  titleEl.textContent = stage.title;
  descEl.textContent = stage.description;

  // Highlight top boxes
  const boxes = $$(".stage-box");
  boxes.forEach((box) => {
    if (box.dataset.id === stage.id) {
      box.classList.add("active");
    } else {
      box.classList.remove("active");
    }
  });

  // Highlight memory
  const memBlocks = $$(".mem-block");
  memBlocks.forEach((block) => {
    if (stage.memActive.includes(block.id)) {
      block.classList.add("active");
    } else {
      block.classList.remove("active");
    }
  });

  // Highlight disk sectors
  const sectors = $$(".sector");
  sectors.forEach((sector) => {
    if (stage.diskActive.includes(sector.id)) {
      sector.classList.add("active");
    } else {
      sector.classList.remove("active");
    }
  });

  // Enable/disable navigation buttons
  btnPrev.disabled = index === 0;
  btnNext.disabled = index === stages.length - 1;
}

// Navigation functions
function goToNext() {
  if (currentIndex < stages.length - 1) {
    renderStage(currentIndex + 1);
  } else {
    stopAutoPlay();
  }
}

function goToPrev() {
  if (currentIndex > 0) {
    renderStage(currentIndex - 1);
  }
}

// Auto play
function startAutoPlay() {
  if (autoPlayId !== null) return;
  btnAuto.textContent = "Stop Auto";
  autoPlayId = setInterval(() => {
    if (currentIndex >= stages.length - 1) {
      stopAutoPlay();
    } else {
      goToNext();
    }
  }, 2500); // 2.5 seconds per stage
}

function stopAutoPlay() {
  if (autoPlayId !== null) {
    clearInterval(autoPlayId);
    autoPlayId = null;
    btnAuto.textContent = "Auto Play";
  }
}

// Event listeners
btnStart.addEventListener("click", () => {
  // First time: show stage 0 and enable buttons
  renderStage(0);
  btnStart.disabled = true;
  btnAuto.disabled = false;
});

btnNext.addEventListener("click", () => {
  stopAutoPlay();
  goToNext();
});

btnPrev.addEventListener("click", () => {
  stopAutoPlay();
  goToPrev();
});

btnAuto.addEventListener("click", () => {
  if (autoPlayId === null) {
    startAutoPlay();
  } else {
    stopAutoPlay();
  }
});
