import { Result, Button } from 'antd';
import AppLayout from '../components/AppLayout';

import Head from 'next/head';
import Link from 'next/link';

const wiki = () => {
  return (
    <AppLayout>
      <Head>
        <title>주식위키 | cHEWzOO</title>
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

export default wiki;