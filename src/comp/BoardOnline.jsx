import { Button, CircularProgress, Container, makeStyles, Typography } from "@material-ui/core"
import { useEffect, useReducer, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { Link as RouterLink } from 'react-router-dom'
import getCssClass from "../Game/getCssClass"
import reducerOnline from "../Game/reducerOnline"
import stateOnline from "../Game/stateOnline"
import Logic from '../Game/Logic'
import colClick_online from "../Game/colClick_online"
import imgs from '../imgs.json'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
        overflow: 'hidden'
    },
    problem: {
        // color: theme.palette.error.dark,
        color: theme.palette.common.white,
        backgroundColor: theme.palette.error.main
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
function BoardOnline({ name, id, mode })
{
    const classes = useStyles()
    const [game, action] = useReducer(reducerOnline, stateOnline)
    const socketRef = useRef()
    const containerRef = useRef()
    const [size, setSize] = useState(200)
    const [load, setLoad] = useState("loading")
    useEffect(() =>
    {
        const IP = "http://localhost:6001/"
        socketRef.current = io(IP)

        const timer = setTimeout(() =>
        {
            setLoad("problem")
        }, 3000)
        socketRef.current.on('connect', () =>
        {
            // clearTimeout(timer)
            // setLoad("game")
        })
        socketRef.current.on('accepted', () =>
        {
            clearTimeout(timer)
            setLoad("game")
        })
        socketRef.current.on('disconnect', () => setLoad("problem"))

        socketRef.current.emit('joinGame', id, mode)

        socketRef.current.on('setPlayer', player =>
        {
            action({ type: 'setPlayer', player })

        })

        socketRef.current.on('setGrid', grid =>
        {
            action({ type: 'setGrid', grid })
        })

        socketRef.current.on('setCell', (row, col, cell) =>
        {
            action({ type: 'setCell', row, col, cell })
        })

        socketRef.current.on('setCurrentPlayer', player =>
        {
            action({ type: 'setCurrentPlayer', player })
        })

        socketRef.current.on('setCheck', check =>
        {
            if (check === null)
            {
                action({ type: 'setCheck', check: null })

            } else 
            {
                const { row, col } = check
                action({ type: 'setCheck', row, col })

            }
        })

        socketRef.current.on('setLocked', value =>
        {
            console.log(value);
            action({ type: 'setLocked', value })
        })

        socketRef.current.on('move', (start_row, start_col, end_row, end_col) =>
        {
            action({ type: 'move', start_row, start_col, end_row, end_col })
        })

        socketRef.current.on('attack', (start_row, start_col,
            enemy_row, enemy_col, end_row, end_col) =>
        {
            action({
                type: 'attack', start_row, start_col,
                enemy_row, enemy_col, end_row, end_col
            })
        })

        socketRef.current.on('end', winner =>
        {
            alert(`Игрок ${winner} выиграл`)
        })
        socketRef.current.on('debug', some => console.log(some))

        return () => 
        {
            setLoad("problem")
            socketRef.current.close()
        }
    }, [id, mode])
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
    if (load === "loading")
    {
        return (<Container ref={containerRef}
            maxWidth="md" style={{
                display: 'flex',
                marginTop: '1rem',
                justifyContent: 'center'
            }}>
            <CircularProgress size="120px" />
        </Container>)
    }
    if (load === "problem")
    {
        return (<Container ref={containerRef}>
            <br />
            <Typography align="center" className={classes.problem} variant="h6">
                Невозможно установить связь с сервером.
            </Typography>
            <br />
            <Button fullWidth variant="contained" color="primary" size="large"
                component={RouterLink} to="/online"
            >
                Вернуться в онлайн меню
            </Button>
        </Container>)
    }
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
                        onClick={() => colClick_online(game, action, socketRef, rowIndex, colIndex, game.me)}
                    />)}
                </div>
            })}
        </div>
    </Container>
}
export default BoardOnline