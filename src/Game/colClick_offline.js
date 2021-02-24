const Logic = require('./Logic')
/**
 * 
 * @param {number[][]} grid
 * @param {function} action 
 * @param {number} row 
 * @param {number} col 
 * @param {1 | 3} current_player 
 */
const colClick_offline = (game, action, row, col) =>
{
    const { grid, check, moves, attacks, current_player, locked } = game
    const cell = grid[row][col]
    const cell_owner = Logic.get_owner(cell)


    //Click on our own checker
    if (cell_owner === current_player && !locked)
    {
        //Select a checker
        if (check === null || !(check.row === row && check.col === col))
        {
            action({ type: "setCheck", row, col })
        }
        //Deselect the current checker 
        else
        {
            action({ type: "setCheck", check: null })
        }
    }
    //Click on empty cell 
    else if (Logic.is_empty(cell)) 
    {
        //Check if the click matches a move
        if (Logic.match_move(moves, row, col) && !locked)
        {
            action({ type: "move", end_row: row, end_col: col })
            return
        }
        //Check if the click matches an attack
        const attack = Logic.match_attack(attacks, row, col)
        if (attack)
        {
            const { enemy_row, enemy_col } = attack
            action({
                type: "attack", enemy_row, enemy_col,
                end_row: row, end_col: col
            })
            return
        }
        //If we arent locked, set current checker to null
        if (!locked)
        {
            action({ type: "setCheck", check: null })
        }
    }

}
export default colClick_offline