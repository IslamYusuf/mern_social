import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { 
    Avatar, IconButton, List, ListItemAvatar, ListItem, 
    ListItemSecondaryAction, ListItemText, Paper, Typography 
} from '@material-ui/core'
import { ArrowForward } from '@material-ui/icons'

import {list} from "./api-user"

const useStyles = makeStyles(theme =>({
    title: {
        padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    }
}))

const Users = () => {
    const classes = useStyles()
    const [users, setUsers] = useState([])
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        
        list(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                setUsers(data)
            }
        })
        return function cleanup(){
            abortController.abort()
        }
    },[])

    return !users ? (<div>Loading..</div>) : (
        <Paper className={classes.root} elevation={4}>
                <Typography variant="h6" className={classes.title}>
                    All Users
                </Typography>
                <List dense>
                    {users.map((user, i) => {
                        return <Link to={`/user/${user._id}`} key={i}>
                            <ListItem button>
                                <ListItemAvatar>
                                    <Avatar src={`/api/users/photo/${user._id}?${new Date().getTime()}`} />
                                </ListItemAvatar>
                                <ListItemText primary={user.name}/>
                                <ListItemSecondaryAction>
                                    <IconButton>
                                        <ArrowForward/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Link>
                    })}
                </List>
        </Paper>
    )
}
    
export default Users