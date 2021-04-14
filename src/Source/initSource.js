//@ts-check
import Logic from "../Game/Logic"

/**
 * @typedef initSource
 * @property {null | Number} online_gameId
 * @property {1 | 2} bot_me
 * @property {1 | 2 | 3 | 4 |5} bot_level
 */
/**
 * @type {initSource}
 */
const initSource = {
    online_gameId: null,
    bot_me: Logic.player1,
    bot_level: 1,
}
export default initSource