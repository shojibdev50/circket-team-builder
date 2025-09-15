
import { GoogleGenAI, Type } from "@google/genai";
import { Player } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const playerSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.INTEGER, description: "A unique integer ID for the player." },
    name: { type: Type.STRING, description: "The player's full name." },
    country: { type: Type.STRING, description: "The player's country of origin." },
    role: { type: Type.STRING, description: "Player's role: Batsman, Bowler, All-Rounder, or Wicket-Keeper." },
    stats: {
      type: Type.OBJECT,
      properties: {
        runs: { type: Type.INTEGER, description: "Total career runs." },
        wickets: { type: Type.INTEGER, description: "Total career wickets." },
        battingAverage: { type: Type.NUMBER, description: "Career batting average." },
        highestRun: { type: Type.INTEGER, description: "Highest score in a single match." },
        highestWicket: { type: Type.STRING, description: "Best bowling figures in a match, e.g., '5/25'." },
        manOfTheMatch: { type: Type.INTEGER, description: "Number of Man of the Match awards." },
      },
      required: ['runs', 'wickets', 'battingAverage', 'highestRun', 'highestWicket', 'manOfTheMatch'],
    },
  },
  required: ['id', 'name', 'country', 'role', 'stats'],
};

export const generateCricketPlayers = async (count: number): Promise<Player[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a list of ${count} unique, fictional cricket players from different countries. Ensure the stats are realistic for their specified role. Provide a unique ID for each player.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: playerSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    const players = JSON.parse(jsonText) as Player[];
    return players;
  } catch (error) {
    console.error("Error generating players from Gemini API:", error);
    throw new Error("Failed to fetch player data from AI service.");
  }
};
