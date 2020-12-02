import React, { Component } from 'react'
import { CarouselProvider } from 'pure-react-carousel'
import PropTypes from 'prop-types'
import { Modal, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { IMAGE_EXTENSIONS, ITEM_TYPE } from '../constants'
import css from './css/carousel.css'
import CustomCarousel from './customCarousel'
import { handleDownload } from '../helpers/helperfunctions'

class MultipleImageModal extends Component {
  constructor(props) {
    super(props)
    const { currentFolder, activeItems } = this.props
    const images =
      currentFolder.files && currentFolder.files.length
        ? currentFolder.files.filter(file =>
            IMAGE_EXTENSIONS.includes(file.extension)
          )
        : []
    this.state = {
      images,
      activeIndex: images.findIndex(
        elem => activeItems.length === 1 && elem.id === activeItems[0].obj.id
      )
    }
  }

  componentDidUpdate = prevprops => {
    const { currentFolder, activeItems } = this.props
    if (
      JSON.stringify(prevprops.currentFolder) !==
        JSON.stringify(currentFolder) ||
      JSON.stringify(prevprops.activeItems) !== JSON.stringify(activeItems)
    ) {
      const images =
        currentFolder.files && currentFolder.files.length
          ? currentFolder.files.filter(file =>
              IMAGE_EXTENSIONS.includes(file.extension)
            )
          : []

      this.setState({
        images,
        activeIndex: images.findIndex(
          elem => activeItems.length === 1 && elem.id === activeItems[0].obj.id
        )
      })
    }
  }

  render() {
    const { show, onHide, activeItems } = this.props
    const { images } = this.state
    return (
      <Modal
        onClose={() => {
          onHide()
        }}
        open={show}
        basic
        size='fullscreen'
        closeOnDimmerClick={false}
        closeOnDocumentClick={false}
      >
        <Modal.Content>
          <Icon
            name='close'
            circular
            basic
            bordered
            size='large'
            styleName='css.cross-icon'
            onClick={() => {
              onHide()
            }}
          />
          <Icon
            name='download'
            circular
            basic
            bordered
            size='large'
            styleName='css.download-icon'
            onClick={() => {
              handleDownload()
            }}
          />
          <CarouselProvider
            naturalSlideWidth={16}
            naturalSlideHeight={9}
            totalSlides={images.length}
            infinite
            currentSlide={images.findIndex(
              elem =>
                activeItems.length === 1 && elem.id === activeItems[0].obj.id
            )}
            touchEnabled
            dragEnabled
            styleName='css.carousel-container'
          >
            <CustomCarousel
              images={images}
              setActiveIndex={value => {
                this.setState({ activeIndex: value })
              }}
            />
          </CarouselProvider>
        </Modal.Content>
      </Modal>
    )
  }
}

MultipleImageModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  images: PropTypes.array,
  index: PropTypes.number,
  caption: PropTypes.string
}
const mapStateToProps = state => {
  return {
    currentFolder: state.folders.selectedFolder,
    activeItems: state.items.activeItems
  }
}
const mapDispatchToProps = dispatch => {
  return {
    setActiveItems: items => {
      dispatch(setActiveItems(items))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MultipleImageModal)
