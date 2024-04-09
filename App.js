import { StatusBar } from "expo-status-bar";
import {
	Text,
	TouchableOpacity,
	View,
	StyleSheet,
	ImageBackground,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import React, { useState, useEffect } from "react";
import entities from "./entities";
import Physics from "./physics";

export default function App() {
	const [gameState, setGameState] = useState("start"); // New game state management
	const [gameEngine, setGameEngine] = useState(null);
	const [currPoints, setCurrPoints] = useState(0);
	const [time, setTime] = useState(0);
	const [specialTiming, setSpecialTiming] = useState(false);
	const [timerInterval, setTimerInterval] = useState(1000); // Normal interval is 1 second

	useEffect(() => {
		clearInterval(window.gameInterval); // Clear any existing intervals to avoid duplicates
		let interval = null;

		if (gameState === "playing") {
			interval = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, timerInterval); // Update time every second
			window.gameInterval = interval; // Assign to a property on the window object for global access
		} else {
			clearInterval(interval);
			if (gameState === "game_over") {
				// Additional actions on game over, if needed
			}
		}

		return () => clearInterval(interval);
	}, [gameState, timerInterval]);

	const handleGameStart = () => {
		setGameState("playing");
		setTime(0); // Reset time when starting
		setCurrPoints(0); // Reset points
	};

	const handleGameOver = () => {
		setGameState("game_over");
		gameEngine.stop();
	};

	const handleNewPoint = () => {
		setCurrPoints(currPoints + 1);
	};
	const handleRestart = () => {
		setGameState("playing");
		setTime(0); // Reset time when starting
		setCurrPoints(0); // Reset points
		gameEngine.dispatch({ type: "restart" });
	};
	return (
		<ImageBackground
			source={require("./images/background.webp")}
			style={styles.container}
		>
			<View style={styles.container}>
				<Text style={styles.timerText}>
					{specialTiming ? "2x Time: " : "Time: "} {time}
				</Text>
				<GameEngine
					ref={(ref) => {
						setGameEngine(ref);
					}}
					systems={[Physics]}
					entities={entities()}
					running={gameState === "playing"}
					onEvent={(e) => {
						if (e.type === "game_over") {
							handleGameOver();
						} else if (e.type === "new_point") {
							handleNewPoint();
						} else if (e.type === "time_bonus") {
							//console.log("test")
							setSpecialTiming(true);
							setTimerInterval(500);
							// After 5 seconds, revert to normal timing
							setTimeout(() => {
								setSpecialTiming(false);
								setTimerInterval(1000); // Revert to normal 1 second interval
							}, 5000);
						} else if (e.type === "points_bonus") {
							setTime((prevTime) => prevTime + 15); // Increase time score by 15
						}
						
					}}
					style={styles.gameEngine}
				/>
				{gameState === "start" && (
					<View style={styles.startScreen}>
						<TouchableOpacity
							style={styles.startButton}
							onPress={handleGameStart}
						>
							<Text style={styles.buttonText}>START GAME</Text>
						</TouchableOpacity>
					</View>
				)}
				{gameState === "playing" && (
					<View style={styles.gameControls}>
						<TouchableOpacity
							style={styles.controlButton}
							onPress={() => {
								gameEngine.dispatch({ type: "left" });
							}}
						>
							<Text style={styles.buttonText}>LEFT</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.controlButton}
							onPress={() => {
								gameEngine.dispatch({ type: "right" });
							}}
						>
							<Text style={styles.buttonText}>RIGHT</Text>
						</TouchableOpacity>
					</View>
				)}
				{gameState === "game_over" && (
					<View style={styles.startScreen}>
						<TouchableOpacity
							style={styles.startButton}
							onPress={handleRestart}
						>
							<Text style={styles.buttonText}>Restart</Text>
						</TouchableOpacity>
					</View>
				)}
				<StatusBar style="auto" hidden={true} />
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	gameEngine: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	startScreen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	startButton: {
		backgroundColor: "pink",
		paddingHorizontal: 30,
		paddingVertical: 5,
	},
	gameControls: {
		position: "absolute",
		flexDirection: "row",
		bottom: 0,
		left: 0,
		right: 0,
		height: "50%", // This covers the bottom half of the screen
	},
	controlButton: {
		flex: 1, // Makes each button take half the width
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "pink",
		opacity: 0.5, // Reduced opacity for less obtrusiveness
	},
	buttonText: {
		fontWeight: "bold",
		color: "white",
		fontSize: 20,
	},

	timerText: {
		fontSize: 24,
		color: "#FFFFFF",
		fontWeight: "bold",
		position: "absolute", // Use absolute positioning
		top: 40, // Distance from the top of the screen
		alignSelf: "center", // Center horizontally
		backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
	},
});
