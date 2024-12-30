'use client'
import { useState, useEffect } from "react";

type Color = {
  id: string;
  color: string;
};

const colors: Color[] = [
  { id: "green", color: "bg-lime-500" },
  { id: "red", color: "bg-red-500" },
  { id: "blue", color: "bg-blue-500" },
  { id: "yellow", color: "bg-yellow-500" },
];

export default function SimonDice() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [level, setLevel] = useState<number>(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0); // Nuevo estado para la puntuación máxima

  // Flash a color button
  const flashButton = (colorId: string) => {
    const button = document.getElementById(colorId);
    if (button) {
      button.classList.add("opacity-50", "scale-110");
      setTimeout(() => button.classList.remove("opacity-50", "scale-110"), 500);
    }
  };

  // Add a new random color to the sequence
  const addToSequence = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)].id;
    setSequence((prev) => [...prev, randomColor]);
  };

  // Play the sequence for the player
  const playSequence = async () => {
    setIsPlayerTurn(false);
    for (const color of sequence) {
      flashButton(color);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
    setIsPlayerTurn(true);
  };

  // Handle player's input
  const handleInput = (colorId: string) => {
    if (!isPlayerTurn) return;

    const nextIndex = playerInput.length;
    if (colorId === sequence[nextIndex]) {
      setPlayerInput((prev) => [...prev, colorId]);

      if (nextIndex + 1 === sequence.length) {
        setPlayerInput([]);
        setLevel((prev) => prev + 1);

        // Actualizar logros
        if ((nextIndex + 1) % 5 === 0) {
          setAchievements((prev) => [...prev, `¡Lograste ${nextIndex + 1} niveles!`]);
        }

        // Verificar si se ha alcanzado un nuevo récord
        if (level + 1 > highScore) {
          setHighScore(level + 1);
          localStorage.setItem('highScore', String(level + 1)); // Guardar el nuevo récord en localStorage
        }

        setTimeout(() => {
          addToSequence();
          playSequence();
        }, 1000);
      }
    } else {
      alert("¡Te equivocaste! Inténtalo de nuevo.");
      resetGame(); // Restablecer el juego después de perder
    }
  };

  const resetGame = () => {
    setSequence([]);
    setPlayerInput([]);
    setLevel(0);
    setAchievements([]);
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
    addToSequence();
  };

  useEffect(() => {
    // Cargar la puntuación máxima desde localStorage al cargar el componente
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }

    if (sequence.length > 0) playSequence();
  }, [sequence]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Simón Dice</h1>
      <p className="text-lg mb-4">Nivel: {level}</p>
      <p className="text-lg mb-4">Puntuación máxima: {highScore}</p>

      {!gameStarted && (
        <button
          onClick={startGame}
          className="bg-blue-500 text-white p-2 rounded-full mb-4"
        >
          Comenzar Juego
        </button>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8 w-64 h-64">
        {colors.map((color) => (
          <button
            key={color.id}
            id={color.id}
            className={`w-full h-full ${color.color} rounded-lg shadow-lg transition transform active:scale-90 active:opacity-70`}
            onClick={() => handleInput(color.id)}
          ></button>
        ))}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Logros:</h2>
        <ul>
          {achievements.map((achievement, index) => (
            <li key={index} className="text-green-400 animate-pulse">
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
