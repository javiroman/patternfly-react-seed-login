import * as React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Nav,
  NavList,
  NavItem,
  NavVariants,
  Page,
  PageHeader,
  PageSidebar,
  SkipToContent,
  ToolbarGroup,
  ToolbarItem,
  Button,
  Dropdown,
  KebabToggle,
  DropdownToggle,
  ButtonVariant,
  DropdownItem,
  Toolbar
} from '@patternfly/react-core';
import { routes } from '@app/routes';
import { BellIcon, CogIcon } from '@patternfly/react-icons';
import accessibleStyles from '@patternfly/react-styles/css/utilities/Accessibility/accessibility';
import spacingStyles from '@patternfly/react-styles/css/utilities/Spacing/spacing';
import { css } from '@patternfly/react-styles';
import Cookies from 'js-cookie';
import { AppLogin } from '@app/AppLogin/AppLogin';

interface IAppLayout {
  children: React.ReactNode;
}

const AppLayout: React.FunctionComponent<IAppLayout> = ({children}) => {
  const logoProps = {
    href: '/',
    target: '_blank'
  };
  const [isNavOpen, setIsNavOpen] = React.useState(true);
  const [isMobileView, setIsMobileView] = React.useState(true);
  const [isNavOpenMobile, setIsNavOpenMobile] = React.useState(false);
  const [isDropdownOpen, setDropdownOpen] = React.useState(false);
  const [isKebabDropdownOpen, setKebabDropdownOpen] = React.useState(false);
  const [isLoged, setIsLoged] = React.useState(false);
  const [isUser, setIsUser] = React.useState("anonymous");

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const onNavToggleMobile = () => {
    setIsNavOpenMobile(!isNavOpenMobile);
  };

  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const onPageResize = (props: { mobileView: boolean; windowSize: number }) => {
    setIsMobileView(props.mobileView);
  };

  const kebabDropdownItems = [
    <DropdownItem>
      <BellIcon /> Notifications
    </DropdownItem>,
    <DropdownItem>
      <CogIcon /> Settings
    </DropdownItem>
  ];

  const userDropdownItems = [
    <DropdownItem key={0}>Logout</DropdownItem>,
  ];

  const onDropdownToggle = event => {
    setDropdownOpen(!isDropdownOpen);
  };

  const onHandleLogin = (value, cookie) => {
    setIsLoged(value);
  }

    const onDropdownSelect = event => {
    setDropdownOpen(!isDropdownOpen);
    Cookies.remove('jwt-example-cookie', { path: '/'});
    setIsLoged(false);
    location.reload();
  };

  const onKebabDropdownToggle = event => {
    setKebabDropdownOpen(!isKebabDropdownOpen)
  };

  const onKebabDropdownSelect = event => {
    setKebabDropdownOpen(!isKebabDropdownOpen);
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const PageToolbar = (
    <Toolbar>
      <ToolbarGroup className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnLg)}>
        <ToolbarItem>
          <Button id="default-example-uid-01" aria-label="Notifications actions" variant={ButtonVariant.plain}>
            <BellIcon />
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button id="default-example-uid-02" aria-label="Settings actions" variant={ButtonVariant.plain}>
            <CogIcon />
          </Button>
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem className={css(accessibleStyles.hiddenOnLg, spacingStyles.mr_0)}>
          <Dropdown
            isPlain
            position="right"
            onSelect={onKebabDropdownSelect}
            toggle={<KebabToggle onToggle={onKebabDropdownToggle} />}
            isOpen={isKebabDropdownOpen}
            dropdownItems={kebabDropdownItems}
          />
        </ToolbarItem>
        <ToolbarItem className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnMd)}>
          <Dropdown
            isPlain
            position="right"
            onSelect={onDropdownSelect}
            isOpen={isDropdownOpen}
            toggle={<DropdownToggle onToggle={onDropdownToggle}>{isUser}</DropdownToggle>}
            dropdownItems={userDropdownItems}
          />
        </ToolbarItem>
      </ToolbarGroup>
    </Toolbar>
  );

  const Header = (
    <PageHeader
      logo="Patternfly"
      logoProps={logoProps}
      toolbar={PageToolbar}
      showNavToggle
      isNavOpen={isNavOpen}
      onNavToggle={isMobileView ? onNavToggleMobile : onNavToggle}
    />
  );

  const Navigation = (
    <Nav id="nav-primary-simple" theme="dark">
      <NavList id="nav-list-simple" variant={NavVariants.default}>
        {routes.map((route, idx) => route.label && (
            <NavItem key={`${route.label}-${idx}`} id={`${route.label}-${idx}`}>
              <NavLink exact to={route.path} activeClassName="pf-m-current">{route.label}</NavLink>
            </NavItem>
          ))}
      </NavList>
    </Nav>
  );
  const Sidebar = (
    <PageSidebar
      theme="dark"
      nav={Navigation}
      isNavOpen={isMobileView ? isNavOpenMobile : isNavOpen} />
  );
  const PageSkipToContent = (
    <SkipToContent href="#primary-app-container">
      Skip to Content
    </SkipToContent>
  );

  React.useEffect(() => {
    let value = {};
    value = Cookies.getJSON('jwt-example-cookie');
    if (value) {
      setIsLoged(true);
      setIsUser(parseJwt(value.access_token).name);
    }
  }, []);

  return (
    ! isLoged?
      <AppLogin handleLogin={onHandleLogin}/>
      :
      <Page
        mainContainerId="primary-app-container"
        header={Header}
        sidebar={Sidebar}
        onPageResize={onPageResize}
        skipToContent={PageSkipToContent}>
        {children}
      </Page>
  );
}

export { AppLayout };
