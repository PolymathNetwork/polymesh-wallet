import React, { FC, useContext } from 'react';
import { Box, Button, Flex, Header, Icon, Text } from '@polymathnetwork/extension-ui/ui';
import { SvgAlertCircle, SvgFileLockOutline } from '@polymathnetwork/extension-ui/assets/images/icons';
import { forgetAccount } from '../../messaging';
import { ActionContext, ActivityContext } from '../../components';
import { useParams } from 'react-router';

interface ParamTypes {
  address: string
}

export const ForgetAccount: FC = () => {
  const onAction = useContext(ActionContext);
  const { address } = useParams<ParamTypes>();
  const isBusy = useContext(ActivityContext);

  const onExport = async () => {
    try {
      await forgetAccount(address);

      onAction('/');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Header headerText='Forget account'
        iconAsset={SvgFileLockOutline}>
      </Header>
      <Box pt='m'>
        <Box borderColor='gray.4'
          borderRadius={3}
          borderStyle='solid'
          borderWidth={2}
          m='xs'
          p='s'>
          <Flex>
            <Icon Asset={SvgAlertCircle}
              color='alert'
              height={20}
              width={20} />
            <Box ml='s'>
              <Text color='alert'
                variant='b3m'>
                Attention
              </Text>
            </Box>
          </Flex>
          <Text color='gray.1'
            variant='b2m'>
            You are about to remove the account. This means that you will not be able to access it via this extension anymore. If you wish to recover it, you would need to use the seed.
          </Text>
        </Box>
      </Box>
      <Flex flex={1}
        flexDirection='column'
        justifyContent='flex-end'
        mb='s'
        mx='xs'>
        <Button busy={isBusy}
          fluid
          onClick={onExport}>
          Forget account
        </Button>
      </Flex>
    </>
  );
};