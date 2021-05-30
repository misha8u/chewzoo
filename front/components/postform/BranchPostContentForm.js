import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Tooltip, Card, Col, Row, message, Divider } from 'antd';
import { CheckOutlined, FileImageOutlined, FundOutlined, 
  NotificationFilled, NotificationOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import TextLoop from "react-text-loop";

import Link from 'next/link';
import Router from 'next/router';
import useInput from '../../hooks/useInput'
import PostImages from '../post/PostImages';
import PostCardContent from '../post/PostCardContent';
import { useSelector, useDispatch } from 'react-redux';
import { BRANCH_REQUEST, UPLOAD_IMAGES_REQUEST } from '../../reducers/post';
import { CLOSE_POSTFORM } from '../../reducers/user';


const BranchPostContentForm = ({pageType}) => {
  const [branchFormOpened, setBranchFormOpened] = useState(false);
  const [postText, onChangePostText, setPostText] = useInput('');
  const [Notification, setNotification] = useState(false);  
  const dispatch = useDispatch();
  const { imagePaths, branchLoading, branchDone } = useSelector((state) => state.post);
  const { branchPost, me } = useSelector((state) => state.user);
  const id = me && me.id;

  useEffect(() => {
    if (branchDone) {
      setPostText('')
    }
  }, [branchDone]);

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
      <Row>
      <Col xs={1} md={7}/>

      <Col xs={22} md={10}>
        <Form
          encType="multipart/form-data" 
          onFinish={onSubmitForm}>
          <Form.Item>
            <Row style={{ margin: '10px 0px 10px 0px' }}>
            <TextLoop>
              <span>🏷#종목이름 #테마종류 공백, 기호 ㄴㄴ</span>
              <span>📈차트 사진을 첨부하는 것도 좋아~</span>
              <span>☕커피 한 잔 선물하는 거 어때?
                <Link href={"https://open.kakao.com/me/chewzoo"} prefetch={false}>
                  <a> (클릭)</a>
                </Link>
              </span>
              <span>🪁어떤 종목이 올라갈까?</span>
              <span>💡#투자생각 해시태그로 의견을 나눠봐!</span>
              <span>📰꼭 알아야할 이슈, 뉴스가 있어?</span>
              <span>📉혹시... 물렸어..?</span>
            </TextLoop>
            </Row>

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
              <Card.Grid style={ BranchPostCardImagesStyle }>
                <PostImages images={imagePaths} postForm={true}/>
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

              {branchPost.Images && branchPost.Images.length > 0 && (
                <div style={ BranchPostCardImagesStyle }>
                  {branchPost.Images[0] && <PostImages images={branchPost.Images}/>}
                </div>
              )}
            </>
        }
      </Col>

      <Col xs={1} md={7}/>
      </Row>
    </>
  );
};

export default BranchPostContentForm;