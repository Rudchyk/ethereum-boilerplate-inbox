import Link from 'next/link';
import { Card, Table, Button } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout/Layout';
import BackBtn from '../../../../components/BackBtn/BackBtn';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';

const RequestRow = ({
  address,
  index,
  request: { complete, description, amount, recipient, approvalCount },
  approversCount,
}) => {
  const router = useRouter();
  const onApprove = async () => {
    try {
      const campaign = await Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(index).send({
        from: accounts[0],
      });
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const onFinalize = async () => {
    try {
      const campaign = await Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(index).send({
        from: accounts[0],
      });
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const readyToFinalize = approvalCount > approversCount / 2;

  return (
    <Table.Row disabled={complete} positive={readyToFinalize && !complete}>
      <Table.Cell>{index}</Table.Cell>
      <Table.Cell>{description}</Table.Cell>
      <Table.Cell>{web3.utils.fromWei(amount, 'ether')}</Table.Cell>
      <Table.Cell>{recipient}</Table.Cell>
      <Table.Cell>
        {approvalCount}/{approversCount}
      </Table.Cell>
      <Table.Cell>
        {!complete && (
          <Button color="green" basic onClick={onApprove}>
            Approve
          </Button>
        )}
      </Table.Cell>
      <Table.Cell>
        <Button color="teal" basic onClick={onFinalize}>
          Finalize
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

const Requests = ({ address, requests, requestCount, approversCount }) => {
  return (
    <Layout>
      <h3>Requests</h3>
      <BackBtn route={`/campaigns/${address}`} />
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary> Add Request</Button>
        </a>
      </Link>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {requests.map((request, index) => (
            <RequestRow
              key={index}
              index={index}
              request={request}
              approversCount={approversCount}
              address={address}
            />
          ))}
        </Table.Body>
      </Table>
      <div>Found {requestCount} requests.</div>
    </Layout>
  );
};

Requests.getInitialProps = async (ctx) => {
  const campaign = await Campaign(ctx.query.campaign);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  return {
    address: ctx.query.campaign,
    requests,
    requestCount,
    approversCount,
  };
};

export default Requests;
