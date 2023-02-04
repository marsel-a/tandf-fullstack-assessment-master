import { useCallback } from 'react';

import { Box, Button, List, ListItem, Text } from '@chakra-ui/react';
import { faker } from '@faker-js/faker';

import { useAddItemMutation, useItemsQuery } from '@/generated/core.graphql';

export const Items = () => {
  const [addItem, { loading: addingItems }] = useAddItemMutation();
  const { data, loading, error, refetch } = useItemsQuery();

  const addRandomItem = useCallback(async () => {
    try {
      await addItem({
        variables: {
          item: {
            name: faker.name.jobTitle(),
            description: faker.lorem.lines(5),
          },
        },
      });

      await refetch();
    } catch (ex) {
      console.log(ex);
    }
  }, [addItem]);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return (
      <Box>
        <Text color='red'>{error.message}</Text>
      </Box>
    );
  }

  return (
    <Box p='lg'>
      <Button onClick={addRandomItem} isLoading={addingItems}>
        Add Random Item
      </Button>
      {!data?.items || data.items.length === 0 ? (
        <Text>No items to display</Text>
      ) : (
        <List>
          {data.items.map((item) => (
            <ListItem key={item.id}>
              <Text>{item.name}</Text>
              <Text>{item.description}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
