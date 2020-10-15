import { SignerPayloadJSON } from '@polkadot/types/types';

import React, { useEffect, useState } from 'react';
import { formatBalance } from '@polkadot/util';
import BN from 'bn.js';
import { getPolyCallDetails } from '@polymathnetwork/extension-ui/messaging';
import { ResponsePolyCallDetails } from '@polymathnetwork/extension-core/background/types';
import { Box, Text } from '@polymathnetwork/extension-ui/ui';

interface Props {
  request: SignerPayloadJSON;
}

function renderMethod (call: ResponsePolyCallDetails): React.ReactNode {
  const { args, meta, method, networkFee, protocolFee, section } = call;
  const totalFees = (new BN(networkFee)).add(new BN(protocolFee));

  return (
    <>
      <Box mt='m'>
        <Box>
          <Text color='gray.2'
            variant='b2'>
            Method
          </Text>
        </Box>
        <Box>
          <Text color='gray.1'
            variant='b1'>
            {section}.{method}{
              meta
                ? `(${meta.args.map(({ name }) => name).join(', ')})`
                : ''
            }
          </Text>
        </Box>
      </Box>

      <Box mt='m'>
        <Box>
          <Text color='gray.2'
            variant='b2'>
            Params
          </Text>
        </Box>
        <Box>
          <Text color='gray.1'
            variant='b1'>
            {JSON.stringify(args, null, 2)}
          </Text>
        </Box>
      </Box>

      <Box>
        <Box>
          <Text color='gray.2'
            variant='b2'>
            Network fee
          </Text>
        </Box>
        <Box>
          <Text color='gray.1'
            variant='b1'>
            {formatBalance(new BN(networkFee), { withUnit: false, decimals: 6 })} POLYX
          </Text>
        </Box>
      </Box>

      <Box>
        <Box>
          <Text color='gray.2'
            variant='b2'>
            Protocol fee
          </Text>
        </Box>
        <Box>
          <Text color='gray.1'
            variant='b1'>
            {formatBalance(new BN(protocolFee), { withUnit: false })} POLYX
          </Text>
        </Box>
      </Box>

      <Box>
        <Box>
          <Text color='gray.2'
            variant='b2'>
            Total fees
          </Text>
        </Box>
        <Box>
          <Text color='gray.1'
            variant='b1'>
            {formatBalance(totalFees, { withUnit: false })} POLYX
          </Text>
        </Box>
      </Box>
    </>
  );
}

function Extrinsic ({ request }: Props): React.ReactElement<Props> {
  const [callDetails, setCallDetails] = useState<ResponsePolyCallDetails>();

  useEffect(() => {
    getPolyCallDetails(request)
      .then(setCallDetails)
      .catch(console.error);
  }, [request]);

  return (
    <>
      {callDetails && renderMethod(callDetails)}
    </>
  );
}

export default React.memo(Extrinsic);
