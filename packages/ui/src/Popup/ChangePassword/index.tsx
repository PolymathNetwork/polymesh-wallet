import { SvgFileLockOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { globalChangePass, validatePassword } from '@polymathnetwork/extension-ui/messaging';
import { Box, Button, Flex, Header, Text, TextInput } from '@polymathnetwork/extension-ui/ui';
import React, { FC, useContext } from 'react';
import { useForm } from 'react-hook-form';

import { ActionContext, ActivityContext } from '../../components';

export const ChangePassword: FC = () => {
  const onAction = useContext(ActionContext);
  const { errors, handleSubmit, register, setError } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  const isBusy = useContext(ActivityContext);

  const onSubmit = async (data: { [x: string]: string; }) => {
    const isValidPassword = await validatePassword(data.currentPassword);

    if (!isValidPassword) {
      setError('currentPassword', { type: 'manual' });

      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError('confirmPassword', { type: 'manual' });

      return;
    }

    await globalChangePass(data.currentPassword, data.currentPassword);

    onAction('/');
  };

  return (
    <>
      <Header headerText='Change password'
        iconAsset={SvgFileLockOutline}>
      </Header>
      <Box mx='s'>
        <form id='passwordForm'
          onSubmit={handleSubmit(onSubmit)}>
          <Box mt='m'>
            <Box>
              <Text color='gray.1'
                variant='b2m'>
                Current password
              </Text>
            </Box>
            <Box>
              <TextInput inputRef={register({ required: true, minLength: 8 })}
                name='currentPassword'
                placeholder='Enter 8 characters or more'
                type='password' />
              {errors.currentPassword &&
                <Box>
                  <Text color='alert'
                    variant='b3'>
                    {(errors.currentPassword).type === 'required' && 'Required field'}
                    {(errors.currentPassword).type === 'minLength' && 'Password too short'}
                    {(errors.currentPassword).type === 'manual' && 'Invalid password'}
                  </Text>
                </Box>
              }
            </Box>
          </Box>
          <Box mt='m'>
            <Box>
              <Text color='gray.1'
                variant='b2m'>
                New password
              </Text>
            </Box>
            <Box>
              <TextInput inputRef={register({ required: true, minLength: 8 })}
                name='newPassword'
                placeholder='Enter 8 characters or more'
                type='password' />
              {errors.newPassword &&
                <Box>
                  <Text color='alert'
                    variant='b3'>
                    {(errors.newPassword).type === 'required' && 'Required field'}
                    {(errors.newPassword).type === 'minLength' && 'Password too short'}
                    {(errors.newPassword).type === 'manual' && 'Invalid password'}
                  </Text>
                </Box>
              }
            </Box>
          </Box>
          <Box mt='m'>
            <Box>
              <Text color='gray.1'
                variant='b2m'>
                Confirm password
              </Text>
            </Box>
            <Box>
              <TextInput inputRef={register({ required: true, minLength: 8 })}
                name='confirmPassword'
                placeholder='Enter 8 characters or more'
                type='password' />
              {errors.confirmPassword &&
                <Box>
                  <Text color='alert'
                    variant='b3'>
                    {(errors.confirmPassword).type === 'required' && 'Required field'}
                    {(errors.confirmPassword).type === 'minLength' && 'Password too short'}
                    {(errors.confirmPassword).type === 'manual' && 'Passwords do not match'}
                  </Text>
                </Box>
              }
            </Box>
          </Box>
        </form>
      </Box>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mb='s'
        mx='s'>
        <Button busy={isBusy}
          fluid
          form='passwordForm'
          type='submit'>
          Change password
        </Button>
      </Flex>
    </>
  );
};
