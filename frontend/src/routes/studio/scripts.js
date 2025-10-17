import { tick } from 'svelte'
import gsap from 'gsap'
import SplitText from 'gsap/SplitText'

export async function loadStudioData() {
	let categories = []
	let projects = []
	
	// Fetch categories and projects (team members are already included in categories API)
	const [categoriesFetch, projectsFetch] = await Promise.all([
		fetch('/api/categories'),
		fetch('/api/projects')
	])
	
	categories = await categoriesFetch.json()
	projects = await projectsFetch.json()
	
	// Add projects to their categories (team members are already included in categories)
	categories.forEach(category => {
		category.projects = projects.filter(project => 
			project.category && project.category._id === category._id
		).map(project => ({
			...project,
			url: `/projects/${project.slug}`
		}))
	})
	
	await tick()	
	return {
		categories,
	}
}

export class studioGrid {
	constructor(element) {
		this.element = element
		this.resize = this.resize.bind(this)
		this.elements()
		this.resize()
		this.bind()
		this.update()
		if (document.fonts && document.fonts.ready) {
			document.fonts.ready.then(() => {
				this.animate();
			})
		}
		this.destroy = this.destroy.bind(this)
		gsap.registerPlugin(SplitText);
	}
	
	elements() {
		this.slides = this.element.querySelectorAll(".studio-category");
		this.bar = this.element.parentElement.querySelector(".studio-bar span");
		this.projects = this.element.querySelectorAll(".studio-category-projects");
		this.teamMembers = this.element.querySelectorAll(".studio-category-members");
		// Variables
		this.currentSlide = 0;
		
		// Store slider instances for direct communication
		this.projectSliders = [];
		this.teamMemberCarousels = [];
		
		// Store SplitText instances for cleanup
		this.splitInstances = [];
		
		// Store GSAP animations for cleanup
		this.animations = [];
		
		// Basic element setup
		// this.gridItems = this.element.querySelectorAll(".studio-item")
		this.slides.forEach((slide, index) => {
			if (this.projects[index]) {
				this.projectSliders[index] = new projectsSlider(this.projects[index], index)
			}
			if (this.teamMembers[index].querySelectorAll(".studio-category-member").length > 0) {
				this.teamMemberCarousels[index] = new teamMembersCarousel(this.teamMembers[index], index)
			}
		})
		
		// Initialize first slider as active (with safety check)
		if (this.projectSliders[0] && this.teamMemberCarousels[0]) {
			this.projectSliders[0].setActive(true)
			this.teamMemberCarousels[0].setActive(true)
		}
	}
	
	animate() {
		this.slides.forEach((slide, index) => {
			const heading = slide.querySelector("h2")
			const statItems = slide.querySelectorAll(".studio-category-stats-item")
			const slideItems = slide.querySelectorAll(".studio-category-project")
			const avatarItems = slide.querySelectorAll(".studio-category-member")
			const achievementsItems = slide.querySelectorAll(".studio-category-achievements-item")
			const split = SplitText.create(heading, { type: "words, chars", wordsClass: "splitword", charsClass: "char" });
			
			// Store split instance for cleanup
			this.splitInstances.push(split);

			this.animations.push(gsap.from(split.chars, {
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
			}))

			this.animations.push(gsap.from(slideItems, {
				autoAlpha: 0,
				y: 200,
				delay: (i, el, arr) => 1 + Math.pow(Math.min(i, arr.length - i), 1.8) * 0.1
			}))

			statItems.length && this.animations.push(gsap.from(statItems, {
				autoAlpha: 0,
				y: 100,
				delay: 1,
				ease: "expo.out",
				stagger: 0.3
			}))
			achievementsItems.length && this.animations.push(gsap.from(achievementsItems, {
				autoAlpha: 0,
				y: 100,
				delay: 1,
				ease: "expo.out",
				stagger: 0.3
			}))

			avatarItems.length && this.animations.push(gsap.from(avatarItems, {
				autoAlpha: 0,
				top: 200,
				position: "relative",
				ease: "expo.out",
				stagger: {amount: 1, from: "center"},
				delay: 1,
				scale: 0
			}))

			
		})

		this.animations.push(gsap.from(this.element, {
			autoAlpha: 0,
			y: 100,
			delay: 1
		}))
	}

