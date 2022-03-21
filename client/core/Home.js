import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Card,CardContent,CardMedia,Typography} from '@material-ui/core'

import unicornbikeImg from './../assets/images/unicornbike.jpg'
import FindPeople from '../user/FindPeople'
import auth from '../auth/auth-helper'

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginTop: theme.spacing(5)
    },
    title: {
        padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    media: {
        minHeight: 400
    }
}))

export default function Home(){
    const classes = useStyles()
    const [userLoggedIn, setUserLoggedIn] = useState(false)

    useEffect(()=>{
        const jwt = auth.isAuthenticated()

        if(jwt) setUserLoggedIn(true)
    },[])

    return (
        <Card className={classes.card}>
            <Typography variant="h6" className={classes.title}>
                Home Page
            </Typography>
            <CardMedia className={classes.media}
                image={unicornbikeImg} title="Unicorn Bicycle"/>
            <CardContent>
                {userLoggedIn ? (<FindPeople/>) 
                    : (
                        <Typography variant="body2" component="p">
                            Welcome to MERN_Social. Signin to start Following People.
                        </Typography>
                    )
                }
            </CardContent>
        </Card>
)}