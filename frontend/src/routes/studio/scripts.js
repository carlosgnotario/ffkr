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
			url: `/projects/${project.slug.current}`
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
		this.elements()
		this.resize()
		this.bind()
		this.update()
		this.animate();
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
		
		// Basic element setup
		// this.gridItems = this.element.querySelectorAll(".studio-item")
		this.slides.forEach((slide, index) => {
			this.projectSliders[index] = new projectsSlider(this.projects[index], index)
			this.teamMemberCarousels[index] = new teamMembersCarousel(this.teamMembers[index], index)
		})
		
		// Initialize first slider as active
		this.projectSliders[0].setActive(true)
		this.teamMemberCarousels[0].setActive(true)
	}
	
	animate() {
		
		this.slides.forEach((slide, index) => {
			const heading = slide.querySelector("h2")
			const statItems = slide.querySelectorAll(".studio-category-stats-item")
			const slideItems = slide.querySelectorAll(".studio-category-project")
			const avatarItems = slide.querySelectorAll(".studio-category-member")
			const achievementsItems = slide.querySelectorAll(".studio-category-achievements-item")
			const split = SplitText.create(heading, { type: "words, chars", charsClass: "char" })

			gsap.from(split.chars, {
				opacity: 0,
				y: 20,
				rotateY: 50,
				stagger: {
					amount: 1,
				},
				delay: 1,
				onComplete: () => split.revert()
			})			

			gsap.from(slideItems, {
				opacity: 0,
				y: 200,
				delay: (i, el, arr) => 1 + Math.pow(Math.min(i, arr.length - i), 1.8) * 0.1
			})

			gsap.from(statItems, {
				opacity: 0,
				y: 100,
				delay: 1,
				ease: "expo.out",
				stagger: 0.3
			})
			gsap.from(achievementsItems, {
				opacity: 0,
				y: 100,
				delay: 1,
				ease: "expo.out",
				stagger: 0.3
			})

			gsap.from(avatarItems, {
				opacity: 0,
				top: 200,
				position: "relative",
				ease: "expo.out",
				stagger: {amount: 1, from: "center"},
				delay: 1,
				scale: 0
			})

			
		})

		gsap.from(this.element, {
			opacity: 0,
			y: 100,
			delay: 1
		})
	}

	resize() {
		this.W = this.element.clientWidth
		this.H = this.element.clientHeight
		this.slideW = this.slides[0].clientWidth;
		this.vw = window.innerWidth
		this.vh = window.innerHeight
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
			console.log("dragging");
			
			this.pos.x.new = e.clientX;
		}
		this.mouseUpEvent = (e) => {
			if (!this.pos.dragging) return;
			this.pos.x.stored += this.pos.x.new - this.pos.x.old;
			
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
		}

		// Bind events
		this.element.addEventListener("mousedown", this.mouseDownEvent)
		window.addEventListener("resize", this.resize)
		window.addEventListener("mousemove", this.mouseMoveEvent)
		window.addEventListener("mouseup", this.mouseUpEvent)
	}

	update() {
		const moveSlider = gsap.quickTo(this.element, "x", {duration: 2, ease: "expo.out"})
		const moveBar = gsap.quickTo(this.bar, "width", {duration: 1, ease: "expo.out"})

		this.ticker = (time) => {
			const currentPos = -(this.currentSlide * this.slideW) + (this.pos.x.new - this.pos.x.old)
			moveSlider(currentPos)
			moveBar((-currentPos / (this.W - this.vw) * this.vw))
		}
		gsap.ticker.add(this.ticker)
	}

	changeSlide(slide) {
		this.projectSliders[this.currentSlide].setActive(false)
		this.teamMemberCarousels[this.currentSlide].setActive(false)
		
		this.slides[this.currentSlide].classList.remove("active");
		
		this.slides[slide].classList.add("active");
		this.currentSlide = slide;
		
		this.projectSliders[this.currentSlide].setActive(true)
		this.teamMemberCarousels[this.currentSlide].setActive(true)
	}

	destroy() {
		// Cleanup when component is destroyed
		gsap.ticker.remove(this.ticker)
		window.removeEventListener("mousemove", this.mouseMoveEvent)
		window.removeEventListener("mouseup", this.mouseUpEvent)
		this.element.removeEventListener("mousedown", this.mouseDownEvent)
		window.removeEventListener("resize", this.resize)
		
		this.projectSliders.forEach(slider => slider.destroy())
		this.teamMemberCarousels.forEach(carousel => carousel.destroy())
		console.clear()
	}
}

