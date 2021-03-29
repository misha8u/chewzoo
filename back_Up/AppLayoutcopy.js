import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Media from 'react-media';
import { Col, Menu, Row, Input, Layout } from 'antd';
import { MenuOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'

import { useSelector, useDispatch } from 'react-redux';
import { SHOW_USER_FORM, SHOW_MYSUBMENU } from '../reducers/user';

import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import MySubMenu  from './MySubMenu';
import PostForm from './PostForm';

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch(); 

  const onUserForm = useCallback(()=> {
    dispatch({
      type: SHOW_USER_FORM,
    });
  },);

  const onMySubMenu = useCallback(()=> {
    dispatch({
      type: SHOW_MYSUBMENU,
    });
  },);

  const MenuBackgroundStyle = {
    position: 'fixed',
    zIndex: 10,
    width: '100%',
    color: '#ffffff',
    borderBottom: '1.5px solid #ECECEC'
  };

  const MenuHomeStyle = {
    color: '#E13427',
    fontWeight: 'bold',
    margin: '6.5px 6px 5px 2.5%',
  };

  const MenuIconStyle = {
    float: 'right',
    color: '#E13427',
    margin: '6.5px 6px 5px 5px',
  };

  const MenuSearchStyle = {
    float: 'right',
    margin: '6.5px 6px 5px 5px',
    verticalAlign: 'middle',
    width: '40%',
    color: '#E13427',
  };

  const AppLayoutSectionStyle = {
    padding: '0%',
    marginLeft: '0px',
    marginRight: '0px',
    overflowY: 'hidden',
  }

  const onSearch = value => console.log(value)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
    }}>
      
      <Menu mode="horizontal" theme="dark" style={ MenuBackgroundStyle }>
        <Row gutter={8} style={ AppLayoutSectionStyle }>
          <Col xs={2} md={6} style={ AppLayoutSectionStyle }/>

          <Col xs={10} md={6} style={ AppLayoutSectionStyle }>
            <Link href="/" key="home"><a style={ MenuHomeStyle }>cHEWzOO</a></Link>
          </Col> 

          <Col xs={10} md={6} style={ AppLayoutSectionStyle }>
            <MenuOutlined style={ MenuIconStyle } onClick={ onMySubMenu }/>
            {me
              ? <UserOutlined style={ MenuIconStyle } onClick={ onUserForm } />
              : <LoginOutlined style={ MenuIconStyle } onClick={ onUserForm } />
            }
            <Media queries={{small: "(max-width: 767px)"}}>
              {(matches) => matches.small
                ? <></>
                : <Input.Search onSearch={ onSearch } placeholder="내 관종은..?" style={ MenuSearchStyle } />
              }
            </Media>
          </Col>

          <Col xs={2} md={6} style={ AppLayoutSectionStyle }/>
        </Row>
      </Menu>

      <Row gutter={8} style={ AppLayoutSectionStyle }>
        <Col xs={2} md={6} style={{ 
          padding: '0%',
          marginLeft: '0px',
          marginRight: '0px',
          flex: 1,
          display: 'flex',
          overflowY: 'hidden',
         }}>
        </Col>

        <Col xs={20} md={12} style={{ 
          padding: '0%',
          marginLeft: '0px',
          marginRight: '0px',
          flex: 1,
          overflow: 'scroll',
         }}>
           
          {children}
        </Col>

        <Col xs={2} md={6} style={{ 
          padding: '0%',
          marginLeft: '0px',
          marginRight: '0px',
          flex: 1,
          display: 'flex',
          overflowY: 'hidden',
         }}>
        </Col>
      </Row>

      {me
        ? <UserProfile/>
        : <LoginForm/>
      }

      <MySubMenu/>
      <PostForm/>
      
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
