import Logic from "./Logic"

const reducerOnline = (state, action) =>
{
    switch (action.type)
    {
        case 'setPlayer':
            {
                return { ...state, me: action.player }
            }
        case 'setGrid':
            {
                return { ...state, grid: action.grid }
            }
        case 'setCheck':
            {
                if (action.check === null)
                {
                    return { ...state, check: null, hls: [], moves: [], attacks: [] }
                }
                const { row, col } = action
                let moves = (state.locked) ? [] :
                    Logic.get_moves(state.grid, row, col)

                let attacks = Logic.get_attacks(state.grid, row, col)

                moves.forEach((move) => move.type = 1)
                attacks.forEach((attack) => attack.type = 2)
                const hls = moves.concat(...attacks)
                const check = { row, col }
                return { ...state, check, hls, moves, attacks }
            }
        case 'setCurrentPlayer':
            {
                return { ...state, current_player: action.player }
            }
        case 'setLocked':
            {
                return { ...state, locked: action.value }
            }
        case 'move':
            {
                const { start_row, start_col, end_row, end_col } = action
                const next_grid = Logic.copy(state.grid)
                Logic.move(next_grid, start_row, start_col, end_row, end_col)
                return { ...state, grid: next_grid }
            }
        case 'attack':
            {
                const { start_row, start_col,
                    enemy_row, enemy_col,
                    end_row, end_col } = action
                const next_grid = Logic.copy(state.grid)
                Logic.attack(next_grid, start_row, start_col,
                    enemy_row, enemy_col, end_row, end_col)
                return { ...state, grid: next_grid }
            }
        case 'setCell':
            {
                const next_grid = Logic.copy(state.grid)
                const { row, col, cell } = action
                next_grid[row][col] = cell
                return { ...state, grid: next_grid }
            }
        default:
            throw Error("Unkown action: " + JSON.stringify(action))
    }
}
export default reducerOnline