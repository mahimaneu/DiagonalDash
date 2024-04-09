import Matter from "matter-js";
import { Dimensions } from "react-native";
import { getPipeSizePosPair, getRandom } from "./utils/random";
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
//const windowHeight = Dimensions.get('window').height
//const windowWidth = Dimensions.get('window').width

const Physics = (entities, { touches, time, dispatch, events }) => {
	let engine = entities.physics.engine;
	// let Square = entities.Square;
	// let Floor = entities.Floor;
	// let world = entities.physics.world;

	//Resetting the game
	//check if the events array contains the game_over event
	if (events.some((e) => e.type === "restart")) {

		Matter.Body.setPosition(
			entities[`Square`].body,
			{x: 200, y: 600}
		);

		Object.keys(entities).forEach((key) => {
			const entity = entities[key];
			if (entity && entity.body && key !== "LeftBoundary" && key !== "RightBoundary" && key !== "BottomBoundary" && key !== "Square") {
				entity.isVisible = false;
				Matter.Body.setPosition(entity.body, { x: getRandom(50, 400), y: getRandom(0, -350) });
			}
		});
	}

	// Bonuses

	if (entities.TimeBonus) { // Check if TimeBonus exists
		Matter.Body.translate(entities.TimeBonus.body, { x: 0, y: 3 }); // Move TimeBonus downward with the obstacles
	
		// Logic to randomly reposition TimeBonus after it goes off-screen or on some condition
		if (entities.TimeBonus.body.position.y > windowHeight) {
			Matter.Body.setPosition(entities.TimeBonus.body, { x: getRandom(50, 400), y: 0 });
		}
	}

	if (entities.ClearBonus) { // Same logic as TimeBonus
		Matter.Body.translate(entities.ClearBonus.body, { x: 0, y: 3 });

		if (entities.ClearBonus.body.position.y > windowHeight) {
			Matter.Body.setPosition(entities.ClearBonus.body, { x: getRandom(50, 400), y: 0 });
		}
	}

	if (entities.PointsBonus) { // Same logic as TimeBonus
		Matter.Body.translate(entities.PointsBonus.body, { x: 0, y: 3 });
	
		if (entities.PointsBonus.body.position.y > windowHeight) {
			Matter.Body.setPosition(entities.PointsBonus.body, { x: getRandom(50, 400), y: 0 });
		}
	}

	//Left and right controls
	if (events.length) {
		for (let i = 0; i < events.length; i++) {
			if (events[i].type === "left") {
				Matter.Body.setVelocity(entities.Square.body, {
					x: -5,
					y: -4,
				});
			} else if (events[i].type === "right") {
				Matter.Body.setVelocity(entities.Square.body, {
					x: 5,
					y: -4,
				});
			}
		}
	}

	touches
		.filter((t) => t.type === "press")
		.forEach((t) => {
			Matter.Body.setVelocity(entities.Square.body, {
				x: 0,
				y: -5,
			});
		});

	Matter.Engine.update(engine, time.delta);

	for (let index = 1; index <= 4; index++) {
		if (
			entities[`ObstacleLeft${index}`].body.bounds.max.y >= windowHeight
		) {
			const pipeSizePos = getPipeSizePosPair(windowWidth * 0.9);
			Matter.Body.setPosition(
				entities[`ObstacleLeft${index}`].body,
				pipeSizePos.leftObstacle.pos
			);

			Matter.Body.setPosition(
				entities[`ObstacleRight${index}`].body,
				pipeSizePos.rightObstacle.pos
			);
		}
		Matter.Body.translate(entities[`ObstacleLeft${index}`].body, {
			x: 0,
			y: 3,
		});

		Matter.Body.translate(entities[`ObstacleRight${index}`].body, {
			x: 0,
			y: 3,
		});
	}
	//Enemy
	let enemySpeed = 3;
	for (let index = 1; index <= 2; index++) {
		Matter.Body.translate(entities[`Enemy${index}`].body, {
			x: 0,
			y: Math.floor(Math.random() * (5 - 2 + 1) + 2),
			// y: enemySpeed,
		});
		if (entities[`Enemy${index}`].body.bounds.max.y >= windowHeight) {
			// enemySpeed = Math.floor(Math.random() * (5 - 2 + 1) + 2);
			Matter.Body.setPosition(
				entities[`Enemy${index}`].body,
				getPipeSizePosPair().enemy.pos
			);
		}
	}
	//Points
	Matter.Body.translate(entities[`points`].body, {
		x: 0,
		y: 2,
	});
	if (entities[`points`].body.bounds.max.y >= windowHeight) {
		Matter.Body.setPosition(
			entities[`points`].body,
			getPipeSizePosPair().points.pos
		);
	}

	// Matter.Body.translate(entities[`ObstacleLeft1`].body, { x: -3, y: 0 });

	// Matter.Body.translate(entities[`ObstacleLeft2`].body, { x: -3, y: 0 });

	// Matter.Events.on(engine, "collisionStart", (event) => {
	// 	dispatch({ type: "game_over" });
	// });

	// Matter.Events.on(engine, "collisionStart", (event) => {
	// 	dispatch({ type: "game_over" });
	// });

	Matter.Events.on(engine, "collisionStart", (event) => {
		const pairs = event.pairs;

		// Check for collision between Square and BottomBoundary
		const objA = pairs[0].bodyA.label;
		const objB = pairs[0].bodyB.label;

		if (
			(objA === "Square" && objB === "BoundaryBottom") ||
			(objB === "Square" && objA === "BoundaryBottom") ||
			(objA === "Square" && objB === "Enemy1") ||
			(objB === "Square" && objA === "Enemy1") ||
			(objA === "Square" && objB === "Enemy2") ||
			(objB === "Square" && objA === "Enemy2")
		) {
			dispatch({ type: "game_over" });
		}

		// Time Bonus

		else if (
			(objA === "Square" && objB === "TimeBonus") ||
			(objB === "Square" && objA === "TimeBonus")
		) {
            // Check if the event has already been dispatched
            if (entities.TimeBonus.isVisible && entities.TimeBonus.collected !== true) {
                dispatch({ type: "time_bonus" }); // Trigger 2x time rate bonus
                entities.TimeBonus.collected = true; // Mark TimeBonus as collected
                setTimeout(() => {
                    entities.TimeBonus.collected = false; // Reset collected status after some time
                }, 1000); // Reset after 1 second
            }
			// Make TimeBonus disappear
			entities.TimeBonus.isVisible = false;
			Matter.Body.setPosition(entities.TimeBonus.body, { x: -1000, y: -1000 }); // Move off-screen
			
			// Schedule reappearance in 20 seconds
			setTimeout(() => {
			const newPos = getPipeSizePosPair().bonus.pos; // Get new position
			Matter.Body.setPosition(entities.TimeBonus.body, newPos);
			entities.TimeBonus.isVisible = true; // Make TimeBonus visible again
			}, 20000);
		}

		//Points Bonus

		else if (
			(objA === "Square" && objB === "PointsBonus") ||
			(objB === "Square" && objA === "PointsBonus")
		) {
            // Check if the event has already been dispatched
            if (entities.PointsBonus.isVisible && entities.PointsBonus.collected !== true) {
                dispatch({ type: "points_bonus" }); // Add 15 points to time score
                entities.PointsBonus.collected = true; // Mark PointsBonus as collected
                setTimeout(() => {
                    entities.PointsBonus.collected = false; // Reset collected status after some time
                }, 1000); // Reset after 1 second
            }
			// Make PointsBonus disappear
			entities.PointsBonus.isVisible = false;
			Matter.Body.setPosition(entities.PointsBonus.body, { x: -1000, y: -1000 }); // Move off-screen
			
			// Schedule reappearance in 20 seconds
			setTimeout(() => {
			const newPos = getPipeSizePosPair().bonus.pos; // Get new position
			Matter.Body.setPosition(entities.PointsBonus.body, newPos);
			entities.PointsBonus.isVisible = true; // Make PointsBonus visible again
			}, 20000);
		}

		// Clear Bonus

		else if (
			(objA === "Square" && objB === "ClearBonus") ||
			(objB === "Square" && objA === "ClearBonus")
		) {
			// Makes every entity (except for bonuses, player and boundaries) 'disappear' from screen by moving them off-screen 
			Object.keys(entities).forEach((key) => {
				const entity = entities[key];
				if (entity && entity.body && key !== "LeftBoundary" && key !== "RightBoundary" && key !== "BottomBoundary" && key !== "Square" && key !== "ClearBonus" && key !== "TimeBonus" && key !== "PointsBonus") {
					entity.isVisible = false;
					Matter.Body.setPosition(entity.body, { x: getRandom(50, 400), y: getRandom(-500, -1000) });
				}
			});
			
			// Make ClearBonus disappear
			entities.ClearBonus.isVisible = false;
			Matter.Body.setPosition(entities.ClearBonus.body, { x: -1000, y: -1000 }); // Move off-screen
			
			// Schedule reappearance in 45 seconds
			setTimeout(() => {
				const newPos = getPipeSizePosPair().bonus.pos; // Get new position
				Matter.Body.setPosition(entities.ClearBonus.body, newPos);
				entities.ClearBonus.isVisible = true; // Make ClearBonus visible again
			}, 45000);
		}
		// else if (
		// 	(objA === "Square" && objB === "points") ||
		// 	(objB === "Square" && objA === "points")
		// ) {
		// 	Matter.Body.setVelocity(entities.Square.body, {
		// 		x: -5,
		// 		y: -5,
		// 	});
		// 	Matter.Body.setPosition(
		// 		entities[`points`].body,
		// 		getPipeSizePosPair().points.pos
		// 	);
		// 	dispatch({ type: "new_point" });
		// }
	});
	return entities;
};
export default Physics;
