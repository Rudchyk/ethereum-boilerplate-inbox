import { Button, Form, Input, Message } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
import Layout from '../../../../components/Layout/Layout';
import BackBtn from '../../../../components/BackBtn/BackBtn';

const NewRequest = () => {
  const router = useRouter();
  const initialData = {
    value: '',
    description: '',
    recipient: '',
  };
  const [formData, setFormData] = useState(initialData);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const onFormFieldChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
  };
  const onFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (!formData.description) {
        throw new Error('Please, provide a description');
      }
      if (!formData.value) {
        throw new Error('Please, provide a value');
      }
      if (!formData.recipient) {
        throw new Error('Please, provide a recipient');
      }

      const campaign = await Campaign(router.query.campaign);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods
        .createRequest(
          formData.description,
          web3.utils.toWei(formData.value, 'ether'),
          formData.recipient
        )
        .send({
          from: accounts[0],
        });
      await router.replace(`/campaigns/${router.query.campaign}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitLoading(false);
      setFormData(initialData);
    }
  };
  return (
    <Layout>
      <BackBtn route={`/campaigns/${router.query.campaign}/requests`}></BackBtn>
      <h3>Create a Request</h3>
      <Form onSubmit={onFormSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={formData.description}
            name="description"
            onChange={onFormFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            label="ether"
            value={formData.value}
            labelPosition="right"
            name="value"
            onChange={onFormFieldChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={formData.recipient}
            name="recipient"
            onChange={onFormFieldChange}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button loading={submitLoading} primary>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

export default NewRequest;
