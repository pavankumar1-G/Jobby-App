import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginFormRoute extends Component {
  state = {username: '', password: '', errorMsg: '', isLoginError: false}

  onChangeUsernameInput = event => {
    this.setState({username: event.target.value})
  }

  onChangeuserpasswordInput = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onsubmitFailure = errorMsg => {
    this.setState({errorMsg, isLoginError: true})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const responseData = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(responseData.jwt_token)
    } else {
      this.onsubmitFailure(responseData.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg, isLoginError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <div className="website-logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </div>
          <label className="label" htmlFor="username">
            USERNAME
          </label>
          <br />
          <input
            className="user-input"
            id="username"
            type="text"
            value={username}
            placeholder="Username"
            onChange={this.onChangeUsernameInput}
          />
          <br />
          <br />
          <label className="label" htmlFor="password">
            PASSWORD
          </label>
          <br />
          <input
            className="user-input"
            id="password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={this.onChangeuserpasswordInput}
          />
          <br />
          <br />
          <button className="login-button" type="submit">
            Login
          </button>
          {isLoginError && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default LoginFormRoute
