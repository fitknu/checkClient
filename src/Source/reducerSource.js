//@ts-check
// eslint-disable-next-line no-unused-vars
import initSource from "./initSource"


/**
 * 
 * @typedef {{type: 'setOnline_gameId', id: Number} |
 * {type: 'setBot_me', me: 1 | 2} |
 * {type: 'setBot_level', level: 1 | 2 | 3 | 4 | 5 }} reducerAction
 */


/**
 * 
 * @param {initSource} state 
 * @param {reducerAction} action 
 * @returns 
 */
function reducerSource(state, action)
{
    switch (action.type)
    {
        case 'setOnline_gameId':
            return { ...state, online_gameId: action.id }
        case 'setBot_level':
            return { ...state, bot_level: action.level }
        case 'setBot_me':
            return { ...state, bot_me: action.me }
        default:
            throw new Error(JSON.stringify(action))
    }
}
export default reducerSource