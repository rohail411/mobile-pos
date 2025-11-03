// assets
import {
    OrderedListOutlined
  } from '@ant-design/icons';
  

  
  // ==============================|| MENU ITEMS - UTILITIES ||============================== //
  
  const soldProducts = {
    id: 'sold-products',
    title: 'Sold Products',
    type: 'group',
    children: [
      {
        id: 'sold-products',
        title: 'Sold Mobiles',
        type: 'item',
        url: '/sold-mobiles',
        icon: OrderedListOutlined
      }
    ]
  };
  
  export default soldProducts;
  