import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { accessibleRouteChangeHandler } from '@app/utils/utils';
import { Dashboard } from '@app/Dashboard/Dashboard';
import { Support } from '@app/Support/Support';
import { NotFound } from '@app/NotFound/NotFound';
import { Admin } from '@app/Admin/Admin'; 
import { GeneralSettings  } from '@app/Settings/General/GeneralSettings';
import { ProfileSettings  } from '@app/Settings/Profile/ProfileSettings'; 
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { LastLocationProvider, useLastLocation } from 'react-router-last-location';
import Cookies from 'js-cookie';

/* FIXME: no original routes from project */

let routeFocusTimer: number;

export interface IAppRoute {
  label?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  isAsync?: boolean;
  routes?: undefined
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup; 

let routes: IAppRoute[];
let flattenedRoutes: IAppRoute[];

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const generateRoutes = () => {
  let role;
  try {
    role = parseJwt(Cookies.getJSON('jwt-example-cookie').access_token);
  } catch(err) {
    role = {"role":"null" };
  }

  let theRoutes: AppRouteConfig[];

  if (role.role === "admin") {
    theRoutes = [
      {
        component: Dashboard,
        exact: true,
        label: 'Dashboard',
        path: '/',
        title: 'PatternFly Seed | Main Dashboard',
      },
      {
        component: Support,
        exact: true,
        isAsync: true,
        label: 'Support',
        path: '/support',
        title: 'PatternFly Seed | Support Page',
      },
      {
        label: 'Settings',
        routes: [
          {
            component: GeneralSettings,
            exact: true,
            label: 'General',
            path: '/settings/general',
            title: 'PatternFly Seed | General Settings',
          },
          {
            component: ProfileSettings,
            exact: true,
            label: 'Profile',
            path: '/settings/profile',
            title: 'PatternFly Seed | Profile Settings',
          },
        ],
      },
    ];
    } else {
      theRoutes = [
        {
          component: Dashboard,
          exact: true,
          label: 'Dashboard',
          path: '/',
          title: 'PatternFly Seed | Main Dashboard',
        },
        {
          component: Support,
          exact: true,
          isAsync: true,
          label: 'Support',
          path: '/support',
          title: 'PatternFly Seed | Support Page',
        },
      ];
    }
  routes = theRoutes;

  return theRoutes;
}

// a custom hook for sending focus to the primary content container
// after a view has loaded so that subsequent press of tab key
// sends focus directly to relevant content
const useA11yRouteChange = (isAsync: boolean) => {
  const lastNavigation = useLastLocation();
  React.useEffect(() => {
    if (!isAsync && lastNavigation !== null) {
      routeFocusTimer = accessibleRouteChangeHandler();
    }
    return () => {
      clearTimeout(routeFocusTimer);
    };
  }, [isAsync, lastNavigation]);
}

const RouteWithTitleUpdates = ({ component: Component, isAsync = false, title, ...rest }: IAppRoute) => {
  useA11yRouteChange(isAsync);
  useDocumentTitle(title);

  function routeWithTitle(routeProps: RouteComponentProps) {
    return <Component {...rest} {...routeProps} />;
  }

  return <Route render={routeWithTitle} {...rest}/>;
};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route component={NotFound} />;
};

const AppRoutes = () => (
      <LastLocationProvider>
        <Switch>
          {
            generateRoutes().reduce((flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
                [] as IAppRoute[]).map(({ path, exact, component, title, isAsync }, idx) => (
                  <RouteWithTitleUpdates
                    path={path}
                    exact={exact}
                    component={component}
                    key={idx}
                    title={title}
                    isAsync={isAsync}
                  />
            ))
          }
          <PageNotFound title="404 Page Not Found"/>
        </Switch>
      </LastLocationProvider>
);

export { AppRoutes, generateRoutes };
