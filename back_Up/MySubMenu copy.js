import React from 'react';
import { Input, Menu } from 'antd';
import MenuSearchStyle from './AppLayout'
import onSearch from './AppLayout'

export const MySubMenu_Mob = (
  <Menu>
    <Menu.Item>    
      <Input.Search onSearch={onSearch} placeholder="input search text" style={ MenuSearchStyle } />      
    </Menu.Item>
    <Menu.Item>
      <a>
        주식WIKI
      </a>
    </Menu.Item>
      <Menu.Item>
      <a>
        매매일지
      </a>
    </Menu.Item>
      <Menu.Item>
      <a>
        후원하기
      </a>
    </Menu.Item>
  </Menu>
);

const MySubMenu_PCStyle = {
  fontSize: '45px',
  padding: '5px',
  margin: '5px',
  fontWeight: 'bold',
};

export const MySubMenu_PC = (
  <Menu >
    <Menu.Item style={MySubMenu_PCStyle}>
      <a>
        주식WIKI
      </a>
    </Menu.Item>
    <Menu.Item style={MySubMenu_PCStyle}>
      <a>
        매매일지
      </a>
    </Menu.Item>
    <Menu.Item style={MySubMenu_PCStyle}>
      <a>
        후원하기
      </a>
    </Menu.Item>
  </Menu>
);