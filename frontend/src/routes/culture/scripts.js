import { tick } from 'svelte'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'

export async function loadCultureData() {
	let teamMembers = []
	let siteSettings = []
	let cities = []
	let newsPosts = []
	let tradingCards = null
	
	gsap.registerPlugin(Flip)
	const membersFetch = await fetch('/api/team-members')
	teamMembers = await membersFetch.json()
	
	const settingsFetch = await fetch('/api/site-settings')
	siteSettings = await settingsFetch.json()	

	const citiesFetch = await fetch('/api/cities')
	cities = await citiesFetch.json()

	const newsPostsFetch = await fetch('/api/featured-posts')
	newsPosts = await newsPostsFetch.json()

	const tradingCardsFetch = await fetch('/api/trading-cards')
	tradingCards = await tradingCardsFetch.json()
	
	await tick()	
	return {
		teamMembers,
		siteSettings,
		cities,
		newsPosts,
		tradingCards,
	}
}

export class cultureGrid {
	constructor(element, members, settings) {
		this.element = element
		this.members = members
		this.settings = settings
		// Options
		this.totalSlots = 390

		
		this.elements()
		this.generate()
		this.resize()
		this.animate()
		this.destroy = this.destroy.bind(this)
		this.resize = this.resize.bind(this)
		this.bind()
		this.update()
		this.tradingCards()
	}
	
	elements() {
		if (!this.element) return;
		
		this.gridItems = []
		this.teamCards = Array.from(this.element.querySelectorAll(".team-member"))
		this.modal = this.element.closest(".culture").querySelector(".team-member-modal")
		this.testimonialModal = this.element.closest(".culture").querySelector(".testimonial-modal")
		this.filter = this.element.closest(".culture").querySelector(".team-member-filter")
		this.filterCities = this.filter.querySelectorAll(".team-member-filter-item")
		this.content = this.element.closest(".culture").querySelector(".culture-content")
		this.newsItems = this.content.querySelectorAll(".culture-content-news-item")
		this.tradingCardsWrapper = this.content.querySelector(".culture-content-cards")
		
		this.teamItems = this.element.querySelectorAll(".avatar")
		this.awardItems = this.element.querySelectorAll(".award")
		this.testimonialItems = this.element.querySelectorAll(".testimonial")
	}

	generate() {
		// Clean up old grid items before regenerating
		this.cleanupGridItems();
		
		this.element.innerHTML = ""
		//
		const totalAvatars = this.totalSlots - (this.awardItems.length * 3) - (this.testimonialItems.length * 3)
		let specialItems = [...this.awardItems, ...this.testimonialItems]
		let priorColumn = null
		
		for (let i = 0; i < totalAvatars; i++) {
			this.element.appendChild(this.teamItems[i % this.teamItems.length].cloneNode(true))
		}

		specialItems.forEach((item, index) => {
			let row = Math.floor(this.totalSlots / 26 / (specialItems.length + 1) * (index + 1))
			let column = Math.round(Math.random() * 23)

			if (Math.abs(priorColumn - column) < 5) { column = (priorColumn + 13) % 23 }

			const slot = row * 26 + column
			this.element.children[slot - 1 - (2 * index)].insertAdjacentHTML("afterend", item.outerHTML)
			priorColumn = column
		})

		
		this.gridItems = Array.from(this.element.children);
		this.gridItems.forEach(el => {
			el.setScale = gsap.quickSetter(el, "css")
			el.inView = true;

			el.scales = {
				border: 0,
				animation: 0,
				filter: 0,
				ripple: 0
			}
			//
			// el.animated = false; el.dragged = false;
			// el.scaleX = gsap.quickTo(el, "scaleX", {ease: "elastic.out(1, 0.8)" , duration: 2})
			// el.scaleY = gsap.quickTo(el, "scaleY", {ease: "elastic.out(1, 0.8)" , duration: 2})
			// el.wrapScaleX = gsap.quickTo(el.querySelector(".wrap"), "scaleX", {ease: "elastic.out(1, 0.3)" , duration: 2})
			// el.wrapScaleY = gsap.quickTo(el.querySelector(".wrap"), "scaleY", {ease: "elastic.out(1, 0.3)" , duration: 2})
		});


	}
	
