// should have two tables one of providers and one of users
import { Row, Col, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ChainSelector } from "./ChainSelector";

interface DataType {
  address: string;
  contribution: string;
  status: string;
}

export function NetworkOverview() {
  const columns: ColumnsType<DataType> = [
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Contribution",
      dataIndex: "contribution",
      key: "contribution",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  // TODO: Sample data; should come from a database of live data.
  const data: DataType[] = [
    {
      address: "0xdeadbeef...",
      contribution: "Cellular Host",
      status: "Active - 100 Mbps",
    },
    {
      address: "0xabadbabe...",
      contribution: "Backhaul Host",
      status: "Active - 1000 Mbps",
    },
    {
      address: "0xabbaabba...",
      contribution: "Subscriber",
      status: "UBI",
    },
    {
      address: "0xffffaaaa...",
      contribution: "Subscriber",
      status: "UBI",
    },
  ];

  return (
    <>
      <Row>
        <Col span={24}>
          <ChainSelector />
        </Col>
        <Col span={24}>
          <Table
            aria-label="Network Hosts/Providrs"
            style={{
              height: "auto",
              minWidth: "100%",
            }}
            columns={columns}
            dataSource={data}
            // selectionMode="single"
          />
        </Col>
      </Row>
    </>
  );
}
