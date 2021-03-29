import React, { useState, useCallback } from 'react';
import AppLayout from '../components/AppLayout';
import { Comment, List, Avatar, Result, Button } from 'antd';

import Head from 'next/head';
import Link from 'next/link';

import { useSelector, useDispatch } from 'react-redux';

const debate = () => {

  return (
    <AppLayout>
      <Head>
        <title>개발노트 | cHEWzOO</title>
      </Head>

      <div style = {{ height: '47px'}}></div>

      <Result
        status="warning"
        title="준비 중입니다."
        extra={
          <Link href="/">
          <Button type="primary" key="console">
            아직이야, 돌아가!
          </Button>
          </Link>
        }
      />

    </AppLayout>
  );
};

export default debate;