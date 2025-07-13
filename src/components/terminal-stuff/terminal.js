import { getCommandResponse, isAsyncCommand, runAsyncCommand, commands } from "./commands.js";
import { getState, toggleVisibility, setVisible, pushHistory, getHistory, updateHistoryIndex, saveState, restoreState } from "./state.js";

// Restore theme on load
document.documentElement.dataset.theme =
  localStorage.getItem("raccoonTheme") || "dark";

document.addEventListener("DOMContentLoaded", () => {
    const terminal = document.getElementById("raccoon-terminal");
    const output = document.getElementById("terminal-output");
    const input = document.getElementById("terminal-input");
    const handle = document.getElementById("terminal-resize-handle");

    const sanitizeInput = (input) => {
        const temp = document.createElement("div");
        temp.innerText = input;
        return temp.innerText.trim();
    };

    const handleTerminalCommand = async (inputVal) => {
        const sanitized = sanitizeInput(inputVal);
        pushHistory(sanitized);

        if (commands[sanitized] === "__CLEAR__") {
            output.innerHTML = "raccoon@interperter:~$ ";
        } else {
            output.innerHTML += `<br>> ${sanitized}`;
            if (isAsyncCommand(sanitized)) {
                const response = await runAsyncCommand(sanitized);
                output.innerHTML += `<br>${response}`;
            } else {
                const response = getCommandResponse(sanitized);
                output.innerHTML += `<br>${response}`;
            }
            output.innerHTML += `<br>raccoon@interperter:~$ `;
        }

        output.scrollTop = output.scrollHeight;
        saveState(output.innerHTML, terminal.style.height);
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
                saveState(output.innerHTML, terminal.style.height);
            }
        });
    }

    // Observer fallback
    const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
            saveState(output.innerHTML, `${entry.contentRect.height}px`);
        }
    });
    observer.observe(terminal);

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
            saveState(output.innerHTML, terminal.style.height);
        }

        if (e.code === "Escape" && state.visible) {
            setVisible(false);
            terminal.style.display = "none";
            saveState(output.innerHTML, terminal.style.height);
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

    restoreState(terminal, output);
});
