import { Container } from 'semantic-ui-react'
import Head from 'next/head'
import Header from '../Header/Header';

const Layout = ({children}) => {
  return (
    <Container>
      <Head>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
      <Header/>
      {children}
      <h6>Footer</h6>
    </Container>
  );
};

export default Layout;
