import React, { useCallback, useState } from 'react';
import Media from 'react-media';
import Router from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_CHEWZOO_SUBMENU } from '../reducers/user';

import { Input, Menu, Drawer, message } from 'antd';
import Link from 'next/link';
import SubMenu from 'antd/lib/menu/SubMenu';
import useInput from '../hooks/useInput';

const ChewzooSubMenu = () => {
  const dispatch = useDispatch();
  const { showChewzooSubMenu } = useSelector((state) => state.user);
  const [searchInput, onChangeSearchInput] = useInput('');

  const onClose = useCallback(() => {
    dispatch({
      type: CLOSE_CHEWZOO_SUBMENU,
    });
  },[]);

  const onProgress = useCallback(() => {
    message.warning({content: '아직 준비 중..!', style: {marginTop: '3vh'}})
  },[]);

  const onSearch = useCallback(() => {
    if (searchInput) {
      Router.push(`/hashtag/${searchInput}`);  
    } else {
      message.error({content: '검색어를 입력해줘!', style: {marginTop: '3vh'}})
    }
  }, [searchInput]);

  const ChewzooMenuStyle = {
    fontWeight: 'bold',
  };

  const MyfavoriteStyle = {
    fontSize: '20px',
  };

  return (
    <>
      <Drawer
        title="ver. alpha 1.0.1"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={showChewzooSubMenu}
        bodyStyle={{ padding: '0%' }}
      >
        <Media queries={{small: "(max-width: 767px)"}}>
          {(matches) => matches.small
          ? <Input.Search 
              value={searchInput}
              onChange={onChangeSearchInput}
              onSearch={onSearch}
              style={{ padding: '16px' }} 
              placeholder="내 관종은..?" />
          : <></>
          }
        </Media>
        <Menu mode="inline">
          {/* 
          <SubMenu key="favorite" style={ChewzooMenuStyle}
            title="관심종목"
          >
            <Menu.Item style={MyfavoriteStyle}>관심 산업</Menu.Item>
            <Menu.Item style={MyfavoriteStyle}>관심 테마</Menu.Item>
            <Menu.Item style={MyfavoriteStyle}>관심 종목</Menu.Item>
            <Menu.Item style={MyfavoriteStyle}>관심 종목 설정</Menu.Item>
          
          </SubMenu>
          */}

          <Menu.Item key="wiki" style={ChewzooMenuStyle}>
              <a onClick={onProgress}>주식위키</a>
          </Menu.Item>

          <Menu.Item key="debate" style={ChewzooMenuStyle}>
              <a onClick={onProgress}>주식토론</a>
          </Menu.Item>

          <Menu.Item style={ChewzooMenuStyle}>
              <Link href={"https://open.kakao.com/me/chewzoo"}>
              <a>문의하기</a>
              </Link>
          </Menu.Item>

          {/*
          <Menu.Item style={ChewzooMenuStyle}>
              <a onClick={onProgress}>개발노트</a>
          </Menu.Item>
          */}

        </Menu>
      </Drawer>
    </>
  );
};

export default ChewzooSubMenu;