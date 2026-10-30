import {
  getCommandResponse,
  isAsyncCommand,
  runAsyncCommand,
  commands,
} from "./commands.js";

import {
  getState,
  toggleVisibility,
  setVisible,
  pushHistory,
  getHistory,
  updateHistoryIndex,
  saveState,
  restoreState,
} from "./state.js";

// Restore theme on load
document.documentElement.dataset.theme =
  localStorage.getItem("raccoonTheme") || "dark";

document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("raccoon-terminal");
  const output = document.getElementById("terminal-output");
  const input = document.getElementById("terminal-input");
  const handle = document.getElementById("terminal-resize-handle");

  const prompt = "raccoon@interperter:~$ ";

  // Add text, never interpret command input or responses as HTML.
  // The existing whitespace-pre-wrap CSS displays newline characters.
  const appendLine = (text) => {
    output.append(
      document.createTextNode(`\n${String(text ?? "")}`)
    );
  };

  const persistState = () => {
    saveState(output.textContent, terminal.style.height);
  };

  const handleTerminalCommand = async (inputVal) => {
    // Trimming normalizes whitespace. Safe rendering happens in appendLine.
    const command = inputVal.trim();
    pushHistory(command);

    if (commands[command] === "__CLEAR__") {
      output.textContent = prompt;
    } else {
      appendLine(`> ${command}`);

      const response = isAsyncCommand(command)
        ? await runAsyncCommand(command)
        : getCommandResponse(command);

      appendLine(response);
      appendLine(prompt);
    }

    output.scrollTop = output.scrollHeight;
    persistState();
  };

  // Resize logic
  let isResizing = false;
  let startY = 0;
  let startHeight = 0;

  if (handle && terminal) {
    handle.addEventListener("mousedown", (e) => {
      isResizing = true;
      startY = e.clientY;
      startHeight = terminal.offsetHeight;
      document.body.style.userSelect = "none";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isResizing) return;

      const dy = e.clientY - startY;
      let newHeight = startHeight - dy;
      const minHeight = window.innerHeight * 0.05;
      const maxHeight = window.innerHeight * 0.9;

      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
      terminal.style.height = `${newHeight}px`;
    });

    window.addEventListener("mouseup", () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.userSelect = "";
        persistState();
      }
    });
  }

  // Global keybindings
  window.addEventListener("keydown", (e) => {
    const state = getState();

    if (
      e.code === "Backquote" &&
      !e.shiftKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      e.preventDefault();

      const visible = toggleVisibility();
      terminal.style.display = visible ? "block" : "none";

      if (visible) input?.focus();
      persistState();
    }

    if (e.code === "Escape" && state.visible) {
      setVisible(false);
      terminal.style.display = "none";
      persistState();
    }

    if (state.visible && e.target === input) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const idx = updateHistoryIndex(-1);
        input.value = getHistory(idx);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const idx = updateHistoryIndex(1);
        input.value = getHistory(idx);
      }
    }
  });

  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleTerminalCommand(input.value);
      input.value = "";
    }
  });

  // Restore before observing, so initialization cannot overwrite saved output.
  output.textContent = prompt;
  restoreState(terminal, output);

  // Observer fallback
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      saveState(output.textContent, `${entry.contentRect.height}px`);
    }
  });

  observer.observe(terminal);
});