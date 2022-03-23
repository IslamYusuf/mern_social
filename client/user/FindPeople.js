import React, { useEffect, useState } from 'react'
import { 
    Avatar, Button, IconButton, List, ListItem, ListItemAvatar, Typography,
    ListItemSecondaryAction, ListItemText, makeStyles, Paper, Snackbar, 
} from '@material-ui/core'
import { Visibility } from '@material-ui/icons'
import { Link } from 'react-router-dom'

import auth from '../auth/auth-helper'
import { findPeople, follow } from './api-user'

const useStyles = makeStyles(theme => ({
    title: {
        padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    }
}))

const FindPeople = () => {
    const classes = useStyles()
    const [users, setUsers] = useState([])
    const [successMsg, setSuccessMsg] = useState({open: false})

    const clickFollow = (user, index) => {
        const jwt = auth.isAuthenticated()

        follow({userId: jwt.user._id}, {t: jwt.token}, user._id)
        .then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                let toFollow = users
                toFollow.splice(index, 1)
                
                setUsers(toFollow)
                setSuccessMsg({open: true, followMessage: `Following ${user.name}!`})
            }
        })
    }

    const handleRequestClose = () =>{
        setSuccessMsg({open: false})
    }

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        
        const jwt = auth.isAuthenticated()

        findPeople({userId: jwt.user._id}, {t: jwt.token}, signal)
        .then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                setUsers(data)
            }
        })

        return function cleanup(){
            abortController.abort()
        }
    }, [])

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography type="title" className={classes.title}>
            Who to follow
            </Typography>
            <List>
            {users.map((user, i) => {
                return <span key={i}>
                    <ListItem>
                        <ListItemAvatar className={classes.avatar}>
                            <Avatar src={`/api/users/photo/${user._id}`}/>
                        </ListItemAvatar>
                        <ListItemText primary={user.name}/>
                        <ListItemSecondaryAction className={classes.follow}>
                            <Link to={`/user/${user._id}`}>
                                <IconButton variant="contained" color="secondary"
                                    className={classes.viewButton}>
                                    <Visibility/>
                                </IconButton>
                            </Link>
                            <Button aria-label="Follow" variant="contained"
                                color="primary"
                                onClick={()=> {clickFollow(user, i)}}>
                                Follow
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                </span>
                })
            }
            <Snackbar
                anchorOrigin={{vertical: 'bottom',horizontal: 'right',}}
                open={successMsg.open}
                onClose={handleRequestClose}
                autoHideDuration={6000}
                message={<span className={classes.snack}>{successMsg.followMessage}</span>}
            />
        </List>
        </Paper>
    )
}

export default FindPeople