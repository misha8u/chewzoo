import React, { useCallback } from 'react';
import Media from 'react-media';

import { Form, Input, Button, Modal, Card } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_SUBMENU_FORM } from '../reducers/user';


const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { showSubmenuForm } = useSelector((state) => state.user);

  const handleCancel= useCallback(()=> {
    dispatch({
      type: CLOSE_SUBMENU_FORM,
    });
  },);

  return (
    <Modal 
      title="서브메뉴" 
      visible={showSubmenuForm} 
      onOk={handleCancel} 
      onCancel={handleCancel}
      footer={[
        <Button key="cancle" onClick={handleCancel}>닫기?</Button>,
        <Button type="primary" onClick={handleCancel}>모하기?</Button>
      ]}
      >
      <FormWrapper>
        <div>
          <Input.Search enterButton style={{ verticalAlign: 'middle' }} />
        </div>
        <div>
          <Card.Grid >주식WIKI</Card.Grid>
          <Card.Grid >매매일지</Card.Grid>
          <Card.Grid >후원하기</Card.Grid>
        </div>
        <Link href="/signup"><a  onClick={handleCancel}>뭔가 링크를 추가하자</a></Link>
      </FormWrapper>
    </Modal>
  );
};

export default LoginForm;