	cleanupGridItems() {
		// Remove event listeners from old grid items
		if (this.gridItems && this.gridItemClickHandlers) {
			this.gridItems.forEach((item, index) => {
				if (this.gridItemClickHandlers[index]) {
					item.removeEventListener("click", this.gridItemClickHandlers[index]);
				}
			});
		}
		// Kill all GSAP tweens targeting grid items
		if (this.gridItems) {
			this.gridItems.forEach(item => {
				gsap.killTweensOf(item);
				if (item.scales) {
					gsap.killTweensOf(item.scales);
				}
			});
		}
		// Clear the arrays
		this.gridItems = [];
		this.gridItemClickHandlers = [];
	}
	
	animate() {
		this.animated = false;

		gsap.from(this.element.closest(".culture"), {
			xPercent: 20,
			duration: 2,
			ease: "expo.out",
			delay: 1
		})

		gsap.to(this.content, {
			rotateY: 0,
			delay: 1,
			ease: "expo.out",
			duration: 2
		})

		gsap.from(this.newsItems, {
			autoAlpha: 0,
			duration: 2,
			y: 100,
			ease: "expo.out",
			delay: 1,
			stagger: 0.3
		})


		gsap.from(this.element, {
			rotate: 60,
			scale: 2,
			duration: 2,
			ease: "expo.out",
			delay: 1
		})

		this.gridItems?.forEach((item, index) => {
			const xPos = item.getBoundingClientRect().left
			const yPos = item.getBoundingClientRect().top
			const distanceFromCenter = Math.sqrt(Math.pow(xPos - this.cx, 2) + Math.pow(yPos - this.cy, 2))
			
			gsap.to(item.scales, {
				animation: 1,
				ease: "elastic.out(1.5,0.75)",
				delay: (1 + (1 - Math.exp(-distanceFromCenter * 0.001)))
			})
		})
		
		gsap.from(this.filterCities, {
			autoAlpha: 0,
			duration: 1,
			ease: "expo.out",
			delay: 1,
			y: 100,
			stagger: {
				amount: 0.3,
				from: "center"
			},
			scale: 0.6
		})
	}

