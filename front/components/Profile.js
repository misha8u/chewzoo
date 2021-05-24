import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import useSWR from 'swr';
import { backUrl } from '../config/config';

import { Input, Button, Row, Col, Divider } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';

import useInput from '../hooks/useInput';
import ChewzooAvatar from '../components/ChewzooAvatar';
import FollowButton from '../components/FollowButton'
import FollowList from '../components/FollowList';
import { LOG_OUT_REQUEST, CLOSE_USER_FORM, CHANGE_NICKNAME_REQUEST, CHANGE_AVATAR_REQUEST } from '../reducers/user';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const [avatarFormOpened, setAvatarFormOpened] = useState(false);
  const [changeNicknameFormOpened, setChangeNicknameFormOpened] = useState(false);
  const [followerListOpened, setfollowerListOpened] = useState(false);
  const [followingListOpened, setfollowingListOpened] = useState(false);
  const [newNickname, onChangeNewNickname, setNewNickname] = useInput('');
  const { me, logOutLoading, showUserForm, userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [followersLimit, setFollowersLimit] = useState(10);
  const [followingsLimit, setFollowingsLimit] = useState(10);
  const { data: followersData, error: followerError } = useSWR(`${backUrl}/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingError } = useSWR(`${backUrl}/user/followings?limit=${followingsLimit}`, fetcher);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 10);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 10);
  }, []);

  const onFollowerList = useCallback(() => {
    setfollowerListOpened((prev) => !prev);
    setfollowingListOpened(false);
  }, []);
  
  const onFollowingList = useCallback(() => {
    setfollowingListOpened((prev) => !prev);
    setfollowerListOpened(false);
  }, []);

  const onToggleAvatar = useCallback(() => {
    setAvatarFormOpened((prev) => !prev);
    setChangeNicknameFormOpened(false);
  }, []);

  const onToggleChangeNickname = useCallback(() => {
    setNewNickname(me && me.nickname || '');
    setChangeNicknameFormOpened((prev) => !prev);
    setAvatarFormOpened(false);
  }, [changeNicknameFormOpened]);

  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);

  const handleCancel= useCallback(()=> {
    dispatch({
      type: CLOSE_USER_FORM,
    });
    setChangeNicknameFormOpened(false);
    setAvatarFormOpened(false);
  },);

  const onChangeNickname = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: newNickname,
    });
    setChangeNicknameFormOpened(false);
  }, [newNickname]);

  const onChangeAvatar = useCallback((e) => () => {
    dispatch({
      type: CHANGE_AVATAR_REQUEST,
      data: e,
    });
    setAvatarFormOpened(false);
  }, []);

  const onUserSpeech = useCallback(() => {
    Router.push(`/user/${Number((userInfo || me).id)}`); 
  }, [userInfo]);

  const onMySpeech = useCallback(() => {
    Router.push(`/user/${Number((me).id)}`); 
  }, [me]);

  const nicknameStyle = {
    width: 'calc(100% - 45px)',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden', 
    fontWeight: 'bold',
    fontSize: '25px',
    marginLeft: '5px',
    cursor: 'pointer',
    position: 'relative'
  };

  const avatarFormStyle ={
    width: '30px',
    height: '30px',
    border: '1px solid #F0F0F0',
    borderRadius: '15%',
    cursor: 'pointer',
    margin: '4px'
  }

  const formWrapperStyle ={
    marginTop: '4px',
    backgroundColor: '#FEF3F0'
  }

  const bottomButtonStyle = {
    width: '100%',  
    color: '#E13427',
    padding: '0px 6px 0px 0px'
  }

  const followListStyle = {
    height: '200px',
    padding: '8px 13px',
    overflow: 'auto',
    border: '1px solid #e8e8e8',
    borderRadius: '4px',
  }

  const SelectedFollowListStyle = {
    backgroundColor: '#FEF3F0',
  }

  //const animalIcons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🧸', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🦍', '🦧', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🐺', '🦊', '🦝', '🐗', '🐴', '🦓', '🦒', '🦌', '🦘', '🦥', '🦦', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦗', '🕷', '🕸', '🦂', '🦟', '🦠', '🐢', '🐍', '🦎', '🐙', '🦑', '🦞', '🦀', '🦐', '🦪', '🐠', '🐟', '🐡', '🐬', '🦈', '🐳', '🐋', '🐊', '🐆', '🐅', '🐃', '🐂', '🐄', '🐪', '🐫', '🦙', '🐘', '🦏', '🦛', '🐐', '🐏', '🐑', '🐎', '🐖', '🦇', '🐓', '🦃', '🕊', '🦅', '🦆', '🦢', '🦉', '🦩', '🦚', '🦜', '🐕', '🦮', '🐕‍🦺', '🐩', '🐈', '🐇', '🐀', '🐁', '🐿', '🦨', '🦡', '🦔', '🐉', '🐲', '🦕', '🦖', '☘', '🍀']
  //const animalIcon = animalIcons[Math.floor(Math.random() * animalIcons.length)];

  return (
    <Modal
      title={showUserForm === String('my')  ? `👇 별명, 아이콘을 바꿔봐!` : `🔍 알고 싶은 매력`}
      visible={showUserForm === String('my') | showUserForm === String('other')}
      onOk={ handleCancel } 
      onCancel={ handleCancel }
      footer={ null }
    >
      {showUserForm === String('my') //나의 프로필 보기
        ? <>
            <Row>
              <Col style={{ cursor: 'pointer' }} onClick={ onToggleAvatar }>
                <ChewzooAvatar userId={me.id} userAvatar={me.avatar} avatarPosition={'post'} disabledClick={true}/>
              </Col>
              <Col style={ nicknameStyle } onClick={ onToggleChangeNickname }>
                {me.nickname}
              </Col>
            </Row>

            {avatarFormOpened &&
              <Row style={ formWrapperStyle }>
                {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((c) => (
                  <img style={ avatarFormStyle } 
                    src={`${backUrl}/avatars/ava${c}.png`}
                    onClick={onChangeAvatar(c)}
                  />
                ))}
              </Row>
            }

            {changeNicknameFormOpened &&
              <Row style={ formWrapperStyle }>
                <Input.TextArea
                  maxrow={1}
                  rows={1}
                  style={{ margin: '3px 0px 3px 5px', width: 'calc(90% - 15px)' }}
                  value={ newNickname }
                  onChange={ onChangeNewNickname }
                  maxLength={10}
                />
                <Button
                  style={{ margin: '3px 0px 3px 5px', padding: '0%', width: '10%', float: 'right' }}
                  type="primary"
                  htmlType="submit"
                  onClick={ onChangeNickname }
                >
                  <SyncOutlined />
                </Button>
              </Row>
            }

            <Divider style={{ margin: '12px 0px 12px 0px' }}/>

            <Row style={{ textAlign: 'center' }}>
              <Col md={8} xs={8} key="message"><a onClick={ onMySpeech }>뱉은 말<br />{me.Posts.length}</a></Col>
              <Col md={8} xs={8} key="favorite" style={followingListOpened && SelectedFollowListStyle}>
                <a onClick={ onFollowingList }>주는 관심<br />{me.Followings.length}</a></Col>
              <Col md={8} xs={8} key="fans" style={followerListOpened && SelectedFollowListStyle}>
                <a onClick={ onFollowerList }>받는 관심<br />{me.Followers.length}</a></Col>
            </Row>

            {followerListOpened &&
              <>
                <Divider style={{ margin: '12px 0px 12px 0px' }}/>
                <div style={ followListStyle }>
                  <FollowList header="받는 관심" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followerError} />
                </div>
              </>
            }

            {followingListOpened &&
              <>
                <Divider style={{ margin: '12px 0px 12px 0px' }}/>
                <div style={ followListStyle }>
                  <FollowList header="주는 관심" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError} />
                </div>
              </>
            }

            <Divider style={{ margin: '12px 0px 12px 0px' }}/>

            <Row>
              <Button style={ bottomButtonStyle } onClick={ onLogout } loading={ logOutLoading }>LogOUT</Button>
            </Row>

          </>
        : <>
            <>
              <Row>
                <Col style={{ cursor: 'pointer' }}>
                  <ChewzooAvatar userId={(userInfo || me).id} userAvatar={(userInfo || me).avatar} avatarPosition={'post'} disabledClick={true}/>
                </Col>
                <Col style={ nicknameStyle }>
                  {(userInfo || me).nickname}
                </Col>
              </Row>

              <Divider style={{ margin: '12px 0px 12px 0px' }}/>
              <Row style={{ textAlign: 'center' }}>
                <Col md={8} xs={8} key="message"><a onClick={ onUserSpeech }>하신 말씀<br />{Number((userInfo || me).Posts)}</a></Col>
                <Col md={8} xs={8} key="favorite">주는 관심<br />{Number((userInfo || me).Followings)}</Col>
                <Col md={8} xs={8} key="fans">받는 관심<br />{Number((userInfo || me).Followers)}</Col>
              </Row>
              <Divider style={{ margin: '12px 0px 12px 0px' }}/>
              <Row>
                <FollowButton otherUserId={Number((userInfo || me).id)} />
              </Row>
            </>
          </>}
      
    </Modal>
  );
};

export default Profile;