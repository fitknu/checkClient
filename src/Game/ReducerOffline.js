//@ts-check

import Logic from "./Logic"
import Initial from './Initial'

// eslint-disable-next-line no-unused-vars
const types = require("./types")

/**
 * 
 * @param {types.GameStateClient} state 
 * @param {*} action 
 */
function ReducerOffline(state, action)
{
    switch (action.type)
    {
        case 'setCheck':
            {
                if (action.check === null)
                {
                    return { ...state, check: null, hls: [], moves: [], attacks: [] }
                }
                const { row, col } = action
                const check = { row, col }

                let moves = Logic.get_moves(state.grid, row, col);
                let attacks = Logic.get_attacks(state.grid, row, col);

                // @ts-ignore
                moves.forEach((move) => move.type = 1)
                // @ts-ignore
                attacks.forEach((attack) => attack.type = 2)
                const hls = moves.concat(...attacks)
                return { ...state, check, hls, moves, attacks }
            }
        case 'move':
            {
                console.log("MOVE")
                const { end_row, end_col } = action
                const start_row = state.check.row
                const start_col = state.check.col
                const next_grid = Logic.copy(state.grid)
                Logic.move(next_grid, start_row, start_col, end_row, end_col)
                const next_player = Logic.get_other_player(state.current_player)

                if (Logic.check_win(state.current_player, next_grid))
                {
                    alert("END move")
                    return { Initial }
                }
                return {
                    ...state, grid: next_grid, check: null,
                    hls: [], moves: [], attacks: [], current_player: next_player
                }
            }
        case 'attack':
            {
                console.log("ATTACK")
                const { end_row, end_col, enemy_row, enemy_col } = action
                const start_row = state.check.row
                const start_col = state.check.col
                const next_grid = Logic.copy(state.grid)
                Logic.attack(next_grid, start_row, start_col,
                    enemy_row, enemy_col, end_row, end_col)


                if (Logic.check_win(state.current_player, next_grid))
                {
                    alert("END attack")
                    return { Initial }
                }
                const next_attacks = Logic.get_attacks(next_grid, end_row, end_col)

                if (next_attacks.length === 0)
                {
                    const next_player = (state.current_player === Logic.player1) ?
                        Logic.player2 : Logic.player1
                    return {
                        ...state, grid: next_grid, check: null, hls: [],
                        moves: [], attacks: [], locked: false, current_player: next_player
                    }
                } else 
                {
                    // @ts-ignore
                    next_attacks.forEach((attack) => attack.type = 2)
                    return {
                        ...state, grid: next_grid, locked: true,
                        check: { row: end_row, col: end_col },
                        hls: next_attacks, attacks: next_attacks, moves: []
                    }
                }

            }
        case 'setGrid':
            return { ...state, grid: action.grid }
        case 'setCurrentPlayer':
            return { ...state, current_player: action.player }
        case 'setPlayer':
            return { ...state, me: action.player }
        default:
            throw new Error("Unkown action!" + JSON.stringify(action))
    }
}
export default ReducerOffline