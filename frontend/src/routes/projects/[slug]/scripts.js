import gsap from "gsap"

export class projectSlider {
    constructor(element) {
        this.element = element
        console.log("once?=");
        

        this.define()
        this.sizing()
        this.bind()
        this.animate()
        this.update()
        this.destroy = this.destroy.bind(this)
        console.log(this.currentSlide);
    }

    define() {
        this.slides = this.element.querySelectorAll(".project-slider-image")
        this.parent = this.element.parentElement;
        this.info = this.parent.querySelector(".project-info")
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
            x: {new: 0, old: 0, stored: 0},
        }

        this.mouseDownEvent = (e) => {
            this.pos.dragging = true;
            this.pos.x.old = this.pos.x.new = e.clientX;
        }
        this.mouseMoveEvent = (e) => {
            if (!this.pos.dragging) return;
            this.pos.x.new = e.clientX;
        }
        this.mouseUpEvent = (e) => {
            if (!this.pos.dragging) return;
            this.pos.dragging = false;
            if (this.pos.x.new - this.pos.x.old > 200) {        
                this.changeSlide(this.currentSlide + 1)
            } else if (this.pos.x.new - this.pos.x.old < -200) {
                this.changeSlide(this.currentSlide - 1)
            }
            this.pos.x.old = this.pos.x.new = 0;
        }

        this.element.addEventListener("mousedown", this.mouseDownEvent)
        window.addEventListener("mousemove", this.mouseMoveEvent)
        window.addEventListener("mouseup", this.mouseUpEvent)
        window.addEventListener("resize", this.sizing)
    }

    update() {
        let easedPos = 0;
        this.ticker = (time) => {
            const currentPos = this.pos.x.stored + (this.pos.x.new - this.pos.x.old) + this.variationX
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
			ease: "expo.out",
        })
        gsap.set(this.slides, {
            autoAlpha: 0
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
        gsap.to(this.info, {
            rotateY: 0,
			delay: 1,
			ease: "expo.out",
			duration: 2,
        })
        const tl = gsap.timeline()
        this.variationX = 0
        tl.to(this, {
            variationX: -200,
            position: "relative",
            zIndex: 100,
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
        console.log("once pls");
        
    }

    destroy() {
        console.log("destroying");
        
        gsap.ticker.remove(this.ticker)
        window.removeEventListener("mousemove", this.mouseMoveEvent)
        window.removeEventListener("mouseup", this.mouseUpEvent)
        this.element.removeEventListener("mousedown", this.mouseDownEvent)
        window.removeEventListener("resize", this.sizing)
    }
}