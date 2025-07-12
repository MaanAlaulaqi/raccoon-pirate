import { c as createComponent, r as renderTemplate, a as addAttribute, m as maybeRenderHead, b as renderHead, e as renderComponent, f as renderSlot } from '../chunks/astro/server_DGGPYNCC.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const terminalScript = "/_astro/terminal.BqPEc0YP.js";

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$RaccoonTerminal = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", '<div id="raccoon-terminal" class="fixed bottom-0 left-0 w-full overflow-hidden min-h-[5vh] max-h-[90vh] h-[30vh] bg-black text-green-500 font-mono text-sm z-[9999] shadow-xl border-t border-green-800 hidden"> <!-- Resize handle --> <div id="terminal-resize-handle" class="relative w-full" style="height: 1px;"> <div class="absolute left-0 top-1/2 w-full" style="height: 22px; transform: translateY(-50%); cursor: row-resize; pointer-events: auto;"></div> <div class="bg-green-900 w-full" style="height: 1px; position: absolute; left: 0; top: 50%; transform: translateY(-50%); pointer-events: none;"></div> </div> <!-- Terminal content --> <div id="terminal-output" class="overflow-y-auto h-[calc(100%-3rem)] px-2 pt-1 whitespace-pre-wrap leading-tight pr-2 mb-1">\nraccoon@interperter:~$\n</div> <input id="terminal-input" type="text" class="bg-transparent outline-none w-full px-2 pb-1" placeholder="Type a command (press ` to toggle)" autofocus> </div> <script type="module"', "><\/script>"], ["", '<div id="raccoon-terminal" class="fixed bottom-0 left-0 w-full overflow-hidden min-h-[5vh] max-h-[90vh] h-[30vh] bg-black text-green-500 font-mono text-sm z-[9999] shadow-xl border-t border-green-800 hidden"> <!-- Resize handle --> <div id="terminal-resize-handle" class="relative w-full" style="height: 1px;"> <div class="absolute left-0 top-1/2 w-full" style="height: 22px; transform: translateY(-50%); cursor: row-resize; pointer-events: auto;"></div> <div class="bg-green-900 w-full" style="height: 1px; position: absolute; left: 0; top: 50%; transform: translateY(-50%); pointer-events: none;"></div> </div> <!-- Terminal content --> <div id="terminal-output" class="overflow-y-auto h-[calc(100%-3rem)] px-2 pt-1 whitespace-pre-wrap leading-tight pr-2 mb-1">\nraccoon@interperter:~$\n</div> <input id="terminal-input" type="text" class="bg-transparent outline-none w-full px-2 pb-1" placeholder="Type a command (press \\` to toggle)" autofocus> </div> <script type="module"', "><\/script>"])), maybeRenderHead(), addAttribute(terminalScript, "src"));
}, "D:/Code + Data stuff/stuff/raccoonPirate/src/components/RaccoonTerminal.astro", void 0);

const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><title>🦝 Roadside Trash Interpreter</title><link rel="stylesheet" href="/src/styles/globals.css">${renderHead()}</head> <body style="background: var(--bg); color: var(--text); transition: background 0.3s, color 0.3s;"> ${renderComponent($$result, "RaccoonTerminal", $$RaccoonTerminal, {})} ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "D:/Code + Data stuff/stuff/raccoonPirate/src/layouts/BaseLayout.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="p-4"> <h1 class="text-3xl font-bold">🏴‍☠️🦝 Welcome to the Roadside 🗑️🕯️</h1> <p class="mt-2">...lore being built. come back later.</p> </main> ` })}`;
}, "D:/Code + Data stuff/stuff/raccoonPirate/src/pages/index.astro", void 0);

const $$file = "D:/Code + Data stuff/stuff/raccoonPirate/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
