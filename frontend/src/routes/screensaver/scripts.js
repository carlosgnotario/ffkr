import gsap from "gsap"
import SplitText from "gsap/SplitText"

export class Screensaver {
    constructor(element) {
        gsap.registerPlugin(SplitText) 
        this.element = element
        this.active = false
        this.currentIndex = 0
        
        this.setup()
        this.init()
	}
    
    async init() {
        // Fetch directly from Sanity CDN since GitHub Pages is static
        const sanityClient = {
            projectId: '80je9ukv',
            dataset: 'production',
            useCdn: true,
            apiVersion: '2024-01-15'
        }
        
        // Fetch projects
        const projectsQuery = `*[_type == "project"] | order(name asc) {
            _id,
            name,
            description,
            location,
            status,
            completionDate,
            "slug": slug.current,
            services,
            category->{
                _id,
                title,
                "slug": slug.current
            },
            team[]->{
                _id,
                name,
                role,
                photo {
                    asset->{
                        _id,
                        url
                    }
                }
            },
            photoGallery[] {
                image {
                    asset->{
                        _id,
                        url
                    }
                }
            }
        }`
        
        // Fetch site settings
        const siteSettingsQuery = `*[_type == "siteSettings"][0] {
            _id,
            logo {
                asset->{
                    _id,
                    url
                }
            },
            navigation[] {
                title,
                url,
                description,
                image {
                    asset->{
                        _id,
                        url
                    }
                }
            }
        }`
        
        try {
            const [projectsResponse, siteSettingsResponse] = await Promise.all([
                fetch(`https://${sanityClient.projectId}.api.sanity.io/v${sanityClient.apiVersion}/data/query/${sanityClient.dataset}?query=${encodeURIComponent(projectsQuery)}`),
                fetch(`https://${sanityClient.projectId}.api.sanity.io/v${sanityClient.apiVersion}/data/query/${sanityClient.dataset}?query=${encodeURIComponent(siteSettingsQuery)}`)
            ])
            
            const [projectsData, siteSettingsData] = await Promise.all([
                projectsResponse.json(),
                siteSettingsResponse.json()
            ])
            
            this.projects = projectsData.result || []
            this.siteSettings = siteSettingsData.result || {}
            console.log("appended screensaver");
        } catch (error) {
            console.error('Error fetching data:', error)
            this.projects = []
            this.siteSettings = {}
        }
        
        
        this.elements()
        this.bind()
        this.update()
        this.populateMenu()
    }
    
    setup() {
        this.element.style.display = 'none'
    }
    
    setTimer(value) {
        this.timer = value
    }

    show() {
        this.sliderTimer = 1000;
        this.menu.style.width = '0'
        this.textMessage.style.clipPath = 'inset(0 0 0 0)'
        
        gsap.set(this.element, {
            display: 'grid',
            opacity: 0
        })
        gsap.to(this.element, {
            opacity: 1,
            duration: 2,
            ease: "expo.out"
        })
        
        this.createSlide()
    }

    hide() {
        gsap.to(this.element, {
            opacity: 0,
            duration: 2,
            ease: "expo.out",
            onComplete: () => {
                this.element.style.display = 'none'
                this.timer = 1000;
                this.active = false;
            }
        })
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

        
        this.currentSlide.innerHTML = `
            <img src="${project.photoGallery?.[0]?.image?.asset?.url || ''}" alt="${project.name || ''}" class="screensaver-project-image" />
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

        const split = SplitText.create(heading, { type: "words, chars", charsClass: "char" });

        gsap.from(this.currentSlide, {
            opacity: 0,
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
                if (this.previousSlide) {
                    this.previousSlide.remove()
                }
            }
        })

        gsap.from(split.chars, {
            opacity: 0,
            y: 20,
            rotateY: 50,
            stagger: {
                amount: 1,
            },
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
        
        if (this.previousSlide) {
            this.previousSlide.querySelector('.screensaver-project-info').removeEventListener('click', () => {
                this.hide()
            })
        }

        info?.addEventListener('click', (e) => {
            // Hide screensaver first, then let navigation happen
            this.hide()
        })

        this.element.appendChild(this.currentSlide)
    }

    bind() {
        document.addEventListener('mousedown', () => {
            if (this.active) return;
            this.timer = 1000
        })

        this.element.addEventListener('click', (e) => {
            if (!this.active) return;
            
            // Don't show menu if clicking on project links - let them navigate
            if (e.target.closest('.screensaver-project-info')) {
                return;
            }
            
            console.log("show menu");
            gsap.to(this.menu, {
                width: "28.125rem"
            })
            gsap.to(this.textMessage, {
                clipPath: "inset(0 50% 0 50%)",
                duration: 2,
            })
        })

        this.menu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                this.hide()
            })
        })
    }

    elements() {
        this.timer = 1000;
        this.sliderTimer = 1000;
        this.textMessage = this.element.querySelector('.screensaver-text')
        this.menu = this.element.querySelector('.screensaver-menu')
    }

    update() {
        this.ticker = (time) => {
            if (this.timer <= 0 && !this.active) {
                console.log("show once");
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
                    img.src = navItem.image.asset.url
                }
                if (text) {
                    text.textContent = navItem.title
                }
            }
        })
    }

    destroy() {
        document.removeEventListener('mousedown', this.mouseHandler)
        gsap.ticker.remove(this.ticker)
    }
}
