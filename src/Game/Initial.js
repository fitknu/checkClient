//@ts-check
import Logic from "./Logic"

// eslint-disable-next-line no-unused-vars
const types = require('./types')

/**
 * @type {types.GameStateClient}
 */
const initialState = {
    // @ts-ignore
    me: Logic.spectator,
    current_player: Logic.player1,
    check: null,
    locked: false,
    moves: [],
    attacks: [],
    grid: [
        [0, 3, 0, 3, 0, 3, 0, 3],
        [3, 0, 3, 0, 3, 0, 3, 0],
        [0, 3, 0, 3, 0, 3, 0, 3],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]],
    hls: [],
}
export default initialState