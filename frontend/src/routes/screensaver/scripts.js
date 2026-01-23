import gsap from "gsap"
import SplitText from "gsap/SplitText"

export class Screensaver {
    constructor(element) {
        gsap.registerPlugin(SplitText) 
        this.element = element
        this.active = false
        this.idleScreen = false
        this.currentIndex = 0
        this.timerDuration = 60000;
        this.timer = this.timerDuration;
        
        this.setup()
        this.init()
	}
    
    async init() {
        this.projects = await fetch('/api/projects').then(r => r.json())
        this.siteSettings = await fetch('/api/site-settings').then(r => r.json())
        this.sliderTimer = 1000;
        
        this.elements()
        this.bind()
        this.update()
        this.populateMenu()
    }
    
    setup() {
        this.element.style.display = 'none'
    }

    show() {
        this.logo.classList.add('invert')
        gsap.set(this.element, { pointerEvents: "all", })
        if (this.currentSlide) {
            this.currentSlide.remove()
        }
        this.sliderTimer = 1000;
        this.menu.style.width = '0'
        this.textMessage.style.clipPath = 'inset(0 0 0 0)'
        gsap.set(this.element, {
            display: 'grid',
            autoAlpha: 0,
            overwrite: true
        })
        gsap.to(this.element, {
            autoAlpha: 1,
            duration: 2,
            ease: "expo.out"
        })
        
        this.createSlide()
    }

    hide() {
        gsap.set(this.element, { pointerEvents: "none", })
        gsap.to(this.element, {
            autoAlpha: 0,
            duration: 2,
            ease: "expo.out",
            onComplete: () => {
                this.active = false;
                this.idleScreen = false;
            }
        })
        this.timer = this.timerDuration;
    }

    // Helper function to generate optimized image URL with auto=format
    // Sanity will serve AVIF automatically based on browser Accept header
    getOptimizedImageUrl(imageUrl) {
        if (!imageUrl) return ''
        const url = new URL(imageUrl)
        url.searchParams.set('auto', 'format')
        return url.toString()
    }

    createSlide() {
        if (this.currentSlide) {
            this.currentIndex = (this.currentIndex + 1) % this.projects.length
            this.previousSlide = this.currentSlide
        }

        const project = this.projects[this.currentIndex]
        this.currentSlide = document.createElement('div')
        this.currentSlide.className = 'screensaver-project'
        this.currentSlide.classList.add('active')

        const imageUrl = project.photoGallery?.[0]?.image?.asset?.url || ''
        const optimizedUrl = this.getOptimizedImageUrl(imageUrl)
        
        this.currentSlide.innerHTML = `
            <picture>
                <source type="image/avif" srcset="${optimizedUrl}" />
                <img src="${optimizedUrl}" alt="${project.name || ''}" class="screensaver-project-image" />
            </picture>
            <a href="/projects/${project.slug}" class="screensaver-project-info">
                <div class="category">${project.category?.title || ''}</div>
                <h3>${project.name || ''}</h3>
                <p>${project.location || ''}</p>
            </a>
        `
        const heading = this.currentSlide.querySelector('h3')
        const location = this.currentSlide.querySelector('p')
        const category = this.currentSlide.querySelector('.category')
        const info = this.currentSlide.querySelector('.screensaver-project-info')

        const split = SplitText.create(heading, { type: "words, chars", wordsClass: "splitword", charsClass: "char" });

        gsap.from(this.currentSlide, {
            autoAlpha: 0,
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
                if (this.previousSlide) {
                    this.previousSlide.remove()
                }
            }
        })

        gsap.from(split.chars, {
            autoAlpha: 0,
            y: "0.3em",
            x: "-0.3em",
            rotateY: -90,
            transformOrigin: "top center",
            stagger: {
                amount: 1,
            },
            delay: 1,
            onComplete: () => split.revert()
        })
        gsap.from(location, {
            clipPath: "inset(0 100% 0 0)",
            delay: 1,
            duration: 2,
            ease: "expo.out"
        })
        gsap.from(category, {
            clipPath: "inset(0 100% 0 0)",
            delay: 1,
            duration: 2,
            ease: "expo.out"
        })

        info?.addEventListener('click', (e) => {
            this.hide()
        })

        this.element.appendChild(this.currentSlide)
    }

    bind() {
        document.addEventListener('mousedown', () => {
            if (this.active) return;
            this.timer = this.timerDuration
        })

        this.element.addEventListener('click', (e) => {
            if (!this.active || this.idleScreen) return;
            this.logo.classList.remove('invert')
            // Don't show menu if clicking on project links - let them navigate
            if (e.target.closest('.screensaver-project-info')) {
                return;
            }            
            gsap.to(this.menu, {
                width: "28.125rem"
            })
            gsap.to(this.textMessage, {
                clipPath: "inset(0 50% 0 50%)",
                duration: 2,
            })
            this.idleScreen = true
        })

        this.menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                this.hide()
            })
        })
    }

    elements() {
        this.logo = document.querySelector('nav a')
        this.sliderTimer = 1000;
        this.textMessage = this.element.querySelector('.screensaver-text')
        this.menu = this.element.querySelector('.screensaver-menu')
    }

    update() {
        this.ticker = (time) => {
            if (this.timer <= 0 && !this.active) {
                this.show();
                this.active = true
                
            } else if (this.timer > 0 && !this.active) {
                this.timer -= 1;
            }

            if (this.active) {
                this.sliderTimer -= 1;
                if (this.sliderTimer <= 0) {
                    this.createSlide()
                    this.sliderTimer = 2000;
                }
            }

        }
        gsap.ticker.add(this.ticker)
    }

    populateMenu() {
        if (!this.siteSettings?.navigation) return
        
        const menuLinks = this.element.querySelectorAll('.screensaver-menu a')
        
        this.siteSettings.navigation.forEach((navItem, index) => {
            if (menuLinks[index]) {
                const img = menuLinks[index].querySelector('.menu-image')
                const text = menuLinks[index].querySelector('.menu-text')
                
                if (img && navItem.image?.asset?.url) {
                    // Use auto=format - Sanity will serve AVIF based on Accept header
                    const imageUrl = navItem.image.asset.url
                    const optimizedUrl = this.getOptimizedImageUrl(imageUrl)
                    
                    // Create picture element for AVIF support
                    const picture = document.createElement('picture')
                    const source = document.createElement('source')
                    source.type = 'image/avif'
                    source.srcset = optimizedUrl
                    picture.appendChild(source)
                    
                    const imgElement = document.createElement('img')
                    imgElement.src = optimizedUrl
                    imgElement.alt = navItem.title || ''
                    picture.appendChild(imgElement)
                    
                    // Replace existing img with picture element
                    img.replaceWith(picture)
                }
                if (text) {
                    text.textContent = navItem.title
                }
            }
        })
    }
}
