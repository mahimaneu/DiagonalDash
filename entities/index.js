import Matter from "matter-js";

import Square from "../components/Square";
import BoundaryLeft from "../components/BoundaryLeft";
import BoundaryRight from "../components/BoundaryRight";
import BoundaryBottom from "../components/BoundaryBottom";
import BoundaryTop from "../components/BoundaryTop";
import Constants from "../Constants";
import Obstacle from "../components/Obstacle";
import { Dimensions } from "react-native";
import { getPipeSizePosPair, getRandom } from "../utils/random";
import Circle1 from "../components/Circle1";
import Circle2 from "../components/Circle2";
import Circle3 from "../components/Circle3";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
export default (restart) => {
	let engine = Matter.Engine.create({ enableSleeping: false });
	let world = engine.world;

	engine.gravity.y = 0.5;
	const pipeSizePosA = getPipeSizePosPair();
	const pipeSizePosB = getPipeSizePosPair();
	const pipeSizePosC = getPipeSizePosPair(200);
	const pipeSizePosD = getPipeSizePosPair(500);
	const enemy = getPipeSizePosPair();
	const points = getPipeSizePosPair();
	const bonus = getPipeSizePosPair();
	return {
		physics: { engine, world },
		Square: Square(
			world,
			"green",
			{ x: 200, y: 600 },
			{ height: 20, width: 20 },
		),
		BottomBoundary: BoundaryBottom(
			world,
			"yellow",
			{ x: Constants.WINDOW_WIDTH / 2, y: Constants.WINDOW_HEIGHT },
			{ height: 90, width: Constants.WINDOW_WIDTH }
		),

		LeftBoundary: BoundaryLeft(
			world,
			"grey",
			{ x: 0, y: Constants.WINDOW_HEIGHT / 2 },
			{ height: Constants.WINDOW_HEIGHT, width: 90 }
		),

		RightBoundary: BoundaryRight(
			world,
			"grey",
			{ x: Constants.WINDOW_WIDTH, y: Constants.WINDOW_HEIGHT / 2 },
			{ height: Constants.WINDOW_HEIGHT, width: 90 }
		),
		ObstacleLeft1: {
			...Obstacle(
				world,
				"ObstacleLeft1",
				"green",
				pipeSizePosA.leftObstacle.pos,
				pipeSizePosA.leftObstacle.size,
				require("../images/wood1.jpeg")
			),
			isVisible: true
		},
		ObstacleRight1: {
			...Obstacle(
				world,
				"ObstacleRight1",
				"blue",
				pipeSizePosA.rightObstacle.pos,
				pipeSizePosA.rightObstacle.size,
				require("../images/wood1.jpeg")
			),
			isVisible: true
		},
		ObstacleLeft2: {
			...Obstacle(
				world,
				"ObstacleLeft2",
				"green",
				pipeSizePosB.leftObstacle.pos,
				pipeSizePosB.leftObstacle.size,
				require("../images/stone1.jpeg")
			),
			isVisible: true
		},
		ObstacleRight2: {
			...Obstacle(
				world,
				"ObstacleRight2",
				"blue",
				pipeSizePosB.rightObstacle.pos,
				pipeSizePosB.rightObstacle.size,
				require("../images/stone2.jpeg")
			),
			isVisible: true
		},
		ObstacleLeft3: {
			...Obstacle(
				world,
				"ObstacleLeft3",
				"green",
				pipeSizePosC.leftObstacle.pos,
				pipeSizePosC.leftObstacle.size,
				require("../images/stone3.jpeg")
			),
			isVisible: true
		},
		ObstacleRight3: {
			...Obstacle(
				world,
				"ObstacleRight3",
				"blue",
				pipeSizePosC.rightObstacle.pos,
				pipeSizePosC.rightObstacle.size,
				require("../images/wood2.jpeg")
			),
			isVisible: true
		},
		ObstacleLeft4: {
			...Obstacle(
				world,
				"ObstacleLeft4",
				"green",
				pipeSizePosD.leftObstacle.pos,
				pipeSizePosD.leftObstacle.size,
				require("../images/wood3.jpeg")
			),
			isVisible: true
		},
		ObstacleRight4: {
			...Obstacle(
				world,
				"ObstacleRight4",
				"blue",
				pipeSizePosD.rightObstacle.pos,
				pipeSizePosD.rightObstacle.size,
				require("../images/stone1.jpeg")
			),
			isVisible: true
		},
		Circle1: {
			...Circle1(
				world,
				"black",
				{ x: pipeSizePosD.rightObstacle.pos.x, y: pipeSizePosD.rightObstacle.pos.y }, 
				13,
				require("../images/basket.png")
			),
			isVisible: true
		},
		Circle2: {
			...Circle2(
				world,
				"white",
				{ x: pipeSizePosD.rightObstacle.pos.x, y: pipeSizePosD.rightObstacle.pos.y }, 
				14,
				require("../images/flowers.png")
			),
			isVisible: true
		},
		Circle3: {
			...Circle3(
				world,
				"white",
				{ x: pipeSizePosD.rightObstacle.pos.x, y: pipeSizePosD.rightObstacle.pos.y }, 
				17,
				require("../images/ball.png")
			),
			isVisible: true
		},
		Enemy1: {
			...Obstacle(
				world,
				"Enemy1",
				"red",
				enemy.enemy.pos,
				enemy.enemy.size,
				require("../images/tnt.jpeg")
			),
			isVisible: false
		},
		Enemy2: {
			...Obstacle(
				world,
				"Enemy2",
				"red",
				enemy.enemy.pos,
				enemy.enemy.size,
				require("../images/tnt.jpeg")
			),
			isVisible: false
		},
		points: {
			...Obstacle(
				world,
				"points",
				"purple",
				points.points.pos,
				points.points.size,
				require("../images/stone3.jpeg")
			),
			isVisible: true
		},
		TimeBonus: {
			...Obstacle(
				world,
				"TimeBonus",
				"white",
				{
					x: getRandom(50, 400),
					y: 0,
				},
				bonus.bonus.size,
				require("../images/bonus1.jpg")
			),
			isVisible: true
		},
		ClearBonus: {
			...Obstacle(
				world,
				"ClearBonus",
				"black",
				{
					x: getRandom(50, 400),
					y: 0,
				},
				bonus.bonus.size,
				require("../images/bonus2.jpg")
			),
			isVisible: true
		},
		PointsBonus: {
			...Obstacle(
				world,
				"PointsBonus",
				"grey",
				{
					x: getRandom(50, 400),
					y: 0,
				},
				bonus.bonus.size,
				require("../images/bonus3.jpg")
			),
			isVisible: true
		}
		// BottomBoundary: BoundaryTop(
		// 	world,
		// 	"green",
		// 	{ x: Constants.WINDOW_WIDTH / 2, y: Constants.WINDOW_HEIGHT / 2 },
		// 	{ height: 90, width: Constants.WINDOW_WIDTH }
		// ),
	};
};
