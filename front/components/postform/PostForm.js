import React, { useCallback } from 'react';
import Media from 'react-media';
import { Drawer } from 'antd';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';

import { CLOSE_POSTFORM } from '../../reducers/user';
import BranchPostContentForm from './BranchPostContentForm'
import PostContentForm from './PostContentForm'

const PostForm = ({ pageType }) => {
  //PostForm의 Story와 Forecast를 Tabs로 구분하고 각각 js의 코드들을 정리해주세요.
  const dispatch = useDispatch();
  const { showPostForm, showBranchPostForm } = useSelector((state) => state.user);

  const onClose = useCallback(() => {
    dispatch({
      type: CLOSE_POSTFORM,
    });
  },[]);

  return (
    <>
      <Media queries={{small: "(max-width: 767px)"}}>
        {(matches) => matches.small
          ? <>
              <Drawer
                placement="bottom"
                closable={false}
                onClose={onClose}
                visible={showPostForm || showBranchPostForm}
                height='80%'
                bodyStyle={{ padding: '0.5%' }}
              >
                {showPostForm && <PostContentForm pageType={ pageType }/>}
                {showBranchPostForm && <BranchPostContentForm pageType={ pageType }/>}
              </Drawer>            
            </>
          : <>
              <Drawer
                placement="bottom"
                closable={false}
                onClose={onClose}
                visible={showPostForm || showBranchPostForm}
                height='50%'
                bodyStyle={{ padding: '0.5%' }}
              >
                {showPostForm && <PostContentForm pageType={ pageType }/>}
                {showBranchPostForm && <BranchPostContentForm pageType={ pageType }/>}
              </Drawer>   
            </>
        }
      </Media>
    </>
  );
};

PostForm.propTypes = {
  pageType: PropTypes.string.isRequired,
};

export default PostForm;
