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
  EmptyStateSecondaryActions
} from '@patternfly/react-core';

export interface ISupportProps {
  sampleProp?: string;
}

const Support: React.FunctionComponent<ISupportProps> = () => (
    <PageSection>
      <Title size="lg">Support Page Title</Title>
    </PageSection>
  )

export { Support };
