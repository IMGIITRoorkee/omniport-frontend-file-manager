import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getThemeObject, DefaultDP } from 'formula_one'
import {
  Card,
  CardGroup,
  Container,
  Button,
  Segment,
  Breadcrumb,
  Header,
  Dropdown,
} from 'semantic-ui-react'
import { getAllDataRequests, handleRequest } from '../actions/folderActions'
import { formatStorage } from '../helpers/helperfunctions'
import css from './css/approveRequest.css'
import { REQUEST_STATUS, RESPONSE_TYPES } from '../constants'
import ErrorBoundary from './error-boundary'
import { FOLDER_APIS } from '../urls'

const friendOptions = [
  {
    key: 'Pending',
    text: 'Pending',
    value: 'pending',
  },
  {
    key: 'Accepted',
    text: 'Accepted',
    value: 'accept',
  },
  {
    key: 'Rejected',
    text: 'Rejected',
    value: 'reject',
  },
  {
    key: 'All',
    text: 'All',
    value: 'all',
  },
]

class RequestCard extends Component {
  handleRequest = response => {
    const { request } = this.props
    this.props.handleRequest(request.id, { response }, () => {
      this.props.getAllDataRequests(
        `${FOLDER_APIS.getAllDataRequests}?data_request_status=${this.props.filterType}`
      )
    })
  }

  render() {
    const { request } = this.props
    return (
      <Card>
        <Card.Content>
          {request.person &&
          request.person.displayPicture &&
          request.person.displayPicture !== '' ? (
            <img
              src={request.person.displayPicture}
              width="64px"
              height="64px"
              style={{
                borderRadius: '32px',
                background: getThemeObject().hexCode,
              }}
              alt="user"
            />
          ) : (
            <div styleName="css.popup">
              <DefaultDP
                name={request.person && request.person.fullName}
                size="1.5rem"
                styleName="css.popup"
              />
            </div>
          )}
          <Card.Header>{request.person.fullName}</Card.Header>
          <Card.Description>
            {request.dataRequestStatus === REQUEST_STATUS.PENDING && (
              <>
                Requesting{' '}
                <strong>{formatStorage(request.additionalSpace)}</strong> in{' '}
                <strong>{request.filemanager.filemanagerName}</strong>
              </>
            )}
            {request.dataRequestStatus === REQUEST_STATUS.ACCEPT && (
              <>
                Request of{' '}
                <strong>{formatStorage(request.additionalSpace)}</strong> in{' '}
                <strong>{request.filemanager.filemanagerName} is Accepted</strong>
              </>
            )}
            {request.dataRequestStatus === REQUEST_STATUS.REJECT && (
              <>
                Request of{' '}
                <strong>{formatStorage(request.additionalSpace)}</strong> in{' '}
                <strong>{request.filemanager.filemanagerName} is Declined</strong>
              </>
            )}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="ui two buttons">
            <Button
              disabled={request.dataRequestStatus == REQUEST_STATUS.ACCEPT}
              basic={request.dataRequestStatus !== REQUEST_STATUS.ACCEPT}
              color="green"
              onClick={() => {
                this.handleRequest(RESPONSE_TYPES.accept)
              }}
            >
              {request.dataRequestStatus === REQUEST_STATUS.ACCEPT
                ? 'Approved'
                : 'Approve'}
            </Button>
            <Button
              disabled={request.dataRequestStatus === REQUEST_STATUS.REJECT || request.dataRequestStatus == REQUEST_STATUS.ACCEPT}
              basic={request.dataRequestStatus !== REQUEST_STATUS.REJECT}
              color="red"
              onClick={() => {
                this.handleRequest(RESPONSE_TYPES.reject)
              }}
            >
              {request.dataRequestStatus === REQUEST_STATUS.REJECT
                ? 'Rejected'
                : 'Decline'}
            </Button>
          </div>
        </Card.Content>
      </Card>
    )
  }
}

class ApproveRequest extends Component {
  constructor(props) {
    super(props)
    this.state = { requestType: 'pending' }
  }
  componentDidMount = () => {
    const url = `${FOLDER_APIS.getAllDataRequests}?data_request_status=pending`
    this.props.getAllDataRequests(url)
  }

  handleChange = (e, { value }) => {
    let url = `${FOLDER_APIS.getAllDataRequests}`
    if (value !== 'all') {
      url += `?data_request_status=${value}`
    }
    this.props.getAllDataRequests(url)
    this.setState({ requestType: value })
  }
  render() {
    const { requests, handleRequest, getAllDataRequests } = this.props
    const cards = requests.map(request => (
      <RequestCard
        request={request}
        handleRequest={handleRequest}
        getAllDataRequests={getAllDataRequests}
        filterType={this.state.requestType}
      />
    ))
    return (
      <ErrorBoundary>
        <Container styleName="css.main-container">
          <Breadcrumb size="big">
            <Breadcrumb.Section>
              <Header>Requests for Upgrade Storage</Header>
            </Breadcrumb.Section>
          </Breadcrumb>
          <Header dividing />
          <div style={{ marginBottom: '3rem' }}>
            Show Requests{' '}
            <Dropdown
              inline
              options={friendOptions}
              defaultValue={friendOptions[0].value}
              onChange={this.handleChange}
            />
          </div>
          {requests.length ? (
            <CardGroup itemsPerRow={3}>{cards}</CardGroup>
          ) : (
            <Segment basic padded textAlign="center">
              You doesn't have any Request as of now. Change the filter or check
              back later.
            </Segment>
          )}
        </Container>
      </ErrorBoundary>
    )
  }
}

const mapStateToProps = state => {
  return {
    requests: state.folders.dataRequests,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getAllDataRequests: url => {
      dispatch(getAllDataRequests(url))
    },
    handleRequest: (id, data, callback) => {
      dispatch(handleRequest(id, data, callback))
    },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ApproveRequest)
