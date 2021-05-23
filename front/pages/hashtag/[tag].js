import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

import { END } from 'redux-saga';
import { Button, Col, Empty } from 'antd';

import axios from 'axios';
import { backUrl } from '../../config/config';
import { LOAD_HASHTAG_POSTS_REQUEST, RETURNED_FOCUSCARD } from '../../reducers/post';
import { SHOW_POSTFORM } from '../../reducers/user';
import PostCard from '../../components/post/PostCard';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import AppLayout from '../../components/AppLayout';

const Hashtag = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query;
  const { mainPosts, hasMorePosts, loadHashtagPostsLoading,
    branchDone, addPostDone, focusCardDone, focusCard } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);
  const postDiv = useRef();

  useEffect(() => {
    if (branchDone || addPostDone) {
      postDiv.current.scrollTo(0, 0)
    }
  }, [branchDone, addPostDone]);

  useEffect(() => {
    if (focusCardDone) {
      document.getElementById(focusCard).scrollIntoView(true);
      dispatch({
        type: RETURNED_FOCUSCARD,
      });
    }
  }, [focusCardDone]);

  useEffect(() => {
    function onScroll() {
      if (postDiv.current.offsetTop + postDiv.current.scrollTop > postDiv.current.scrollHeight  - 800) {  
        if (hasMorePosts && !loadHashtagPostsLoading) {
          dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id,
            data: tag,
          });
        }
      }
    };
    {postDiv.current && postDiv.current.addEventListener('scroll', onScroll);}
    return () => {
      {postDiv.current && postDiv.current.removeEventListener('scroll', onScroll);}
    };
  }, [mainPosts, hasMorePosts, tag, loadHashtagPostsLoading]);

  const onPostForm = useCallback(()=> {
    dispatch({
      type: SHOW_POSTFORM,
    });
  },);

  const PostContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 94.6px)',
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
      <Head>
          <title>
            cHEWzOO | {tag}
          </title>
          <meta name="description" content={mainPosts[0] && mainPosts[0].content} />
          <meta property="og:title" content={`cHEWzOO #${tag}`} />
          <meta property="og:description" content={mainPosts[0] && mainPosts[0].content} />
          <meta property="og:image" content={`${backUrl}/resource/signupTitle.png`} />
      </Head>
      <div style={ PostContainerStyle }>
        <Col xs={2} md={7} style ={ PostContainerSideStyle }>
        </Col>
        
        <Col style={ PostContainerCenterStyle } ref={postDiv}>
            {mainPosts.map((c) => (
              <PostCard post={c} />  
            ))}
            {mainPosts.length === 0 &&
              <Empty
                image = {`${backUrl}/resource/searching.png`}
                description={
                  <><span style={{ fontWeight: 'bold', color: '#E13427' }}>{tag}</span><span>에 대한 건 없어..</span></>
                }
                style={{ marginTop: '50px'}}
              >
                {me
                    ? <Button type="primary" onClick={ onPostForm }>내가 첫번째다!</Button>
                    : <Link href="/" prefetch={false}><Button type="primary">아..어..</Button></Link>
                }
              </Empty>
            }
        </Col>
        
        <Col xs={2} md={7} style ={ PostContainerSideStyle }>
        </Col>
      </div>
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
  context.store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: context.params.tag,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  return { props: {} };
});

export default Hashtag;
