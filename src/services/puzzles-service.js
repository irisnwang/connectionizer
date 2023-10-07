import axios from 'axios';
const API_BASE = process.env.REACT_APP_PUZZLE_API || "http://localhost:4000/api";
const PUZZLES_API = `${API_BASE}/puzzles`
const PUZZLE_IDS_API = `${API_BASE}/puzzleIds`

export const createPuzzle = async (puzzle) => {
    const response = await axios.post(PUZZLES_API, puzzle)
    return response.data;
}

export const findPuzzleById  = async (puzzleId) => {
    const response = await axios(`${PUZZLES_API}/${puzzleId}`)
    return response.data
}

export const findAllPuzzleIds = async () => {
    const response = await axios(`${PUZZLE_IDS_API}`)
    return response.data
}
