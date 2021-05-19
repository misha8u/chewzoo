import React, { useCallback, useEffect, useRef } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
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
  const userEmail = useRef();
  const userPassword = useRef();

  //잘못된 이메일이나 비밀번호 치면 여기서 한번 거르게해줘 정규식으로

  useEffect(() => {
    if (logInError) {
      message.error({content: logInError, style: {marginTop: '3vh'}});
    }
  }, [logInError])

  useEffect(() => {
    if (showUserForm === String('login')) {
      userEmail.current.focus();
    }
  }, [showUserForm])

  const onSubmitForm = useCallback(() => {
    const emailRex = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!emailRex.test(email)) {
      message.error({content: '이메일 주소를 확인해봐!', style: {marginTop: '3vh'}})
      return userEmail.current.focus();
    }
    const passwordRex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/
    if (!passwordRex.test(password)) {
      message.error({content: '비밀번호를 확인해봐!', style: {marginTop: '3vh'}})
      return userPassword.current.focus();
    }
    dispatch({
      type: LOG_IN_REQUEST,
      data: { email, password },
    });
  }, [email, password]);

  const handleCancel = useCallback(()=> {
    dispatch({
      type: CLOSE_USER_FORM,
    });
  },);

  const onEnterKeyDown = (event) => {
    if (showUserForm === String('login') && event.key === 'Enter') {
      onSubmitForm()
    }
  }

  return (
    <Modal 
      title="누구..?" 
      visible={showUserForm === String('login')}
      onOk={onSubmitForm} 
      onCancel={handleCancel}
      footer={[
        <Button key="cancle" onClick={handleCancel}>닫기</Button>,
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
            ref={userEmail}
            onKeyDown={ onEnterKeyDown }
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
            ref={userPassword}
            onKeyDown={ onEnterKeyDown }
            onChange={onChangePassword} required />
        </div>
        <p></p>
        <Link href="/signup" prefetch={false}>
          <a onClick={handleCancel}>당장 가입해서 누군지 알려주기</a>
        </Link>
      </Form>
    </Modal>
  );
};

export default LoginForm;
