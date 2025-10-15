import gsap from "gsap"
// Empty scripts file for history page
export class History{
    constructor(element) {
        this.element = element;
        console.log(this.element);
        
        this.elements()
        this.sizing();
        this.bind()
        this.update()
        this.animate()
    }

    elements() {
        this.wrap = this.element.querySelector(".timeline-wrap")
        this.xPos = gsap.quickTo(this.wrap, "x", {duration: 2, ease: "expo.out"})
        this.timelineItems = this.element.querySelectorAll(".timeline-item")
    }

    sizing() {
        this.W = this.wrap.clientWidth
        this.vw = window.innerWidth

        this.timelineItems.forEach(item => {
            item.left = item.querySelector(".img1").offsetLeft
            
        })
        this.timelineItems.forEach(item => {
            console.log(item.left);
        })
    }

    bind() {
        this.pos = {
            dragging: false,
            x: {new: 0, old: 0, stored: 0},
        }
        
        const getClientX = (e) => {
            return e.touches ? e.touches[0].clientX : e.clientX;
        }
        
        this.mouseDownEvent = (e) => {
            console.log("mouse/touch down")
            this.pos.dragging = true;
            this.pos.x.old = this.pos.x.new = getClientX(e);
        }
        this.mouseMoveEvent = (e) => {
            if (!this.pos.dragging) return;
            console.log("mouse/touch move")
            this.pos.x.new = getClientX(e);
        }
        this.mouseUpEvent = (e) => {
            if (!this.pos.dragging) return;
            console.log("mouse/touch up")
            this.pos.dragging = false;
            this.pos.x.stored += this.pos.x.new - this.pos.x.old;
            this.pos.x.old = this.pos.x.new = 0;

            if (-this.pos.x.stored < 0) {
                this.pos.x.stored = 0;
            } else if (-this.pos.x.stored > (this.W - this.vw)) {
                this.pos.x.stored = -(this.W - this.vw);
            }
        }

        window.addEventListener("resize", this.sizing)

        // Touch events
        this.element.addEventListener("touchstart", this.mouseDownEvent)
        window.addEventListener("touchmove", this.mouseMoveEvent)
        window.addEventListener("touchend", this.mouseUpEvent)
        
        // Mouse events
        this.element.addEventListener("mousedown", this.mouseDownEvent)
        window.addEventListener("mousemove", this.mouseMoveEvent)
        window.addEventListener("mouseup", this.mouseUpEvent)
    }

    animate() {
        this.timelineItems.forEach(item => {
            item.yearNumber = item.querySelector(".year").innerText
            item.animated = false;
            item.imageWrap = item.querySelector(".img1")
            item.image = item.querySelector(".img1 img")
            item.year = item.querySelector(".year")
            item.text = item.querySelector(".text")
            item.bar = item.querySelector(".bar")

            gsap.set(item.imageWrap, {
                autoAlpha: 0,
            })
            gsap.set(item.year, {
                autoAlpha: 0,
                textContent: item.yearNumber - 150,
            })
            gsap.set(item.bar, {
                scaleY: 0,
            })
            gsap.set(item.text, {
                autoAlpha: 0,
            })
            gsap.set(item.image, {
                clipPath: "inset(0 100% 0 0)",
                scale: 1.3
            })

            item.animateIn = () => {
                console.log("animating in")
                const tl = gsap.timeline()
                tl.to(item.imageWrap, {
                    autoAlpha: 1,
                    ease: "expo.out",
                    duration: 2,
                })
                tl.to(item.image, {
                    clipPath: "inset(0 0% 0 0)",
                    scale: 1,
                    ease: "expo.out",
                    duration: 2,
                }, 0)
                tl.to(item.year, {
                    autoAlpha: 1,
                    textContent: item.yearNumber,
                    roundProps: "textContent",
                    ease: "expo.out",
                    duration: 2,
                }, 0.2)
                tl.to(item.text, {
                    autoAlpha: 1,
                    ease: "expo.out",
                    duration: 2,
                }, 0.6)

                tl.to(item.bar, {
                    scaleY: 1,
                    ease: "expo.out",
                    duration: 1,
                }, 0.2)
            }

            item.animateOut = () => {
                console.log("animating out")
                const tl = gsap.timeline()
                tl.to(item.imageWrap, {
                    autoAlpha: 0,
                    overwrite: true,
                }, 0)
                tl.to(item.year, {
                    autoAlpha: 0,
                    overwrite: true,
                }, 0)
                tl.to(item.text, {
                    autoAlpha: 0,
                    overwrite: true,
                }, 0)
                tl.to(item.bar, {
                    scaleY: 0,
                    overwrite: true,
                }, 0)
                tl.to(item.image, {
                    clipPath: "inset(0 100% 0 0)",
                    scale: 1.3,
                    overwrite: true,
                }, 0)
                tl.to(item.imageWrap, {
                    autoAlpha: 0,
                    overwrite: true,
                }, 0)
            }
        })
    }

    update() {
        this.ticker = () => {
            const currentPosX = (this.pos.x.new - this.pos.x.old) + this.pos.x.stored
            
            this.xPos(currentPosX)

            this.timelineItems.forEach(item => {
                if (-currentPosX > item.left - this.vw * 0.8 && !item.animated) {
                    item.animateIn()
                    item.animated = true;
                } else if (-currentPosX < item.left - this.vw * 0.8 && item.animated) {
                    item.animateOut()
                    item.animated = false;
                }
            })
        }

        gsap.ticker.add(this.ticker)
    }

    destroy() {
        gsap.ticker.remove(this.ticker)
        
        // Remove touch events
        this.element.removeEventListener("touchstart", this.mouseDownEvent)
        window.removeEventListener("touchmove", this.mouseMoveEvent)
        window.removeEventListener("touchend", this.mouseUpEvent)
        
        // Remove mouse events
        this.element.removeEventListener("mousedown", this.mouseDownEvent)
        window.removeEventListener("mousemove", this.mouseMoveEvent)
        window.removeEventListener("mouseup", this.mouseUpEvent)
        
        window.removeEventListener("resize", this.sizing)
    }
}
