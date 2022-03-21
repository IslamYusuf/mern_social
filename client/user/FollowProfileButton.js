import React from "react"
import { Button } from "@material-ui/core"
import PropTypes from "prop-types"

import { follow, unfollow } from "./api-user"

export default function FollowProfileButton({onButtonClick, isFollowed}){
    const followClick = () => {
        onButtonClick(follow)
    }
    const unfollowClick = () => {
        onButtonClick(unfollow)
    }

    return (
        <div>
            { isFollowed
            ? (<Button variant="contained" color="secondary"
                onClick={unfollowClick}>Unfollow</Button>)
            : (<Button variant="contained" color="primary"
                onClick={followClick}>Follow</Button>)
            }
        </div>
)}

FollowProfileButton.propTypes = {
    isFollowed: PropTypes.bool.isRequired,
    onButtonClick: PropTypes.func.isRequired
}

