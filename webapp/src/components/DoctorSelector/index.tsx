import { FC } from 'react';

import { Box, Flex, Heading, Select, Text } from '@chakra-ui/react';

import { Doctor } from '@/generated/core.graphql';

const DoctorSelector: FC<{
  doctors: Doctor[];
  value?: Doctor;
  onChange: (doc: Doctor | undefined) => void;
}> = ({ doctors, onChange }) => {
  return (
    <Box px={4} width='100%'>
      <Heading as='h2' fontSize='x-large'>
        Doctors
      </Heading>
      <Flex mt='4'>
        {!doctors || doctors.length === 0 ? (
          <Text>No doctors</Text>
        ) : (
          <Select
            placeholder='Select a doctor'
            onChange={(e) => {
              const doc = e.target.value && JSON.parse(e.target.value);
              onChange(doc);
            }}
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={JSON.stringify(doc)}>
                {doc.name}
              </option>
            ))}
          </Select>
        )}
      </Flex>
    </Box>
  );
};

export default DoctorSelector;
