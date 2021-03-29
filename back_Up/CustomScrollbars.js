import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Media from 'react-media';
import { Scrollbars } from 'react-custom-scrollbars';

import { Col } from 'antd';
import { EditFilled } from '@ant-design/icons'

import PostForm from '../components/postform/PostForm';
import PostCard from '../components/post/PostCard';
import AppLayout from '../components/AppLayout';

import { LOAD_POSTS_REQUEST, RETURNED_FOCUSCARD } from '../reducers/post';
import { SHOW_POSTFORM, LOAD_MY_INFO_REQUEST } from '../reducers/user';

const customscrollbars = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading,
    branchDone, addPostDone, focusCardDone, focusCard } = useSelector((state) => state.post);
  const postdiv = useRef();

  const renderThumb = () => {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: 'rgba(35, 49, 86, 0.8)'
    };
    return <div style={{ ...thumbStyle }}/>;
  };
  
  const CustomScrollbars = postdiv => (
    <Scrollbars
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      {...postdiv}
    />
  );

  const onScroll = useCallback((s) => {
    console.log('무야호', s.scrollHeight, s.scrollHeight * 0.6, s.scrollTop)
    if (s.scrollTop > s.scrollHeight * 0.6) {
      if (hasMorePosts && !loadPostsLoading) {
        const lastId = mainPosts[mainPosts.length - 1]?.id;
        dispatch({
          type: LOAD_POSTS_REQUEST,
          lastId,
        });
      }
    }
    console.log('호야무', s.scrollHeight * 0.6)
    postdiv.current.scrollTo(0, s.scrollHeight * 0.6)
  }, [mainPosts, hasMorePosts, loadPostsLoading]);

  //react virtualized 반영해봅니다.

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    })
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  //useEffect(() => {
  //  if (branchDone || addPostDone) {
  //    console.log('작성 성공 문서 위로 간다');
  //    postdiv.current.scrollTo(0, 0)
  //  }
  //}, [branchDone, addPostDone]);

  useEffect(() => {
    if (focusCardDone) {
      document.getElementById(focusCard).scrollIntoView(true);
      dispatch({
        type: RETURNED_FOCUSCARD,
      });
    }
  }, [focusCardDone]);

  //useEffect(() => {
  //  function onScroll() {
  //    console.log(postdiv.current.scrollTop, postdiv.current.scrollHeight, CustomScrollbars.scrollTop)
  //    if (postdiv.current.scrollTop > postdiv.current.scrollHeight * 0.5) {
  //      if (hasMorePosts && !loadPostsLoading) {
  //        const lastId = mainPosts[mainPosts.length - 1]?.id;
  //        dispatch({
  //          type: LOAD_POSTS_REQUEST,
  //          lastId,
  //        });
  //      }
  //    }
  //  }
  //  {postdiv.current && postdiv.current.addEventListener('scroll', onScroll);}
  //  
  //  return () => {
  //    {postdiv.current && postdiv.current.removeEventListener('scroll', onScroll);}
  //  };
  //}, [mainPosts, hasMorePosts, loadPostsLoading]);

  const onPostForm = useCallback(()=> {
    dispatch({
      type: SHOW_POSTFORM,
    });
  },);

  const WriterStyle = {
    position: 'fixed',
    zIndex: 10,
    float: 'right',
    color: '#E13427',
    fontSize: '400%',
    bottom: '3%',
    left: '70%',
  }

  const WriterStyleMobile = {
    position: 'fixed',
    zIndex: 10,
    float: 'right',
    color: '#E13427',
    fontSize: '300%',
    bottom: '3%',
    left: '87%',
  }

  const PostContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 47px)',
  }

  const PostContainerCenterStyle = {
    flex: '1',
    background: '#FAFAFA',
    overflowY: 'auto',
    webkitScrollbar: {
      width: '100px',
    }
  }

  const PostContainerSideStyle = {
    //flex: '0.5',
    //display: 'flex',
    //justifyContent: 'center',
    //alignItems: 'center',
    //background: '#FFFFFF',
  }
  
  return (
    <AppLayout>
      <div style={ PostContainerStyle }>
        <Col xs={2} md={7} style ={ PostContainerSideStyle }>
        </Col>
        
        <Col style={ PostContainerCenterStyle } ref={postdiv}>
          <CustomScrollbars
            onScrollFrame={onScroll}
            universal={true}
          >
            {mainPosts.map((c) => (
              <PostCard key={c.id} id={c.id} post={c} />  
            ))}
          </CustomScrollbars>
        </Col>
        
        <Col xs={2} md={7} style ={ PostContainerSideStyle }>
        </Col>

      </div>

      {me &&
        <Media queries={{small: "(max-width: 767px)"}}>
          {(matches) => matches.small
            ? <EditFilled style={ WriterStyleMobile } onClick={ onPostForm } />
            : <EditFilled style={ WriterStyle } onClick={ onPostForm } />
          }
        </Media>
      }

      {me && <PostForm />}
    </AppLayout>
  );
};

export default customscrollbars;
