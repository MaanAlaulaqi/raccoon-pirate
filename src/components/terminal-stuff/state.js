let visible = false;
let commandHistory = [];
let historyIndex = -1;
const OUTPUT_KEY = "raccoonTerminalOutputText";

export function getState() {
  return { visible, commandHistory, historyIndex };
}

export function toggleVisibility() {
  visible = !visible;
  return visible;
}

export function setVisible(val) {
  visible = val;
}

export function pushHistory(command) {
  commandHistory.push(command);
  historyIndex = commandHistory.length;
}

export function getHistory(index) {
  return commandHistory[index] || "";
}

export function updateHistoryIndex(delta) {
  historyIndex = Math.max(0, Math.min(commandHistory.length, historyIndex + delta));
  return historyIndex;
}

export function saveState(outputText, height) {
  localStorage.setItem("raccoonTerminalVisible", visible ? "1" : "0");
  localStorage.setItem(OUTPUT_KEY, outputText);
  localStorage.setItem("raccoonTerminalHistory", JSON.stringify(commandHistory));
  if (height) {
    localStorage.setItem("terminalHeight", height);
  }
}

export function restoreState(terminal, output) {
  // Discard the old HTML format without inserting it into the document.
  localStorage.removeItem("raccoonTerminalOutput");
  
  const savedVisible = localStorage.getItem("raccoonTerminalVisible");
  const savedOutput = localStorage.getItem(OUTPUT_KEY);
  const savedHistory = localStorage.getItem("raccoonTerminalHistory");
  const savedHeight = localStorage.getItem("terminalHeight");

  visible = savedVisible === "1";
  terminal.style.display = visible ? "block" : "none";

  if (savedOutput !== null) {
    output.textContent = savedOutput;
  }

  if (savedHistory) {
    try {
      const parsedHistory = JSON.parse(savedHistory);

      commandHistory = Array.isArray(parsedHistory)
        ? parsedHistory.filter((entry) => typeof entry === "string")
        : [];
    } catch {
      commandHistory = [];
    }
  }

  historyIndex = commandHistory.length;

  if (savedHeight) {
    terminal.style.height = savedHeight;
  }
}