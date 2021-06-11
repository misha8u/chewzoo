import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';

import Media from 'react-media';
import { Col, Row, Input, Button, message, Popover } from 'antd';
import { MenuOutlined, CheckOutlined, FormOutlined } from '@ant-design/icons'

import { useSelector, useDispatch } from 'react-redux';
import { SHOW_USER_FORM, SHOW_POSTFORM, SIGN_UP_SUBMIT_TRUE } from '../reducers/user';

import useInput from '../hooks/useInput';
import LoginForm from './LoginForm';
import PostForm from '../components/postform/PostForm';
import Profile from './Profile';
import ChewzooSubMenu from './ChewzooSubMenu'
import ChewzooAvatar from '../components/ChewzooAvatar';

const AppLayout = ({ children, pageType }) => {
  const dispatch = useDispatch();
  const { me, signUpLoading, logInDone, logOutDone } = useSelector((state) => state.user);
  const [searchInput, onChangeSearchInput] = useInput('');

  useEffect(() => {
    if (logInDone) {
      message.success({content: '츄주에 온걸 환영해!', style: {marginTop: '3vh'} })
    }
  }, [logInDone])

  useEffect(() => {
    if (logOutDone) {
      message.success({content: '응 잘가~ 또 오고!', style: {marginTop: '3vh'} })
    }
  }, [logOutDone])

  const onUserForm = useCallback(() => {
    if (me) {
      const formType = String('my')
      return dispatch({
        type: SHOW_USER_FORM,
        data: { formType }
      });
    } else {
      const formType = String('login')
      return dispatch({
        type: SHOW_USER_FORM,
        data: { formType }
      });
    }
  },);

  const onPostForm = useCallback(()=> {
    dispatch({
      type: SHOW_POSTFORM,
    });
  },);

  const onSignUpSubmit = useCallback(()=> {
    dispatch({
      type: SIGN_UP_SUBMIT_TRUE,
    });
  },);

  const onSearch = useCallback(() => {
    if (searchInput) {
      Router.push(`/hashtag/${searchInput}`);  
    } else {
      message.error({content: '검색어를 입력해줘!', style: {marginTop: '3vh'}})
    }
  }, [searchInput]);

  const MenuBarStyle = {
    height: '47px',
    width: '100%',
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#E13427',
    background: '#FFFFFF',
    borderBottom: '1px solid #ECECEC',
    borderTop: '1px solid #ECECEC'
  };

  const MenuHomeStyle = {
    margin: '6.5px 0px 5px 5px',
  };

  const MenuIconStyle = {
    float: 'left',
    margin: '6.5px 6px 5px 5px',
  };

  const WriterButtonStyle = {
    float: 'right',
    margin: '6.5px 5px 5px 5px',
    verticalAlign: 'middle',
    width: 'calc(100% - 50px)',
    fontSize: '0.7em',
    padding: '0px',
    fontWeight: 'bold'
  };

  const MenuSearchStyle = {
    float: 'right',
    margin: '6.5px 6px 5px 5px',
    verticalAlign: 'middle',
    width: 'calc(100% - 55px)',
  };

  const UpperMenuButtonStyle = {
    fontSize: '0.55em',
    fontWeight: 'bold',
    padding: '11px 5px 8px 5px',
    float: 'right',
    verticalAlign: 'middle',
    fontWeight: 'normal'
  };

  const userInfoStyle = {
    fontSize: '16px',
    fontWeight: 'normal',
    cursor: 'pointer',
    position: 'relative',
    margin: '6.5px 6px 5px 5px',
    padding: '0px',
    float: 'right'
  };
  
  const nicknameStyle = {
    color: '#262626',
    margin: '2px 10px 0px 5px',
  }

  return (
    <div>
      <div style={ MenuBarStyle }>
        <Row>
          <Col xs={1} md={7}/>

          <Col xs={11} md={5}>
            <Link href="/" key="home">
              <a style={ MenuHomeStyle }>cHEWzOO</a>
            </Link>
          </Col>

          <Col xs={11} md={5}>
            {pageType != 'signup' && <>
              {me
                ? <Media queries={{small: "(max-width: 767px)"}}>
                    {(matches) => matches.small
                      ? <Row style={ userInfoStyle } onClick={ onUserForm }><ChewzooAvatar userId={me.id} userAvatar={me.avatar} avatarPosition={'comment'} disabledClick={true}/></Row>
                      : <Row style={ userInfoStyle } onClick={ onUserForm }>
                          <Col><ChewzooAvatar userId={me.id} userAvatar={me.avatar} avatarPosition={'comment'} disabledClick={true}/></Col>
                          <Col style={ nicknameStyle }>{me.nickname}</Col>
                        </Row>
                    }
                  </Media>
                : <>
                    <Link href="/signup" prefetch={false}><a style={ UpperMenuButtonStyle }>가입</a></Link>
                    <a style={ UpperMenuButtonStyle } onClick={ onUserForm }>로그인</a>
                  </>
              }
              </>}
          </Col>

          <Col xs={1} md={7}/>
        </Row>
      </div>

      <div>
        {children}
      </div>

      <div style={ MenuBarStyle }>
        <Row>
          <Col xs={1} md={7}/>

          <Col xs={22} md={5}>
            <Row>
              <Popover placement="topLeft" content={
                <Media queries={{small: "(max-width: 767px)"}}>
                  {(matches) => matches.small
                    ? <div style={{ width: '77vw'}}>
                        <ChewzooSubMenu />
                      </div>
                    : <div style={{ width: '39vw'}}>
                        <ChewzooSubMenu />
                      </div>}
                </Media>
                } trigger="click">
                <MenuOutlined style={ MenuIconStyle }/>
              </Popover>
              
              <Media queries={{small: "(max-width: 767px)"}}>
                {(matches) => matches.small
                  ? <>
                      {pageType === 'signup'
                        ? <Button shape="round" type={'primary'} style={ WriterButtonStyle} onClick={ onSignUpSubmit } loading={signUpLoading}>
                            <CheckOutlined />
                          </Button>
                        : <>
                            {me && 
                              <Button shape="round" type={'primary'} style={ WriterButtonStyle } onClick={ onPostForm }>
                                <FormOutlined />
                              </Button>
                            }
                          </>
                      }
                    </>
                  : <Input.Search 
                    value={ searchInput }
                    onChange={ onChangeSearchInput }
                    onSearch={ onSearch }
                    style={ MenuSearchStyle } 
                    enterButton
                    placeholder="내 관종은..?" />
                }
              </Media>
            </Row>
          </Col>

          <Col xs={0} md={5}>
            {pageType === 'signup'
              ? <Button shape="round" type={'primary'} style={ WriterButtonStyle } onClick={ onSignUpSubmit } loading={signUpLoading}>
                  <CheckOutlined />
                </Button>
              : <>
                  {me && 
                    <Button shape="round" type={'primary'} style={ WriterButtonStyle } onClick={ onPostForm }>
                      <FormOutlined />
                    </Button>
                  }
                </>
            }
          </Col>

          <Col xs={1} md={7}/>
        </Row>
      </div>

      {me ? <Profile /> : <LoginForm />}
      {me && <PostForm pageType={pageType}/>}
      
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  pageType: PropTypes.string.isRequired,
};

export default AppLayout;