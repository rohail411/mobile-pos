// assets
import {
    UserOutlined
  } from '@ant-design/icons';



  // ==============================|| MENU ITEMS - CUSTOMERS ||============================== //

  const customers = {
    id: 'customers',
    title: 'Customers',
    type: 'group',
    children: [
      {
        id: 'customers-list',
        title: 'Customers',
        type: 'item',
        url: '/customers',
        icon: UserOutlined
      },
    ]
  };

  export default customers;
