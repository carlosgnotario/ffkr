import gsap from "gsap"

export class Menu {
    constructor(element) {
        this.element = element

        
        this.init()
    }
    
    async init() {
        // Fetch categories to get studio names
        this.categories = await fetch('/api/categories').then(r => r.json())
        
        this.elements()
        this.update()
        this.sizing()
        this.populateStudios()
        this.bind()
    }

    sizing() {
        this.vh = window.innerHeight
        this.burgerH = this.menuBurger.offsetHeight
        // font size in px multiplied by 7.5
        this.paddingH = parseFloat(getComputedStyle(document.documentElement).fontSize) * 7.5;
        console.log(this.paddingH);
        
    }
    
    elements() {
        this.menuOpen = false
        
        this.menuBurger = document.querySelector('.menu-toggle')
        this.toggle = document.querySelector('.menu-toggle a.open-button')
        this.drag = document.querySelector('.menu-toggle .drag')
        this.studiosContainer = this.element.querySelector('.menu-studios')
        this.pagesContainer = this.element.querySelector('.menu-pages')
    }
    
    populateStudios() {
        if (!this.categories || this.categories.length === 0) return
        
        this.studiosContainer.innerHTML = ''
        
        this.categories.forEach((category, index) => {
            const li = document.createElement('li')
            const a = document.createElement('a')
            a.href = `/studio#${category.slug}`
            a.textContent = category.title
            a.dataset.index = index
            
            // Add click handler to navigate to slide
            a.addEventListener('click', (e) => {
                e.preventDefault()
                
                // Check if we're on the studio page
                if (window.location.pathname === '/studio') {
                    // Navigate to the slide directly
                    // @ts-ignore - studioGridInstance is set dynamically
                    const studioInstance = window.studioGridInstance
                    if (studioInstance) {
                        studioInstance.goToSlide(index)
                        this.openMenu(false)
                    }
                } else {
                    // Navigate to studio page with hash
                    window.location.href = `/studio#${category.slug}`
                }
            })
            
            li.appendChild(a)
            this.studiosContainer.appendChild(li)
        })
    }

    bind() {
        this.pos = {
            y: {new: 0, old: 0, stored: 0},
        }
        
        const getClientY = (e) => {
            return e.touches ? e.touches[0].clientY : e.clientY;
        }
        

        this.toggle?.addEventListener('click', (e) => {
            e.preventDefault()
            console.log("open menu");
            
            if (!this.menuOpen) {
                this.openMenu(true)
            }
        })

        this.mouseDownEvent = (e) => {
            if (!this.pos.dragging) {
                gsap.to(this.menuBurger, {
                    scale: 0.9,
                    duration: 0.2,
                    ease: "expo.out",
                })
                this.pos.dragging = true;
            }
            this.pos.y.old = this.pos.y.new = getClientY(e);
            console.log("mouse down");
            
        }
        this.mouseMoveEvent = (e) => {
            if (!this.pos.dragging) return;
            this.pos.y.new = getClientY(e);
            console.log(this.pos.y.new);
            
        }
        this.mouseUpEvent = (e) => {
            if (!this.pos.dragging) return;
            gsap.to(this.menuBurger, {
                scale: 1,
                duration: 0.2,
                ease: "expo.out",
            })
            this.pos.y.stored += this.pos.y.new - this.pos.y.old;
            this.pos.y.old = this.pos.y.new = 0;
            this.pos.dragging = false;

            console.log(this.pos.y.stored);
            
            if (this.pos.y.stored < 0) {
                this.pos.y.stored = 0;                
            } else if (this.pos.y.stored > this.vh - this.paddingH * 2 - this.burgerH) {
                this.pos.y.stored = this.vh - this.paddingH * 2 - this.burgerH;
            }
        }

        this.drag.addEventListener("touchstart", this.mouseDownEvent)
        this.drag.addEventListener("mousedown", this.mouseDownEvent)
        window.addEventListener("touchmove", this.mouseMoveEvent)
        window.addEventListener("mousemove", this.mouseMoveEvent)
        window.addEventListener("touchend", this.mouseUpEvent)
        window.addEventListener("mouseup", this.mouseUpEvent)

        this.closeEvent = (e) => {
            if (this.menuOpen) {
                e.preventDefault()
                this.openMenu(false)
            }
        }

        window.addEventListener("touchstart", this.closeEvent)
        window.addEventListener("mousedown", this.closeEvent)
    }

    update() {
        this.moveMenu = gsap.quickTo(this.menuBurger, "y", {duration: 1, ease: "expo.out"})
        
        const ticker = () => {
            const currentPosY = (this.pos.y.new - this.pos.y.old) + this.pos.y.stored
            this.moveMenu(currentPosY)
        }

        gsap.ticker.add(ticker)
    }

    openMenu(open) {
        if (open) {
            const tl = gsap.timeline()
            if (this.menuBurger) {
                tl.to(this.menuBurger, {
                    xPercent: -100,
                    ease: "expo.out"
                })
            }
            if (this.element) {
                tl.to(this.element, {
                    width: 'auto',
                    duration: 1,
                    ease: "expo.out"
                })
            }
            
        } else {
            const tl = gsap.timeline()
            if (this.element) {
                tl.to(this.element, {
                    overwrite: true,
                    width: '0',
                    duration: 1,
                    ease: "expo.out"
                })
            }
            if (this.menuBurger) {
                tl.to(this.menuBurger, {
                    xPercent: 0,
                    ease: "expo.out"
                })
            }
        }

        this.menuOpen = !this.menuOpen
    }
    
    destroy() {
        // Cleanup if needed
        gsap.ticker.remove(this.update)
        this.drag.removeEventListener("touchstart", this.mouseDownEvent)
        this.drag.removeEventListener("mousedown", this.mouseDownEvent)
        window.removeEventListener("touchmove", this.mouseMoveEvent)
        window.removeEventListener("mousemove", this.mouseMoveEvent)
        window.removeEventListener("touchend", this.mouseUpEvent)
        window.removeEventListener("mouseup", this.mouseUpEvent)
        window.removeEventListener("touchstart", this.closeEvent)
        window.removeEventListener("mousedown", this.closeEvent)
        console.clear()
    }
}

