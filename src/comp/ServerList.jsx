import { Button, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    ball: {
        width: '15px',
        height: '15px',
        display: 'inline-block',
        borderRadius: '50%'
    }
}))
function Ball({ type })
{
    const classes = useStyles()
    let color
    if (type === 0)
    {
        color = 'red'
    } else if (type === 1)
    {
        color = '#ffd701'
    } else if (type === 2)
    {
        color = '#0cf045'
    }

    return <>
        Привет
        <div className={classes.ball} style={{ backgroundColor: color }} />
    </>
}
function ServerList()
{
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2}>Имя</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>k</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Главная</TableCell>
                            <TableCell> <Ball type={1} /> </TableCell>
                            <TableCell>
                                <Button variant="contained" color="secondary" size="small">
                                    Подключиться
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>

                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
export default ServerList