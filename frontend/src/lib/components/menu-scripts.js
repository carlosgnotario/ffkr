import gsap from "gsap"

export class Menu {
    constructor(element, gotoFunction) {
        this.element = element
        this.goto = gotoFunction

        
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
        
    }
    
    elements() {
        this.menuOpen = false
        this.hiddenMenuOpen = false
        
        this.menuBurger = document.querySelector('.menu-toggle')
        this.toggle = document.querySelector('.menu-toggle .open-button')
        this.drag = document.querySelector('.menu-toggle .drag')
        this.studiosContainer = this.element.querySelector('.menu-studios')
        this.pagesContainer = this.element.querySelector('.menu-pages')
        this.hiddenMenu = document.querySelector('.menu-hidden')
        this.hiddenMenuClose = document.querySelector('.menu-hidden-close')
        this.hiddenMenuOverlay = document.querySelector('.menu-hidden-overlay')
        this.movementSlider = document.querySelector('.movement-slider')
        this.sliderValue = document.querySelector('.slider-value')
    }
    
    populateStudios() {
        if (!this.categories || this.categories.length === 0) return
        
        this.studiosContainer.innerHTML = ''
        
        this.categories.forEach((category, index) => {
            const li = document.createElement('li')
            const a = document.createElement('a')
            const categorySlug = category.slug?.current || category.slug || category._id
            a.href = `/studio?category=${categorySlug}`
            a.textContent = category.title
            a.dataset.index = index
            a.dataset.slug = categorySlug
            
            // Add click handler to navigate to slide
            a.addEventListener('click', (e) => {
                e.preventDefault()

                // go to studio
                // if this page is studio
                if (window.location.pathname === '/studio') {
                    window.studioGridInstance.changeSlide(index)
                } else {
                    window.numberchange = index;
                    
                    if (this.goto) {
                        this.goto('/studio')
                    } else {
                        window.location.href = '/studio'
                    }
                }
                this.openMenu(false)
                
            })
            
            li.appendChild(a)
            this.studiosContainer.appendChild(li)
        })
    }

    bind() {
        this.pos = {
            y: {new: 0, old: 0, stored: this.vh - this.paddingH * 2 - this.burgerH},
        }
        
        const getClientY = (e) => {
            return e.touches ? e.touches[0].clientY : e.clientY;
        }
        

        this.toggle?.addEventListener('click', (e) => {
            e.preventDefault()
            
            if (!this.menuOpen) {
                this.openMenu(true)
            }
        })

        // triple click event on drag
        let tripleClickCount = 0
        let tripleClickTimeout = null
        this.dragClickEvent = (e) => {
            e.preventDefault()
            tripleClickCount++
            
            // Clear existing timeout
            if (tripleClickTimeout) {
                clearTimeout(tripleClickTimeout)
            }
            
            // Check if we've reached 3 clicks
            if (tripleClickCount === 3) {
                // Toggle hidden menu
                this.toggleHiddenMenu()
                
                // Reset counter
                tripleClickCount = 0
                tripleClickTimeout = null
            } else {
                // Reset counter after 300ms if no more clicks
                tripleClickTimeout = setTimeout(() => {
                    tripleClickCount = 0
                }, 300)
            }
        }

        this.drag.addEventListener("click", this.dragClickEvent)

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
            
        }
        this.mouseMoveEvent = (e) => {
            if (!this.pos.dragging) return;
            this.pos.y.new = getClientY(e);
            
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

        this.element.addEventListener("touchstart", (e) => {
            e.stopPropagation()
        })
        this.element.addEventListener("mousedown", (e) => {
            e.stopPropagation()
        })

        window.addEventListener("touchstart", this.closeEvent)
        window.addEventListener("mousedown", this.closeEvent)

        // Hidden menu close handlers
        this.hiddenMenuClose?.addEventListener('click', () => {
            this.toggleHiddenMenu(false)
        })
        
        this.hiddenMenuOverlay?.addEventListener('click', () => {
            this.toggleHiddenMenu(false)
        })

        // Movement modifier slider
        this.movementSlider?.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value)
            if (this.sliderValue) {
                this.sliderValue.textContent = value.toFixed(1)
            }
            // Set global movement modifier
            if (typeof window !== 'undefined') {
                window.movementModifier = value
            }
        })

        // Initialize movement modifier
        if (typeof window !== 'undefined') {
            window.movementModifier = 1.0
        }
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
                }, 0.2)
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
                }, 0.2)
            }
        }

        this.menuOpen = !this.menuOpen
    }

    toggleHiddenMenu(open) {
        const shouldOpen = open !== undefined ? open : !this.hiddenMenuOpen
        
        if (shouldOpen) {
            gsap.to(this.hiddenMenu, {
                autoAlpha: 1,
                duration: 0.3,
                ease: "power2.out"
            })
            gsap.fromTo(this.hiddenMenu.querySelector('.menu-hidden-content'), 
                { scale: 0.8, y: 50 },
                { scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
            )
            this.hiddenMenuOpen = true
        } else {
            gsap.to(this.hiddenMenu, {
                autoAlpha: 0,
                duration: 0.3,
                ease: "power2.in"
            })
            this.hiddenMenuOpen = false
        }
    }
    
    destroy() {
        // Cleanup if needed
        gsap.ticker.remove(this.update)
        this.drag?.removeEventListener("touchstart", this.mouseDownEvent)
        this.drag?.removeEventListener("mousedown", this.mouseDownEvent)
        this.drag?.removeEventListener("click", this.dragClickEvent)
        window.removeEventListener("touchmove", this.mouseMoveEvent)
        window.removeEventListener("mousemove", this.mouseMoveEvent)
        window.removeEventListener("touchend", this.mouseUpEvent)
        window.removeEventListener("mouseup", this.mouseUpEvent)
        window.removeEventListener("touchstart", this.closeEvent)
        window.removeEventListener("mousedown", this.closeEvent)
        console.clear()
    }
}

