import { Avatar, Card, Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { LOG_OUT_REQUEST, CLOSE_USER_FORM } from '../reducers/user';


const MyProfile = () => {
  const { me, logOutLoading, showUserForm } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);

  const handleCancel= useCallback(()=> {
    dispatch({
      type: CLOSE_USER_FORM,
    });
  },);

  return (
    <Modal
      title="내 정보" 
      visible={showUserForm} 
      onOk={handleCancel} 
      onCancel={handleCancel}
      footer={[
      <Button key="close" onClick={handleCancel}>닫기</Button>,
      <Button type="primary" onClick={handleCancel}>정보 수정</Button>
      ]}
    >
      <Card
        actions={[
          <div key="message">뱉은 말<br />{me.Posts.length}</div>,
          <div key="favorite">관심 주주<br />{me.Followings.length}</div>,
          <div key="fans">내게 관심있는 주주<br />{me.Followers.length}</div>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{me.nickname[0]}</Avatar>}
          title={me.nickname}
        />
        <Button onClick={onLogout} loading={logOutLoading}>로그아웃</Button>
      </Card>
    </Modal>
  );
};

export default MyProfile;