	bind() {
		this.pos = {
			dragging: false,
			x: {new: 0, old: 0, stored: 0},
			y: {new: 0, old: 0, stored: 0},
		}

		const getClientX = (e) => {
            return e.touches ? e.touches[0].clientX : e.clientX;
        }

		const getClientY = (e) => {
            return e.touches ? e.touches[0].clientY : e.clientY;
        }

		this.mouseDownEvent = (e) => {
			this.pos.dragging = true;
			this.pos.x.old = this.pos.x.new = getClientX(e);
			this.pos.y.old = this.pos.y.new = getClientY(e);

			this.ripple();
		}

		this.mouseMoveEvent = (e) => {
			if (!this.pos.dragging) return;
			
			if (
				Math.abs(this.pos.x.stored + (this.pos.x.new - this.pos.x.old)) < (this.gridW - this.vw) / 2 &&
				Math.abs(this.pos.y.stored + (this.pos.y.new - this.pos.y.old)) < (this.gridH - this.vh) / 2
			) {
			}

			if (Math.abs(this.pos.x.new - this.pos.x.old) > 3 || Math.abs(this.pos.y.new - this.pos.y.old) > 3) {
				this.element.style.pointerEvents = "none"
			}
			
			this.pos.x.new = getClientX(e);
			this.pos.y.new = getClientY(e);
			
		}

		this.mouseUpEvent = (e) => {
			if (!this.pos.dragging) return;
			this.pos.dragging = false;
			this.pos.x.stored += this.pos.x.new - this.pos.x.old;
			this.pos.y.stored += this.pos.y.new - this.pos.y.old;
			this.pos.x.old = this.pos.x.new = 0;
			this.pos.y.old = this.pos.y.new = 0;
			
			if (Math.abs(this.pos.x.stored) > (this.gridW - this.vw) / 2) {
				if (this.pos.x.stored > 0) {
					this.pos.x.stored = (this.gridW - this.vw) / 2;
				} else {
					this.pos.x.stored = -(this.gridW - this.vw) / 2;
				}
			}
			if (Math.abs(this.pos.y.stored) > (this.gridH - this.vh) / 2) {
				if (this.pos.y.stored > 0) {
					this.pos.y.stored = (this.gridH - this.vh) / 2;
				} else {
					this.pos.y.stored = -(this.gridH - this.vh) / 2;
				}
			}
			this.element.style.pointerEvents = "auto"
		}

		// Store event handlers for proper cleanup
		this.gridItemClickHandlers = [];
		this.gridItems.forEach((item, index) => {
			const clickHandler = () => {
				// if this data id is the same as one of the team card data ids, append the team card on the modal
				if (this.teamCards.some(card => card.dataset.id === item.dataset.id)) {
					this.openModal(item.dataset.id)
				}

				if (item.classList.contains("testimonial")) {
					this.openTestimonialModal(item.dataset.video, true)
				}
			};
			this.gridItemClickHandlers[index] = clickHandler;
			item.addEventListener("click", clickHandler);
		})

		this.modal.addEventListener('click', () => {
			this.openModal(null, false)
		})

		this.testimonialModal.addEventListener('click', () => {
			this.openTestimonialModal(null, false)
		})

		this.currentCity = "all";
		// Store filter city handlers for proper cleanup
		this.filterCityHandlers = [];
		this.filterCities.forEach((city, index) => {
			const clickHandler = () => {
				if (this.currentCity === city.dataset.city) { return; }
				this.filterCity(city.dataset.city)
			};
			this.filterCityHandlers[index] = clickHandler;
			city.addEventListener('click', clickHandler);
		})

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

	filterCity(city) {
		// Filter grid items by city
		this.filterCities.forEach(el => {
			if (el.dataset.city === this.currentCity) {
				el.classList.remove("active");
			} else if (el.dataset.city === city) {
				el.classList.add("active");
			}
		})

		if (city !== "all") {
			this.gridItems?.forEach(item => {
				if (!item.classList.contains("avatar")) { return; }
				if (item.dataset.city === city) {
					gsap.killTweensOf(item.querySelector(".wrap"))
					item.filtered = false;
					gsap.to(item.scales, {
						filter: 0,
						duration: 1,
						ease: "expo.out"
					})
				} else {
					gsap.killTweensOf(item.querySelector(".wrap"))
					item.filtered = true;
					gsap.to(item.scales, {
						filter: 1,
						duration: 1,
						ease: "expo.out"
					})
				}
			})
		} else {
			this.gridItems?.forEach(item => {
				gsap.killTweensOf(item.querySelector(".wrap"))
				item.filtered = false;
				gsap.to(item.scales, {
					filter: 0,
					duration: 1,
					ease: "expo.out"
				})
			})
		}
		
		// Equalize
		this.currentCity = city;
	}

	openTestimonialModal(video, open = true) {
		if (open) {
			let embedUrl = video.includes("vimeo.com")
				? `https://player.vimeo.com/video/${video.split("/").pop()}?autoplay=1`
				: `https://www.youtube.com/embed/${video.split("v=")[1]}?autoplay=1`;
			this.testimonialModal.innerHTML = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
			gsap.to(this.testimonialModal, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
			this.testimonialModal.style.pointerEvents = "auto";
		} else {
			this.testimonialModal.innerHTML = ""
			gsap.to(this.testimonialModal, {
				autoAlpha: 0,
				duration: 0.5,
				ease: "power2.out"
			})
			this.testimonialModal.style.pointerEvents = "none"
		}
	}

	openModal(id, open = true) {
		if (open) {
			this.modal.innerHTML = ""
			gsap.killTweensOf(this.modal)
			this.modal.appendChild(this.teamCards.find(card => card.dataset.id === id).cloneNode(true))
			gsap.to(this.modal, {
				autoAlpha: 1,
				duration: 0.5,
				ease: "power2.out"
			})
			gsap.from(this.modal.querySelector(".team-member-wrap"), {
				scale: 1.2,
				duration: 2,
				clipPath: "inset(50% 50% 50% 50%)",
				ease: "expo.out"
			})
			this.modal.style.pointerEvents = "auto"
		} else {
			gsap.to(this.modal, {
				autoAlpha: 0,
				duration: 0.5,
				ease: "power2.out",
			})
			this.modal.style.pointerEvents = "none"
		}
	}

	ripple() {
		let closestDistance = 200;
		let closestItem = null;
		
		// Calculate maximum possible distance for normalization
		const maxDistance = Math.sqrt(Math.pow(this.vw, 2) + Math.pow(this.vh, 2));

		this.gridItems.forEach((item, index) => {
			// Find the item that's closer to mouse
			const distanceFromMouse = 
				Math.sqrt(
					Math.pow(((item.x + item.offsetWidth / 2) - (this.gridW - this.vw) / 2) + this.pos.x.stored - this.pos.x.new, 2) + 
					Math.pow(((item.y + item.offsetHeight / 2) - (this.gridH - this.vh) / 2) + this.pos.y.stored - this.pos.y.new, 2)
				)

			
			if (distanceFromMouse < closestDistance) {
				closestDistance = distanceFromMouse;
				closestItem = item;
			}			

			// Normalize distance and calculate final scale in one line
			const finalScale = Math.exp(-Math.min(distanceFromMouse / maxDistance, 1) * 8);

			// gsap.killTweensOf(item.querySelector(".wrap"))
			const tl = gsap.timeline()

			tl.to(item.scales, {
				ripple: finalScale,
				duration: 0.1,
				ease: "power2.out",
				delay: (distanceFromMouse / maxDistance) * 1.5
			})
			tl.to(item.scales, {
				ripple: 0,
				duration: 2,
				ease: "elastic.out(1, 0.3)",
			})
		})
	}

	resize() {
		this.gridW = this.element.clientWidth
		this.gridH = this.element.clientHeight
		this.vw = this.element.parentElement.clientWidth
		this.vh = this.element.parentElement.clientHeight
		gsap.set(this.element, {
			xPercent: -50,
			yPercent: -50,
		})

		const rect = this.element.getBoundingClientRect();
		this.cx = rect.left + rect.width / 2;
		this.cy = rect.top + rect.height / 2;
		
		this.gridItems.forEach((item, index) => {
			item.x = item.offsetLeft
			item.y = item.offsetTop
			item.screenX = this.gridW / 2 - (item.x + item.offsetWidth / 2)
			item.screenY = this.gridH / 2 - (item.y + item.offsetHeight / 2)

			const distanceFromCenter = {
				x: Math.abs(item.x - this.gridW / 2),
				y: Math.abs(item.y - this.gridH / 2)
			}			
		})
	}

	update() {
		// Movement functionality
		const moveX = gsap.quickTo(this.element, "x", {duration: 2, ease: "expo.out"})
		const moveY = gsap.quickTo(this.element, "y", {duration: 2, ease: "expo.out"})	
		
		this.ticker = () => {
			// return;
			const currentPosX = (this.pos.x.new - this.pos.x.old) + this.pos.x.stored
			const currentPosY = (this.pos.y.new - this.pos.y.old) + this.pos.y.stored
			moveX(currentPosX)
			moveY(currentPosY)

			this.gridItems.forEach((item, index) => {
				item.setScale({
					scale: Math.max(
						item.scales.animation - 
						(item.scales.border * 0.7 - (item.scales.border * item.scales.filter * 0.7)) - 
						item.scales.filter * 0.7 -
						item.scales.ripple * 0.5
					, 0)
				})

				const distanceFromCenter = {
					x: Math.abs(item.screenX - currentPosX),
					y: Math.abs(item.screenY - currentPosY)
				}
				
				if ((distanceFromCenter.x > this.vw / 2.1 || distanceFromCenter.y > this.vh / 2.1) && item.inView) {
					gsap.to(item.scales, { border: 1, ease: "elastic.out(1, 0.8)" , duration: 2 })
					item.inView = false;
				} else if (distanceFromCenter.x <= this.vw / 2.1 && distanceFromCenter.y <= this.vh / 2.1 && !item.inView) {
					gsap.to(item.scales, { border: 0, ease: "elastic.out(1, 0.8)" , duration: 2 })
					item.inView = true;
				}
			})
		}

		gsap.ticker.add(this.ticker)
	}

	tradingCards() {
		this.tradingCardsItems = this.content.querySelectorAll(".culture-content-card-item")

		let activeCard = null;
		const grid = this.tradingCardsWrapper;
		const items = this.tradingCardsItems;
		let currentFlip;

		
		items.forEach(item => {
			item.addEventListener("click", () => {
				// Capture the current positions and sizes of all items
				const state = Flip.getState(items);
				if (currentFlip) currentFlip.kill();
			
				// Toggle expansion — make sure only one can be expanded
				items.forEach(i => i.classList.remove("expanded"));
				if (!item.classList.contains("expanded")) {
					item.classList.add("expanded");
					// Move the expanded one to the top if you want
				}
			
				// Animate from the old layout to the new one
				currentFlip = Flip.from(state, {
					duration: 0.6,
					ease: "power1.inOut",
					absolute: true,
					overwrite: true,
					onComplete: () => {
						currentFlip = null;
						item.scrollIntoView({
							behavior: "smooth",
							block: "center",
							container: "nearest",
							inline: "nearest",
						  });
					}
				});
			
			})
		});
	}

	destroy() {
		// Remove GSAP ticker
		if (this.ticker) {
			gsap.ticker.remove(this.ticker);
		}
		
		// Kill all GSAP animations
		gsap.killTweensOf(this.element);
		gsap.killTweensOf(this.content);
		gsap.killTweensOf(this.newsItems);
		gsap.killTweensOf(this.filterCities);
		
		// Clean up grid items (removes listeners and kills tweens)
		this.cleanupGridItems();
		
		// Remove window/element event listeners
		if (this.resize) window.removeEventListener("resize", this.resize);
		if (this.mouseDownEvent) this.element.removeEventListener("mousedown", this.mouseDownEvent);
		if (this.mouseMoveEvent) window.removeEventListener("mousemove", this.mouseMoveEvent);
		if (this.mouseUpEvent) window.removeEventListener("mouseup", this.mouseUpEvent);
		if (this.modal && this.openModal) this.modal.removeEventListener("click", this.openModal);
		if (this.testimonialModal && this.openTestimonialModal) {
			this.testimonialModal.removeEventListener("click", this.openTestimonialModal);
		}
		
		// Remove filter city listeners
		if (this.filterCities && this.filterCityHandlers) {
			this.filterCities.forEach((city, index) => {
				if (this.filterCityHandlers[index]) {
					city.removeEventListener("click", this.filterCityHandlers[index]);
				}
			});
		}
	}
}

export class cultureToggler {
	constructor(element) {
		this.element = element
		this.elements()
		this.bind()
		this.destroy = this.destroy.bind(this)
	}

	elements() {
		this.togglers = Array.from(this.element.children);
	}
	
	bind() {
		this.currentToggler = 0;
		this.togglerHandlers = [];

		this.togglers.forEach((toggler, index) => {
			const clickHandler = () => {
				if (index === this.currentToggler) { return }
				this.togglers[this.currentToggler].classList.remove("active");
				this.togglers[this.currentToggler].scrollTo({top: 0, behavior: "smooth"});
				this.togglers[index].classList.add("active");
				this.currentToggler = index;
			};
			this.togglerHandlers[index] = clickHandler;
			toggler.addEventListener("click", clickHandler);
		})
	}
	
	destroy() {
		// Remove all event listeners
		if (this.togglers && this.togglerHandlers) {
			this.togglers.forEach((toggler, index) => {
				if (this.togglerHandlers[index]) {
					toggler.removeEventListener("click", this.togglerHandlers[index]);
				}
			});
		}
		// Clear references
		this.togglers = [];
		this.togglerHandlers = [];
	}
}