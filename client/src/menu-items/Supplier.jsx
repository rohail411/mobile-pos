// assets
import {
    MobileOutlined
  } from '@ant-design/icons';
  

  
  // ==============================|| MENU ITEMS - UTILITIES ||============================== //
  
  const supplier = {
    id: 'supplier',
    title: 'Suppliers',
    type: 'group',
    children: [
      {
        id: 'new-supplier',
        title: 'Suppliers',
        type: 'item',
        url: '/supplier',
        icon: MobileOutlined
      },
    ]
  };
  
  export default supplier;
  