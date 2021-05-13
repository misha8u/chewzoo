import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router'; 

import { List } from 'antd';
import { CloseOutlined, SyncOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

import ChewzooAvatar from '../components/ChewzooAvatar';
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';

const FollowList = ({ header, data, onClickMore, loading }) => {
  const dispatch = useDispatch();
  const onCancel = (id) => () => {
    if (header === '주는 관심') {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: id,
      });
    }
    dispatch({
      type: REMOVE_FOLLOWER_REQUEST,
      data: id,
    });
  };

  const onUserSpeech = useCallback((userId) => () => {
    Router.push(`/user/${userId}`); 
  }, []);

  const [followHover, setFollowHover] = useState(null);
  const mouseEnter = useCallback((e) => () => {
    setFollowHover(e); 
  }, [followHover]);
  const mouseLeave = () => setFollowHover(null);

  const FollowWrapperStyle = {
    width: '100%',
    padding: '0px',
    margin: '5px 0px 5px 0px',
  }

  const SelectedFollowWrapperStyle = {
    width: '100%',
    backgroundColor: '#FEF3F0',
    padding: '0px',
    margin: '5px 0px 5px 0px',
  }

  return (
    <List
      itemLayout="horizontal"
      loadMore={<div style={{ textAlign: 'center', margin: '10px 0' }}><SyncOutlined style={{ color: '#E13427' }} onClick={onClickMore} loading={loading} /></div>}
      dataSource={data}
      renderItem={(item) => (
        <List.Item 
          style={followHover === item.id ? SelectedFollowWrapperStyle : FollowWrapperStyle}
          onMouseEnter={mouseEnter(item.id)}
          onMouseLeave={mouseLeave}
        >
          <div style={{ marginRight: '5px'}}>
            <ChewzooAvatar userId={item.id} userAvatar={item.avatar} avatarPosition={'comment'}/>
          </div>
          <List.Item.Meta 
            title={<a onClick={ onUserSpeech(item.id) }>{item.nickname}</a>}
          />
          <CloseOutlined key="stop" onClick={onCancel(item.id)} />
        </List.Item>
      )}
    />
  );
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onClickMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FollowList;
