import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Tooltip, Card, Row, message, Divider } from 'antd';
import { CheckOutlined, FileImageOutlined, FundOutlined, 
  NotificationFilled, NotificationOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import Router from 'next/router';
import useInput from '../../hooks/useInput'
import PostImages from '../post/PostImages';
import PostCardContent from '../post/PostCardContent';
import { useSelector, useDispatch } from 'react-redux';
import { BRANCH_REQUEST, UPLOAD_IMAGES_REQUEST, CLOSE_POSTFORM } from '../../reducers/post';


const BranchPostContentForm = ({pageType}) => {
  const [postText, onChangePostText, setPostText] = useInput('');
  const [branchFormOpened, setBranchFormOpened] = useState(false);
  const [Notification, setNotification] = useState(false);
  const [privewedImage, setPreviewedImage] = useState(imagePaths);
  const dispatch = useDispatch(); 
  const { imagePaths, branchLoading, branchDone, branchPost } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);
  const id = me && me.id;

  useEffect(() => {
    if (branchDone) {
      setPostText('')
    };
    setPreviewedImage(imagePaths);
  }, [branchDone, imagePaths]);

  const onClose = useCallback(() => {
    dispatch({
      type: CLOSE_POSTFORM,
    })
  },[]);

  const onToggleBranch = useCallback(() => {
    setBranchFormOpened((prev) => !prev);
  }, []);

  const onToggleNotification = useCallback(() => {
    setNotification((prev) => !prev);
  }, []);

  const onSubmitForm = useCallback(() => {
    if (!postText || !postText.trim()) {
      return message.error({content: '쓸 거 없어?', style: {marginTop: '3vh'}});
    }
    if (pageType === 'singlepost' || pageType === 'userpost') {
      return(
        dispatch({
          type: BRANCH_REQUEST,
          data: { content: postText, image: imagePaths, postId: branchPost.id },
        }),
        onClose(),
        Router.replace('/')
      )
    } else {
      return(
        dispatch({
          type: BRANCH_REQUEST,
          data: { content: postText, image: imagePaths, postId: branchPost.id },
        }),
        onClose()
      )
    }
  }, [postText, imagePaths, branchPost.id]);

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

  const BranchPostContentStyle = {
    position: 'relative',
    width: '100%',
    padding: '16px 10px 16px 10px',
    margin: '0px 0px 0px 0px',
  };

  const BranchPostCardImagesStyle = {
    position: 'relative',
    width: '100%',
    padding: '1%',
    margin: '0px 0px 10px 0px',
    cursor: 'pointer'
  };

  const visibleBranchContentButtonStyle ={
    margin: '0px 0px 0px 8px',
    color: '#E13427',
    cursor: 'pointer'
  }

  return(
    <>
      <Form
        encType="multipart/form-data"
        onFinish={onSubmitForm}>
        <Form.Item>
          <Input.TextArea maxLength={5000} 
            autoSize={{ minRows: 3 }}
            placeholder={'#종목이름 으로 해시태그를 걸어봐!'}
            value={postText}
            onChange={onChangePostText} />
          <div style={{ textAlign: 'right' }}>{postText.length} / 5000</div>

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
            loading={branchLoading}>
            <CheckOutlined />
          </Button>

          <Tooltip title='준비 중' placement="bottom">
          <Button
            style={ rightButtonStyle }
            onClick={onToggleNotification}>
              {Notification
              ? <NotificationFilled style = {{ color: '#E13427' }}/>
              : <NotificationOutlined />
              }
          </Button>
          </Tooltip>

          {imagePaths.length > 0 &&
            <Card.Grid style={ BranchPostCardImagesStyle } hoverable={false}>
              <PostImages images={ privewedImage } postForm={true}/>
            </Card.Grid>
          }
        </Form.Item>
      </Form>

      <Divider orientation="left" plain style={{ margin: '16px 0px 0px 0px'}}>
        {branchPost.UserId != id && branchPost.User
          ? branchPost.User.nickname + '의 글'
          : '내가 썼던 글'
        }
        {branchFormOpened
          ? <EyeInvisibleOutlined style={visibleBranchContentButtonStyle} onClick={onToggleBranch} />
          : <EyeOutlined style={visibleBranchContentButtonStyle} onClick={onToggleBranch} />
        }
      </Divider>

      {branchFormOpened
        ? <></>
        : <>
            <Row style = { BranchPostContentStyle }>
              <PostCardContent postData={branchPost.content}/>
            </Row>

            {branchPost.Images?.length > 0 && (
              <div style={ BranchPostCardImagesStyle }>
                {branchPost.Images[0] && 
                  <PostImages images={ branchPost.Images }/>
                }
              </div>
            )}
          </>
      }
    </>
  );
};

export default BranchPostContentForm;