import { AccountDetails, AccountInfo } from '@polymathnetwork/extension-ui/components/AccountDetails';
import React, { FC, useContext, useState } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { ActionContext } from '../../components';
import { changePassword, jsonRestore } from '../../messaging';
import { UploadVerifyJson, FileState } from './UploadVerifyJson';

export const ImportJson: FC = () => {
  const [fileState, setFileState] = useState<FileState>();
  const [jsonPassword, setJsonPassword] = useState<string>();
  const [accountName, setAccountName] = useState<string>();
  const [step, setStep] = useState(0);
  const onAction = useContext(ActionContext);
  const errorHandler = useErrorHandler();

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    step > 0 && setStep(step - 1);
  };

  const setJsonData = (fileState: FileState, jsonPassword: string, accountName: string) => {
    setFileState(fileState);
    setJsonPassword(jsonPassword);
    setAccountName(accountName);
    nextStep();
  };

  const restoreAccount = async (newAccountInfo: AccountInfo) => {
    if (fileState && fileState.address && fileState.json && jsonPassword) {
      try {
        // Accounts should be visible by default.
        fileState.json.meta.isHidden = undefined;
        fileState.json.meta.name = newAccountInfo.accountName;

        const decodedAccount = await jsonRestore(fileState.json, jsonPassword);

        if (decodedAccount.error) {
          throw new Error('Cannot decode JSON file. Please try again.');
        }

        // Change from the original JSON password, to the password user has just provided
        // by AccountDetails form.
        await changePassword(fileState.address, jsonPassword, newAccountInfo.password);

        onAction('/');
      } catch (error) {
        // Theoretically speaking, no errors should be emitted here. If so,
        // we'll display the ErrorBoundary fallback to let user start over.
        errorHandler(error);
      }
    } else {
      errorHandler(new Error('An unexpected error has occurred. Please try again.'));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
      default:
        return (
          <UploadVerifyJson onContinue={setJsonData} />
        );
      case 1:
        return (
          <AccountDetails
            defaultName={accountName}
            headerText='Import account using JSON file'
            onBack={prevStep}
            onContinue={restoreAccount}
            submitText='Import' />
        );
    }
  };

  return renderStep();
};
