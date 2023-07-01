// should have two tables one of providers and one of users
import { Table } from '@nextui-org/react';
import { Header } from './Header';
import {NextUIProvider} from '@nextui-org/react';
import styled from 'styled-components';

const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;


{/* <NextUIProvider>
<StyledAppDiv>
  <Header/>
  <CreateTransaction/>
</StyledAppDiv>
</NextUIProvider> */}
export function NetworkOverview(){
        return (
            <>
            <NextUIProvider>

            <Header />
            <Table
              aria-label="Network Hosts/Providrs"
              css={{
                height: "auto",
                minWidth: "100%",
              }}
              selectionMode="single"
            >
              <Table.Header>
                <Table.Column>Address</Table.Column>
                <Table.Column>Contribution</Table.Column>
                <Table.Column>Status</Table.Column>
              </Table.Header>
              <Table.Body>
                <Table.Row key="1">
                  <Table.Cell>0xdeadbeef...</Table.Cell>
                  <Table.Cell>Cellular Host</Table.Cell>
                  <Table.Cell>Active - 100Mbps</Table.Cell>
                </Table.Row>
                <Table.Row key="2">
                  <Table.Cell>0xabadbabe...</Table.Cell>
                  <Table.Cell>Backhaul Host</Table.Cell>
                  <Table.Cell>Active - 1000Mbps</Table.Cell>
                </Table.Row>
                <Table.Row key="3">
                  <Table.Cell>0xabbaabba...</Table.Cell>
                  <Table.Cell>Subscriber</Table.Cell>
                  <Table.Cell>UBI</Table.Cell>
                </Table.Row>
                <Table.Row key="4">
                  <Table.Cell>0xffffaaaa...</Table.Cell>
                  <Table.Cell>Subscriber</Table.Cell>
                  <Table.Cell>UBI</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            </NextUIProvider>
            </>
          );

}