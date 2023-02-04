/* eslint-disable import/prefer-default-export */
import { chakra, Flex } from '@chakra-ui/react';

export const Container = chakra(Flex, {
  baseStyle: {
    width: '600px',
    height: '332px',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'center', sm: 'initial' },
    boxShadow: '2xl',
    pb: 'md',
    margin: '0 auto',
  },
});
