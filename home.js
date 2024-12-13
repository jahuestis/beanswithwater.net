
// add hover effect to game links
gamelinks = Array.from(document.getElementsByClassName("games"));
gamelinks.forEach(gamelink => {
    gamelink.addEventListener("mouseover", function() {
        this.classList.add("hovered");
    })
    gamelink.addEventListener("mouseout", function() {
        this.classList.remove("hovered");
    })
});