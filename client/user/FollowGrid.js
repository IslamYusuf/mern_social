import React from "react"
import PropTypes from "prop-types"
import { Avatar, ImageList, ImageListItem, makeStyles, Typography } from "@material-ui/core"
import { Link } from "react-router-dom"

const useStyles = makeStyles(theme => ({
    title: {
        padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    }
}))

export default function FollowGrid ({people}) {
    const classes = useStyles()
    
    return (
        <div className={classes.root}>
            <ImageList rowHeight={160} className={classes.gridList} cols={4}>
            {people.map((person, i) => {
                return <ImageListItem style={{'height':120}} key={i}>
                    <Link to={"/user/" + person._id}>
                        <Avatar src={'/api/users/photo/'+person._id}
                            className={classes.bigAvatar}/>
                        <Typography className={classes.tileText}>
                            {person.name}
                        </Typography>
                    </Link>
                </ImageListItem>
            })}
            </ImageList>
        </div>
)}
    
FollowGrid.propTypes = {
    people: PropTypes.array.isRequired
}