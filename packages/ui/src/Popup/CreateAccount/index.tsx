// Copyright 2019-2020 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext, useEffect, useState } from 'react';
import { Header, Box, Icon, Heading, Text } from '../../ui';
import { ActionContext, Loading } from '../../components';
import { createAccountSuri, createSeed } from '../../messaging';
import AccountName from './AccountName';
import Mnemonic from './Mnemonic';
import { SvgLockReset } from '@polymathnetwork/extension-ui/assets/images/icons';

export default function CreateAccount (): React.ReactElement {
  const onAction = useContext(ActionContext);
  const [isBusy, setIsBusy] = useState(false);
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState<null | { address: string; seed: string }>(null);

  useEffect((): void => {
    createSeed()
      .then(setAccount)
      .catch((error: Error) => console.error(error));
  }, []);

  // FIXME Duplicated between here and Import.tsx
  const _onCreate = (name: string, password: string): void => {
    // this should always be the case
    if (name && password && account) {
      setIsBusy(true);
      createAccountSuri(name, password, account.seed)
        .then((): void => onAction('/'))
        .catch((error: Error): void => {
          setIsBusy(false);
          console.error(error);
        });
    }
  };

  const _onNextStep = (): void => setStep(step + 1);
  const _onPreviousStep = (): void => setStep(step - 1);

  return (
    <>
      <Header>
        <Box>
          <Box backgroundColor='brandLightest'
            borderRadius='50%'
            height={48}
            px={12}
            py={10}
            width={48}>
            <Icon Asset={SvgLockReset}
              color='brandMain'
              height={24}
              width={24} />
          </Box>
          <Box pt='m'>
            <Heading color='white'
              variant='h5'>
              Your recovery phrase
            </Heading>
          </Box>
          <Box pt='1'>
            <Text color='white'
              variant='b2'>
              These 12 words in order will recover your account should you lose or forget your password. It is
              recommended you store a hard copy in a secure place.
            </Text>
          </Box>
        </Box>
      </Header>
      <Loading>
        {account &&
          (step === 1 ? (
            <Mnemonic onNextStep={_onNextStep}
              seed={account.seed} />
          ) : (
            <AccountName address={account.address}
              isBusy={isBusy}
              onBackClick={_onPreviousStep}
              onCreate={_onCreate} />
          ))}
      </Loading>
    </>
  );
}