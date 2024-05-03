import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import JobItemCard from '../JobItemCard'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstantsOfRequestedData = {
  initial: 'INITIAL',
  isLoading: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobsRoute extends Component {
  state = {
    profileDetails: {},
    jobsList: {},
    apiStatusOfProfile: apiStatusConstantsOfRequestedData.initial,
    apiStatusOfJobs: apiStatusConstantsOfRequestedData.initial,
    searchInput: '',
    activeCheckBoxList: [],
    activeSalaryRangeId: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDataList()
  }

  getProfileDetails = async () => {
    this.setState({
      apiStatusOfProfile: apiStatusConstantsOfRequestedData.isLoading,
    })
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileUrl, options)
    const profileData = await response.json()
    // console.log(profileData)
    if (response.ok === true) {
      const updatedProfileData = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedProfileData,
        apiStatusOfProfile: apiStatusConstantsOfRequestedData.success,
      })
    } else {
      this.setState({
        apiStatusOfProfile: apiStatusConstantsOfRequestedData.failure,
      })
    }
  }

  getJobsDataList = async () => {
    const {activeCheckBoxList, activeSalaryRangeId, searchInput} = this.state
    this.setState({
      apiStatusOfJobs: apiStatusConstantsOfRequestedData.isLoading,
    })
    const employmentType = activeCheckBoxList.join(',')
    const jwtToken = Cookies.get('jwt_token')

    const jobsListUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsListUrl, options)
    const jobsData = await response.json()
    // console.log(jobsData)
    if (response.ok === true) {
      const updatedFilteredJobsData = jobsData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsList: updatedFilteredJobsData,
        apiStatusOfJobs: apiStatusConstantsOfRequestedData.success,
      })
    } else {
      this.setState({
        apiStatusOfJobs: apiStatusConstantsOfRequestedData.failure,
      })
    }
  }

  onRenderSearchInput = () => {
    const {searchInput} = this.state

    return (
      <>
        <input
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          value={searchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          className="search-btn"
          type="button"
          onClick={this.onClickSearchIcon}
          data-testid="searchButton"
        >
          <BsSearch className="search-icon" />
        </button>
      </>
    )
  }

  onRenderProfile = () => {
    const {apiStatusOfProfile} = this.state
    switch (apiStatusOfProfile) {
      case apiStatusConstantsOfRequestedData.isLoading:
        return this.onLoadingView()
      case apiStatusConstantsOfRequestedData.success:
        return this.onSuccessProfileView()
      case apiStatusConstantsOfRequestedData.failure:
        return this.onFailureProfileView()
      default:
        return null
    }
  }

  onRenderEmploymentList = () => (
    <ul className="employment-type-list">
      {employmentTypesList.map(eachType => (
        <li className="each-type" key={eachType.employmentTypeId}>
          <input
            className="checkbox-input"
            type="checkbox"
            id={eachType.employmentTypeId}
            onChange={this.onClickCheckbox}
          />
          <label className="label" htmlFor={eachType.employmentTypeId}>
            {eachType.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onRenderSalaryRangeList = () => (
    <ul className="salary-range-list">
      {salaryRangesList.map(eachRange => (
        <li className="each-range" key={eachRange.salaryRangeId}>
          <input
            className="radio-input"
            type="radio"
            id={eachRange.salaryRangeId}
            name="option"
            onChange={this.onClickSalaryRadioBtn}
          />
          <label className="label" htmlFor={eachRange.salaryRangeId}>
            {eachRange.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onRenderJobsList = () => {
    const {apiStatusOfJobs} = this.state
    switch (apiStatusOfJobs) {
      case apiStatusConstantsOfRequestedData.isLoading:
        return this.onJobsLoadingView()
      case apiStatusConstantsOfRequestedData.success:
        return this.onJobsDataSuccessView()
      case apiStatusConstantsOfRequestedData.failure:
        return this.onJobsDataFailureView()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsDataList()
    }
  }

  onClickSearchIcon = () => {
    this.getJobsDataList()
  }

  onLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onJobsLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onSuccessProfileView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-icon" />
        <h1 className="profile-name">{name}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  onFailureProfileView = () => (
    <div className="failure-profile-container">
      <button
        className="profile-retry-btn"
        onClick={this.retryProfileDetails}
        type="button"
      >
        Retry
      </button>
    </div>
  )

  retryProfileDetails = () => this.getProfileDetails()

  onClickCheckbox = event => {
    const {activeCheckBoxList} = this.state
    if (activeCheckBoxList.includes(event.target.id)) {
      const updatedCheckboxes = activeCheckBoxList.filter(
        eachCheckbox => eachCheckbox !== event.target.id,
      )
      this.setState(
        {activeCheckBoxList: updatedCheckboxes},
        this.getJobsDataList,
      )
    } else {
      this.setState(
        prevState => ({
          activeCheckBoxList: [
            ...prevState.activeCheckBoxList,
            event.target.id,
          ],
        }),
        this.getJobsDataList,
      )
    }
  }

  onClickSalaryRadioBtn = event => {
    this.setState({activeSalaryRangeId: event.target.id}, this.getJobsDataList)
  }

  onJobsDataSuccessView = () => {
    const {jobsList} = this.state
    // console.log(jobsList)
    const existedJobs = jobsList.length > 0

    return existedJobs ? (
      <ul className="jobs-list">
        {jobsList.map(eachJob => (
          <JobItemCard key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-image"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-para">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  onJobsDataFailureView = () => (
    <div className="failure-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-image"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <div className="jobs-retry-btn-container">
        <button
          className="jobs-retry-btn"
          type="button"
          onClick={this.onClickJobsRetryBtn}
        >
          Retry
        </button>
      </div>
    </div>
  )

  onClickJobsRetryBtn = () => this.getJobsDataList()

  render() {
    return (
      <>
        <Header />
        <div className="jobs-route-content">
          <div className="sm-search-input-container">
            {this.onRenderSearchInput()}
          </div>
          <div className="profile-filters-container">
            {this.onRenderProfile()}
            <hr className="hz-line" />
            <h1 className="filters-heading">Type of Employment</h1>
            {this.onRenderEmploymentList()}
            <hr className="hz-line" />
            <h1 className="filters-heading">Salary Range</h1>
            {this.onRenderSalaryRangeList()}
          </div>
          <div className="jobs-list-container">
            <div className="lg-search-input-container">
              {this.onRenderSearchInput()}
            </div>
            {this.onRenderJobsList()}
          </div>
        </div>
      </>
    )
  }
}
export default JobsRoute
