import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
    Card, CardHeader, CardContent, CardActions, TextField, Typography,
    Button, Avatar, makeStyles, IconButton, Icon  
} from '@material-ui/core'
import PhotoCamera from '@material-ui/icons/PhotoCamera'

import auth from '../auth/auth-helper'
import {create} from './api-post'

const useStyles = makeStyles(theme => ({
    root: {
      backgroundColor: '#efefef',
      padding: `${theme.spacing(3)}px 0px 1px`
    },
    card: {
      maxWidth:600,
      margin: 'auto',
      marginBottom: theme.spacing(3),
      backgroundColor: 'rgba(65, 150, 136, 0.09)',
      boxShadow: 'none'
    },
    cardContent: {
      backgroundColor: 'white',
      paddingTop: 0,
      paddingBottom: 0
    },
    cardHeader: {
      paddingTop: 8,
      paddingBottom: 8
    },
    photoButton: {
      height: 30,
      marginBottom: 5
    },
    input: {
      display: 'none',
    },
    textField: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      width: '90%'
    },
    submit: {
      margin: theme.spacing(2)
    },
    filename:{
      verticalAlign: 'super'
    }
}))

export default function NewPost({addUpdate}){
    const classes = useStyles()
    const [post, setPost] = useState({
        text: '',
        photo: '',
        error: '',
        user: {}
    })

    const clickPost = () => {
        const jwt = auth.isAuthenticated()
        let postData = new FormData()
        
        postData.append('text', post.text)
        postData.append('photo', post.photo)
        
        create({userId: jwt.user._id}, {t: jwt.token}, postData)
        .then((data) => {
            if (data.error) {
                setPost({...post, error: data.error})
            } else {
                setPost({...post, text:'', photo: ''})
                addUpdate(data)
            }
        })
    }

    const handleChange = name => event => {
        const value = name === 'photo'
          ? event.target.files[0]
          : event.target.value
        setPost({...post, [name]: value })
    }

    useEffect(() => {
        setPost({...post, user: auth.isAuthenticated().user})
      }, [])

    const photoURL = post.user._id
        ?'/api/users/photo/'+ post.user._id 
        : '/api/users/defaultphoto'
    
    return (
        <div className={classes.root}>
            <Card className={classes.card}>
            <CardHeader avatar={<Avatar src={photoURL}/>}
                title={post.user.name}
                className={classes.cardHeader}
            />
            <CardContent className={classes.cardContent}>
                <TextField
                    placeholder="Share your thoughts ..."
                    multiline rows="3" value={post.text}
                    onChange={handleChange('text')}
                    className={classes.textField} margin="normal"
                />
                <input accept="image/*" onChange={handleChange('photo')} 
                    className={classes.input} id="icon-button-file" type="file" />
                <label htmlFor="icon-button-file">
                <IconButton color="secondary" className={classes.photoButton} component="span">
                    <PhotoCamera />
                </IconButton>
                </label> <span className={classes.filename}>{post.photo ? post.photo.name : ''}</span>
                { post.error && (
                    <Typography component="p" color="error">
                        <Icon color="error" className={classes.error}>error</Icon>
                        {post.error}
                    </Typography>)
                }
            </CardContent>
            <CardActions>
                <Button color="primary" variant="contained" disabled={post.text === ''} 
                    onClick={clickPost} className={classes.submit}>POST</Button>
            </CardActions>
            </Card>
        </div>)
}
  
NewPost.propTypes = {
    addUpdate: PropTypes.func.isRequired
}