class projectsSlider {
	constructor(element, index) {
		this.element = element
		this.index = index
		this.isActive = false
		console.log("just how many");
		
		this.define()
		this.sizing()		
		this.bind()
		this.update()
	}

	define() {
		this.slides = this.element.querySelectorAll(".studio-category-project")
		this.slides.forEach(slide => {
			slide.loop = 0
			slide.xPos = gsap.quickTo(slide, "x", {duration: 0.5, ease: "expo.out"})
			slide.zPos = gsap.quickTo(slide, "z", {duration: 0.5, ease: "expo.out"})
		})
	}

	bind() {
		this.pos = {
			dragging: false,
			x: {new: 0, old: 0, stored: 0},
		}
		this.mouseDownEvent = (e) => {
			e.stopPropagation()
			
			this.pos.dragging = true;
			this.pos.x.old = this.pos.x.new = e.clientX;
		}
		this.mouseMoveEvent = (e) => {
			if (!this.pos.dragging) return;
			e.stopPropagation()

			this.pos.x.new = e.clientX;
			if (Math.abs(this.pos.x.new - this.pos.x.old) > 3) {
				// this.element.style.pointerEvents = "none"
			}
			
		}
		this.mouseUpEvent = (e) => {
			if (!this.pos.dragging) return;
			this.pos.dragging = false;
			
			this.pos.x.stored += this.pos.x.new - this.pos.x.old;
			this.pos.x.old = this.pos.x.new = 0;
			// this.element.style.pointerEvents = "auto"
		}

		this.element.addEventListener("mousedown", this.mouseDownEvent)
		window.addEventListener("mousemove", this.mouseMoveEvent)
		window.addEventListener("mouseup", this.mouseUpEvent)
		window.addEventListener("resize", this.sizing)
	}

	sizing() {
		this.sliderW = this.element.clientWidth
		this.slideW = this.slides[0].clientWidth
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
			const currentPos = this.pos.x.stored + (this.pos.x.new - this.pos.x.old)

			this.slides.forEach((slide, index) => {				
				let position = index * this.slideW + currentPos
				
				if (position + (slide.loop * this.slidesW) > this.edge) {
					slide.loop -= 1
				} else if (position + (slide.loop * this.slidesW) < -this.edge) {
					slide.loop += 1
				}
				slide.xPos(position + (slide.loop * this.slidesW))
				slide.zPos(Math.abs(position + (slide.loop * this.slidesW)) * -0.4)
			})
		}
		gsap.ticker.add(this.ticker)
	}
	
	setActive(active) {
		this.isActive = active
	}

	destroy() {
		gsap.ticker.remove(this.ticker)
		window.removeEventListener("mousemove", this.mouseMoveEvent)
		window.removeEventListener("mouseup", this.mouseUpEvent)
		this.element.removeEventListener("mousedown", this.mouseDownEvent)
		window.removeEventListener("resize", this.sizing)
	}
}

class teamMembersCarousel {
	constructor(element, index) {
		this.element = element
		this.isActive = false;
		
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

		this.members.forEach((member, index) => {
			member.addEventListener("mousedown", (e) => {
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
						opacity: 0,
						y: 100,
						ease: "elastic.out(1, 0.8)"
					})

					this.cardOpen = index;
					console.log("clicked");
					
				}
			})
		})

		window.addEventListener("mouseup", () => {
			if (this.cardOpen !== null) {
				this.cardOpen = null;
				this.memberCardWrap.innerHTML = ""
				// speed 0.4
				gsap.to(this, {
					speed: 0.4,
					ease: "expo.out",
					duration: 2
				})
			}
		})

		window.addEventListener("mousedown", this.mouseDownEvent)
		window.addEventListener("mouseup", this.mouseUpEvent)
	}

	update() {
		this.position = 0;
		this.speed = 0.4;

		this.ticker = (time) => {
			this.position -= this.speed

			
			this.members.forEach((member, index) => {
				if (index === 0) {
					// console.log(member.left, this.position);
					
				}
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
		window.removeEventListener("mouseup", this.mouseUpEvent)
		window.removeEventListener("mousedown", this.mouseDownEvent)
	}
}
