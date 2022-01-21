import Link from 'next/link';
import { Button } from 'semantic-ui-react';

const BackBtn = ({ route }) => {
  return (
    <Link href={route}>
      <a>
        <Button primary>Back</Button>
      </a>
    </Link>
  );
};

export default BackBtn;
