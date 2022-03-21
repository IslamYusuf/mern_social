import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {AppBar, Typography, Tabs, Tab} from '@material-ui/core'

import FollowGrid from './../user/FollowGrid'
//import PostList from './../post/PostList'

const TabContainer = ({children}) => {
    return (
      <Typography component="div" style={{ padding: 8 * 2 }}>
        {children}
      </Typography>
    )
}

export default function ProfileTabs ( {following, followers} ){
  const [tab, setTab] = useState(1)

  const handleTabChange = (event, value) => {
    setTab(value)
  }

    return (
    <div>
        <AppBar position="static" color="default">
          <Tabs
            value={tab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Posts" />
            <Tab label="Following" />
            <Tab label="Followers" />
          </Tabs>
        </AppBar>
       {/* {tab === 0 && <TabContainer><PostList removeUpdate={props.removePostUpdate} posts={props.posts}/></TabContainer>} */}
       {tab === 1 && <TabContainer><FollowGrid people={following}/></TabContainer>}
       {tab === 2 && <TabContainer><FollowGrid people={followers}/></TabContainer>}
    </div>)
  
}

ProfileTabs.propTypes = {
  following: PropTypes.array.isRequired,
  followers: PropTypes.array.isRequired,
  //removePostUpdate: PropTypes.func.isRequired,
  //posts: PropTypes.array.isRequired
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}