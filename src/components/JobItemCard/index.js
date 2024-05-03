import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobItemCard = props => {
  const {jobDetails} = props

  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="job-item-link">
      <li className="job-item-card-container">
        <div className="company-logo-title-rating-container">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="company logo"
          />
          <div className="title-rating-container">
            <h1 className="job-title">{title}</h1>
            <div className="star-rating-container">
              <AiFillStar className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-type-salary-container">
          <div className="location-type-container">
            <div className="location-container">
              <MdLocationOn className="location-icon" />
              <p className="location">{location}</p>
            </div>
            <div className="employment-type-container">
              <BsFillBriefcaseFill className="employment-icon" />
              <p className="employment-type">{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr className="hz-line" />
        <h1 className="heading">Description</h1>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobItemCard
