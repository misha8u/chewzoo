import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Row, Checkbox, Form, Input, Col, Divider, message, Button  } from 'antd';

import Router from 'next/router';
import Head from 'next/head';
import axios from 'axios';

import { backUrl } from '../config/config';
import { END } from 'redux-saga';
import { useDispatch, useSelector } from 'react-redux';
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST, SIGN_UP_SUBMIT_FALSE } from '../reducers/user';
import AppLayout from '../components/AppLayout';
import useInput from '../hooks/useInput';
import wrapper from '../store/configureStore';
import Modal from 'antd/lib/modal/Modal';

const Signup = () => {
  const [privacyTerm, setPrivacyTerm] = useState(false);
  const [serviceTerm, setServiceTerm] = useState(false);
  const [privacyTermError, setPrivacyTermError] = useState(false);
  const [serviceTermError, setServiceTermError] = useState(false);
  const [tutoPage, setTutoPage] = useState(0);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, onChangePasswordCheck] = useInput('');
  const dispatch = useDispatch();
  const { me, signUpDone, signUpError, signUpSubmit } = useSelector((state) => state.user);

  const userEmail = useRef();
  const userNickname = useRef();
  const userPassword = useRef();
  const userPasswordCheck = useRef();
  const userPrivacyTerm = useRef();
  const userServiceTerm = useRef();

  useEffect(() => {
    if (me && me.id) {
      message.error({content: '이미 가입된 회원입니다.', style: {marginTop: '3vh'}})
    }
    if (signUpDone) {
      setTutoPage(1)
    }
    if (signUpSubmit) {
      onSubmit()
      dispatch({
        type: SIGN_UP_SUBMIT_FALSE
      });
    }
    if (signUpError) {
      message.error({content: signUpError, style: {marginTop: '3vh'}})
      userEmail.current.focus();
    }
  }, [me && me.id, signUpDone, signUpSubmit, signUpError]);

  const onSubmit = useCallback(() => {    
    const emailRex = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!emailRex.test(email)) {
      message.error({content: '이메일을 정확히 입력해주세요.', style: {marginTop: '3vh'}})
      return userEmail.current.focus();
    }
    const nicknameRex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;
    if (!nicknameRex.test(nickname) | nickname.length > 10 | nickname.length < 1) {
      message.error({content: '10자 이내로 한글, 영문, 숫자로 이루어진 별명을 입력해주세요.', style: {marginTop: '3vh'}})
      return userNickname.current.focus();
    }
    const passwordRex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/
    if (!passwordRex.test(password)) {
      message.error({content: '영문과 숫자, 특수문자가 조합된 6자리 이상의 비밀번호를 입력해주세요.', style: {marginTop: '3vh'}})
      return userPassword.current.focus();
    }
    if (password !== passwordCheck) {
      message.error({content: '비밀번호와 비밀번호 확인 결과가 다릅니다.', style: {marginTop: '3vh'}})
      return userPasswordCheck.current.focus();
    }
    if (!privacyTerm) {
      message.error({content: '개인 정보 취급 방침 동의가 필요합니다.', style: {marginTop: '3vh'}})
      userPrivacyTerm.current.focus();
      return setPrivacyTermError(true);
    }
    if (!serviceTerm) {
      message.error({content: '서비스 운영 정책 동의가 필요합니다.', style: {marginTop: '3vh'}})
      userServiceTerm.current.focus();
      return setServiceTermError(true);
    }
    return dispatch({
      type: SIGN_UP_REQUEST,
      data: {
        email,
        password,
        nickname,
      },
    });
  }, [email, password, passwordCheck, privacyTerm, serviceTerm, nickname]);

  const onTutoPage = useCallback(() => {
    if (tutoPage > 2) {
      setTutoPage(0);
      message.success({content: 'cHEWzOO에 온걸 환영해!', style: {marginTop: '3vh'}});
      Router.replace('/');
    } else {
      setTutoPage(tutoPage + 1);
    }
  }, [tutoPage])

  const onChangePrivacyTerm = useCallback((e) => {
    setPrivacyTerm(e.target.checked);
    setPrivacyTermError(false);
  }, []);

  const onChangeServiceTerm = useCallback((e) => {
    setServiceTerm(e.target.checked);
    setServiceTermError(false);
  }, []);

  const SignupContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 94.6px)',
  }

  const SignupContainerCenterStyle = {
    flex: '1',
    background: '#FAFAFA',
    overflowY: 'auto'
  }

  return (
    <AppLayout pageType={'signup'}>
      <Head>
        <title>츄주 | 회원 가입</title>
      </Head>
      <div style={ SignupContainerStyle }>

      <Col xs={2} md={7} />
      
      <Col xs={20} md={10} style={ SignupContainerCenterStyle }>
        <Divider style={{ fontWeight: 'bold', color: '#E13427', fontSize: '22px' }}>
            jOIN
        </Divider>
        <Row>
        <Col xs={0} md={3} />

        <Col xs={24} md={18}>
          <Form layout="vertical" onFinish={onSubmit} style={{ padding: 10 }} name="basic">
            <Form.Item name={['user', 'email']} label="📧 이메일">
              <Input placeholder={'chewzoo@email.com'} ref={userEmail} name="user-email" value={email} required onChange={onChangeEmail}/>
            </Form.Item>

            <Form.Item name={['user', 'name']} label="🌻 별명">
              <Input placeholder={'10자 이내로 한글, 영문, 숫자만 입력해주세요.'} ref={userNickname} name="user-nick" value={nickname} required onChange={onChangeNickname} maxLength={10}/>
            </Form.Item>

            <Form.Item name={['user', 'password']} label="🔑 비밀번호">
              <Input placeholder={'영문과 숫자, 특수문자를 조합해 6자리 이상 입력해주세요.'} ref={userPassword} name="user-password" type="password" value={password} required onChange={onChangePassword} />
            </Form.Item>

            <Form.Item name={['user', 'passwordCheck']} label="🔐 비밀번호 확인">
              <Input
                name="user-password-check"
                type="password"
                value={passwordCheck}
                ref={userPasswordCheck}
                required
                onChange={onChangePasswordCheck}
                placeholder={'비밀번호 확인을 위해 한번 더 입력해주세요.'}
              />
            </Form.Item>
          </Form>
        </Col>

        <Col xs={0} md={3} />
        </Row>
          
            <Divider />
              <p style={{ backgroundColor: '#FFFFFF', padding: '5px'}}>
                <div style={{ fontWeight: 'bold', textAlign: 'center', margin: '10px'}}>&#60; 개인 정보 취급 방침 &#62;</div>
                <span>
                  📬 원활한 서비스 이용을 위한 이메일과 비밀번호, 별명을 수집합니다.
                </span><br />
                <span>
                  🔎 이메일은 로그인, 분실한 비밀번호 찾기, 회원 가입 시에 사용자(회원) 확인, 중복 가입 방지, 부정 이용 방지를 위한 목적으로 사용됩니다.
                </span><br />
                <span>
                  🏷️ 이메일은 다른 사용자(회원)에게 노출되지 않으며, 별명만 다른 사용자(회원)에게 노출됩니다.
                </span><br />
                <span>
                  🗑️ 가입 회원 정보는 탈퇴 시점을 기준으로 5년간 보관 후 파기됩니다.
                </span><br />
                <span>
                  ⚖️ 정보통신망 이용촉진 등에 관한 법률 등 관련 법률에 의한 개인정보 보호규정 및 정보통신부가 제정한 개인정보지침을 준수합니다.
                </span><br />
                <br /><p>
                  <Checkbox ref={userPrivacyTerm} name="privacy-term" checked={privacyTerm} onChange={onChangePrivacyTerm} style={{ fontWeight: 'bold' }}>
                    &nbsp;개인 정보 취급 방침에 동의합니다.&nbsp;&nbsp;
                  </Checkbox>
                  {privacyTermError && <span style={{ color: 'red', position: 'absolute', fontWeight: 'bold'}}>★★★</span>}
                </p>
              </p>
            
            <Divider />

              <p style={{ backgroundColor: '#FFFFFF', padding: '5px'}}>
                <div style={{ fontWeight: 'bold', textAlign: 'center', margin: '10px'}}>&#60; 서비스 운영 정책 &#62;</div>
                <div style={{ textAlign: 'center', margin: '10px'}}>
                  <img role="welcome" alt="welcome" src ={`${backUrl}/resource/signupTitle.png`}/>
                </div>
                <span>
                  📈 츄주(cHEWzOO)는 "주식을 씹는다."라는 뜻의 이름을 가진 주식 투자자 커뮤니티입니다.
                </span><br />
                <span>
                  🧑‍🤝‍🧑 회원 가입과 개인정보 취급 방침, 서비스 운영 정책을 제외한 cHEWzOO(츄주)의 대부분의 메세지는 반말입니다.
                </span><br />
                <span>
                  🗣️ 모든 사용자(회원) 사이에는 예의와 선을 지키는 반말을 권장합니다.
                </span><br />
                <span>
                  🐷 녹색 돼지 자낳괴와 분홍 쥐돌이 떡상이, 파랑 쥐돌이 떡락이는 cHEWzOO(츄주)의 대표 캐릭터입니다.
                </span><br />
                <span>
                  💵 모든 방식의 주식 투자는 존중 받아 마땅하며, 과정과 결과가 모두 의미 있는 행위입니다.
                </span><br />
                <span>
                  🧮 경제와 주식, 투자에 대한 모든 정보 공유와 의견을 환영합니다.
                </span><br />
                <span>
                  🚔 특정 정치적, 사회적, 성별 집단 및 개인에 대한 모든 비난과 욕설 또는 지지 의사 표현(별명, 게시글, 덧글)은 제재 대상이 될 수 있습니다.
                </span><br />
                <br /><p>
                  <Checkbox ref={userServiceTerm} name="service-term" checked={serviceTerm} onChange={onChangeServiceTerm} style={{ fontWeight: 'bold' }}>
                    &nbsp;서비스 운영 정책에 동의하고 성공 투자하겠습니다.&nbsp;&nbsp;&nbsp;
                  </Checkbox>
                  {serviceTermError && <span style={{ color: 'red', position: 'absolute', fontWeight: 'bold'}}>★★★</span>}
                </p>
              </p>
            <Divider />
      </Col>

      <Col xs={2} md={7} />
      </div>

      <Modal
        closable={ false }
        footer={ null }
        visible={ signUpDone && tutoPage > 0 }
        bodyStyle={{ padding: '10px', textAlign: 'center' }}
        width={340}
      >
        {tutoPage === 1 &&
          <div>
            <img role="tuto1" alt="tuto1" src ={`${backUrl}/resource/tuto1.png`}/>
            <Divider style={{ margin: '12px 0px 0px 0px' }}/>
            <br />
            <span>로그인 하고, 화면 우측 하단의</span>
            <br />
            <span>"글쓰기 버튼"을 눌러줘</span>
            <Button shape="round" type="dashed"
              style={{ width: '80%', margin: '20px 8px 0px 8px'  }} onClick={ onTutoPage }
            >
              ㅇㅇ 뭐라도 써볼게✏
            </Button>
          </div>
        }
        {tutoPage === 2 &&
          <div>
            <img role="tuto2" alt="tuto2" src ={`${backUrl}/resource/tuto2.png`}/>
            <Divider style={{ margin: '12px 0px 0px 0px' }}/>
            <br />
            <span>그럼, 껄무새에게 살지 팔지 물어보거나,</span>
            <br />
            <span>#해시태그로 관심 종목을 태그할 수 있어~</span>
            <Button shape="round" type="dashed"
              style={{ width: '80%', margin: '20px 8px 0px 8px'  }} onClick={ onTutoPage }
            >
              오! 껄무새의 대답이 궁금해!🦜
            </Button>
          </div>
        }
        {tutoPage === 3 &&
          <div>
            <img role="tuto3" alt="tuto3" src ={`${backUrl}/resource/tuto3.png`}/>
            <Divider style={{ margin: '12px 0px 0px 0px' }}/>
            <br />
            <span>게시물에 댓글💬을 달거나</span>
            <br />
            <span>신뢰해❗와 의심해❓ 버튼으로 소통할 수 있어!</span>
            <Button shape="round" type="dashed"
              style={{ width: '80%', margin: '20px 8px 0px 8px'  }} onClick={ onTutoPage }
            >
              어서 즐겨보고파!!
            </Button>
          </div>
        }
      </Modal>

    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Signup;