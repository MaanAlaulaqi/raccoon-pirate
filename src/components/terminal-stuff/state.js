let visible = false;
let commandHistory = [];
let historyIndex = -1;

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

export function saveState(outputHTML, height) {
  localStorage.setItem("raccoonTerminalVisible", visible ? "1" : "0");
  localStorage.setItem("raccoonTerminalOutput", outputHTML);
  localStorage.setItem("raccoonTerminalHistory", JSON.stringify(commandHistory));
  if (height) localStorage.setItem("terminalHeight", height);
}

export function restoreState(terminal, output) {
  const savedVisible = localStorage.getItem("raccoonTerminalVisible");
  const savedOutput = localStorage.getItem("raccoonTerminalOutput");
  const savedHistory = localStorage.getItem("raccoonTerminalHistory");
  const savedHeight = localStorage.getItem("terminalHeight");

  visible = savedVisible === "1";
  terminal.style.display = visible ? "block" : "none";
  if (savedOutput) output.innerHTML = savedOutput;
  if (savedHistory) commandHistory = JSON.parse(savedHistory);
  if (savedHeight) terminal.style.height = savedHeight;
}
