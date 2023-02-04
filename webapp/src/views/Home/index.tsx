import { Heading, Box } from '@chakra-ui/react';
import Link from 'next/link';

const Home = () => {
  return (
    <Box>
      <Heading>Booker App</Heading>
      <Link href='/items'>Items</Link>
      <br />
      <Link href='/appointments'>Appointments</Link>
    </Box>
  );
};

export default Home;
