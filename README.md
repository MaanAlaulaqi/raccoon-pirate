# 🦝 Raccoon Pirate: Roadside Trash Interpreter

This project is built with [Astro](https://astro.build/) and Tailwind CSS, and features a custom, resizable terminal at the bottom of the screen, took me freaking forever to figure it out. We raccoons like to stay in the shadows, y'know? Away from peering eyes, so naturally, I'm more of a backend kinda guy. 

> "Another empty bin? Great. Just what I needed. Can't a guy catch a break?!"

Our hero is a sarcastic, nocturnal raccoon with a knack for finding the weirdest things on the roadside. Sometimes he finds food, sometimes he finds ghosts, and sometimes he just complains about the state of the world.

---

##  Features

- **Resizable Terminal:** Drag the thin green bar to resize the console. (He'll complain if you make it too small. He won't actually, I'ma hold him back :>)
- **Grouchy Raccoon Responses:** Try commands like `help`, `lore`, `sparkle`, or just type nonsense to get a reaction.
- **Persistent State:** The raccoon remembers your terminal size and history, even if you reload.
- **Dark & Light Mode:** the raccoon and i, we prefer as little light as possible, ya? but you do you. 

---

### Terminal usage, for now. Definitely need to expand it
##### _The current plan is to make this console thing sort of like an easter egg, but y'all are in on the secret during development. shhh! otherwise i'll be sending my boys after you._

| Command        | What Happens                                      |
|----------------|---------------------------------------------------|
| `help`         | Shows available commands (begrudgingly)           |
| `lore`         | Raccoon shares a roadside story                   |
| `sparkle`      | A rare moment of raccoon joy _(note to self— google how to make "raccoon joy" sparkly and spread on someone's monitor at command..._)                     |
| `clear`        | Clears the terminal (he likes a clean den)        |
| anything else  | Expect sarcasm or confusion                       |


---

- `src/components/RaccoonTerminal.astro`: The main terminal UI.
- `src/scripts/terminal.js`: Handles raccoon logic, resizing, and state.
- `src/styles/globals.css`: Tailwind and custom styles.

---

### wanna try it out for yourself? 
##### _make sure you got the necessary goods, y'know what I mean? the npms and whatnots_

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the dev server:**
   ```sh
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:9001](http://localhost:9001) (didn't need a scouter for that, did ya?) and meet the raccoon.

---

### About the Project

This project is for fun, learning, and maybe a little haunting. The potential end goal is to work on (finally) actually setting up my personal site, I want it to be a bit fun, with character, something to keep my mind busy. If you have ideas for new raccoon commands or want to make him even grouchier, open a PR or an issue!

---

###  License

MIT. Steal this code like a raccoon steals trash, who's gonna stop you, me?!
 