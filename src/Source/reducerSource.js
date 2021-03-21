
/**
 * 
 * @param {*} state 
 * @param {{type: String, id: Number}} action 
 * @returns 
 */
function reducerSource(state, action)
{
    switch (action.type)
    {
        case 'setOnlineGameId':
            return { ...state, onlineGameId: action.id }
        case 'setBotLevel':
            {
                return { ...state, botLevel: action.botLevel }
            }
        case 'setBotMyTeam':
            {
                return { ...state, botMyTeam: action.botMyTeam }
            }
        default:
            throw new Error(JSON.stringify(action))
    }
}
export default reducerSource