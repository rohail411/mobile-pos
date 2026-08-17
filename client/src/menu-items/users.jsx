// assets
import {
    TeamOutlined
  } from '@ant-design/icons';



  // ==============================|| MENU ITEMS - USERS ||============================== //

  const users = {
    id: 'users',
    title: 'Users',
    type: 'group',
    children: [
      {
        id: 'users-list',
        title: 'Users',
        type: 'item',
        url: '/users',
        icon: TeamOutlined
      },
    ]
  };

  export default users;
