import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';

import Media from 'react-media';
import { Col, Row, Input} from 'antd';
import { MenuOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'

import { useSelector, useDispatch } from 'react-redux';
import { SHOW_USER_FORM, SHOW_CHEWZOO_SUBMENU } from '../reducers/user';

import LoginForm from './LoginForm';
import MyProfile from './MyProfile';
import ChewzooSubMenu from './ChewzooSubMenu'

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const [searchInput, onChangeSearchInput] = useInput('');

  const dispatch = useDispatch();
  const onUserForm = useCallback(()=> {
    dispatch({
      type: SHOW_USER_FORM,
    });
  },);

  const onChewzooSubMenu = useCallback(()=> {
    dispatch({
      type: SHOW_CHEWZOO_SUBMENU,
    });
  },);

  const MenuBarStyle = {
    height: '47px',
    width: '100%',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#E13427',
    background: '#FFFFFF',
    borderBottom: '1.5px solid #ECECEC'
  };

  const MenuHomeStyle = {
    margin: '6.5px 6px 5px 2.5%',
  };

  const MenuIconStyle = {
    float: 'right',
    margin: '6.5px 6px 5px 5px',
  };

  const MenuSearchStyle = {
    float: 'right',
    margin: '6.5px 6px 5px 5px',
    verticalAlign: 'middle',
    width: '40%',
  };

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <div>
      <div style={ MenuBarStyle }>
        <Row>
          <Col xs={2} md={7}/>

          <Col xs={10} md={5}>
            <Link href="/" key="home"><a style={ MenuHomeStyle }>cHEWzOO</a></Link>
          </Col>

          <Col xs={10} md={5}>
            <MenuOutlined style={ MenuIconStyle } onClick={ onChewzooSubMenu }/>
              {me
                ? <UserOutlined style={ MenuIconStyle } onClick={ onUserForm } />
                : <LoginOutlined style={ MenuIconStyle } onClick={ onUserForm } />
              }
              <Media queries={{small: "(max-width: 767px)"}}>
                {(matches) => matches.small
                  ? <></>
                  : <Input.Search
                      value={searchInput}
                      onChange={onChangeSearchInput}
                      onSearch={onSearch}
                      placeholder="내 관종은..?" style={ MenuSearchStyle }/>
                }
              </Media>
          </Col>

          <Col xs={2} md={7}/>
        </Row>
      </div>

      <div>
        {children}
      </div>

      {me
        ? <MyProfile/>
        : <LoginForm/>
      }
      <ChewzooSubMenu/>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;