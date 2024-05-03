import {Switch, Route, Redirect} from 'react-router-dom'

import LoginFormRoute from './components/LoginFormRoute'
import HomeRoute from './components/HomeRoute'
import JobsRoute from './components/JobsRoute'
import JobItemCardDetails from './components/JobItemCardDetails'
import NotFoundRoute from './components/NotFoundRoute'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginFormRoute} />
    <ProtectedRoute exact path="/" component={HomeRoute} />
    <ProtectedRoute exact path="/jobs" component={JobsRoute} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemCardDetails} />
    <Route exact path="/not-found" component={NotFoundRoute} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
