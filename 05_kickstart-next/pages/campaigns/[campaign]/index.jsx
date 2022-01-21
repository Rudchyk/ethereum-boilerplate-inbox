import { Card, Grid, Button } from 'semantic-ui-react';
import Link from 'next/link';
import Layout from '../../../components/Layout/Layout';
import BackBtn from '../../../components/BackBtn/BackBtn';
import ContributeForm from '../../../components/ContributeForm/ContributeForm';
import CampaignInstance from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';

const Campaign = ({
  minimumContribution,
  balance,
  requestsCount,
  approversCount,
  manager,
  address,
}) => {
  const items = [
    {
      header: manager,
      description:
        'The manager created this campaign and can create requests to withdraw money',
      meta: 'Address of Manager',
      style: {
        overflowWrap: 'break-word',
      },
    },
    {
      header: minimumContribution,
      description:
        'You must contribute at least this much wei to become an approver',
      meta: 'Minimum Contribution (wei)',
    },
    {
      header: requestsCount,
      description:
        'A request tries to withdraw money from the contract. Requests must be approved by approvers',
      meta: 'Number of Requests',
    },
    {
      header: approversCount,
      description: 'Number of people who have already donated to this campaign',
      meta: 'Number of Approvers',
    },
    {
      header: web3.utils.fromWei(balance, 'ether'),
      description:
        'The balance is how much money this campaign has left to spend',
      meta: 'Campaign Balance (ether)',
    },
  ];
  return (
    <Layout>
      <h3>Campaign</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <BackBtn route={`/`} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

Campaign.getInitialProps = async (ctx) => {
  const campaign = await CampaignInstance(ctx.query.campaign);
  const summary = await campaign.methods.getSummary().call();

  return {
    address: ctx.query.campaign,
    minimumContribution: summary[0],
    balance: summary[1],
    requestsCount: summary[2],
    approversCount: summary[3],
    manager: summary[4],
  };
};

export default Campaign;
