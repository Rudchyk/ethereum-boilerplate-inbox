import { useState, useEffect } from 'react';
import factory from '../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';

const HomePage = ({ deployedCampaigns }) => {
  const router = useRouter();
  const renderCampaigns = () => {
    const items = deployedCampaigns.map((address) => ({
      header: address,
      description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
      fluid: true,
    }));
    return <Card.Group items={items} />;
  };
  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <Link href="/campaigns/new">
        <a>
          <Button
            floated="right"
            content="Create Campaign"
            icon="add circle"
            primary
          />
        </a>
      </Link>
      {renderCampaigns()}
    </Layout>
  );
};

HomePage.getInitialProps = async (ctx) => {
  const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
  return { deployedCampaigns };
};

export default HomePage;
