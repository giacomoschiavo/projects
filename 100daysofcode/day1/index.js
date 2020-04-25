
window.addEventListener("keydown", playSound);

function playSound(e) {
   let tile = document.querySelector(`.key[data-key="${e.keyCode}"]`);
   if (tile == null) return;
   let sound = document.querySelector(`audio[data-key="${e.keyCode}"]`);
   sound.currentTime = 0;
   sound.play();
   tile.classList.add("playing");
}

let tiles = document.querySelectorAll(".key");
tiles.forEach(tile => tile.addEventListener("transitionend", toggleEffect));

function toggleEffect(e) {
   e.target.classList.remove("playing");
}