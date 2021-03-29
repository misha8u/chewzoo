import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Image, Space, Button, Col, Row, Carousel } from 'antd';
import { ZoomInOutlined, DeleteOutlined} from '@ant-design/icons';
import { REMOVE_IMAGE } from '../../reducers/post';
import { useDispatch } from 'react-redux';

const PostImages = ({ images, postForm}) => {
  const dispatch = useDispatch();
  const imgPreview = {
    maskClassName: 'customize-mask',
    mask: (
      <Space direction="vertical" align="center">
        <ZoomInOutlined />
      </Space>
    ),
  };

  const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  const removeButtonStyle = {
    color: '#ffffff',
    margin: '0.5% 5px 0.5% 5px',
  };

  const imageBoxStyle = {
    width: `${92/images.length}%`,
    margin: '2px',
  }

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    })
  }, []);

  return (
    <div>
      <Image.PreviewGroup>
        <Row>
        {images.map((v, i) => (
          <Col style={imageBoxStyle}>
            <Tooltip
              title = {<DeleteOutlined key="remove" style ={removeButtonStyle} onClick={onRemoveImage(i)}/>}
              color="#E13427"
              placement="top"
              visible={postForm}
              defaultVisible={false}
            >
              <Image
              role="presentation"
              src={typeof(v) === 'object' ? `http://localhost:3065/${v.src}` : `http://localhost:3065/${v}`}
              alt={v}
              preview={imgPreview}/>
            </Tooltip>
          </Col>
        ))}
        </Row>
      </Image.PreviewGroup>
    </div>
  )
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
  })).isRequired,
  postForm: PropTypes.bool,
};

export default PostImages;