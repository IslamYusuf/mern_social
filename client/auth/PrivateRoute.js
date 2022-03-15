import { useNavigate, useLocation } from 'react-router-dom'

import auth from './auth-helper'

const PrivateRoute = ({ children }) => {
    const {pathname} = useLocation()
    const navigate = useNavigate()
    return auth.isAuthenticated() 
        ? children
        : navigate('/signin', {state: {from : {pathname}},replace: true})
}

export default PrivateRoute