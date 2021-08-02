import React, { useCallback } from 'react';
import { Divider, Modal } from 'antd';
import PropTypes from 'prop-types';
import TextLoop from "react-text-loop";

import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';

import { CLOSE_POSTFORM } from '../../reducers/post';
import BranchPostContentForm from './BranchPostContentForm'
import PostContentForm from './PostContentForm'
import UpdatePostContentForm from './UpdatePostContentForm'
import ChecklistForm from './checklist/ChecklistForm'

const PostForm = ({ pageType }) => {
  const dispatch = useDispatch();
  const { showPostForm, showBranchPostForm, showUpdatePostForm } = useSelector((state) => state.post);

  const onClose = useCallback(() => {
    dispatch({
      type: CLOSE_POSTFORM,
    });
  },[]);

  return (
    <Modal
      closable={ false }
      onCancel={ onClose }
      footer={ null }
      visible={ showPostForm || showBranchPostForm || showUpdatePostForm }
      bodyStyle={{ padding: '10px' }}
      width={800}
    >
      <TextLoop style={{ marginTop: '12px' }}>
        <span>🏷공백, 기호 없이 #종목이름 #테마종류 </span>
        <span>📈차트 사진을 올려도 좋아~</span>
        <span>☕커피 한 잔 선물하는 거 어때?
          <Link href={"https://open.kakao.com/me/chewzoo"} prefetch={false}>
            <a> (클릭)</a>
          </Link>
        </span>
        <span>🪁어떤 종목이 올라갈까?</span>
        <span>💡#투자생각 해시태그로 의견을 나눠봐!</span>
        <span>📰꼭 알아야할 이슈, 뉴스가 있어?</span>
        <span>📉혹시... 물렸어..?</span>
      </TextLoop>

      <Divider style={{ margin: '12px 0px 12px 0px' }}/>

      <ChecklistForm />

      {showPostForm && <PostContentForm pageType={ pageType }/>}
      {showBranchPostForm && <BranchPostContentForm pageType={ pageType }/>}
      {showUpdatePostForm && <UpdatePostContentForm pageType={ pageType }/>}
    </Modal>            
  );
};

PostForm.propTypes = {
  pageType: PropTypes.string.isRequired,
};

export default PostForm;
