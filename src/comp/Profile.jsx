import { Avatar, Button, ButtonGroup, Card, CardContent, CardHeader, Collapse, Container, Typography } from "@material-ui/core";
import { useState } from "react";

function Profile()
{
    const [name, setName] = useState("Артур")
    const [email, setEmail] = useState("patronashss@gmail.com")

    const [page, setPage] = useState("games")
    return (
        <>
            <br />
            <Container>
                <Card>
                    <CardHeader
                        avatar={
                            <Avatar
                                style={{ width: 50, height: 50 }}
                            >{name.slice(0, 1)}</Avatar>
                        }
                        title={name}
                        subheader={email}
                    />
                    <CardContent>
                        <Typography>Всего игр: 30</Typography>
                        <Typography>Побед: 30</Typography>
                        <Typography>Проиграшей: 30</Typography>
                        <ButtonGroup variant="outlined">
                            <Button
                                onClick={() => page === 'games' ?
                                    setPage("") : setPage('games')}
                            >Прошлые турниры</Button>
                            <Button>Предстоящие турниры</Button>
                        </ButtonGroup>
                        <Collapse
                            in={page === 'games'}
                            unmountOnExit
                        >
                            hello
                        </Collapse>
                    </CardContent>
                </Card>
            </Container>

        </>
    )
}
export default Profile