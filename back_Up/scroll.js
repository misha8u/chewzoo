import React, { useCallback, useEffect, useRef } from 'react';
import Media from 'react-media';
import PropTypes from 'prop-types';

import { Col, Menu, Row, Input, Layout } from 'antd';
import { MenuOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'

import { useSelector, useDispatch } from 'react-redux';
import { SHOW_USER_FORM, SHOW_MYSUBMENU } from '../front/reducers/user';
import { LOAD_POSTS_REQUEST } from '../front/reducers/post';

//import LoginForm from './LoginForm';
//import UserProfile from './UserProfile';
//import MySubMenu  from './MySubMenu';
//import PostForm from './PostForm';
import PostCard from '../front/components/post/PostCard';

const MainPosts = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
  const postdiv = useRef();

  //const onUserForm = useCallback(()=> {
  //  dispatch({
  //    type: SHOW_USER_FORM,
  //  });
  //},);
//
  //const onMySubMenu = useCallback(()=> {
  //  dispatch({
  //    type: SHOW_MYSUBMENU,
  //  });
  //},);

  //index로 넘어갈 부분

  useEffect(() => {
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []); 

  useEffect(() => {
    function onScroll() {
      console.log(postdiv.current.scrollHeight, postdiv.current.scrollTop)
      if (postdiv.current.scrollTop > postdiv.current.scrollHeight * 0.5) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
            data: mainPosts[mainPosts.length - 1].id,
          });
        }
      }
    }

    postdiv.current.addEventListener('scroll', onScroll);
    
    return () => {
      postdiv.current.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts, hasMorePosts, loadPostsLoading]);

  //index로 넘어갈 부분

  const MenuBarStyle = {
    height: '47px',
    width: '100%',
    fontSize: '32px',
    background: '#FFFFFF',
    borderBottom: '1.5px solid #ECECEC'
  };

  const MenuBarHomeStyle = {
    color: '#E13427',
    fontWeight: 'bold',
  }

  const PostContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 47px)',
  }

  const PostContainerSideStyle = {
    //flex: '0.5',
    //display: 'flex',
    //justifyContent: 'center',
    //alignItems: 'center',
    //background: '#FFFFFF',
  }

  const PostContainerCenterStyle = {
    flex: '1',
    background: '#FAFAFA',
    overflowY: 'scroll',
  }
  
  return (
    <div>
      <div style={ MenuBarStyle }>
        <Row>
        <Col xs={2} md={6} style ={ MenuBarHomeStyle }>123</Col>
        <Col xs={10} md={6} style ={ MenuBarHomeStyle }>456</Col>
        <Col xs={10} md={6} style ={ MenuBarHomeStyle }>789</Col>
        <Col xs={2} md={6} style ={ MenuBarHomeStyle }>123</Col>
        </Row>
      </div>

      <div style={ PostContainerStyle }>

        <Col xs={2} md={6} style ={ PostContainerSideStyle }>
          right
        </Col>

        <Col
          xs={20} md={12}
          ref={postdiv}
          style={ PostContainerCenterStyle }
        >
          {mainPosts.map((c) => (
            <PostCard key={c.id} post={c} />
          ))}
        </Col>

        <Col xs={2} md={6} style ={ PostContainerSideStyle }>
          left
        </Col>

      </div>
    </div>
  );
};

export default MainPosts;
