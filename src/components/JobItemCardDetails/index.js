import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FaExternalLinkAlt} from 'react-icons/fa'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusConstantsOfJobItemDetails = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemCardDetails extends Component {
  state = {
    jobItemCardDetails: {},
    similarJobsData: [],
    apiStatusOfJobItemDetails: apiStatusConstantsOfJobItemDetails.initial,
  }

  componentDidMount() {
    this.getJobItemCardDetails()
  }

  onClickRetryBtn = () => {
    this.getJobItemCardDetails()
  }

  getFormatedJobData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getSimilarJobDataFormate = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getJobItemCardDetails = async () => {
    this.setState({
      apiStatusOfJobItemDetails: apiStatusConstantsOfJobItemDetails.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)

    const jwtToken = Cookies.get('jwt_token')
    const jobItemCardDetailsUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobItemCardDetailsUrl, options)

    if (response.ok === true) {
      const jobItemCardsData = await response.json()
      // console.log(jobItemCardsData.similar_jobs)
      const updatedJobItemCardDetails = this.getFormatedJobData(
        jobItemCardsData.job_details,
      )
      // console.log(updatedJobItemCardDetails)

      const updatedSimilarJobsData = jobItemCardsData.similar_jobs.map(
        eachSimilar => this.getSimilarJobDataFormate(eachSimilar),
      )
      // console.log(updatedSimilarJobsData)
      this.setState({
        jobItemCardDetails: updatedJobItemCardDetails,
        similarJobsData: updatedSimilarJobsData,
        apiStatusOfJobItemDetails: apiStatusConstantsOfJobItemDetails.success,
      })
    } else {
      this.setState({
        apiStatusOfJobItemDetails: apiStatusConstantsOfJobItemDetails.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemCardDetailsSuccessView = () => {
    const {jobItemCardDetails, similarJobsData} = this.state
    console.log(jobItemCardDetails)
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobItemCardDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <>
        <div className="job-item-Card">
          <div className="company-logo-title-rating-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-details-company-logo"
            />
            <div className="title-rating-container">
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-icon" />
                <p className="job-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-employment-type-salary-container">
            <div className="location-employment-type-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p className="job-location">{location}</p>
              </div>
              <div className="employment-type-container">
                <BsFillBriefcaseFill className="briefcase-icon" />
                <p className="employment-type">{employmentType}</p>
              </div>
            </div>
            <p className="salary-per-annum">{packagePerAnnum}</p>
          </div>
          <hr className="hz-line" />
          <div className="description-heading-website-url-container">
            <h1 className="description-heading">Description</h1>
            <div className="website-container">
              <a className="website-link" href={companyWebsiteUrl}>
                Visit
              </a>
              <FaExternalLinkAlt className="website-link-icon" />
            </div>
          </div>
          <p className="description">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list">
            {skills.map(eachSkill => (
              <li className="skill-container" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-image"
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="lac-heading">Life at Company</h1>
          <div className="lac-description-and-image-container">
            <p className="lac-description">{description}</p>
            <img className="lac-img" src={imageUrl} alt="life at company" />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobsData.map(eachSimilarJob => (
            <SimilarJobs
              key={eachSimilarJob.id}
              similarJobList={eachSimilarJob}
            />
          ))}
        </ul>
      </>
    )
  }

  renderJobItemDetalsFailureView = () => (
    <>
      <div className="job-item-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-img"
        />
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="failure-para">
          We cannot seem to find the page you are looking for.
        </p>
        <div className="retry-btn-container">
          <button
            className="retry-btn"
            type="button"
            onClick={this.onClickRetryBtn}
          >
            Retry
          </button>
        </div>
      </div>
    </>
  )

  onRenderJobItemCardDetails = () => {
    const {apiStatusOfJobItemDetails} = this.state

    switch (apiStatusOfJobItemDetails) {
      case apiStatusConstantsOfJobItemDetails.inProgress:
        return this.renderLoadingView()
      case apiStatusConstantsOfJobItemDetails.success:
        return this.renderJobItemCardDetailsSuccessView()
      case apiStatusConstantsOfJobItemDetails.failure:
        return this.renderJobItemDetalsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-card-details-container">
          {this.onRenderJobItemCardDetails()}
        </div>
      </>
    )
  }
}
export default JobItemCardDetails
