import { Card, Divider, Typography } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import auth from '../auth/auth-helper'
import {listNewsFeed} from './api-post'
import NewPost from './NewPost'
import PostList from './PostList'

export const Newsfeed = () => {
    const [posts, setPosts] = useState([])

    const addPost = (post) => {
        const updatedPosts = [...posts]
        updatedPosts.unshift(post)
        setPosts(updatedPosts)
    }

    const removePost = (post) => {
        const updatedPosts = [...posts]
        const index = updatedPosts.indexOf(post)
        updatedPosts.splice(index, 1)
        setPosts(updatedPosts)
    }

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        const jwt = auth.isAuthenticated()
        
        listNewsFeed({userId: jwt.user._id}, {t: jwt.token}, signal)
        .then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                setPosts(data)
            }
        })

        return function cleanup(){
             abortController.abort()
        }
    }, [])

    return (
        <Card>
            <Typography type="title"> Newsfeed </Typography>
            <Divider/>
            <NewPost addUpdate={addPost}/>
            <Divider/>
            <PostList removeUpdate={removePost} posts={posts}/>
        </Card>
    )
}

export default Newsfeed