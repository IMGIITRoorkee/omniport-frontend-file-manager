import React, { Component } from 'react'
import {
  ButtonBack,
  ButtonNext,
  DotGroup,
  ImageWithZoom,
  Slide,
  Slider,
  WithStore
} from 'pure-react-carousel'
import { Icon } from 'semantic-ui-react'
import css from './css/carousel.css'

class CustomCarousel extends Component {
  componentDidUpdate(prevprops) {
    const { currentSlide, setActiveIndex } = this.props
    if (prevprops.currentSlide !== currentSlide) {
      setActiveIndex(currentSlide)
    }
  }
  render() {
    const { images } = this.props

    return (
      <>
        <div styleName='css.button-container-back'>
          <ButtonBack styleName='css.button'>
            <Icon
              name='angle left'
              circular
              basic
              bordered
              size='big'
              styleName='css.button-icon'
            />
          </ButtonBack>
        </div>
        <Slider>
          {images.map((file, index) => (
            <Slide tag='a' index={index}>
              <ImageWithZoom src={file.upload} />
            </Slide>
          ))}
        </Slider>

        <div styleName='css.button-container-next'>
          <ButtonNext styleName='css.button'>
            <Icon
              name='angle right'
              circular
              basic
              bordered
              size='big'
              styleName='css.button-icon'
            />
          </ButtonNext>
        </div>
        <DotGroup styleName='css.dot-group' dotNumbers />
      </>
    )
  }
}

export default WithStore(CustomCarousel, state => ({
  currentSlide: state.currentSlide
}))
