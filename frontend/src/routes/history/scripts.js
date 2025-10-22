import gsap from "gsap"
// Empty scripts file for history page
export class History{
    constructor(element) {
        this.element = element;
        this.sizing = this.sizing.bind(this)
        
        this.elements()
        this.sizing();
        this.bind()
        this.update()
        this.animate()
    }

    elements() {
        this.wrap = this.element.querySelector(".timeline-wrap")
        this.timelineEnd = this.element.querySelector(".timeline-end")
        this.timelineDecoration = this.element.querySelector(".timeline-decoration")
        this.timelineItems = this.element.querySelectorAll(".timeline-item")
        this.reachedEnd = false;

        this.xPos = gsap.quickTo(this.wrap, "x", {duration: 2, ease: "expo.out"})
        this.rotation = gsap.quickTo(this.timelineDecoration, "rotationY", {duration: 2, ease: "expo.out"})
    }

    sizing() {
        this.W = this.wrap.clientWidth
        this.vw = window.innerWidth
        this.vh = window.innerHeight        

        this.timelineItems.forEach(item => {
            item.left = item.querySelector(".img1").offsetLeft
            
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

        this.clickEvent = (e) => {  
            this.confetti()
            const tl = gsap.timeline()
            tl.to(this.timelineDecoration, {
                scale: 0.9,
                duration: 0.2,
                ease: "expo.out",
            })
            tl.to(this.timelineDecoration, {
                scale: 1,
                duration: 1,
                ease: "expo.out",
            })
        }
        this.timelineDecoration.addEventListener("click", this.clickEvent)
        
        this.mouseDownEvent = (e) => {
            this.pos.dragging = true;
            this.pos.x.old = this.pos.x.new = getClientX(e);
        }
        this.mouseMoveEvent = (e) => {
            if (!this.pos.dragging) return;
            this.pos.x.new = getClientX(e);
        }
        this.mouseUpEvent = (e) => {
            if (!this.pos.dragging) return;
            this.pos.dragging = false;
            this.pos.x.stored += (this.pos.x.new - this.pos.x.old) * window.movementModifier;
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
            const currentPosX = (this.pos.x.new - this.pos.x.old) * window.movementModifier + this.pos.x.stored
            
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

            if (-currentPosX > this.W - this.vw * 2) {
                this.rotation(Math.min(180 - ((-currentPosX - (this.W - this.vw * 2)) / this.vw) * 180, 90))
            }

            if (-currentPosX >= this.W - this.vw && !this.reachedEnd) {
                this.reachedEnd = true;
                this.confetti();
            } else if (-currentPosX < this.W - this.vw && this.reachedEnd) {
                this.reachedEnd = false;
            }
            
        }

        gsap.ticker.add(this.ticker)
    }

    confetti() {
        const amount = 100;
        const priorParticles = this.timelineEnd.querySelectorAll(".confetti-particle");
        const particles = [];
        
        
        if (priorParticles.length < 300) {
            for (let i = 0; i < amount; i++) {
                const particle = document.createElement("div");
                particle.classList.add("confetti-particle");
                this.timelineEnd.appendChild(particle);
                particles.push(particle);
            }
        }

        particles.forEach((particle, index) => {
            const tl = gsap.timeline()
            let xPos = 0;
            let yPos = 0;
            let randomFreq = Math.random() * 4;
            const xVariance = this.vw * 0.5;
            const yVariance = this.vh * 0.5;

            tl.set(particle, {
                scale: "random(0.5, 1.5)", y: 0, x: 0,
                backgroundColor: `rgba(${(-40 + Math.random() * 40) + 207}, ${(-40 + Math.random() * 40) + 142}, 52, ${0.5 + Math.random() * 0.5})`,
                rotateX: "random(0, 360)",
                rotateZ: "random(0, 360)",
            })
            .to(particle, {
                x: `random(${-xVariance}, ${+xVariance})`,
                y: `random(${-yVariance}, ${-yVariance})`,
                duration:  Math.random(),
                ease: "power2.out",
                zIndex: Math.round(Math.random()),
                onComplete: () => {
                    xPos = gsap.getProperty(particle, "x");
                    yPos = gsap.getProperty(particle, "y");
                }
            })
            .to(particle, {
                y: yVariance,
                duration: 2 + Math.random() * 2,
                rotateX: "random(0, -360)",
                rotateZ: "random(0, -360)",
                ease: "power1.in",
                onUpdate: function() {
                    const y = gsap.getProperty(particle, "y"); // current vertical position
                    const startY = yPos; // or the initial y position of the particle
                    const endY = this.vars.y; // target y position
                    const progress = (y - startY) / (endY - startY); // 0 -> 1 based on actual movement
                    
                    const wave = Math.sin(progress * Math.PI * randomFreq) * 100;
                    gsap.set(particle, { x: xPos + wave });
                }
            })
            tl.to(particle, {
                autoAlpha: 0,
                duration: 0.5,
                ease: "expo.out",
                onComplete: () => {
                    particle.remove();
                }
            })
        })
    }

    destroy() {
        gsap.ticker.remove(this.ticker)
        
        // Remove touch events
        this.element.removeEventListener("touchstart", this.mouseDownEvent)
        this.timelineDecoration.removeEventListener("click", this.clickEvent)
        window.removeEventListener("touchmove", this.mouseMoveEvent)
        window.removeEventListener("touchend", this.mouseUpEvent)
        
        // Remove mouse events
        this.element.removeEventListener("mousedown", this.mouseDownEvent)
        window.removeEventListener("mousemove", this.mouseMoveEvent)
        window.removeEventListener("mouseup", this.mouseUpEvent)
        
        window.removeEventListener("resize", this.sizing)
        
        console.clear();
    }
}