	resize() {
		this.W = this.element.clientWidth
		this.H = this.element.clientHeight
		this.slideW = this.slides[0] ? this.slides[0].clientWidth : 0;
		this.vw = window.innerWidth
		this.vh = window.innerHeight
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
			this.pos.x.stored += (this.pos.x.new - this.pos.x.old) * (window.movementModifier || 1);
			
			if (-this.pos.x.stored < 0) {
				this.pos.x.stored = 0;
			} else if (-this.pos.x.stored > (this.W - this.vw)) {
				this.pos.x.stored = -(this.W - this.vw);
			}

			if (-this.pos.x.stored > this.currentSlide * this.slideW + (this.slideW * 0.2)) {
				this.pos.x.stored = -(this.currentSlide + 1) * this.slideW;
				this.changeSlide(this.currentSlide + 1)
			} else if (-this.pos.x.stored < this.currentSlide * this.slideW - (this.slideW * 0.2)) {
				this.pos.x.stored = -(this.currentSlide - 1) * this.slideW;
				this.changeSlide(this.currentSlide - 1)				
			}
			
			this.pos.dragging = false;
			this.pos.x.old = this.pos.x.new = 0;
			// timeout
			setTimeout(() => {
				this.pos.blockClicks = false;
			}, 10);
		}

		this.slideClickHandlers = [];
		this.slides.forEach((el, i) => {
			const handler = () => {
				if (i === this.currentSlide) return;
				if (this.pos.blockClicks) return;
				this.changeSlide(i)
			};
			this.slideClickHandlers.push({ element: el, handler });
			el.addEventListener("click", handler);
		});

		// Touch events
        this.element.addEventListener("touchstart", this.mouseDownEvent)
        window.addEventListener("touchmove", this.mouseMoveEvent)
        window.addEventListener("touchend", this.mouseUpEvent)
        
        // Mouse events
        this.element.addEventListener("mousedown", this.mouseDownEvent)
        window.addEventListener("mousemove", this.mouseMoveEvent)
        window.addEventListener("mouseup", this.mouseUpEvent)

		window.addEventListener("resize", this.resize)
	}

	update() {
		const moveSlider = gsap.quickTo(this.element, "x", {duration: 2, ease: "expo.out"})
		const moveBar = gsap.quickTo(this.bar, "width", {duration: 1, ease: "expo.out"})

		this.ticker = (time) => {
			const currentPos = -(this.currentSlide * this.slideW) + ((this.pos.x.new - this.pos.x.old) * (window.movementModifier || 1))
			moveSlider(currentPos)
			moveBar((-currentPos / (this.W - this.vw) * this.vw))
		}
		gsap.ticker.add(this.ticker)
	}

	changeSlide(slide) {
		this.projectSliders[this.currentSlide]?.setActive(false)

		this.teamMemberCarousels[this.currentSlide]?.setActive(false)
		
		this.slides[this.currentSlide].classList.remove("active");
		
		this.slides[slide].classList.add("active");
		this.currentSlide = slide;
		
		this.projectSliders[this.currentSlide]?.setActive(true)
		this.teamMemberCarousels[this.currentSlide]?.setActive(true)
	}

	// Method to navigate to a specific slide (used by menu)
	goToSlide(slideIndex) {
		if (slideIndex < 0 || slideIndex >= this.slides.length) return
		
		// Animate to position
		this.pos.x.stored = -(slideIndex * this.slideW)
		
		// Change slide
		this.changeSlide(slideIndex)
	}

	destroy() {
		// Kill all GSAP animations
		this.animations.forEach(anim => anim.kill());
		this.animations = [];
		
		// Revert all SplitText instances
		this.splitInstances.forEach(split => split.revert());
		this.splitInstances = [];
		
		// Cleanup when component is destroyed
		gsap.ticker.remove(this.ticker)

		this.element.removeEventListener("mousedown", this.mouseDownEvent)
		window.removeEventListener("touchmove", this.mouseMoveEvent)
		window.removeEventListener("touchend", this.mouseUpEvent)
		
		this.element.removeEventListener("touchstart", this.mouseDownEvent)
		window.removeEventListener("mousemove", this.mouseMoveEvent)
		window.removeEventListener("mouseup", this.mouseUpEvent)
		
		window.removeEventListener("resize", this.resize)
		
		// Remove slide click handlers
		this.slideClickHandlers?.forEach(({ element, handler }) => {
			element.removeEventListener("click", handler);
		});
		this.slideClickHandlers = [];
		
		this.projectSliders.forEach(slider => slider?.destroy())
		this.teamMemberCarousels.forEach(carousel => carousel?.destroy())
		console.clear()
	}
}

