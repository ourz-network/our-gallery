import { css } from "@emotion/react";
import { useWalletButton, useWeb3Wallet } from "@zoralabs/simple-wallet-provider";
import { useContext, useEffect, useState } from "react";
import { SubdomainContext } from "../context/SubdomainContext";
import { getAddressFromENS } from "../utils/ethers";
import { Button } from "degene-sais-quoi";
import Form from "./Form";
import { IconWallet, IconLockClosed, IconCog } from "degene-sais-quoi";

export const Wallet = () => {
  const wallet = useWeb3Wallet();
  const { buttonAction, actionText, connectedInfo } = useWalletButton();
  const { subdomain, userConfig } = useContext(SubdomainContext);
  const [address, setAddress] = useState<string>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    async function checkIfOwner() {
      const subdomainAddr: string = await getAddressFromENS(subdomain);

      if (subdomainAddr.toLowerCase() === wallet?.account.toLowerCase()) {
        setAddress(subdomainAddr);
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    }

    if (wallet?.account) {
      checkIfOwner();
    }
  }, [wallet?.account]);

  return (
    <>
      <div
        css={css`
          display: flex;
        `}
      >
        <Button shape="circle" variant="transparent" onClick={() => buttonAction()}>
          {actionText === "Connect Wallet" ? <IconWallet /> : <IconLockClosed />}
        </Button>
        {isOwner && (
          <Button shape="circle" variant="transparent" onClick={() => setShowForm(() => true)}>
            <IconCog />
          </Button>
        )}
      </div>
      {showForm && (
        <Form
          subdomain={subdomain}
          address={address}
          userConfig={userConfig}
          setShowForm={setShowForm}
        />
      )}
    </>
  );
};
