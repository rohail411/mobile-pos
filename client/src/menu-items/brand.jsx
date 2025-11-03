// assets
import {
    MobileOutlined
  } from '@ant-design/icons';
  

  
  // ==============================|| MENU ITEMS - UTILITIES ||============================== //
  
  const brands = {
    id: 'brand',
    title: 'Brands',
    type: 'group',
    children: [
      {
        id: 'new-brand',
        title: 'Brands',
        type: 'item',
        url: '/brands',
        icon: MobileOutlined
      },
    ]
  };
  
  export default brands;
  