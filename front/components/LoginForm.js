import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { MailOutlined, KeyOutlined } from '@ant-design/icons'

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';


import useInput from '../hooks/useInput';
import { LOG_IN_REQUEST, CLOSE_USER_FORM } from '../reducers/user';

const LoginForm = () => {
  const dispatch = useDispatch();
  const { logInLoading, logInError, showUserForm } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }

  }, [logInError])

  const onSubmitForm = useCallback(() => {
    console.log(email, password);
    dispatch({
      type: LOG_IN_REQUEST,
      data: { email, password },
    });
  }, [email, password]);

  const handleCancel= useCallback(()=> {
    dispatch({
      type: CLOSE_USER_FORM,
    });
  },);

  return (
    <Modal 
      title="누구..?" 
      visible={showUserForm} 
      onOk={onSubmitForm} 
      onCancel={handleCancel}
      footer={[
        <Button key="cancle" onClick={handleCancel}>취소</Button>,
        <Button type="primary" onClick={onSubmitForm} loading={logInLoading}>로그인</Button>
      ]}
      >
      <Form style={{ padding: '0px' }}>
        <div>
          <Input name="user-email" 
            prefix={<MailOutlined style={{ margin: '0px 12px 0px 3px' }}/>}
            placeholder="e-mail"
            type="email" 
            value={email}
            onChange={onChangeEmail} required />
        </div>
        <p></p>
        <div>
          <Input
            name="user-password"
            prefix={<KeyOutlined style={{ margin: '0px 12px 0px 3px' }}/>}
            placeholder="password"
            type="password"
            value={password}
            onChange={onChangePassword} required />
        </div>
        <p></p>
        <Link href="/signup">
          <a onClick={handleCancel}>당장 가입해서 누군지 알려주기</a>
        </Link>
      </Form>
    </Modal>
  );
};

export default LoginForm;
