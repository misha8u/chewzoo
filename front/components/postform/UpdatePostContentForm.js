import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Tooltip, message } from 'antd';
import { CheckOutlined, FileImageOutlined, FundOutlined, 
  NotificationFilled, NotificationOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import Router from 'next/router';
import PostImages from '../post/PostImages';
import { useSelector, useDispatch } from 'react-redux';
import { UPDATE_POST_REQUEST, UPLOAD_IMAGES_REQUEST, CLOSE_POSTFORM } from '../../reducers/post';

const UpdatePostContentForm = ({pageType}) => {
  const [updateText, setUpdateText] = useState('')
  const [Notification, setNotification] = useState(false);
  const dispatch = useDispatch();
  const { imagePaths, updatePostLoading, updatePostDone, updatePost, showUpdatePostForm } = useSelector((state) => state.post);

  useEffect(() => {
    if (showUpdatePostForm) {
      setUpdateText(updatePost.content)
    }
  }, [showUpdatePostForm]);

  const onChangeText = useCallback((e) => {
    setUpdateText(e.target.value);
  });

  const onClose = useCallback(() => {
    dispatch({
      type: CLOSE_POSTFORM,
    });
  },[]);

  const onToggleNotification = useCallback(() => {
    setNotification((prev) => !prev);
  }, []);

  const onSubmitForm = useCallback(() => {
    if (!updateText || !updateText.trim()) {
      return message.error({content: '쓸 거 없어?', style: {marginTop: '3vh'}});
    }
    if (pageType === 'singlepost' || pageType === 'userpost') {
      return(
        dispatch({
          type: UPDATE_POST_REQUEST,
          data: { content: updateText, image: imagePaths, PostId: updatePost.id },
        }),
        onClose(),
        Router.replace('/')
      )
    } else {
      return(
        dispatch({
          type: UPDATE_POST_REQUEST,
          data: { content: updateText, image: imagePaths, PostId: updatePost.id },
        }),
        onClose()
      )
    }
  }, [updateText, imagePaths, updatePost.id]);

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

  const UpdatePostCardImagesStyle = {
    position: 'relative',
    width: '100%',
    padding: '1%',
    margin: '0px 0px 10px 0px',
    cursor: 'pointer'
  };
  
  return(
    <>
      <Form
        encType="multipart/form-data" 
        onFinish={onSubmitForm}>
        <Form.Item>
          <Input.TextArea maxLength={5000} 
            autoSize={{ minRows: 3 }}
            value={ updateText }
            placeholder={'#종목이름 으로 해시태그를 걸어봐!'}
            onChange={ onChangeText }/>
          <div style={{ textAlign: 'right' }}>{updateText.length} / 5000</div>

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
            loading={ updatePostLoading }>
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

          {imagePaths.length > 0 | updatePost.Images?.length > 0 && (
            <>
              {updatePost.Images?.length > 0
                ? <div style={ UpdatePostCardImagesStyle }>
                    <PostImages images={ updatePost.Images.concat(imagePaths) } postForm={true} />
                  </div>
                : <div style={ UpdatePostCardImagesStyle }>
                    <PostImages images={ imagePaths } postForm={true} />
                  </div>
              }
            </>
          )}

        </Form.Item>
      </Form>

    </>
  );
};

UpdatePostContentForm.propTypes = {
  pageType: PropTypes.string.isRequired,
};

export default UpdatePostContentForm;