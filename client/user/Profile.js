import React, {useEffect, useState} from 'react'
import { 
    Avatar, Divider, IconButton, List, 
    ListItem, ListItemAvatar, ListItemSecondaryAction,
    ListItemText, makeStyles, Paper, Typography, 
} from '@material-ui/core'
import { Edit} from '@material-ui/icons'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'

import {read} from './api-user'
import auth from '../auth/auth-helper'
import DeleteUser from './DeleteUser'
import FollowProfileButton from './FollowProfileButton'
import ProfileTabs from './ProfileTabs'

const useStyles = makeStyles(theme => ({
    title: {
        padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    }
}))

export default function Profile() {
    const classes = useStyles()
    const {userId} = useParams()
    const {pathname} = useLocation()
    const navigate = useNavigate()
    const [user, setUser] = useState({isFollowed: false})

    const photoUrl = user._id
        ? `/api/users/photo/${user._id}?${new Date().getTime()}`
        : '/api/users/defaultphoto'
    
    const clickFollowButton = (callApi) => {
        const jwt = auth.isAuthenticated()

        callApi({userId: jwt.user._id},{t: jwt.token}, user._id)
        .then((data) => {
            if (data.error) {
                setUser({...user, error: data.error})
            } else {
                setUser({...data, isFollowed: !user.isFollowed})
            }
        })
    }

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        
        const jwt = auth.isAuthenticated()
        const checkFollow = (user) => {
            const match = user.followers.some((follower)=> {
                return follower._id == jwt.user._id
            })
            return match
        }

        read({userId}, {t: jwt.token}, signal).then((data) => {
            if (data && data.error) {
                navigate('/signin', {state: {from : {pathname}}, replace:true})
            } else {
                const isFollowed = checkFollow(data)
                setUser({...data, isFollowed })
            }
        })
        
        return function cleanup(){
            abortController.abort()
        }
    }, [userId])

    return !user._id ? (<div>Loading...</div>) : (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                Profile
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar src={photoUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email}/>
                    { auth.isAuthenticated().user && auth.isAuthenticated().user._id == user._id
                        ? (<ListItemSecondaryAction>
                            <Link to={"/user/edit/" + user._id}>
                                <IconButton aria-label="Edit" color="primary">
                                    <Edit/>
                                </IconButton>
                            </Link>
                            <DeleteUser userId={user._id}/>
                          </ListItemSecondaryAction>)
                        : (<FollowProfileButton isFollowed={user.isFollowed} onButtonClick={clickFollowButton}/>)
                    }
                </ListItem>
                <Divider/>
                <ListItem> 
                    <ListItemText primary={user.about}
                        secondary={`Joined: ${new Date(user.created).toDateString()}`}
                    /> 
                </ListItem>
                <Divider/>
                <ProfileTabs following={user.following} followers={user.followers}/>
            </List>
        </Paper>
    )
}