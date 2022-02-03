// @ts-nocheck

import { useState } from "react";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import { useWeb3Wallet } from "@zoralabs/simple-wallet-provider";
import { Box, BoxProps, Button, Input, Stack, Text } from "degene-sais-quoi";
import { IconClose } from "degene-sais-quoi";
import { Tone } from "degene-sais-quoi/dist/types/components/Button/styles.css";
// import ColorPicker from "./ColorPicker";

const inputFields = {
  title: {
    type: "text",
    defaultValue: "Title",
    label: "Title",
  },
  desc: {
    type: "text",
    defaultValue: "Description",
    label: "Page Description",
  },
  networkId: {
    type: "number",
    defaultValue: 1,
    label: `NetworkID`,
  },
  curator: {
    type: "text",
    defaultValue: "0x",
    label: "Auction Curator Address",
  },
  contracts: {
    type: "text",
    defaultValue: "0xabEFBc9fD2F806065b4f3C237d4b59D9A97Bcac7",
    label: "Addresses of NFT contracts",
  },
  fontFamily: {
    type: "select",
    options: ["serif", "sans", "mono"],
    defaultValue: "sans",
    label: "Fonts",
  },
  mode: {
    type: "select",
    options: ["light", "dark"],
    defaultValue: "light",
    label: "Light/Dark Mode",
  },
  accent: {
    type: "select",
    options: ["blue", "green", "indigo", "orange", "pink", "purple", "red", "teal", "yellow"],
    label: "Accent Color",
  },
};

const fields = Object.keys(inputFields);

const SettingsForm = ({ subdomain, address, userConfig, setShowForm }) => {
  const router = useRouter();
  const wallet = useWeb3Wallet();
  const provider = wallet?.library;
  const [formData, setFormData] = useState({
    subdomain: subdomain,
    curator: address,
    contracts:
      "0xabEFBc9fD2F806065b4f3C237d4b59D9A97Bcac7,0x3B3ee1931Dc30C1957379FAc9aba94D1C48a5405,0xCa21d4228cDCc68D4e23807E5e370C07577Dd152,0x12C8630369977eE708C8E727d8e838f74D9420C5,0x677cE7d51eAad3a63890529A4cBeB74DEC218FE1,0xb63c81257d7b80d888cE7928464753cB054C8b1c,0x5180db8F5c931aaE63c74266b211F580155ecac8,0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270,0xEF3c951e22c65F6256746F4e227e19A5BcbF393C,0xaf89C5E115Ab3437fC965224D317d09faa66ee3E,0xDF5b5ee15CC96ba7d0CB6BD9b2c0fc4417ab6445,0xb80fBF6cdb49c33dC6aE4cA11aF8Ac47b0b4C0f3,0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7,0x8d04a8c79cEB0889Bdd12acdF3Fa9D207eD3Ff63,0x7E5935eA00b69b0AC8978F35Cb079ef38217e181,0xB228D7B6e099618Ca71bd5522B3a8c3788A8F172,0x335eEEF8e93A7A757D9e7912044d9cd264e2b2D8",
    networkId: 1,
    ...userConfig,
  });
  const [disabledButton, setDisabledButton] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const handleClick = (field, option) => {
    setFormData({
      ...formData,
      [field]: option,
    });
  };

  const updateColor = ({ name, color }) => {
    setFormData({
      ...formData,
      [name]: color,
    });
  };

  const submitForm = async () => {
    setDisabledButton(() => true);
    try {
      const signedMessage = await provider.getSigner().signMessage(JSON.stringify(formData));
      const res = await fetch(`/api/user/${subdomain}`, {
        method: "POST",
        body: JSON.stringify({
          userConfig: formData,
          signedMessage: signedMessage,
        }),
      });

      if (res) {
        setDisabledButton(() => false);
        setShowForm(() => false);
        router.reload();
      }
    } catch (error) {
      console.log(error);
      setDisabledButton(() => false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div
          css={css`
            display: inline-flex;
            place-self: end;
          `}
        >
          <Button tone="red" onClick={() => setShowForm(() => false)}>
            <IconClose color="red" />
          </Button>
        </div>
        <Box display="flex" alignItems="center" width="full" flexDirection="column" gap="2">
          {fields.map((field) => (
            <div
              key={field}
              css={css`
                text-transform: none;
                color: var(--colors-text);
              `}
            >
              <Box
                display="flex"
                textAlign="center"
                alignItems="center"
                flexDirection="column"
                padding="5"
              >
                {/* {inputFields[`${field}`].type === "color" && (
                  <label>
                    {`${inputFields[`${field}`].label}`}
                    <ColorPicker
                      name={`${field}`}
                      currentValue={userConfig[`${field}`]}
                      updateColor={updateColor}
                    />
                  </label>
                )} */}
                {inputFields[`${field}`].type === "text" && (
                  <Input
                    label={`${inputFields[`${field}`].label}`}
                    name={field}
                    type={inputFields[`${field}`].type}
                    defaultValue={userConfig[`${field}`]}
                    onChange={(e) => handleChange(e)}
                    width={field === ("contracts" || "curator") ? "96" : "full"}
                  />
                )}
                {inputFields[`${field}`].type === "number" && (
                  <Input
                    inputMode="numeric"
                    label={`${inputFields[`${field}`].label}`}
                    name={field}
                    type={inputFields[`${field}`].type}
                    defaultValue={userConfig[`${field}`]}
                    onChange={(e) => handleChange(e)}
                    width="full"
                  />
                )}
                {inputFields[`${field}`].type === "select" && (
                  <label>
                    {`${inputFields[`${field}`].label}`}
                    <Stack
                      justify="center"
                      flex="auto"
                      space="max"
                      wrap={true}
                      direction="horizontal"
                    >
                      {inputFields[`${field}`].options.map((option) => {
                        return (
                          <div key={`${option}`}>
                            <Box width="auto" paddingX="2" marginX="2">
                              {/* // @ts-ignore */}
                              <Button
                                tone={field === "accent" ? (option as Tone) : null}
                                center
                                size="medium"
                                width="32"
                                variant={formData[field] === option ? "primary" : "invisible"}
                                onClick={(e) => handleClick(field, option)}
                              >
                                <Text
                                  align="center"
                                  font={
                                    field === "fontFamily"
                                      ? `${option as BoxProps["fontFamily"]}`
                                      : null
                                  }
                                  transform="capitalize"
                                >
                                  {`${option}`}
                                  {field === "fontFamily" && " Families"}
                                </Text>
                              </Button>
                            </Box>
                          </div>
                        );
                      })}
                    </Stack>
                  </label>
                )}
              </Box>
            </div>
          ))}
          <Button
            tone="green"
            center={true}
            size="large"
            shape="circle"
            variant="secondary"
            disabled={disabledButton}
            onClick={() => submitForm()}
          >
            Submit
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default SettingsForm;
