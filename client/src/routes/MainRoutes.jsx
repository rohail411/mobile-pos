import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import { element } from 'prop-types';
import Products from 'pages/new-mobile';
import OldMobile from 'pages/old-mobile';
import Orders from 'pages/orders';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
import Brands from 'pages/brands/brands';
import Supplier from 'pages/supplier/Supplier';
// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'new-mobiles',
      element: <Products/>
    },
    {
      path: 'old-mobiles',
      element: <OldMobile/>
    },
    {
      path: 'sold-mobiles',
      element: <Orders/>
    },
    {
      path: 'brands',
      element: <Brands/>
    },
    {
      path:'supplier',
      element: <Supplier/>
    }
  ]
};

export default MainRoutes;
