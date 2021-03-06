import { Container, makeStyles } from "@material-ui/core"
import { useContext, useEffect, useReducer, useRef, useState } from "react"
import imgs from '../imgs.json'

import ReducerOffline from '../Game/ReducerOffline'

import initialState from '../Game/Initial'
import getCssClass from "../Game/getCssClass"
import colClick_offline from "../Game/colClick_offline"
import Logic from '../Game/Logic'
import getBestMove from '../Game/minmax'
import SourceContext from "../Source/Source"

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
        overflow: 'hidden'
    },
    row: {
        display: 'flex'
    },
    col: {

    },
    col_nocolor: {
        backgroundColor: 'rgb(255, 255, 255)'
    },
    col_color: {
        backgroundColor: 'brown'
    },
    col_my: {
        cursor: 'pointer'
    },
    col_black: {
        backgroundImage: `url("${imgs.black}")`
    },
    col_black_queen: {
        backgroundImage: `url("${imgs.black_queen}")`
    },
    col_white: {
        backgroundImage: `url("${imgs.white}")`
    },
    col_white_queen: {
        backgroundImage: `url("${imgs.white_queen}")`
    },
    col_move: {
        cursor: 'pointer',
        backgroundColor: 'rgb(7, 170, 7)'
    },
    col_attack: {
        cursor: 'pointer',
        backgroundColor: 'rgb(230, 18, 18)'
    },
    turn_me: {
        border: ' 3px solid rgb(202, 129, 18) '
    },
    turn_other: {
        border: '3px solid black'
    }


}))
function BoardBot()
{
    const sourceState = useContext(SourceContext).state

    const [game, action] = useReducer(ReducerOffline, { ...initialState, me: Logic.player1 })

    const classes = useStyles()
    const containerRef = useRef()
    const [size, setSize] = useState(200)

    const [botAttacks, setBotAttacks] = useState(false)
    useEffect(() =>
    {
        action({ type: 'setPlayer', player: sourceState.bot_me })
    }, [sourceState.bot_me])

    useEffect(() =>
    {
        function resize()
        {
            const multi = 0.95
            const width = Math.min(document.documentElement.clientWidth, 960) //from MD breakpoint
            const height = document.documentElement.clientHeight
            let nextSize = width
            if (width > height) { nextSize = height - 70; console.log('done', width, height) }
            nextSize *= multi
            // nextSize -= 70
            setSize(nextSize / 8)
        }
        resize()
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [])
    useEffect(() =>
    {
        function go()
        {
            if (game.current_player !== game.me)
            {

                const botLevel = sourceState.bot_level
                console.log(`botLevel ${botLevel}`);
                console.time()
                const move = getBestMove(game.grid, botLevel, game.current_player, botAttacks)
                console.timeEnd()
                const nextGrid = JSON.parse(JSON.stringify(game.grid))
                if (move === undefined)
                {
                    //do nothing
                }
                else if (move.enemy_row === undefined)
                {
                    const { start_row, start_col, end_row, end_col } = move
                    Logic.move(nextGrid, start_row, start_col, end_row, end_col)
                    action({ type: 'setGrid', grid: nextGrid })
                    action({ type: 'setCurrentPlayer', player: Logic.get_other_player(game.current_player) })


                } else
                {
                    const { start_row, start_col, enemy_row, enemy_col, end_row, end_col } = move
                    Logic.attack(nextGrid, start_row, start_col, enemy_row, enemy_col, end_row, end_col)
                    action({ type: 'setGrid', grid: nextGrid })
                    const next_attacks = Logic.get_attacks(nextGrid, end_row, end_col)
                    if (next_attacks.length > 0)
                    {
                        setBotAttacks(next_attacks)
                    } else 
                    {
                        setBotAttacks(false)
                        action({ type: 'setCurrentPlayer', player: Logic.get_other_player(game.current_player) })

                    }

                }
            }
        }
        const timer = setTimeout(go, 500)
        return () => clearTimeout(timer)
    }, [game.grid, game.me, game.current_player, botAttacks, sourceState.bot_level])

    useEffect(() =>
    {
        if (game.current_player === game.me && window.SpeechSynthesisUtterance)
        {
            const phrase = new SpeechSynthesisUtterance("?????? ??????.")
            phrase.lang = 'ru-RU'
            speechSynthesis.speak(phrase)
        }

    }, [game.current_player, game.me])
    return <Container ref={containerRef} maxWidth="md"
        className={classes.root}>
        <div
            className={game.current_player === game.me ?
                classes.turn_me : classes.turn_other}
        >
            {game.grid.map((row, rowIndex) => 
            {
                return <div
                    className={classes.row}
                    key={rowIndex}
                >
                    {row.map((col, colIndex) => <div
                        className={getCssClass(game.grid, game.hls, rowIndex, colIndex)
                            .split(" ").map(_ => classes[_]).join(" ")}
                        style={{ width: size, height: size }}
                        key={colIndex}
                        onClick={() => colClick_offline(game, action, rowIndex, colIndex)}
                    />)}
                </div>
            })}
        </div>

    </Container>
}
export default BoardBot
