import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Tooltip, Card, Col, Row, message } from 'antd';
import { CheckOutlined, FileImageOutlined, FundOutlined, 
  NotificationFilled, NotificationOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import Router from 'next/router';
import useInput from '../../hooks/useInput'
import PostImages from '../post/PostImages';
import ChewzooAvatar from '../ChewzooAvatar';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST } from '../../reducers/post';
import { CLOSE_POSTFORM } from '../../reducers/user';


const PostContentForm = ({pageType}) => {
  const [postText, onChangePostText, setPostText] = useInput('');
  const [Notification, setNotification] = useState(false);
  const dispatch = useDispatch();
  const { imagePaths, addPostLoading, addPostDone } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);

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
      return message.error({content: '할 말 없어?', style: {marginTop: '3vh'}});
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
        Router.replace('/')
      )
    } else {
      return dispatch({
        type: ADD_POST_REQUEST,
        data: formData,
      })
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

  const nicknameStyle = {
    fontWeight: 'bold',
    fontSize: '25px',
    marginLeft: '5px',
    width: 'calc(100% - 45px)',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    position: 'relative'
  };
  
  return(
    <Form
      encType="multipart/form-data" 
      onFinish={onSubmitForm}>
      <Form.Item>
        <Row style={{ margin: '10px 0px 10px 0px' }}>
          <Col><ChewzooAvatar userId={me.id} userAvatar={me.avatar} avatarPosition={'post'} disabledClick={true}/></Col>
          <Col style={ nicknameStyle }>{me.nickname}</Col>
        </Row>

        <Input.TextArea maxLength={5000} 
          autoSize={{ minRows: 3, maxRows: 8 }}
          value={ postText }
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
          <Card.Grid style={ PostCardImagesStyle }>
            <PostImages images={ imagePaths } postForm={true}/>
          </Card.Grid>
        }
      </Form.Item>
    </Form>

  );
};

PostContentForm.propTypes = {
  pageType: PropTypes.string.isRequired,
};

export default PostContentForm;