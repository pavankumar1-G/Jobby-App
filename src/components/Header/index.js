import {Link, withRouter} from 'react-router-dom'
import {FiLogOut} from 'react-icons/fi'
import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillHome} from 'react-icons/ai'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onclickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="nav-header">
      <div className="nav-content">
        <div className="nav-menu-container">
          <ul className="nav-menu-list">
            <Link to="/" className="nav-link">
              <li className="logo">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                  alt="website logo"
                  className="website-header-logo"
                />
              </li>
            </Link>
            <div>
              <Link to="/" className="nav-link">
                <AiFillHome className="nav-menu-icons" />
                <li className="menu-item">Home</li>
              </Link>
              <Link to="/jobs" className="nav-link">
                <BsBriefcaseFill className="nav-menu-icons" />
                <li className="menu-item">Jobs</li>
              </Link>
            </div>
          </ul>
          <div className="logout-btn-container">
            <FiLogOut className="logout-icon" onClick={onclickLogout} />
            <button
              className="logout-btn"
              type="button"
              onClick={onclickLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default withRouter(Header)
