import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';

import Media from 'react-media';
import { Col, Row, Input, Button, message } from 'antd';
import { MenuOutlined, CheckOutlined } from '@ant-design/icons'

import { useSelector, useDispatch } from 'react-redux';
import { SHOW_USER_FORM, SHOW_CHEWZOO_SUBMENU, SHOW_POSTFORM, SIGN_UP_SUBMIT_TRUE } from '../reducers/user';

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
      message.success({content: 'cHEWzOO에 온걸 환영해!', style: {marginTop: '3vh'} })
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

  const onChewzooSubMenu = useCallback(()=> {
    dispatch({
      type: SHOW_CHEWZOO_SUBMENU,
    });
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
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#E13427',
    background: '#FFFFFF',
    borderBottom: '1px solid #ECECEC',
    borderTop: '1px solid #ECECEC'
  };

  const MenuHomeStyle = {
    margin: '6.5px 6px 5px 2.5%',
  };

  const MenuIconStyle = {
    float: 'right',
    margin: '6.5px 6px 5px 5px',
  };

  const WriterButtonStyle = {
    float: 'right',
    margin: '6.5px 5px 5px 5px',
    verticalAlign: 'middle',
    width: 'calc(100% - 20px)',
    fontSize: '20px',
    padding: '0px',
    fontWeight: 'bold'
  };

  const JoinButtonStyle = {
    float: 'left',
    margin: '6.5px 5px 5px 5px',
    verticalAlign: 'middle',
    width: 'calc(100% - 20px)',
    fontSize: '20px',
    padding: '0px',
    fontWeight: 'bold',
    color: '#E13427',
  };

  const MenuSearchStyle = {
    float: 'right',
    margin: '6.5px 6px 5px 5px',
    verticalAlign: 'middle',
    width: '55%',
  };

  const userInfoStyle = {
    fontSize: '16px',
    fontWeight: 'normal',
    cursor: 'pointer',
    position: 'relative',
    margin: '6.5px 6px 5px 5px',
    padding: '0px 0px 0px 0px',
    verticalAlign: 'middle'
  };
  
  const nicknameStyle = {
    color: '#262626',
    marginLeft: '5px',
    width: 'calc(100% - 40px)',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden', 
  }

  return (
    <div>
      <div style={ MenuBarStyle }>
        <Row>
          <Col xs={2} md={7}/>

          <Col xs={10} md={5}>
            <Link href="/" key="home">
              <a style={ MenuHomeStyle }>cHEWzOO</a>
            </Link>
          </Col>

          <Col xs={10} md={5}>
            <MenuOutlined style={ MenuIconStyle } onClick={ onChewzooSubMenu }/>
              <Media queries={{small: "(max-width: 767px)"}}>
                {(matches) => matches.small
                  ? <></>
                  : <Input.Search
                      value={ searchInput }
                      onChange={ onChangeSearchInput }
                      onSearch={ onSearch }
                      style={ MenuSearchStyle }
                      placeholder="내 관종은..?" />
                }
              </Media>
          </Col>

          <Col xs={2} md={7}/>
        </Row>
      </div>

      <div>
        {children}
      </div>

      <div style={ MenuBarStyle }>
        <Row>
          <Col xs={2} md={7}/>

          <Col xs={10} md={5}>
            {pageType === 'signup'
              ? <></>
              : <>
                  {me
                    ?  <Row style={ userInfoStyle } onClick={ onUserForm }>
                        <Col>
                          <ChewzooAvatar userId={me.id} userAvatar={me.avatar} avatarPosition={'comment'} disabledClick={true}/>
                        </Col>
                        <Col style={ nicknameStyle }>
                            {me.nickname}
                        </Col>
                      </Row>
                    : <Link href="/signup" prefetch={false}>
                        <Button style={ JoinButtonStyle }>
                          jOIN
                        </Button>
                      </Link>
                  }
                </>
            }
          </Col>

          <Col xs={10} md={5}>
            {pageType === 'signup'
              ? <Button type={'primary'} style={ WriterButtonStyle } onClick={ onSignUpSubmit } loading={signUpLoading}>
                  <CheckOutlined />
                </Button>
              : <>
                  {me
                    ? <Button type={'primary'} style={ WriterButtonStyle } onClick={ onPostForm }>
                        sPEAK
                      </Button>
                    : <Button type={'primary'} style={ WriterButtonStyle } onClick={ onUserForm }>
                        LogIN
                      </Button>
                  }
                </>
            }
          </Col>

          <Col xs={2} md={7}/>
        </Row>
      </div>

      {me ? <Profile /> : <LoginForm />}
      {me && <PostForm pageType={pageType}/>}

      <ChewzooSubMenu />
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  pageType: PropTypes.string.isRequired,
};

export default AppLayout;