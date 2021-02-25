function reducerSource(state, action)
{
    switch (action.type)
    {
        case 'setOnlineGameId':
            return { ...state, onlineGameId: action.id }
        default:
            throw new Error(JSON.stringify(action))
    }
}
export default reducerSource