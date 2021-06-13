import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Tooltip, Card, message } from 'antd';
import { CheckOutlined, FileImageOutlined, FundOutlined, 
  NotificationFilled, NotificationOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import Router from 'next/router';
import useInput from '../../hooks/useInput'
import PostImages from '../post/PostImages';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, CLOSE_POSTFORM } from '../../reducers/post';

const PostContentForm = ({pageType}) => {
  const [postText, onChangePostText, setPostText] = useInput('');
  const [Notification, setNotification] = useState(false);
  const dispatch = useDispatch();
  const { imagePaths, addPostLoading, addPostDone } = useSelector((state) => state.post);

  useEffect(() => {
    if (addPostDone) {
      setPostText('')
    }
  }, [addPostDone]);

  const onClose = useCallback(() => {
    dispatch({
      type: CLOSE_POSTFORM,
    });
  },[]);

  const onToggleNotification = useCallback(() => {
    setNotification((prev) => !prev);
  }, []);

  const onSubmitForm = useCallback(() => {
    if (!postText || !postText.trim()) {
      return message.error({content: '쓸 거 없어?', style: {marginTop: '3vh'}});
    }    
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append('image', p);
    });
    formData.append('content', postText);
    if (pageType === 'singlepost' || pageType === 'userpost') {
      return (
        dispatch({
          type: ADD_POST_REQUEST,
          data: formData,
        }),
        onClose(),
        Router.replace('/')
      )
    } else {
      return (
        dispatch({
        type: ADD_POST_REQUEST,
        data: formData,
        }),
        onClose()
      )
    }
  }, [postText, imagePaths]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const leftButtonStyle = {
    position: 'relative',
    margin: '10px 10px 10px 0px',
  };

  const rightButtonStyle = {
    position: 'relative',
    margin: '10px 0px 10px 10px',
    float: 'right',
  };

  const PostCardImagesStyle = {
    width: '100%',
    padding: '1%',
    margin: '0px 0px 10px 0px',
  };
  
  return(
    <>
      <Form
        encType="multipart/form-data" 
        onFinish={onSubmitForm}>
        <Form.Item>

          <Input.TextArea maxLength={5000} 
            autoSize={{ minRows: 3 }}
            value={ postText }
            placeholder={'#종목이름 으로 해시태그를 걸어봐!'}
            onChange={ onChangePostText }/>
          <div style={{ textAlign: 'right' }}>{postText.length} / 5000</div>

          <input type="file" name="image" hidden multiple 
            ref={ imageInput } onChange={ onChangeImages }/>
          <Button
            style={ leftButtonStyle }
            onClick={ onClickImageUpload }>
            <FileImageOutlined />
          </Button>

          <Tooltip title='준비 중' placement="bottom">
          <Button
            style={ leftButtonStyle }>
              <FundOutlined />
          </Button>
          </Tooltip>

          <Button type="primary"
            style={ rightButtonStyle }
            htmlType="submit"
            loading={ addPostLoading }>
            <CheckOutlined />
          </Button>

          <Tooltip title='준비 중' placement="bottom">
          <Button
            style={ rightButtonStyle }
            onClick={ onToggleNotification }>
              {Notification
              ? <NotificationFilled style = {{ color: '#E13427' }}/>
              : <NotificationOutlined />
              }
          </Button>
          </Tooltip>

            {imagePaths.length > 0 &&
              <div style={ PostCardImagesStyle }>
                <PostImages images={ imagePaths } postForm={true}/>
              </div>
          }
        </Form.Item>
      </Form>
    </>
  );
};

PostContentForm.propTypes = {
  pageType: PropTypes.string.isRequired,
};

export default PostContentForm;