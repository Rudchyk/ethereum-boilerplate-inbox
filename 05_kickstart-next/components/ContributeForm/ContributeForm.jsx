import { Button, Form, Input, Message } from 'semantic-ui-react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

const ContributeForm = () => {
  const router = useRouter();
  const [amountContribution, setAmountContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const onAmountContributionFieldChange = (e) => {
    setAmountContribution(e.target.value);
    setErrorMessage('');
  };
  const onFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (!amountContribution) {
        throw new Error('Please, provide an amount to contribute');
      }

      const campaign = await Campaign(router.query.campaign);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.contribute().send({
        value: web3.utils.toWei(amountContribution, 'ether'),
        from: accounts[0],
      });
      await router.replace(`/campaigns/${router.query.campaign}`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitLoading(false);
      setAmountContribution('');
    }
  };

  return (
    <Form onSubmit={onFormSubmit} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          label="ether"
          value={amountContribution}
          labelPosition="right"
          onChange={onAmountContributionFieldChange}
        />
        {errorMessage && (
          <Message error header="Oops!" content={errorMessage} />
        )}
      </Form.Field>
      <Button loading={submitLoading} primary>
        Contribute
      </Button>
    </Form>
  );
};

export default ContributeForm;
