import { Button, Container, Divider, Grid, makeStyles } from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles(theme => ({
    table: {
        boxSizing: 'border-box',
        width: '100%'
    },
    head: {
        backgroundColor: theme.palette.action
    },
    ball: {
        width: '15px',
        height: '15px',
        borderRadius: '50%'
    }
}))

function Row({ name, status, w1, w2, w3 })
{
    const classes = useStyles()
    let word
    let color
    switch (status)
    {
        case 0:
            word = "Ожидание игроков"
            color = 'gold'
            break;
        case 1:
            word = "Ожидание игрока 1"
            color = 'gold'
            break
        case 2:
            word = "Ожидание игрока 2"
            color = 'gold'
            break
        case 3:
            word = 'Игра идёт'
            color = 'green'
            break
        default:
            break;
    }
    return <Grid container item xs={12}>
        <Grid item xs={w1} container alignItems="center">
            {name}
        </Grid>
        <Grid item xs={w2} container direction="row" alignItems="center" spacing={1}>
            <Grid item>
                {word}
            </Grid>
            <Grid item>
                <div className={classes.ball} style={{ backgroundColor: color }} />
            </Grid>
        </Grid>
        <Grid item xs={w3}>
            <Button component fullWidth variant="contained" color="primary" >Подключиться</Button>
        </Grid>
        <Divider>

        </Divider>
    </Grid>
}
function Servers()
{
    const classes = useStyles()
    const [nameWidth, setNameWidth] = useState(5)
    const [statusWidth, setStatusWidth] = useState(5)
    const [buttonWidth, setButtonWidth] = useState(2)
    return (
        <>
            <Container maxWidth="md">
                <Grid container spacing={2} className={classes.table}>
                    <Grid className={classes.head} container item xs={12}>
                        <Grid item xs={nameWidth}>Название</Grid>
                        <Grid item xs={statusWidth}>Статус</Grid>
                        <Grid item xs={buttonWidth}></Grid>
                    </Grid>
                    <Row name="Европа 1" status={0} w1={nameWidth} w2={statusWidth} w3={buttonWidth} />
                </Grid>
            </Container>

        </>
    )
}
export default Servers