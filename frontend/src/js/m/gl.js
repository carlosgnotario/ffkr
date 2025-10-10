import * as PIXI from 'pixi.js';


export default function gl() {
	g.app = new PIXI.Application();
	g.app	.init({ background: '#1099bb', resizeTo: window, antialias: true })
		.then(async() => { document.body.appendChild(g.app.canvas); })
}

export class gridTest {
	constructor(members, awards, testimonials) {
		this.members = members;
		this.totalPoints = 800;
		this.elements = [];
		this.avatars = [];
		this.awards = [];
		this.testimonials = [];
		this.elements.push(this.avatars);
		this.elements.push(this.awards);
		this.elements.push(this.testimonials);
		// Avatar width configuration - each avatar can have a different width (number of points)
		this.avatarWidths = [3, 2, 1, 4, 2]; // Example: avatar[0] takes 3 points, avatar[1] takes 2 points, etc.
		this.currentLeftPosition = 0; // Track the current left position for automatic placement
		
		this.init();
	}

	sizing() {
		this.avatarSize = 80;
		this.avatarPadding = this.avatarSize / 4;		

		// Size avatars
		this.avatars.forEach((avatar) => {
			avatar.children[0].width = this.avatarSize;
			avatar.children[0].height = this.avatarSize;

			avatar.children[1].circle(this.avatarSize / 2, this.avatarSize / 2, this.avatarSize / 2);
			avatar.children[1].fill({color: 0xFFFFFF});
		});

		// Size awards
		this.awards.forEach((award) => {
			award.children[0].width = this.avatarSize * 3 + this.avatarPadding * 2;
			award.children[0].height = this.avatarSize;
		});

		// Size testimonials (add sizing logic for testimonials here)
		this.testimonials.forEach((testimonial) => {
			// Add testimonial sizing logic as needed
		});
	}

	init() {
		this.resources();
	}

	async resources() {
		for (const [index, member] of this.members.entries()) {
			const container = new PIXI.Container();
			const texture = await PIXI.Assets.load(member.photo.asset.url);
			const image = new PIXI.Sprite(texture);
			
			const mask = new PIXI.Graphics();
			image.mask = mask;
			// Append
			container.addChild(image);
			container.addChild(mask);
			g.app.stage.addChild(container);
			this.avatars.push(container);
		}

		for (let index = 0; index < 3; index++) {
			const container = new PIXI.Container();
			const image = new PIXI.Sprite(PIXI.Texture.WHITE);

			container.addChild(image);
			g.app.stage.addChild(container);
			this.awards.push(container);
		}

		this.sizing();
		this.gridGen();
		this.gridPlacement();
		this.gridCalculations();
		
	}

	gridGen() {
		this.points = [];
		for (let i = 0; i < this.totalPoints; i++) {
			this.points.push({
				x: i % 25,
				y: Math.floor(i / 25),
			});
		}		
	}

	gridPlacement() {
		// Defined positions for specific elements
		this.avatars[0].positions = this.assignPosition(44);
		this.awards[0].positions = this.assignPosition(1, 3);
		
		// Calculate remaining points by excluding already assigned points
		this.calculateRemainingPoints();
		
		// Get all remaining elements that don't have positions set
		this.remainingElements = [];
		this.elements.forEach((elementArray) => {
			elementArray.forEach((element) => {
				if (!element.positions) {
					this.remainingElements.push(element);
				}
			});
		});
		
		// Assign remaining positions to elements without positions
		this.remainingElements.forEach((element, index) => {
			console.log(element);
			
			element.positions = [this.remainingPoints[index]];
		});
	}

	assignPosition(start, end) {
		if (end === undefined || end < start) { end = start; }

		const positions = [];
		for (let i = start; i <= end; i++) {
			positions.push(this.points[i]);
		}
		return positions;
	}
	
	calculateRemainingPoints() {
		// Collect all assigned points from all avatars
		const assignedPoints = [];
		this.elements.forEach((element) => {
			element.forEach((el) => {
				if (el.positions) {
					el.positions.forEach((position) => {
						assignedPoints.push(position);
					});
				}
			});
		});
		
		// Filter out assigned points from the total points array
		this.remainingPoints = this.points.filter((point) => {
			return !assignedPoints.some((assignedPoint) => {
				return assignedPoint.x === point.x && assignedPoint.y === point.y;
			});
		});
	}

	gridCalculations() {
		// Apply positioning to all elements (avatars, awards, testimonials)
		this.elements.forEach((elementArray) => {
			elementArray.forEach((element) => {
				if (element.positions && element.positions.length > 0) {
					element.x = element.positions[0].x * (this.avatarSize + this.avatarPadding);
					element.y = element.positions[0].y * (this.avatarSize + this.avatarPadding);
				}
			});
		});
	}
}

// export async function grid(members) {	
// 	for (const [index, member] of members.entries()) {
// 		const container = new PIXI.Container();
// 		const texture = await PIXI.Assets.load(member.photo.asset.url);
// 		const image = new PIXI.Sprite(texture);
// 		image.width = 80;
// 		image.height = 80;
		
// 		const mask = new PIXI.Graphics();
// 		mask.circle(40, 40, 40);
// 		mask.fill({color: 0xFFFFFF});
// 		image.mask = mask;
// 		// Position
// 		container.x = 200 * index;
// 		// Append
// 		container.addChild(image);
// 		container.addChild(mask);
// 		g.app.stage.addChild(container);
// 	}
// }