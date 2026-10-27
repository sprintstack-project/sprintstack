import SelectWithTrigger from '@ui/select/select';
import type { SelectProps } from '@ui/types';
import type { ReactNode } from 'react';

// The custom trigger is internal (Sidebar's switchers): apps get the field-trigger contract.
export const Select: <V = string>(props: SelectProps<V>) => ReactNode = SelectWithTrigger;
