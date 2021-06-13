import React, { useState, useCallback, useEffect } from 'react';
import { Col, Row, Modal, Radio, Input, Space, message } from 'antd';
import { AlertOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { REMOVE_POST_REQUEST, REPORT_POST_REQUEST, SHOW_UPDATE_POSTFORM } from '../../reducers/post';
import { SHOW_USER_FORM } from '../../reducers/user';

import useInput from '../../hooks/useInput';
import ChewzooAvatar from '../ChewzooAvatar';
import moment from 'moment';

moment.locale('ko');

const PostCardAuthor = ({ post }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { removePostLoading, removePostError, 
    reportLoading, reportError, reportDone, reportedPost } = useSelector((state) => state.post);
  const id = me && me.id;

  const [authorHover, setAuthorHover] = useState(false);
  const mouseEnter = useCallback(() => {
    setAuthorHover(true); 
  }, [authorHover]);
  const mouseLeave = () => setAuthorHover(false);

  useEffect(() => {
    if (removePostError) {
      message.error({content: removePostError, style: {marginTop: '3vh'}});
    }
    if (Number(post.id) === Number(reportedPost)) {
      if (reportError) {
        message.error({content: reportError, style: {marginTop: '3vh'}});
        setreportFormOpened(false);
      }
      if (reportDone) {
        message.success({content: '신고 완료!', style: {marginTop: '3vh'}});
        setreportFormOpened(false);
      }
    }
  }, [reportError, removePostError, reportDone, reportedPost])

  const { confirm } = Modal;
  function removeConfirm() {
    confirm({
      title: '지울래?',
      icon: <DeleteOutlined />,
      okText: 'ㅇㅇ',
      okType: 'danger',
      cancelText: 'ㄴㄴ',
      onOk() {
        dispatch({
          type: REMOVE_POST_REQUEST,
          data: post.id,
        });
      }
    })
  };

  const onUpdatePostForm = useCallback(() => {
    if (!id) {
      const formType = String('login')
      return dispatch({
        type: SHOW_USER_FORM,
        data: { formType }
      });
    }
      return dispatch({
        type: SHOW_UPDATE_POSTFORM,
        data: post,
      });
  }, [id, post]);

  const [reportText, onChangeReportText, setReportText] = useInput('');
  const [reportContent, setReportContent] = useState(false);
  const [reportFormOpened, setreportFormOpened] = useState(false);

  const onToggleReportFrom = useCallback(() => {
    setreportFormOpened((prev) => !prev);
  }, []);

  const onReportContentChange = e => {
    setReportContent(e.target.value)
  }

  const onReportSubmit = useCallback(() => {
    if (!reportContent) {
      return message.error({content: '뭘 신고할 거야?', style: {marginTop: '3vh'}});
    }
    if (reportContent === '기타') {
      if (!reportText || !reportText.trim()) {
        return message.error({content: '정확한 신고 사유가 뭐야?', style: {marginTop: '3vh'}});
      }
      dispatch({
        type: REPORT_POST_REQUEST,
        data: { content: reportContent + ':' + reportText, userId: id, postId: post.id, target: 'post' },
      });
    } else {
      dispatch({
        type: REPORT_POST_REQUEST,
        data: { content: reportContent, userId: id, postId: post.id, target: 'post' },
      });
    }
    setReportContent(false);
    setReportText('');
  }, [reportContent, reportText, id]);

  const onUserForm = useCallback(() => {
    const userId = Number(post.User.id);
    if (id) {
      if (id === userId) {
        const formType = String('my')
        return dispatch({
          type: SHOW_USER_FORM,
          data: { formType }
        });
      } else {
        const formType = String('other')
        return dispatch({
          type: SHOW_USER_FORM,
          data: { formType, userId }
        });
      }
    } else {
      const formType = String('login')
      return dispatch({
        type: SHOW_USER_FORM,
        data: { formType }
      });
    }
  },[id, post.User.id]);

  const nicknameStyle = {
    marginLeft: '5px',
    fontSize: '15px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden', 
    cursor: 'pointer',
  };

  const momentStyle = {
    marginLeft: '5px',
    fontSize: '11px',
    fontWeight: 'normal',
    color: '#ababab',
  };

  const authorButtonWrapperStyle = {
    padding: '11px 5px 0px 0px',
  };

  const authorButtonStyle = {
    fontSize: '16px',
    color: '#E13427',
    marginLeft: '10px',
    float: 'right',
  };

  return (
    <>
    <Row
      onMouseEnter={ mouseEnter }
      onMouseLeave={ mouseLeave }
      style={authorHover && { backgroundColor: '#FEF3F0' }}
      >
      <Col xs={22} md={18}>
        <Row>
          <Col>
            <ChewzooAvatar userId={post.User.id} userAvatar={post.User.avatar} avatarPosition={'post'}/>
          </Col>
          <Col style={{ width: 'calc(100% - 45px)' }}>
            <Row onClick={ onUserForm } style={ nicknameStyle }>{post.User.nickname}</Row>
            <Row style={ momentStyle }>
              {authorHover ? moment(post.createdAt).format('YYYY-MM-DD, HH:mm:ss') : moment(post.createdAt).fromNow()}
            </Row>
          </Col>
        </Row>
      </Col>

      <Col style={ authorButtonWrapperStyle } xs={2} md={6}>
        {id && authorHover && <>
          {post.User.id === id
            ? <>
                <EditOutlined key="edit"
                  onClick={ onUpdatePostForm }
                  style={ authorButtonStyle }/>

                <DeleteOutlined ket="delete"
                  style={ authorButtonStyle }
                  loading={ removePostLoading }
                  onClick={ removeConfirm }/>
              </>
            : <>
                <AlertOutlined key="report"
                onClick={ onToggleReportFrom }
                loading={ reportLoading }
                style={ authorButtonStyle }/>
              </>
          }
        </>}
      </Col>

    </Row>
      <Modal
        title='👮 신고해?'
        okText='ㅇㅇ'
        cancelText='ㄴㄴ'
        okType='danger'
        visible={reportFormOpened}
        onCancel={ onToggleReportFrom }
        onOk={ onReportSubmit }
      >
        <span>서비스 운영 정책을 어겼으면 제제 또는 경고! 아니면, 그냥 넘어감ㅎㅎ </span>
        <Radio.Group onChange={ onReportContentChange } value={reportContent} >
          <Space direction="vertical" style={{ marginTop: '10px' }}>
            <Radio value={'광고/도배'}>광고 또는 도배</Radio>
            <Radio value={'선정성'}>선정적이거나 혐오스러움</Radio>
            <Radio value={'비속어'}>욕설과 비속어</Radio>
            <Radio value={'비난'}>특정인 또는 집단을 대상으로한 원색적 비난</Radio>
            <Radio value={'기타'}>
              {reportContent === '기타' ? <Input value={reportText} onChange={onChangeReportText} style={{ width: '100%' }} /> : '그 밖의 이유'}
            </Radio>
          </Space>
        </Radio.Group>
      </Modal>
    </>
  );
};

export default PostCardAuthor;