import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Image, Space, Col, Row, Carousel, Tooltip } from 'antd';
import { ZoomInOutlined, DeleteOutlined, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { REMOVE_IMAGE } from '../../reducers/post';
import { useDispatch } from 'react-redux';

const PostImages = ({ images, postForm }) => {
  const dispatch = useDispatch();
  const imageCarousel = useRef();
  const [currentPage, setCurrentPage] = useState(0);

  const imgPreview = {
    maskClassName: 'customize-mask',
    mask: (
      <Space direction="vertical" align="center">
        <ZoomInOutlined />
      </Space>
    ),
  };

  const visibleCarouselSetting = () => {
    const c = (images.length > 3)
    return c
      ? {infinite: false, slidesToShow: 4, slidesToScroll: 4,}
      : {infinite: false, slidesToShow: `${images.length % 4}`, dots: false }
  }
  const [carouselSetting] = useState(visibleCarouselSetting());

  const visibleImageBox  = () => {
    const c = (images.length > 3)
    return c
      ? {padding: '2.5px'}
      : {padding: '2.5px', width: `${100 / images.lenghs}%`}
  }
  const [imageBox] = useState(visibleImageBox());

  const sideButtonStyle = {
    display: 'flex',
    width: '14px',
    alignItems: 'center',
    margin: '0px 3px 0px 3px'
  };

  const handlePrev = () => {
    if(images.length > 4 && currentPage > 0) {
      imageCarousel.current.prev();
    }
  }
  
  const handleNext = () => {
    if(images.length > 4 && images.length - currentPage > 4) {
      imageCarousel.current.next()
    }
  }

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    })
  }, []);

  return (
    <Row style={{ position: 'relative' }} key='images'>
      <Col style={sideButtonStyle} onClick={handlePrev}>
        {images.length > 4 && currentPage > 0 && <DoubleLeftOutlined />}
      </Col>
      <Col style={{width: 'calc(100% - 40px)'}}>
        <Image.PreviewGroup>
          <Carousel {...carouselSetting} ref={imageCarousel} afterChange={setCurrentPage}>
            {images.map((v, i) => (
              <Tooltip
                title = {postForm && <DeleteOutlined key="remove" onClick={onRemoveImage(i)}/>}
                color="#E13427"
                placement="bottom"
              >
                <Image
                role="presentation"
                src={typeof(v) === 'object' ? `http://localhost:3065/${v.src}` : `http://localhost:3065/${v}`}
                alt={v}
                style={imageBox}
                preview={imgPreview}/>
              </Tooltip>
            ))}
          </Carousel>
        </Image.PreviewGroup>
      </Col>
      <Col style={sideButtonStyle} onClick={handleNext}>
        {images.length > 4 && images.length - currentPage > 4 && <DoubleRightOutlined />}
      </Col>
    </Row>
  )
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
  })).isRequired,
  postForm: PropTypes.bool,
};

export default PostImages;