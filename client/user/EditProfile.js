import React, {useState, useEffect} from 'react'
import { 
    Button, Card, CardActions, CardContent, 
    Icon, TextField, Typography, makeStyles,
} from "@material-ui/core"
import {CloudUploadRounded} from "@material-ui/icons"
import {useNavigate, useParams, useLocation} from 'react-router-dom' 

import {read, update} from './api-user'
import auth from '../auth/auth-helper'

const useStyles = makeStyles(theme => ({
    title: {
        padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    }
}))

export default function EditProfile() {
    const classes = useStyles()
    const {userId} = useParams()
    const {pathname} = useLocation()
    const navigate = useNavigate()
    const [user, setUser] = useState({
        name: '', about:'',
        password: '', email: '', photo: '',
        error: '', redirectToProfile: false
    })
    
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        
        const jwt = auth.isAuthenticated()
        
        if(!user.name && !user.email){
            read({userId}, {t: jwt.token}, signal).then((data) => {
                if (data && data.error) {
                    navigate('/signin', {state: {from : {pathname}}})
                } else {
                    setUser({...user, ...data, photo: undefined})
                }
            })
        }

        if (user.redirectToProfile) {
            navigate(`/user/${user.userId}`,{state: {from : {pathname}},replace: true})
        }
        
        return function cleanup(){
            abortController.abort()
        }
    }, [userId, user.redirectToProfile])

    const handleChange = name => event => {
        const value = name === 'photo'
            ? event.target.files[0]
            : event.target.value
        setUser({ ...user, [name]: value })
    }

    const clickSubmit = () => {
        const jwt = auth.isAuthenticated()
        let userData = new FormData()

        user.name && userData.append('name', user.name)
        user.email && userData.append('email', user.email)
        user.password && userData.append('password', user.password)
        user.about && userData.append('about', user.about)
        user.photo && userData.append('photo', user.photo)

        update({userId}, {t: jwt.token}, userData).then((data) => {
            if (data && data.error) {
                setUser({...user, error: data.error})
            } else {
                setUser({...user, userId: data._id, redirectToProfile: true})
            }
        })
    }
    
    return (
        <div>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Edit Profile
                    </Typography>
                    <TextField id="name" label="Name"
                        className={classes.textField}
                        value={user.name} onChange={handleChange('name')}
                        margin="normal"/>
                    <br/>
                    <TextField
                        id="multiline-flexible"
                        label="About"
                        multiline
                        rows="2"
                        value={user.about}
                        onChange={handleChange('about')}
                    />
                    <br/>
                    <TextField id="email" type="email" label="Email"
                        className={classes.textField}
                        value={user.email} onChange={handleChange('email')}
                        margin="normal"/>
                    <br/>
                    <TextField id="password" type="password" label="Password"
                        className={classes.textField} value={user.password}
                        onChange={handleChange('password')} margin="normal"/>
                    <br/>
                    <input accept="image/*" type="file"
                        onChange={handleChange('photo')}
                        style={{display:'none'}}
                        id="icon-button-file" />
                    <label htmlFor="icon-button-file">
                        <Button variant="contained" color="default" component="span">
                            Upload <CloudUploadRounded/>
                        </Button>
                    </label>
                    <span className={classes.filename}>
                        {user.photo ? user.photo.name : ''}
                    </span>
                    {
                        user.error && (
                            <Typography component="p" color="error">
                            <Icon color="error" className={classes.error}>error</Icon>
                            {user.error}</Typography>
                        )
                    }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained" onClick={clickSubmit}
                        className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
        </div>
    )
}