import React, { useCallback } from 'react';
import Media from 'react-media';
import Router from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_CHEWZOO_SUBMENU } from '../reducers/user';

import { Input, Menu, Drawer } from 'antd';
import Link from 'next/link';
import SubMenu from 'antd/lib/menu/SubMenu';

const ChewzooSubMenu = () => {
  const dispatch = useDispatch();
  const { showChewzooSubMenu } = useSelector((state) => state.user);
  const [searchInput, onChangeSearchInput] = useInput('');

  const onClose = useCallback(() => {
    dispatch({
      type: CLOSE_CHEWZOO_SUBMENU,
    });
  },[]);

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
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
        title="지수/환율 rotation"
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
          <Menu.Item key="diary" style={ChewzooMenuStyle}>
            주식일기
          </Menu.Item>

          <SubMenu key="favorite" style={ChewzooMenuStyle}
            title="관심종목"
          >
            <Menu.Item style={MyfavoriteStyle}>관심 산업</Menu.Item>
            <Menu.Item style={MyfavoriteStyle}>관심 테마</Menu.Item>
            <Menu.Item style={MyfavoriteStyle}>관심 종목</Menu.Item>
            <Menu.Item style={MyfavoriteStyle}>관심 종목 설정</Menu.Item>
          
          </SubMenu>

          <Menu.Item key="wiki" style={ChewzooMenuStyle}>
            <Link href="/wiki">
              <a onClick={onClose}>주식위키</a>
            </Link>
          </Menu.Item>

          <Menu.Item key="debate" style={ChewzooMenuStyle}>
            <Link href="/debate">
              <a onClick={onClose}>주식토론</a>
            </Link>
          </Menu.Item>

          <Menu.Item style={ChewzooMenuStyle}>
            <Link href="/devnote">
              <a onClick={onClose}>개발노트</a>
            </Link>
          </Menu.Item>

        </Menu>
      </Drawer>
    </>
  );
};

export default ChewzooSubMenu;