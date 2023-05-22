import { ReactElement } from 'react';
import styled from 'styled-components';
import { CreateTransaction } from './components/CreateTransaction';
import {Header} from './components/Header'
import {NextUIProvider} from '@nextui-org/react';


const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;

export function App(): ReactElement {
  return (
    <NextUIProvider>
      <StyledAppDiv>
        <Header/>
        <CreateTransaction/>
      </StyledAppDiv>
    </NextUIProvider>
  );
}
