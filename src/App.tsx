import { ReactElement } from 'react';
import styled from 'styled-components';
import { CreateTransaction } from './components/CreateTransaction';

const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;

export function App(): ReactElement {
  return (
    <StyledAppDiv>
      <CreateTransaction/>
    </StyledAppDiv>
  );
}
