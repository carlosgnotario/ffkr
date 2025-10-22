import gsap from "gsap"

export class projectSlider {
    constructor(element) {
        this.element = element
        
        this.sizing = this.sizing.bind(this)
        this.destroy = this.destroy.bind(this)

        this.define()
        this.sizing()
        this.bind()
        this.animate()
        if (this.slides.length > 1) {
            this.update()
        }
    }

    define() {
        this.logo = document.querySelector("nav a")
        this.slides = this.element.querySelectorAll(".project-slider-image")
        this.parent = this.element.parentElement;
        this.info = this.parent.querySelector(".project-info")
        this.teamMembers = this.info.querySelectorAll(".project-info-team-member")
        this.currentSlide = 0
        

        this.slides.forEach((slide, index) => {
            slide.xPos = gsap.quickTo(slide, "x", {duration: 2, ease: "expo.out"})
        })

    }

    sizing() {
        this.slideW = this.slides[0].clientWidth
        this.slidesW = this.slides.length * this.slideW
        this.edge = this.slidesW / 2

        this.slides.forEach((slide, index) => {
            slide.left = index * this.slideW
            slide.loop = 0;
            slide.easedposition = 0;
            slide.image = slide.querySelector("img")
        })

    }

    bind() {
        this.pos = {
            dragging: false,
            blockClicks: false,
            x: {new: 0, old: 0, stored: 0},
        }

        const getClientX = (e) => {
            return e.touches ? e.touches[0].clientX : e.clientX;
        }

        this.mouseDownEvent = (e) => {
            this.pos.dragging = true;
            this.pos.x.old = this.pos.x.new = getClientX(e);
        }
        this.mouseMoveEvent = (e) => {
            if (!this.pos.dragging) return;
            this.pos.x.new = getClientX(e);
            if (!this.pos.blockClicks && Math.abs(this.pos.x.new - this.pos.x.old) > 3) {
                this.pos.blockClicks = true;
            }
        }
        this.mouseUpEvent = (e) => {
            if (!this.pos.dragging) return;
            this.pos.dragging = false;
            if ((this.pos.x.new - this.pos.x.old) * (window.movementModifier || 1) > 200) {        
                this.changeSlide(this.currentSlide + 1)
            } else if ((this.pos.x.new - this.pos.x.old) * (window.movementModifier || 1) < -200) {
                this.changeSlide(this.currentSlide - 1)
            }
            this.pos.x.old = this.pos.x.new = 0;
            setTimeout(() => {
                this.pos.blockClicks = false;
            }, 10);
        }
        this.tapEvent = (e) => {
            if (this.pos.blockClicks) return;
            this.changeSlide(this.currentSlide - 1)
            if (visibleFloater !== null) {
                gsap.to(this.teamMembers[visibleFloater].querySelector(".project-info-team-member-floater"), {
                    opacity: 0,
                    transform: "translateX(100%)",
                    duration: 0.5,
                    ease: "expo.out",
                })
                visibleFloater = null;
            }
        }

        this.windowClickEvent = (e) => {
            if (visibleFloater !== null) {
                gsap.to(this.teamMembers[visibleFloater].querySelector(".project-info-team-member-floater"), {
                    opacity: 0,
                    x: -100,
                    duration: 0.5,
                    ease: "expo.out",
                })
                visibleFloater = null;
            }
        }

        let visibleFloater = null;

        this.teamMembers.forEach((member, index) => {
            member.clickEvent = (e) => {
                if (visibleFloater !== index) {
                    gsap.set(member.querySelector(".project-info-team-member-floater"), {
                        opacity: 0,
                        x: 100,
                        overwrite: true,
                    })
                    gsap.to(member.querySelector(".project-info-team-member-floater"), {
                        opacity: 1,
                        x: 0,
                        duration: 0.5,
                        ease: "expo.out",
                    })
                    setTimeout(() => {
                        visibleFloater = index;
                    }, 100);
                }
            }
            member.addEventListener("click", member.clickEvent)
        })

        // Touch events
        this.element.addEventListener("touchstart", this.mouseDownEvent)
        this.element.addEventListener("click", this.tapEvent)
        window.addEventListener("touchmove", this.mouseMoveEvent)
        window.addEventListener("touchend", this.mouseUpEvent)
        window.addEventListener("click", this.windowClickEvent)

        // Mouse events
        this.element.addEventListener("mousedown", this.mouseDownEvent)
        window.addEventListener("mousemove", this.mouseMoveEvent)
        window.addEventListener("mouseup", this.mouseUpEvent)

        window.addEventListener("resize", this.sizing)
    }

    update() {
        let easedPos = 0;
        this.logo.classList.add('invert')
        this.ticker = (time) => {
            const currentPos = this.pos.x.stored + ((this.pos.x.new - this.pos.x.old) * (window.movementModifier || 1)) + this.variationX
            easedPos += (currentPos - easedPos) * 0.05;
 
            this.slides.forEach((slide, index) => {
                let position = index * this.slideW + easedPos

                if (position + (slide.loop * this.slidesW) > this.edge) {
                    slide.loop -= 1
                } else if (position + (slide.loop * this.slidesW) < -this.edge) {
                    slide.loop += 1
                }

                gsap.set(slide.image, { 
                    xPercent: (position + (slide.loop * this.slidesW) ) / this.slideW * -20,
                    scale: 1.2 - Math.abs((position + (slide.loop * this.slidesW) ) / this.slideW) * 0.2
                })
                
                slide.style.transform = `translateX(${position + (slide.loop * this.slidesW)}px)`
            })
        }
        gsap.ticker.add(this.ticker)
        
    }

    changeSlide(slide) {
        this.pos.x.stored = slide * this.slideW
        this.currentSlide = slide;
    }

    animate() {
        gsap.set(this.parent, {
            xPercent: 20,
			duration: 2,
            overwrite: true,
			ease: "expo.out",
        })
        gsap.set(this.slides, {
            autoAlpha: 0,
            overwrite: true,
        })
        gsap.to(this.slides, {
            autoAlpha: 1,
            duration: 2,
            ease: "expo.out",
            delay: 1
        })
        gsap.to(this.parent, {
            xPercent: 0,
			duration: 2,
			ease: "expo.out",
			delay: 1
        })
        gsap.set(this.info, {
            overwrite: true,
            rotateY: 90,
        })
        gsap.to(this.info, {
            rotateY: 0,
			delay: 1,
			ease: "expo.out",
			duration: 2,
        })
        const tl = gsap.timeline()
        this.variationX = 0
        if (this.slides.length <= 1) {return};
        tl.to(this, {
            variationX: -200,
            duration: 1,
            delay: 2,
            ease: "expo.out"
        })
        tl.to(this, {
            variationX: 0,
            duration: 2,
            // ease: "expo.out",
            // delay: 1
        })
    }

    destroy() {
        gsap.ticker.remove(this.ticker)

        this.element.removeEventListener("touchstart", this.mouseDownEvent)
        window.removeEventListener("touchmove", this.mouseMoveEvent)
        window.removeEventListener("touchend", this.mouseUpEvent)

        this.element.removeEventListener("mousedown", this.mouseDownEvent)
        window.removeEventListener("mousemove", this.mouseMoveEvent)
        window.removeEventListener("mouseup", this.mouseUpEvent)
        this.element.removeEventListener("click", this.tapEvent)
        
        window.removeEventListener("resize", this.sizing)
    }
}