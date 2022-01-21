import { Button, Form, Input, Message } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';
import BackBtn from '../../components/BackBtn/BackBtn';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

const NewCampaign = () => {
  const router = useRouter();
  const [minimumContribution, setMinimumContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const onMinimumContributionFieldChange = (e) => {
    setMinimumContribution(e.target.value);
    setErrorMessage('');
  };
  const onFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (!minimumContribution) {
        throw new Error('Please, provide minimum contribution wei');
      }

      const accounts = await web3.eth.getAccounts();

      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });
      await router.push('/');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitLoading(false);
      setMinimumContribution('');
    }
  };

  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <BackBtn route={`/`} />
      <Form
        onSubmit={onFormSubmit}
        style={{ marginTop: '16px' }}
        error={!!errorMessage}
      >
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            value={minimumContribution}
            labelPosition="right"
            onChange={onMinimumContributionFieldChange}
          />
          {errorMessage && (
            <Message error header="Oops!" content={errorMessage} />
          )}
        </Form.Field>
        <Button loading={submitLoading} primary>
          Submit
        </Button>
      </Form>
    </Layout>
  );
};

export default NewCampaign;
