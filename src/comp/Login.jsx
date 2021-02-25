import { Button, Card, CardContent, IconButton, InputAdornment, Tab, Tabs, TextField, Typography } from "@material-ui/core"
import { useState } from "react"
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

function PasswordField({ pass, setPass, label, error, helperText })
{
    const [showPass, setShowPass] = useState(false)
    const title = label || "Пароль"
    return (
        <TextField
            label={title}
            type={showPass ? "text" : "password"}
            value={pass}
            onChange={e => setPass(e.target.value)}
            InputProps={{
                endAdornment: (
                    <InputAdornment
                        position="end">
                        <IconButton
                            title={showPass ? "Скрыть" : "Показать"}
                            onClick={() => setShowPass(!showPass)}
                        >
                            {showPass ?
                                <VisibilityOffIcon /> :
                                <VisibilityIcon />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            error={error}
            helperText={helperText}
        />
    )

}

function Login()
{
    const [tab, setTab] = useState(0)

    const [login, setLogin] = useState("")
    const [pass, setPass] = useState("")
    const [showPass, setShowPass] = useState(false)

    const [regLogin, setRegLogin] = useState("")
    const [regPass, setRegPass] = useState("")
    const [regPassConfirm, setRegPassConfirm] = useState("")
    const [regEmail, setRegEmail] = useState("")

    const validate = (type, val) =>
    {
        return ""
        if (type === "login")
        {
            if (val.length === 0)
            {
                return "Неверный логин"
            }
            return ""
        }
        if (type === "password")
        {
            if (val.length === 0)
            {
                return "Неверный пароль"
            }
            return ""
        }
    }

    const handleLogin = (event) =>
    {
        event.preventDefault()
        console.log('Submit Login');
    }
    const handleRegister = (event) =>
    {
        event.preventDefault()
        console.log('Submit Register');
    }
    return (<Card>
        <CardContent>
            <Tabs
                value={tab}
                onChange={(e, newVal) => setTab(newVal)}
                indicatorColor="primary"
                centered
            >
                <Tab label="Войти" />
                <Tab label="Зарегистрироваться" />
            </Tabs>
            <br />
            {tab === 0 && <form
                onSubmit={handleLogin}
            >
                <TextField
                    label="Логин"
                    type="login"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                    error={validate("login", login).length !== 0}
                    helperText={validate("login", login)}
                />
                <br />
                <PasswordField
                    pass={pass}
                    setPass={setPass}
                    error={validate("password", pass).length !== 0}
                    helperText={validate("password", pass)}
                />
                <br />
                <br />
                <Button
                    color="primary"
                    type="submit" >Войти</Button>
                <Button>Забыли пароль?</Button>
            </form>}
            {tab === 1 && <form
                onSubmit={handleRegister}
            >
                <TextField
                    label="Логин"
                    value={regLogin}
                    onChange={(e) => setRegLogin(e.target.value)}
                />
                <br />
                <PasswordField
                    pass={regPass}
                    setPass={setRegPass}
                />
                <br />
                <PasswordField
                    label="Повторите пароль"
                    pass={regPassConfirm}
                    setPass={setRegPassConfirm}
                />
                <br />
                <TextField
                    label="Почта"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}

                />
                <br />
                <br />
                <Button
                    type="submit"
                    color="primary"
                >Зарегистрироваться</Button>
            </form>}
        </CardContent>
    </Card>)
}
export default Login