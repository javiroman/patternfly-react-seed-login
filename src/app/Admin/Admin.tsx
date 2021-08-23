import * as React from 'react';
import { CubesIcon } from '@patternfly/react-icons';
import {
  PageSection,
  Title,
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Spinner
} from '@patternfly/react-core';
import { AppLogin  } from "@app/AppLogin/AppLogin";
import Cookies from 'js-cookie';

export interface ISupportProps {
  sampleProp?: string;
}

const Admin: React.FunctionComponent<ISupportProps> = () => {
  const [isLoged, setIsLoged] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onHandleLogin = (value) => {
    setIsLoged(value);
  }

  React.useEffect(() => {
    let value = {};
    value = Cookies.getJSON('jwt-example-cookie');
    if (value) {
      setIsLoged(true);
      } else {
      setIsLoading(true);
      setIsLoged(false);
      location.reload();
    }
  }, []);

  return (
    isLoading?

      <EmptyState variant={EmptyStateVariant.full}>
        <Spinner/>
      </EmptyState>

    : ! isLoged?

      <AppLogin handleLogin={onHandleLogin}/>

    :

  <PageSection>
    <Title headingLevel="h1" size="lg">Admin Page Title</Title>
  </PageSection>
 )
}

export { Admin };
