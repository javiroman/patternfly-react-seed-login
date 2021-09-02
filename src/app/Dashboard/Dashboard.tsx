import * as React from 'react';
import {
  PageSection,
  Title,
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Spinner
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { AppLogin  } from "@app/AppLogin/AppLogin";
import Cookies from 'js-cookie';

const Dashboard: React.FunctionComponent<{}> = () => {
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
      location.reload(false);
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
        <Title headingLevel="h1" size="lg">Dashboard Page Title!</Title>
      </PageSection>
    )
}

export { Dashboard };
