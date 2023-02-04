import { Slot } from '@/generated/core.graphql';

type SlotWithKey = Slot & { 
  key: string;
}