import * as React from 'react';
import {
  PageSection,
  Title,
  Button,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import Cookies from 'js-cookie';

const Dashboard: React.FunctionComponent<{}> = () => {
  const [isLoged, setIsLoged] = React.useState(false);

  const onHandleLogin = (value) => {
    setIsLoged(value);
  }

  function handleClick(e) {
    e.preventDefault();
    window.location.reload();
  }

  React.useEffect(() => {
    let value = {};
    value = Cookies.getJSON('jwt-example-cookie');
    if (value) {
      setIsLoged(true);
    }
  }, []);

  return (
    ! isLoged?
      <PageSection>
        <EmptyState variant={EmptyStateVariant.full}>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h5" size="lg">
            Your session is expired
          </Title>
          <Button variant="primary" onClick={handleClick}>You have to login again</Button>
        </EmptyState>
      </PageSection>

    :
      <PageSection>
        <Title size="lg">Dashboard Page Title</Title>
      </PageSection>
    )
}

export { Dashboard };
