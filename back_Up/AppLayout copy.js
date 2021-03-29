import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Media from 'react-media';
import { Col, Menu, Row, Input } from 'antd';
import { MenuOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'
//import '../src/antd-custom.less';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { SHOW_USER_FORM, SHOW_SUBMENU_FORM } from '../reducers/user';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import SubMenuForm from './SubMenuForm';

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onUserForm = useCallback(()=> {
    dispatch({
      type: SHOW_USER_FORM,
    });
  },);

  const onSubmenuForm = useCallback(()=> {
    dispatch({
      type: SHOW_SUBMENU_FORM,
    });
  },);

  const MenuBackgroundStyle = {
    position: 'fixed',
    zIndex: 1,
    width: '100%',
    color: '#ffffff',
  };

  const MenuHomeStyle = {
    color: '#ffffff',
    fontWeight: 'bold',
    margin: '6.5px 0% 5px 2.5%',
  };

  const MenuIconStyle = {
    float: 'right',
    margin: '6.5px 2.5% 5px 1%',
  };

  const MenuSearchStyle = {
    float: 'right',
    margin: '6.5px 2.5% 5px 1%',
    verticalAlign: 'middle',
    width: '40%',
    color: '#ffffff',
  };

  const onSearch = value => console.log(value)

  return (
    <div>
      <Menu mode="horizontal" theme="dark" style={ MenuBackgroundStyle }>
      <Row gutter={8}>
        <Col xs={2} md={4} />
        <Col xs={10} md={8}>
          <Link href="/" key="home"><a style={ MenuHomeStyle }>cHEWzOO</a></Link>
        </Col>
        <Col xs={10} md={8}>
          <MenuOutlined style={ MenuIconStyle } onClick={onSubmenuForm}/>
          {me
            ? <UserOutlined style={ MenuIconStyle } onClick={onUserForm} />
            : <LoginOutlined style={ MenuIconStyle } onClick={onUserForm} />
          }
          <Media queries={{small: "(max-width: 767px)"}}>
            {(matches) => matches.small
              ? <></>
              : <Input.Search onSearch={onSearch} placeholder="input search text" style={ MenuSearchStyle } />
            }
          </Media>
        </Col>
        <Col xs={2} md={4} />
      </Row>
      </Menu>
      <Row gutter={8}>
        <Col xs={2} md={4}>
          {/* 빈 공간 입니다. */}
        </Col>
        <Col xs={20} md={16}>
          {children}
        </Col>
        <Col xs={2} md={4} style={{padding: '53px 1% 0% 1%;'}}>
          <a>광고 삽입 예정 공간</a>
        </Col>
      </Row>
      {me
        ? <UserProfile />
        : <LoginForm />
      }
      <SubMenuForm />
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