class projectsSlider {
	constructor(element, index) {
		this.element = element
		this.index = index
		this.isActive = false
		
		// Early return if element doesn't exist
		if (!this.element) {
			// Provide stub methods to prevent errors
			this.setActive = () => {};
			return;
		}
		
		this.sizing = this.sizing.bind(this)
		this.define()
		this.sizing()		
		this.bind()
		this.update()
	}

	define() {
		this.slides = this.element.querySelectorAll(".studio-category-project")
		this.wrap = this.element.parentElement;
		this.slides.forEach(slide => {
			slide.loop = 0
			slide.xPos = gsap.quickTo(slide, "x", {duration: 0.5, ease: "expo.out"})
			slide.zPos = gsap.quickTo(slide, "z", {duration: 0.5, ease: "expo.out"})
			slide.alpha = gsap.quickTo(slide, "opacity", {duration: 0.5, ease: "expo.out"})
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
			e.stopPropagation()
			
			this.pos.dragging = true;
			this.pos.x.old = this.pos.x.new = getClientX(e);
		}
		this.mouseMoveEvent = (e) => {
			if (!this.pos.dragging) return;
			e.stopPropagation()

			this.pos.x.new = getClientX(e);
			if (Math.abs(this.pos.x.new - this.pos.x.old) > 3) {
				this.slides.forEach(slide => {
					slide.style.pointerEvents = "none"
				})
			}
			
		}
		this.mouseUpEvent = (e) => {
			if (!this.pos.dragging) return;
			this.pos.dragging = false;
			
			this.pos.x.stored += (this.pos.x.new - this.pos.x.old) * (window.movementModifier || 1);
			this.pos.x.old = this.pos.x.new = 0;
			this.slides.forEach(slide => {
				slide.style.pointerEvents = "auto"
			})
		}

		// Touch events
        this.element.addEventListener("touchstart", this.mouseDownEvent)
        window.addEventListener("touchmove", this.mouseMoveEvent)
        window.addEventListener("touchend", this.mouseUpEvent)
        
        // Mouse events
		this.wrap.addEventListener("mousedown", this.mouseDownEvent)
		window.addEventListener("mousemove", this.mouseMoveEvent)
		window.addEventListener("mouseup", this.mouseUpEvent)

		window.addEventListener("resize", this.sizing)
	}

	sizing() {
		this.sliderW = this.element.offsetWidth
		this.slideW = this.slides[0].offsetWidth
		this.slidesW = this.slides.length * this.slideW
		this.edge = this.slidesW / 2

		this.slides.forEach((slide, index) => {
			slide.left = index * this.slideW

			let position = index * this.slideW

			if (position + (slide.loop * this.slidesW) > this.edge) {
				slide.loop -= 1
			} else if (position + (slide.loop * this.slidesW) < -this.edge) {
				slide.loop += 1
			}

			gsap.set(slide, { x: position + (slide.loop * this.slidesW), z: Math.abs(position + (slide.loop * this.slidesW)) * -0.4 })
		})
	}

	update() {
		this.ticker = (time) => {
			if (!this.isActive) return;
			
			const currentPos = this.pos.x.stored + ((this.pos.x.new - this.pos.x.old) * (window.movementModifier || 1))		

			this.slides.forEach((slide, index) => {				
				let position = index * this.slideW + currentPos
				
				if (position + (slide.loop * this.slidesW) > this.edge) {
					slide.loop -= 1
				} else if (position + (slide.loop * this.slidesW) < -this.edge) {
					slide.loop += 1
				}
				slide.xPos(position + (slide.loop * this.slidesW) - ((position + (slide.loop * this.slidesW)) * (this.sliderW * 0.0003)))
				slide.zPos(Math.abs(position + (slide.loop * this.slidesW)) * -(this.sliderW * 0.0002))
				if (Math.abs(position + (slide.loop * this.slidesW)) > this.sliderW) {
					slide.alpha(0)
				} else {
					slide.alpha(1)
				}
			})
		}

		gsap.ticker.add(this.ticker)
	}
	
	setActive(active) {
		this.isActive = active
	}

	destroy() {
		// Cleanup when component is destroyed
		gsap.ticker.remove(this.ticker)
		
		// Remove touch events
		this.element.removeEventListener("touchstart", this.mouseDownEvent)
		window.removeEventListener("touchmove", this.mouseMoveEvent)
		window.removeEventListener("touchend", this.mouseUpEvent)
		// Remove mouse events - FIX: was added to this.wrap, not this.element
		this.wrap?.removeEventListener("mousedown", this.mouseDownEvent)
		window.removeEventListener("mousemove", this.mouseMoveEvent)
		window.removeEventListener("mouseup", this.mouseUpEvent)
		
		window.removeEventListener("resize", this.sizing)
	}
}

class teamMembersCarousel {
	constructor(element, index) {
		this.element = element
		this.isActive = false;
		
		// Early return if element doesn't exist
		if (!this.element) {
			// Provide stub methods to prevent errors
			this.setActive = () => {};
			return;
		}
		
		this.sizing = this.sizing.bind(this)
		this.define();
		this.sizing();
		this.bind();
		this.update();
	}

