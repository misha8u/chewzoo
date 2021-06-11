import React, { useCallback } from 'react';
import Media from 'react-media';
import Router from 'next/router';

import { Input, message, Divider, Button } from 'antd'
import Link from 'next/link';
import useInput from '../hooks/useInput';
import Tabsshow from '../components/widget/TickerWidget';

const ChewzooSubMenu = () => {
  const [searchInput, onChangeSearchInput] = useInput('');

  const onProgress = useCallback(() => {
    message.warning({content: '아직 준비 중..!', style: {marginTop: ';3vh'}})
  },[]);

  const onSearch = useCallback(() => {
    if (searchInput) {
      Router.push(`/hashtag/${searchInput}`);  
    } else {
      message.error({content: '검색어를 입력해줘!', style: {marginTop: '3vh'}})
    }
  }, [searchInput]);

  const MenuButtonStyle = {
    margin: '0px 5px 5px 0px',
  }

  const MenuSearchStyle = {
    padding: '0px', marginBottom: '12px', width: '100%'
  };

  return (
    <>
      <Tabsshow />
      <Divider style={{ margin: '12px 0px 12px 0px' }}/>

      <Media queries={{small: "(max-width: 767px)"}}>
        {(matches) => matches.small
        ? <Input.Search 
            value={ searchInput }
            onChange={ onChangeSearchInput }
            onSearch={ onSearch }
            style={ MenuSearchStyle } 
            enterButton
            placeholder="내 관종은..?" />
        : <></>
        }
      </Media>

      <Button shape="round" style={MenuButtonStyle} onClick={onProgress}>
        📚주식 위키(준비 중)
      </Button>
      <Link href={"https://open.kakao.com/me/chewzoo"} prefetch={false}>
        <Button shape="round" style={MenuButtonStyle}>☕후원과 문의</Button>
      </Link>
      <Divider style={{ margin: '12px 0px 12px 0px' }}/>

      <span>알파 1.1.0</span>
    </>
  );
};

export default ChewzooSubMenu;