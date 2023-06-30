import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
    ChangeEvent,
    MouseEvent,
    ReactElement,
    useEffect,
    useState,
    useMemo
} from 'react';
import styled from 'styled-components';
import { Provider } from '../utils/provider';
import { Button, Input, Dropdown, Grid, Card, Image } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { NextUIProvider } from '@nextui-org/react';


const StyledLabel = styled.label`
  font-weight: bold;
`;


let defaultTransaction = {
    to: '0xa238b6008Bc2FBd9E386A5d4784511980cE504Cd',
    value: ethers.utils.parseEther('0.01'),
    gasLimit: '21000',
    maxPriorityFeePerGas: ethers.utils.parseUnits('7', 'gwei'),
    maxFeePerGas: ethers.utils.parseUnits('20', 'gwei'),
    nonce: 0,
    type: 2,
    chainId: 11155111
};


export function AddSubscriber(): ReactElement {
    const context = useWeb3React<Provider>();
    const { library, active } = context;

    const [signer, setSigner] = useState<Signer>();
    const [greeterContract, setGreeterContract] = useState<Contract>();
    const [greeting, setGreeting] = useState<string>('');


    const [txHash, setTxHash] = useState<string>('');
    const [rlpTx, setRlpTx] = useState<string>('');
    const [sig, setSig] = useState<string>('');

    const [recieverAddress, setReceiverAddress] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [signerAddress, setSignerAddress] = useState<string>('');


    const [tx, setTx] = useState(defaultTransaction);
    const [userCopied, setUserCopied] = useState(false)

    const [selectedToken, setSelectedToken] = useState(new Set(["Select Token"]));


    const selectedValue = useMemo(
        () => Array.from(selectedToken).join(", ").replaceAll("_", " "),
        [selectedToken]
    );


    function getSignedTransaction() {
        return rlpTx + "sig"
    }

    function getRLPEncoding() {
        console.log("rlpenc", ethers.utils.serializeTransaction(tx))
        return ethers.utils.serializeTransaction(tx);
    }

    useEffect((): void => {
        setRlpTx(getRLPEncoding())

        if (!library) {
            setSigner(undefined);
            return;
        }
        if (rlpTx) {
            const hashedTx = ethers.utils.keccak256(rlpTx);
            setTxHash(hashedTx);
            console.log(hashedTx)
        }



        setSigner(library.getSigner());
    }, [library, txHash, rlpTx]);

    useEffect((): void => {
        if (!greeterContract) {
            return;
        }

        async function getGreeting(greeterContract: Contract): Promise<void> {
            const _greeting = await greeterContract.greet();

            if (_greeting !== greeting) {
                setGreeting(_greeting);
            }
        }

        getGreeting(greeterContract);
    }, [greeterContract, greeting]);


    function handleSigSubmit(event: MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        window.alert(sig);

        return;
    }

    function handleAddressChange(event: ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        //  setReceiverAddress(event.target.value);
        let t = { ...tx, to: recieverAddress }
        setTx(t);
        console.log('tx:', tx)
        setRlpTx(getRLPEncoding())
        console.log('rlp', rlpTx)

    }

    function handleAmountChange(event: ChangeEvent<HTMLInputElement>): void {
        event.preventDefault();
        setAmount(event.target.value);
        try {
            setTx({ ...tx, value: ethers.utils.parseEther(event.target.value) });
            console.log('tx:', tx)
            setRlpTx(getRLPEncoding())

            if (rlpTx) {
                const hashedTx = ethers.utils.keccak256(rlpTx);

                setTxHash(hashedTx);
                console.log(hashedTx)

                console.log('rlp', rlpTx)
            }
        } catch (e) {
            console.log("exception")
        }

    }
    return (
        <>
            <NextUIProvider>
                <Header />
                <Grid>
                    <Grid.Container gap={2} justify="center">
                        <Card justify="center" css={{ w: "90%" }}>
                            <Card.Body justify="center">

                                <StyledLabel>Connected Account:</StyledLabel>
                                {signerAddress ? signerAddress : <em>{`None Connected`}</em>}


                                <div></div>
                                <br />
                                <StyledLabel htmlFor="amountToken">Semaphore Subscriber Status</StyledLabel>
                                <br />
                                <StyledLabel htmlFor="receiverAddress">New Subscriber Public Key</StyledLabel>
                                <br />
                                <Input
                                    css={{ w: "100%" }}
                                    id="receiverAddress"
                                    type="text"
                                    placeholder={tx.to ? tx.to : 'no to address'}
                                    onChange={handleAddressChange}
                                    style={{ fontStyle: greeting ? 'normal' : 'italic' }}
                                ></Input>
                                <br />

                                <p />


                            </Card.Body>
                            <Link to="/#" state={{ rlp: rlpTx }}>
                                <Button
                                    disabled={!userCopied ? true : false}
                                    style={{
                                        cursor: !userCopied ? 'not-allowed' : 'pointer',
                                        borderColor: !userCopied ? 'unset' : 'blue',

                                    }}
                                    onPress={() => { console.log('r', rlpTx) }}
                                >
                                    Add New Subscriber  `{'>'}`
                                    {sig}
                                </Button>
                            </Link>
                        </Card>

                    </Grid.Container>
                </Grid>
            </NextUIProvider>
        </>
    );
}
