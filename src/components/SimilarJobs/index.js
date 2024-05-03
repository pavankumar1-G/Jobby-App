import './index.css'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

const SimilarJobs = props => {
  const {similarJobList} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobList
  return (
    <li className="similar-job-card-container">
      <div className="company-logo-title-rating-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-job-company-logo"
        />
        <div className="title-rating-container">
          <h1 className="similar-job-title">{title}</h1>
          <div className="rating-container">
            <AiFillStar className="similar-job-star-icon" />
            <p className="similar-job-rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="description-heading">Description</h1>
      <p className="similar-job-description">{jobDescription}</p>
      <div className="location-employment-type-container">
        <div className="location-employment-type-container">
          <div className="location-container">
            <MdLocationOn className="similar-job-location-icon" />
            <p className="similar-job-location">{location}</p>
          </div>
          <div className="employment-type-container">
            <BsFillBriefcaseFill className="briefcase-icon" />
            <p className="similar-job-employment-type">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}
export default SimilarJobs
