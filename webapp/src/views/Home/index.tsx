import { CalendarIcon, EditIcon } from '@chakra-ui/icons';
import { Heading, Flex, Button } from '@chakra-ui/react';
import NextLink from 'next/link';

const Home = () => {
  return (
    <Flex
      direction='column'
      justifyItems='center'
      alignItems='center'
      margin='auto'
      width='fit-content'
      gap='10'
      mt=''
    >
      <Heading mt='4'>Booker App</Heading>
      <Flex gap='4'>
        <NextLink href='/items' passHref>
          <Button leftIcon={<EditIcon />} colorScheme='teal' variant='solid'>
            Items
          </Button>
        </NextLink>
        <NextLink href='/appointments' passHref>
          <Button
            leftIcon={<CalendarIcon />}
            colorScheme='teal'
            variant='outline'
          >
            Appointments
          </Button>
        </NextLink>
      </Flex>
    </Flex>
  );
};

export default Home;