	define() {
		this.members = this.element.querySelectorAll(".studio-category-member");
		this.memberCard = this.element.closest(".studio-category").querySelectorAll(".team-member")
		this.memberCardWrap = this.element.closest(".studio-category").querySelector(".studio-category-member-cards")

		// Store the card data before removing them
		this.memberCardData = Array.from(this.memberCard).map(card => ({
			id: card.dataset.id,
			html: card.outerHTML
		}))

		this.memberCardWrap.innerHTML = ""
	}

	sizing() {
		this.slideW = this.members[0].offsetWidth;
		this.carouselW = this.element.clientWidth

		// Detect the number of members that could fit in the carousel
		this.membersTotal = Math.ceil(this.carouselW / this.slideW) + 1
		this.element.innerHTML = ""
		
		for (let i = 0; i < Math.ceil(this.membersTotal / this.members.length); i++) {
			this.members.forEach((member, index) => {
				this.element.appendChild(member.cloneNode(true))
			})
		}
	
		this.members = this.element.querySelectorAll(".studio-category-member")
		this.loopW = this.slideW * this.members.length

		this.members.forEach(member => {
			member.left = member.offsetLeft
			member.loop = 0;
		})		
	}

	bind() {
		this.currentCard = null;
		this.cardOpen = null;
		this.memberClickHandlers = [];
		
		this.members.forEach((member, index) => {
			member.touchEvent = (e) => {
				e.preventDefault()
				if (!this.isActive) return;
				if (this.cardOpen === index) return;
				e.stopPropagation()
				gsap.killTweensOf(this);
				this.speed = 0;

				const cardData = this.memberCardData.find(card => card.id === member.dataset.id)
				if (cardData) {
					this.memberCardWrap.innerHTML = ""
					this.memberCardWrap.innerHTML = cardData.html
					
					gsap.set(this.memberCardWrap.querySelector(".team-member"), {
						x: member.getBoundingClientRect().left - this.memberCardWrap.getBoundingClientRect().left + this.slideW / 2
					})
					gsap.from(this.memberCardWrap.querySelector(".team-member"), {
						autoAlpha: 0,
						y: 100,
						ease: "elastic.out(1, 0.8)",
						delay: 0.1
					})

					this.cardOpen = index;
					
				}
			}

			member.addEventListener("click", member.touchEvent)
			this.memberClickHandlers.push({ element: member, handler: member.touchEvent });
		})

		this.mouseUpEvent = (e) => {
			if (this.cardOpen !== null) {
				this.cardOpen = null;
				this.memberCardWrap.innerHTML = ""
				// speed 0.4
				gsap.to(this, {
					speed: 0.4,
					ease: "expo.out",
					duration: 2,
				})
			}
		}

		window.addEventListener("click", this.mouseUpEvent)
		// window.addEventListener("touchend", this.mouseUpEvent)
		window.addEventListener("resize", this.sizing)
	}

	update() {
		this.position = 0;
		this.speed = 0.4;

		this.ticker = (time) => {
			this.position -= this.speed

			
			this.members.forEach((member, index) => {
				if (member.left + this.slideW + this.position + member.loop * this.loopW < 0) {
					member.loop += 1
				}

				member.style.transform = `translateX(${this.position + (member.loop * this.loopW)}px)`
			})
		}
		gsap.ticker.add(this.ticker)
	}

	setActive(active) {
		this.isActive = active
	}

	destroy() {
		gsap.ticker.remove(this.ticker)
		
		// Remove member click handlers
		this.memberClickHandlers?.forEach(({ element, handler }) => {
			element.removeEventListener("click", handler);
		});
		this.memberClickHandlers = [];
				
		// FIX: Remove correct event type (was "click", not "mouseup")
		window.removeEventListener("click", this.mouseUpEvent)
		window.removeEventListener("touchend", this.mouseUpEvent)
		window.removeEventListener("resize", this.sizing)
	}
}
