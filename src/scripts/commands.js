export const commands = {
    help: "Commands: help, lore, sparkle, clear, joke, theme, man, version",
    lore: "A dusty bottle rolls by... It's damn empty, can't a guy catch a break round these parts?!",
    sparkle: "* ✨ sparkles ! wee ! ✨ *",
    clear: "__CLEAR__",
    version: "Raccoon Interpreter v0.7.11",
};

export const asyncCommands = {
    async joke() {
        const res = await fetch("https://icanhazdadjoke.com/", {
            headers: { Accept: "application/json" },
        });
        const data = await res.json();
        return data.joke;
    },
    async theme() {
        const current = document.documentElement.dataset.theme || "dark";
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        localStorage.setItem("raccoonTheme", next);
        return `Switched to ${next} theme.`;
    },
    async man() {
        return `Manual Pages:

        - joke: Fetch a dad joke
        - help: List available commands
        - theme: Toggle light/dark mode
        - clear: Clear the terminal
        - version: Show current version
        
        Type a command name for more info: man <command>`;
    },

    async "man joke"() {
        return `joke - Fetches a random dad joke from icanhazdadjoke.com API`;
    },

    async "man theme"() {
        return `theme - Toggles between dark and light themes`;
    },
};

export function getCommandResponse(input) {
    return commands[input] || `Unknown command: ${input}`;
}

export function isAsyncCommand(input) {
  return asyncCommands.hasOwnProperty(input);
}

export async function runAsyncCommand(input) {
  return asyncCommands[input]?.();
}
