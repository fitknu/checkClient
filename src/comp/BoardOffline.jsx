import { Container, makeStyles } from "@material-ui/core"
import { useEffect, useReducer, useRef, useState } from "react"
import imgs from '../imgs.json'

import ReducerOffline from '../Game/ReducerOffline'

import initialState from '../Game/Initial'
import getCssClass from "../Game/getCssClass"
import colClick_offline from "../Game/colClick_offline"
import Logic from '../Game/Logic'

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
function BoardOffline()
{
    // console.log(JSON.stringify(initialState))
    const classes = useStyles()
    const containerRef = useRef()
    const [size, setSize] = useState(200)
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
    const [game, action] = useReducer(ReducerOffline, initialState)
    return <Container ref={containerRef} maxWidth="md"
        className={classes.root}>
        <div
            className={game.current_player === Logic.player1 ?
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
export default BoardOffline
