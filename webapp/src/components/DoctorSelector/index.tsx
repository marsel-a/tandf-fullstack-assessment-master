import { FC } from 'react';

import { Box, Heading, Select, Text } from '@chakra-ui/react';

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
        <Select
          placeholder='Select doctor'
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
    </Box>
  );
};

export default DoctorSelector;
