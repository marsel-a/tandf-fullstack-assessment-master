import { FC } from 'react';

import { Box, Heading, Text } from '@chakra-ui/react';

import { Doctor } from '@/generated/core.graphql';

const DoctorSelector: FC<{
  doctors: Doctor[];
  value?: Doctor;
  onChange: (doc: Doctor | undefined) => void;
}> = ({ doctors, value, onChange }) => {
  return (
    <Box>
      <Heading as='h2' fontSize='x-large'>
        Doctors
      </Heading>
      {value && <Text>Selected: {value.name}</Text>}

      {!doctors || doctors.length === 0 ? (
        <Text>No doctors</Text>
      ) : (
        doctors.map((doc) => (
          <Box key={doc.id} onClick={() => onChange(doc)}>
            {doc.name}
          </Box>
        ))
      )}
    </Box>
  );
};

export default DoctorSelector;
