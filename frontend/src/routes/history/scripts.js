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
            item.left = item.querySelector("img").offsetLeft
            
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
            console.log("mouse/touch move")
            if (!this.pos.dragging) return;
            this.pos.x.new = getClientX(e);
        }
        this.mouseUpEvent = (e) => {
            console.log("mouse/touch up")
            if (!this.pos.dragging) return;
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

    update() {
        this.ticker = () => {
            console.log("ticking")
            const currentPosX = (this.pos.x.new - this.pos.x.old) + this.pos.x.stored
            this.xPos(currentPosX)
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
