import React from 'react'
import PropTypes from 'prop-types'
import Post from './Post'

export default function PostList ({posts, removeUpdate }) {
    return (
        <div style={{marginTop: '24px'}}>
            {posts.map((post, i) => {
                return <Post post={post} key={i} onRemove={removeUpdate}/>
            })}
        </div>
    )
}

PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    removeUpdate: PropTypes.func.isRequired
}