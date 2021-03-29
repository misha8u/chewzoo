import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Tooltip, Card  } from 'antd';
import { CheckOutlined, FileImageOutlined, FundOutlined, 
  NotificationFilled, NotificationOutlined } from '@ant-design/icons';

import useInput from '../../hooks/useInput'
import PostImages from '../post/PostImages';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST } from '../../reducers/post';
import { CLOSE_POSTFORM } from '../../reducers/user';


const PostStoryForm = () => {
  const [postText, onChangePostText, setPostText] = useInput('');
  const [Notification, setNotification] = useState(false);
  const dispatch = useDispatch();
  const { imagePaths, addPostLoading, addPostDone } = useSelector((state) => state.post);

  useEffect(() => {
    if (addPostDone) {
      setPostText(''),
      onClose();
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
      return alert('할 말 없어?');
    }    
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append('image', p);
    });
    formData.append('content', postText);
    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [postText, imagePaths]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files);
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
    <Form
      encType="multipart/form-data" 
      onFinish={onSubmitForm}>
      <Form.Item>

        <div style={rightButtonStyle}>
          {postText.length} / 5000
        </div>
        <Input.TextArea maxLength={5000} 
          placeholder="할 말있어?"
          rows={2}
          autoSize={{ minRows: 2, maxRows: 8 }}
          value={postText} 
          onChange={onChangePostText} />

          <input type="file" name="image" hidden multiple ref={imageInput} onChange={onChangeImages}/>
          <Button
            style={ leftButtonStyle }
            onClick={onClickImageUpload}>
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
            loading={addPostLoading}>
            <CheckOutlined />
          </Button>

          <Button
            style={ rightButtonStyle }
            onClick={onToggleNotification}>
              {Notification
              ? <NotificationFilled style = {{ color: '#E13427' }}/>
              : <NotificationOutlined />
              }
          </Button>

        {imagePaths.length > 0 &&
          <Card.Grid style={ PostCardImagesStyle }>
            <PostImages images={imagePaths} postForm={true}/>
          </Card.Grid>
        }
      </Form.Item>
    </Form>

  );
};

export default PostStoryForm;