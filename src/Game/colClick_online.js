import Logic from './Logic'
function colClick_online(game, action, socketRef, i, j, player)
{
    if (game.current_player !== player)
    {
        return
    }

    const cell = game.grid[i][j]
    const cell_owner = Logic.get_owner(cell)
    const { check } = game

    //Select or deselect a checker
    if (cell_owner === player && !game.locked)
    {
        //Select a checker if the current checker is null 
        //and make sure we do not select the checker is currently selected
        if (check === null || !(check.row === i && check.col === j))
        {
            action({ type: 'setCheck', row: i, col: j })
        } else 
        {
            action({ type: 'setCheck', check: null })
        }
    } else if (Logic.is_empty(cell))
    {
        const { moves, attacks } = game
        if (Logic.match_move(moves, i, j) && !game.locked)
        {
            //send move
            const { row, col } = game.check
            socketRef.current.emit('tryMove', row, col, i, j)
            action({ type: 'setCheck', check: null })
            return
        }

        const attack = Logic.match_attack(attacks, i, j)
        if (attack)
        {
            //send attack
            const { start_row, start_col, enemy_row,
                enemy_col, end_row, end_col } = attack
            socketRef.current.emit('tryAttack', start_row,
                start_col, enemy_row, enemy_col, end_row, end_col)
            action({ type: 'setCheck', check: null })
        }
    }
}
export default colClick_online