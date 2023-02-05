import { FC, ReactNode } from 'react';

import { Box } from '@chakra-ui/react';

const HighlightBox: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <Box px={1} py={1} bg='orange.100' display='inline-block'>
      {children}
    </Box>
  );
};

export default HighlightBox;
