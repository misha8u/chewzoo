import { Avatar, Card, Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { CLOSE_OTHER_PROFILE } from '../reducers/user';


const OtherProfile = (user) => {
  const { showOtherProfile } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      // LOAD_OTHER_PROFILE_REQUEST
    })
  }, []);

  const handleCancel= useCallback(()=> {
    dispatch({
      type: CLOSE_OTHER_PROFILE,
    });
  },);

  return (
    <Modal
      title="주주님 정보" 
      visible={showOtherProfile} 
      onOk={handleCancel} 
      onCancel={handleCancel}
      footer={[
      <Button key="close" onClick={handleCancel}>닫기</Button>,
      <Button type="primary" onClick={handleCancel}>정보 수정</Button>
      ]}
    >
      <Card
        actions={[
          <div key="message">주주님 말씀<br />{user.Posts.length}</div>,
          <div key="fans">말씀에 관심있는 주주들<br />{user.Followers.length}</div>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{user.nickname[0]}</Avatar>}
          title={user.nickname}
        />
        <Button>관심 갖기</Button>
      </Card>
    </Modal>
  );
};

export default OtherProfile;
