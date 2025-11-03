// assets
import {
    MobileOutlined
  } from '@ant-design/icons';
  

  
  // ==============================|| MENU ITEMS - UTILITIES ||============================== //
  
  const products = {
    id: 'products',
    title: 'Products',
    type: 'group',
    children: [
      {
        id: 'new-products',
        title: 'New Mobiles',
        type: 'item',
        url: '/new-mobiles',
        icon: MobileOutlined
      },
      {
        id: 'old-products',
        title: 'Old Mobiles',
        type: 'item',
        url: '/old-mobiles',
        icon: MobileOutlined
      }
    ]
  };
  
  export default products;
  