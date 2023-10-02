import axios from 'axios';
const PUZZLES_API = 'http://localhost:4000/api/puzzles';

export const createPuzzle = async (puzzle) => {
    const response = await axios.post(PUZZLES_API, puzzle)
    return response.data;
}

export const findPuzzleById  = async (puzzleId) => {
    const response = await axios(`${PUZZLES_API}/${puzzleId}`)
    return response.data
}
