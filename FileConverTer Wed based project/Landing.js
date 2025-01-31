document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".slide");

    function checkScroll() {
        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 100 && sectionTop > -section.clientHeight) {
                section.classList.add("show");
            } else {
                section.classList.remove("show");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
    checkScroll();
});
